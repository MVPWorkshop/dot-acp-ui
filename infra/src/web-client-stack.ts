import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import {
  CfnOutput,
  Duration,
  NestedStack,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import { FrontendS3Config } from "./config";
import { DnsAndCertificateConstruct } from "./dns-certificate-construct";

export interface S3ReactProps extends StackProps {
  zone: IHostedZone;
  config: FrontendS3Config;
  account: string;
}

export class WebClientStack extends NestedStack {
  public readonly distributionId: string;

  constructor(stack: Stack, id: string, props: S3ReactProps) {
    super(stack, id);

    const { zone, config } = props;

    const siteDomain = `${config.hostname}.${zone.zoneName}`;

    const siteBucket = new s3.Bucket(this, "ExplorerFrontend", {
      bucketName: config.bucketName,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      accessControl: s3.BucketAccessControl.PRIVATE,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // Grant access to cloudfron
    new CfnOutput(this, "Bucket-Output", { value: siteBucket.bucketName });

    const cert = new DnsAndCertificateConstruct(this, "cert", {
      zone: props.zone,
      hostname: config.hostname,
      cloudfront: true,
    });
    const { certificate } = cert;
    const myResponseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
      this,
      "ResponseHeadersPolicy",
      {
        responseHeadersPolicyName: `${this.stackName}-explorer-response-header`,
        comment: "A default policy",
        corsBehavior: {
          accessControlAllowCredentials: false,
          accessControlAllowHeaders: ["*"],
          accessControlAllowMethods: ["GET"],
          accessControlAllowOrigins: [siteDomain],
          accessControlMaxAge: Duration.seconds(600),
          originOverride: true,
        },
        securityHeadersBehavior: {
          contentTypeOptions: { override: true },
          frameOptions: {
            frameOption: cloudfront.HeadersFrameOption.DENY,
            override: true,
          },
          referrerPolicy: {
            referrerPolicy: cloudfront.HeadersReferrerPolicy.NO_REFERRER,
            override: true,
          },
          strictTransportSecurity: {
            accessControlMaxAge: Duration.seconds(600),
            includeSubdomains: true,
            override: true,
          },
          xssProtection: {
            protection: true,
            modeBlock: true,
            override: true,
          },
        },
      }
    );

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "cloudfront-OAI",
      {
        comment: `OAI for ${config.bucketName}`,
      }
    );
    // grant s3:list, s3:getBucket, s3:getObject to the OAI
    siteBucket.grantRead(cloudfrontOAI);

    const distribution = new cloudfront.Distribution(
      this,
      "Cloud-front-s3-frontend",
      {
        defaultRootObject: "index.html",
        domainNames: [siteDomain],
        certificate,
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
        defaultBehavior: {
          origin: new cloudfrontOrigins.S3Origin(siteBucket, {
            originAccessIdentity: cloudfrontOAI,
          }),
          compress: true,
          responseHeadersPolicy: myResponseHeadersPolicy,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      }
    );
    this.distributionId = distribution.distributionId;
    // distribution.node.addDependency(cloudfrontOAI);

    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    // Route53 alias record for the CloudFront distribution
    new route53.ARecord(this, "SiteAliasRecord", {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone: props.zone,
    });

    // // react needs to be build in order to be deployed to s3
    // // it can be ignored and can run in a separate pipeline
    // const path = `${process.cwd()}/../frontend/dist`;
    // // Deploy site contents to S3 bucket
    // new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
    //   sources: [s3deploy.Source.asset(path)],
    //   destinationBucket: siteBucket,
    //   distribution,
    //   distributionPaths: ["/*"],
    // });
  }
}
