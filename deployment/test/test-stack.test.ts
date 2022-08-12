import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as testsite from '../lib/test-stack';

test('Website created', () => {
    const app = new cdk.App();
    const stack = new testsite.TestStack(app, 'test', {
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
    template.resourceCountIs('AWS::Route53::RecordSet', 1);

    template.hasResourceProperties('AWS::S3::Bucket', {
        'BucketName': 'test.some.domain',
        'PublicAccessBlockConfiguration': {
            'BlockPublicAcls': true,
            'BlockPublicPolicy': true,
            'IgnorePublicAcls': true,
            'RestrictPublicBuckets': true
        }
    });

    template.hasResourceProperties('AWS::CloudFront::Distribution', {
        'DistributionConfig': {
            'Aliases': ['test.some.domain'],
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
        'Name': 'test.some.domain.',
        'Type': 'A',
    });

});