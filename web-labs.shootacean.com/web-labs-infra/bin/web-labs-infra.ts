#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { WebLabsInfraStack } from '../lib/web-labs-infra-stack';

require('dotenv').config();

const app = new cdk.App();
new WebLabsInfraStack(
  app,
  'WebLabsInfraStack',
  {
    env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
  },
  process.env.AWS_HOSTED_ZONE_ID,
);
