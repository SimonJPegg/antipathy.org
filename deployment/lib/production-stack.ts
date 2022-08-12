import {CfnOutput, Duration, Tags} from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import {ViewerProtocolPolicy} from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import {WebStack, WebStackProps, WebStage, WebStageProps} from './web-stack';
import {HostedZone} from 'aws-cdk-lib/aws-route53';

export interface ProductionProps extends WebStageProps {
    siteProps: WebStackProps
}

export class ProductionStage extends WebStage {
        constructor(scope: Construct, id: string, props: ProductionProps) {
        super(scope, id, props);
        const stack = new ProductionStack(this, 'stack', props.siteProps)
        this.cloudFrontDistroId = stack.cloudFrontDistroId;
        this.deploymentBucketName = stack.deploymentBucketName;
    }
}

export class ProductionStack extends WebStack {

    constructor(scope: Construct, id: string, props: WebStackProps) {
        super(scope, id, props);

        const hostedZone = HostedZone.fromLookup(this, 'zone', {
            domainName: props.domainName,
        });

        const s3bucket = new s3.Bucket(this, 'bucket', {
            bucketName: props.domainName,
            versioned: false,
            encryption: s3.BucketEncryption.UNENCRYPTED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            publicReadAccess: false,
            removalPolicy: cdk.RemovalPolicy.RETAIN
        });

        const certificate = new acm.DnsValidatedCertificate(this, 'cert', {
            domainName: props.domainName,
            hostedZone: hostedZone,
            subjectAlternativeNames: [`www.${props.domainName}`],
            region: 'us-east-1'
        });

        const s3Origin = new origins.S3Origin(s3bucket);

        const distribution = new cloudfront.Distribution(this, 'distro', {
            defaultBehavior: {
                origin: s3Origin,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS
            },
            certificate: certificate,
            domainNames: [props.domainName, `www.${props.domainName}`],
            defaultRootObject: props.defaultRootObject,
            enableIpv6: true,
            enabled: true,
            priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
        });
        distribution.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

        new route53.ARecord(this, 'record',{
            zone: hostedZone,
            recordName: props.domainName,
            ttl: Duration.seconds(3600),
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
        });

        new route53.ARecord(this, 'wwwrecord',{
            zone: hostedZone,
            recordName: `www.${props.domainName}`,
            ttl: Duration.seconds(3600),
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
        });

        Tags.of(this).add('domainName', props.domainName);
        Tags.of(this).add('lastUpdated', new Date().toDateString());
        this.deploymentBucketName = new CfnOutput(this, 'deploymentBucket', {value: s3bucket.bucketName})
        this.cloudFrontDistroId = new CfnOutput(this, 'cloudFrontDistroId', {value: distribution.distributionId})
    }
}
