#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { WebLabsInfraStack } from '../lib/web-labs-infra-stack';

const app = new cdk.App();
new WebLabsInfraStack(app, 'WebLabsInfraStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
