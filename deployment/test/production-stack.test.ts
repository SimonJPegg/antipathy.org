import * as cdk from 'aws-cdk-lib';
import {Template} from 'aws-cdk-lib/assertions';
import * as production from '../lib/production-stack';

test('Website created', () => {
    const app = new cdk.App();
    const stack = new production.ProductionStack(app, 'prod', {
        domainName: 'some.domain',
        defaultRootObject: 'index.html',
        env: {
            account: '1',
            region: 'eu-west-1'
        }
    });
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::S3::Bucket', 1);
    template.resourceCountIs('AWS::S3::BucketPolicy', 1);
    template.resourceCountIs('AWS::CloudFront::Distribution', 1);
    template.resourceCountIs('AWS::Route53::RecordSet', 2);

    template.hasResourceProperties('AWS::S3::Bucket', {
        'BucketName': 'some.domain',
        'PublicAccessBlockConfiguration': {
            'BlockPublicAcls': true,
            'BlockPublicPolicy': true,
            'IgnorePublicAcls': true,
            'RestrictPublicBuckets': true
        }
    });

    template.hasResourceProperties('AWS::CloudFront::Distribution', {
        'DistributionConfig': {
            'Aliases': ['some.domain', 'www.some.domain'],
            'DefaultCacheBehavior': {
                'AllowedMethods': ['GET', 'HEAD', 'OPTIONS'],
                'CachedMethods': ['GET', 'HEAD', 'OPTIONS'],
                'Compress': true,
                'ViewerProtocolPolicy': 'redirect-to-https'
            },
            'DefaultRootObject': 'index.html',
            'Enabled': true,
            'HttpVersion': 'http2',
            'IPV6Enabled': true,
            'PriceClass': 'PriceClass_200',
            'ViewerCertificate': {
                'MinimumProtocolVersion': 'TLSv1.2_2021',
                'SslSupportMethod': 'sni-only'
            }
        }
    });

    template.hasResourceProperties('AWS::Route53::RecordSet', {
        'Name': 'some.domain.',
        'Type': 'A',
    });
    template.hasResourceProperties('AWS::Route53::RecordSet', {
        'Name': 'www.some.domain.',
        'Type': 'A',
    });

});