import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
  SynthUtils,
  countResources,
  haveResource,

  ABSENT, haveResourceLike
} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as WebLabsInfra from '../lib/web-labs-infra-stack';

require('dotenv').config();

const env: cdk.Environment = {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION};
const hostedZoneId: string | undefined = process.env.AWS_HOSTED_ZONE_ID;

test('Snapshot Test WebLabsInfraStack', () => {
  const app = new cdk.App();
  const stack = new WebLabsInfra.WebLabsInfraStack(app, 'TestWebLabsInfraStack', {env: env}, hostedZoneId);
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test('Resources Test Counts', () => {
  const app = new cdk.App();
  const stack = new WebLabsInfra.WebLabsInfraStack(app, 'TestWebLabsInfraStack', {env: env}, hostedZoneId);
  expectCDK(stack).to(countResources('AWS::S3::Bucket', 1));
  expectCDK(stack).to(countResources('AWS::S3::BucketPolicy', 1));
  expectCDK(stack).to(countResources('AWS::CloudFront::Distribution', 1));
  expectCDK(stack).to(countResources('AWS::CloudFront::CloudFrontOriginAccessIdentity', 1));
  // expectCDK(stack).to(countResources('AWS::CertificateManager::Certificate', 1));
  expectCDK(stack).to(countResources('AWS::CloudFormation::CustomResource', 1));
});

test('Properties Test S3', () => {
  const app = new cdk.App();
  const stack = new WebLabsInfra.WebLabsInfraStack(app, 'TestWebLabsInfraStack', {env: env}, hostedZoneId);
  expectCDK(stack).to(haveResource('AWS::S3::Bucket', {
    VersioningConfiguration: ABSENT,
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true,
    },
  }));
});

test('Properties Test CloudFront Distribution', () => {
  const app = new cdk.App();
  const stack = new WebLabsInfra.WebLabsInfraStack(app, 'TestWebLabsInfraStack', {env: env}, hostedZoneId);
  expectCDK(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Enabled: true,
      HttpVersion: 'http2',
      IPV6Enabled: true,
      DefaultRootObject: 'index.html',
      Aliases: [
        'web-labs.shootacean.com'
      ],
      ViewerCertificate: {
        MinimumProtocolVersion: 'TLSv1.2_2019',
        SslSupportMethod: 'sni-only',
      }
    },
    Tags: [
      {Key: 'service', Value: 'web-labs'}
    ]
  }));
});

test('Properties Test ACM Certificate', () => {
  const app = new cdk.App();
  const stack = new WebLabsInfra.WebLabsInfraStack(app, 'TestWebLabsInfraStack', {env: env}, hostedZoneId);
  // expectCDK(stack).to(haveResource('AWS::CertificateManager::Certificate', {
  expectCDK(stack).to(haveResourceLike('AWS::CloudFormation::CustomResource', {
    DomainName: 'web-labs.shootacean.com',
    HostedZoneId: hostedZoneId,
    Region: 'us-east-1',
  }));
});
