import {CfnOutput, Stack, StackProps, Stage, StageProps, Tags} from 'aws-cdk-lib';
import {Construct} from 'constructs';

export interface WebStageProps extends StageProps {
  stackPrefix: string
  siteProps: WebStackProps
}

export class WebStage extends Stage {
  public deploymentBucketName: CfnOutput;
  public cloudFrontDistroId: CfnOutput;
}



export interface WebStackProps extends StackProps {
  domainName: string,
  defaultRootObject: string
  env: {
    account: string  | undefined
    region: string | undefined
  }
}

export abstract class WebStack extends Stack {

  public deploymentBucketName: CfnOutput;
  public cloudFrontDistroId: CfnOutput;

  protected constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id, props);
    new Map<string, string>([
      ['domainName', props.domainName],
      ['lastUpdated', new Date().toISOString()],
      ['managed', 'CDK']
    ]).forEach((k:string ,v: string) => Tags.of(this).add(k,v));
  }

}
