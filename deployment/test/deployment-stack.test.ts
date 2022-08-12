import * as cdk from 'aws-cdk-lib';
import {Template, Capture} from 'aws-cdk-lib/assertions';
import * as deployment from '../lib/deployment-stack';

test('Website created', () => {
    const app = new cdk.App();
    const env = {account: '1', region: 'eu-west-1'}
    const stack = new deployment.DeploymentStack(app, 'deploy', {
        stackPrefix: 'hello',
        domainName: 'hello',
        repo: {
            branch: 'main',
            name: 'hello'
        },
        webStageProps: {
            stackPrefix: 'hello',
            siteProps: {
                domainName: 'hello',
                defaultRootObject: 'index.html',
                env: env
            }
        },
        env: env
    });
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::CodeCommit::Repository', 1);
    template.resourceCountIs('AWS::CodePipeline::Pipeline', 1);
    template.resourceCountIs('AWS::CodeBuild::Project', 6);


    const envCapture = new Capture();
    template.hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: envCapture,
    });


});