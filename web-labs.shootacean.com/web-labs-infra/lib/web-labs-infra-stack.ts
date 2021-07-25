import * as cdk from '@aws-cdk/core';
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as route53 from "@aws-cdk/aws-route53";

export class WebLabsInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps, hostedZoneId: string | undefined) {
    super(scope, id, props);

    const domainName = 'web-labs.shootacean.com';

    if (hostedZoneId === undefined) {
      throw Error;
    }

    const originBucket = this.defineOriginBucket(props?.env?.account);

    const zone = this.lookupHostedZone('shootacean.com', hostedZoneId);
    const certificate = this.defineACMCertificate(domainName, zone);

    const distribution = this.defineDistribution(originBucket, domainName, certificate);

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
   * ACM証明書を作成する
   *
   * @param domainName
   * @param hostedZone
   * @private
   */
  private defineACMCertificate(domainName: string, hostedZone: route53.IHostedZone): acm.Certificate {
    return new acm.DnsValidatedCertificate(this, 'Certificate', {
      domainName: domainName,
      hostedZone: hostedZone,
      region: 'us-east-1',
    });
  }

  /**
   * CloudFrontディストリビューションを作成する
   *
   * @param originBucket
   * @param domainName
   * @param certificate
   * @private
   */
  private defineDistribution(originBucket: s3.Bucket, domainName: string, certificate: acm.Certificate): cloudfront.Distribution {
    return new cloudfront.Distribution(this, 'web-labs-cloudfront', {
      enabled: true,
      defaultRootObject: 'index.html',
      httpVersion: cloudfront.HttpVersion.HTTP2,
      enableIpv6: true,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2019,
      domainNames: [
        domainName,
      ],
      certificate: certificate,
      defaultBehavior: {
        origin: new origins.S3Origin(originBucket),
      },
    });
  }

  /**
   * 定義済みのRoute53ホストゾーンをインポートする
   * @param zoneName
   * @param hostedZoneId
   * @private
   */
  private lookupHostedZone(zoneName: string, hostedZoneId: string): route53.IHostedZone {
    return route53.HostedZone.fromHostedZoneAttributes(this, 'hosted-zone', {
      zoneName: zoneName,
      hostedZoneId: hostedZoneId,
    });
  }
}
