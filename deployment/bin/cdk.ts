#!/usr/bin/env node
import {App} from 'aws-cdk-lib';
import {DeploymentStack} from '../lib/deployment-stack';

const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
};
const domain = 'antipathy.org'
const stackPrefix = 'antipathyorg'
const applicationProps = {
    stackPrefix: stackPrefix,
    domainName: domain,
    repo: {
        branch: 'main',
        name: domain
    },
    webStageProps: {
        stackPrefix: stackPrefix,
        siteProps: {
            domainName: domain,
            defaultRootObject: 'index.html',
            env: env
        }
    },
    env: env
}


const app = new App();
new DeploymentStack(app, 'antipathyorg-deployment', applicationProps);

