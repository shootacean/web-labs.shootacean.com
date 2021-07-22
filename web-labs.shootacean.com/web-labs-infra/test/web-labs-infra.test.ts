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

test('Snapshot Test WebLabsInfraStack', () => {
  const app = new cdk.App();
  const stack = new WebLabsInfra.WebLabsInfraStack(app, 'TestWebLabsInfraStack', {});
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test('Resources Test Counts', () => {
  const app = new cdk.App();
  const stack = new WebLabsInfra.WebLabsInfraStack(app, 'TestWebLabsInfraStack', {});
  expectCDK(stack).to(countResources('AWS::S3::Bucket', 1));
  expectCDK(stack).to(countResources('AWS::S3::BucketPolicy', 1));
  expectCDK(stack).to(countResources('AWS::CloudFront::Distribution', 1));
  expectCDK(stack).to(countResources('AWS::CloudFront::CloudFrontOriginAccessIdentity', 1));
});

test('Properties Test S3', () => {
  const app = new cdk.App();
  const stack = new WebLabsInfra.WebLabsInfraStack(app, 'TestWebLabsInfraStack', {});
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
  const stack = new WebLabsInfra.WebLabsInfraStack(app, 'TestWebLabsInfraStack', {});
  expectCDK(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Enabled: true,
      HttpVersion: 'http2',
      IPV6Enabled: true,
      DefaultRootObject: 'index.html',
    },
    Tags: [
      {Key: 'service', Value: 'web-labs'}
    ]
  }));
});
