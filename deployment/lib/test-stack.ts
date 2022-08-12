import {CfnOutput, Duration} from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import {ViewerProtocolPolicy} from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import {WebStack, WebStackProps, WebStage, WebStageProps} from './web-stack';
import {HostedZone} from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export interface TestProps extends WebStageProps {
    siteProps: WebStackProps
}

export class TestStage extends WebStage {

    constructor(scope: Construct, id: string, props: TestProps) {
        super(scope, id, props);
        const stack = new TestStack(this, 'stack', props.siteProps)
        this.cloudFrontDistroId = stack.cloudFrontDistroId;
        this.deploymentBucketName = stack.deploymentBucketName;
    }

}

export class TestStack extends WebStack {

    constructor(scope: Construct, id: string, props: WebStackProps) {
        super(scope, id, props);

        const hostedZone = HostedZone.fromLookup(this, 'zone', {
            domainName: props.domainName,
        });

        const s3bucket = new s3.Bucket(this, 'bucket', {
            bucketName: `test.${props.domainName}`,
            versioned: false,
            encryption: s3.BucketEncryption.UNENCRYPTED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            publicReadAccess: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });

        const certificate = new acm.DnsValidatedCertificate(this, 'cert', {
            domainName: `test.${props.domainName}`,
            hostedZone: hostedZone,
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
            domainNames: [`test.${props.domainName}`],
            defaultRootObject: props.defaultRootObject,
            enableIpv6: true,
            enabled: true,
            priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
        });

        distribution.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

        new route53.ARecord(this, 'record',{
            zone: hostedZone,
            recordName: `test.${props.domainName}`,
            ttl: Duration.seconds(3600),
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
        });


        this.deploymentBucketName = new CfnOutput(this, 'deploymentBucket', {value: s3bucket.bucketName})
        this.cloudFrontDistroId = new CfnOutput(this, 'cloudFrontDistroId', {value: distribution.distributionId})
    }
}
