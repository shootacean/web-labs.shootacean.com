import * as cdk from '@aws-cdk/core';
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import {HttpVersion, SecurityPolicyProtocol} from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";

export class WebLabsInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const originBucket = this.defineOriginBucket(props?.env?.account);
    const distribution = this.defineDistribution(originBucket);

    // このスタック内のリソースにタグをつける
    cdk.Tags.of(this).add('service', 'web-labs');
  }

  /**
   * CloudFrontオリジン用のS3バケットを作成する
   * @param account
   * @private
   */
  private defineOriginBucket(account: string | undefined): s3.Bucket {
    return new s3.Bucket(this, `web-labs-bucket`, {
      bucketName: `web-labs-${account}`,
      versioned: false,
      publicReadAccess: false,
      blockPublicAccess: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }

  /**
   * CloudFrontディストリビューションを作成する
   * @param originBucket オリジンS3バケット
   * @private
   */
  private defineDistribution(originBucket: s3.Bucket): cloudfront.Distribution {
    return new cloudfront.Distribution(this, 'web-labs-cloudfront', {
      enabled: true,
      defaultBehavior: {
        origin: new origins.S3Origin(originBucket),
      },
      defaultRootObject: 'index.html',
      httpVersion: HttpVersion.HTTP2,
      enableIpv6: true,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2019
    });
  }
}
