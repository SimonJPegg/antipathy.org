import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import {Construct} from 'constructs';
import * as pipeline from 'aws-cdk-lib/pipelines';
import {TestStage} from './test-stack';
import {WebStage, WebStageProps} from './web-stack';
import {ProductionStage} from './production-stack';
import {CodeBuildStep, ManualApprovalStep} from 'aws-cdk-lib/pipelines';
import {HostedZoneStage} from './hostedzone-stack';
import {PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {Tags} from 'aws-cdk-lib';

export interface DeploymentProps extends cdk.StackProps {
    stackPrefix: string
    domainName: string
    repo: {
        branch: string
        name: string
    }
    webStageProps: WebStageProps,
    env: {
        account: string | undefined
        region: string | undefined
    }
}

export class DeploymentStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: DeploymentProps) {
        super(scope, id, props);

        const policyStatements = [PolicyStatement.fromJson({
            'Effect': 'Allow',
            'Action': ['s3:Get*', 's3:Put*','s3:List*', 's3:DeleteObject', 'cloudfront:CreateInvalidation'],
            'Resource': '*'
        }),PolicyStatement.fromJson({
            'Effect': 'Allow',
            'Action': 'route53:ListHostedZonesByName',
            'Resource': '*'
        })]


        const repo = new codecommit.Repository(this, 'repo', {
            repositoryName: props.repo.name
        });

        const codeSource = pipeline.CodePipelineSource.codeCommit(repo,props.repo.branch)

        const codePipeline = new pipeline.CodePipeline(this, 'pipeline', {
            pipelineName: id,
            synth: new pipeline.CodeBuildStep('Synth', {
                input: codeSource,
                rolePolicyStatements: policyStatements,
                installCommands: [
                    'npm install -g aws-cdk'
                ],
                commands: [
                    'cd deployment',
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ],
                primaryOutputDirectory: 'deployment/cdk.out',
                env: {
                    /* eslint-disable */
                    region: props.env.region!,
                    account: props.env.account!
                    /* eslint-enable */
                }
            }),
        });

        const buildStep = new pipeline.CodeBuildStep('build',  {
            input: codeSource,
            installCommands: [
              'n install 18'
            ],
            commands: [
                'cd app',
                'npm install --legacy-peer-deps',
                'npm run clean',
                'npm run build',
            ],
            primaryOutputDirectory: 'app/public'
        });

        const zoneStage = new HostedZoneStage(this, props.stackPrefix+'-zone', {stackPrefix: props.stackPrefix, hzProps: {domainName: props.domainName}})
        const testStage = new TestStage(this, props.stackPrefix+'-test', props.webStageProps);
        const prodStage = new ProductionStage(this, props.stackPrefix+'-prod', props.webStageProps);

        const approve = new ManualApprovalStep('ApproveProdDeploy', {});
        const prodDeploy = this.getDeployStep('prod', prodStage, buildStep, policyStatements);
        prodDeploy.addStepDependency(approve)

        codePipeline.addStage(zoneStage);
        codePipeline.addStage(testStage, {pre: [buildStep], post: [this.getDeployStep('test', testStage, buildStep, policyStatements)]});
        codePipeline.addStage(prodStage, {pre: [approve], post: [prodDeploy]});

        new Map<string, string>([
            ['domainName', props.domainName],
            ['managed', 'CDK']
        ]).forEach((k:string ,v: string) => Tags.of(this).add(k,v));
    }

    getDeployStep(id: string, stage: WebStage, buildStep: CodeBuildStep, policyStatements: PolicyStatement[]) {
        const deploy = new pipeline.CodeBuildStep('deploy',  {
            input: buildStep,
            commands: [
                'aws s3 sync ./ s3://$BUCKET',
                'aws cloudfront create-invalidation --distribution-id $DISTRO --paths /'
            ],
            envFromCfnOutputs: {
                BUCKET: stage.deploymentBucketName,
                DISTRO: stage.cloudFrontDistroId,
            },
            rolePolicyStatements: policyStatements
        });
        deploy.addStepDependency(buildStep);
        return deploy;
    }
}