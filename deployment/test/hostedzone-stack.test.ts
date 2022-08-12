import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as zone from '../lib/hostedzone-stack';

test('Website created', () => {
    const app = new cdk.App();
    const stack = new zone.HostedZoneStack(app, 'zone', {
        domainName: 'some.domain',
    });
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Route53::HostedZone', 1);
    template.resourceCountIs('AWS::Route53::RecordSet', 7);

    template.hasResourceProperties('AWS::Route53::HostedZone', {
        'Name': 'some.domain.'
    });
});