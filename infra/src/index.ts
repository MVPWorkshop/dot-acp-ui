import { App, Stack, StackProps } from "aws-cdk-lib";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { FrontendS3Config } from "./config"
import { CICDReact } from "./s3-cdn-react";
import { WebClientStack } from "./web-client-stack";
import { ISecrets } from "./secrets-stack";

export interface WebReactStackProps extends StackProps {
  zone: IHostedZone;
  config: FrontendS3Config;
  account: string;
  secrets: ISecrets;
}

export class WebReactStack extends Stack {
  constructor(app: App, id: string, props: WebReactStackProps) {
    super(app, id, props);

    /**
     * Create the S3 bucket and CloudFront distribution for the React app.
     * The bucket is configured to serve static web content.
     * The CloudFront distribution is configured to use the bucket as its origin.
     */
    const s3Front = new WebClientStack(this, `client`, {
      zone: props.zone,
      config: props.config,
      account: props.account,
    });

    const { distributionId } = s3Front;
    /**
     * Create the CI/CD pipeline for the React app.
     * The pipeline checks out the source code from a GitHub repository, builds it, deploys it to the S3 bucket and invalidates the CloudFront distribution.
     * The pipeline is configured to use CodeBuild and CodePipeline.
     */
    const s3FrontCiCD = new CICDReact(this, `cicd`, {
      distributionId,
      bucketName: props.config.bucketName,
      repoName: props.config.repoName,
      repoBranch: props.config.repoBranch,
      environmentVariables: props.config.env,
      account: props.account,
      nodejs: props.config.nodejs,
      secrets: props.secrets,
    });
    s3FrontCiCD.node.addDependency(s3Front);
  }
}
