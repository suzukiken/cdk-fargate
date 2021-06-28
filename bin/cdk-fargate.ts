#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkFargateStack } from '../lib/cdk-fargate-stack';
import { CdkFargateStorageStack } from '../lib/cdk-fargate-storage-stack';
import { CdkFargateRepoStack } from '../lib/cdk-fargate-repo-stack';

const app = new cdk.App();
new CdkFargateStack(app, 'CdkFargateStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});
new CdkFargateStorageStack(app, 'CdkFargateStorageStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});
new CdkFargateRepoStack(app, 'CdkFargateRepoStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});