import {aws_route53, Duration, Stage, StageProps, Tags} from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';

export interface HostedZoneStageProps extends StageProps {
    hzProps: HostedZoneProps
    stackPrefix: string
}

export class HostedZoneStage extends Stage {
    constructor(scope: Construct, id: string, props: HostedZoneStageProps) {
        super(scope, id, props);
        new HostedZoneStack(this, 'stack', props.hzProps)
    }
}

export interface HostedZoneProps extends cdk.StackProps {
    domainName: string
}

export class HostedZoneStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: HostedZoneProps) {
        super(scope, id, props);

        const hostedZone = new aws_route53.HostedZone(this, 'zone', {
            zoneName: props.domainName
        });
        hostedZone.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

        new route53.ARecord(this, 'undernet', {
            zone: hostedZone,
            recordName: `undernet.${props.domainName}`,
            ttl: Duration.seconds(3600),
            target: route53.RecordTarget.fromIpAddresses('192.168.0.11')
        });

        new route53.ARecord(this, 'undernet_wildcard', {
            zone: hostedZone,
            recordName: `*.undernet.${props.domainName}`,
            ttl: Duration.seconds(3600),
            target: route53.RecordTarget.fromIpAddresses('192.168.0.11')
        });

        ['calendar', 'drive', 'groups', 'mail', 'sites'].map(subDomain => {
            new route53.CnameRecord(this, `-${subDomain}_alias`, {
                zone: hostedZone,
                recordName: `${subDomain}.${props.domainName}`,
                domainName: 'ghs.googlehosted.com',
                ttl: Duration.seconds(3600),
            })
        });

        Tags.of(this).add('domainName', props.domainName);
        Tags.of(this).add('lastUpdated', new Date().toDateString());
    }
}