import {
  App,
  NestedStack,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Artifact, Pipeline } from "aws-cdk-lib/aws-codepipeline";
import {
  CodeBuildAction,
  GitHubSourceAction,
} from "aws-cdk-lib/aws-codepipeline-actions";
import {
  BuildSpec,
  LinuxBuildImage,
  PipelineProject,
} from "aws-cdk-lib/aws-codebuild";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { ISecrets } from "./secrets-stack";
import { FrontendEnvVars } from "./config";

export interface ReactS3Props extends StackProps {
  readonly distributionId: string;
  readonly bucketName: string;
  readonly repoName: string;
  readonly repoBranch: string;
  readonly environmentVariables: FrontendEnvVars;
  readonly account: string;
  readonly nodejs: string;
  readonly secrets: ISecrets;
}

/**
 * Infrastructure that creates a CI/CD pipeline to deploy a static site to an S3 bucket.
 * The pipeline checks out the source code from a GitHub repository, builds it, deploys it to the S3 bucket and invalidates the CloudFront distribution.
 */
export class CICDReact extends NestedStack {
  constructor(stack: Stack, id: string, props: ReactS3Props) {
    super(stack, id);

    const gitOwner = props.secrets.gitHubSecret
      .secretValueFromJson("gitOwner")
      .unsafeUnwrap();

    const logGroup = new LogGroup(this, `logGroup`, {
      removalPolicy: RemovalPolicy.DESTROY,
      retention: RetentionDays.ONE_WEEK,
      logGroupName: `/codebuild/${props.bucketName}-build-project`,
    });

    const bucket = new Bucket(this, "pipe-bucket", {
      versioned: true,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      bucketName: `${props.bucketName}-pipeline`,
    });

    const sourceOutput = new Artifact("SourceOutput");
    const sourceAction = new GitHubSourceAction({
      actionName: "SOURCE",
      owner: gitOwner,
      repo: props.repoName,
      branch: props.repoBranch,
      oauthToken: props.secrets.gitHubSecret.secretValueFromJson("gitToken"),
      output: sourceOutput,
    });

    // Create the build action
    const webBuildProject = this.createBuildProject(
      props.bucketName,
      props.distributionId,
      props.bucketName,
      props.account,
      props.nodejs, // "16.x.x", "16.17.0"
      props.environmentVariables,
      logGroup
    );
    props.secrets.gitHubSecret.grantRead(webBuildProject);

    const buildAction = new CodeBuildAction({
      actionName: "BUILD_DEPLOY",
      project: webBuildProject,
      input: sourceOutput,
    });

    // Create the pipeline
    const pipelineName = `${props.bucketName}-pipeline`;
    new Pipeline(this, pipelineName, {
      pipelineName: pipelineName,
      artifactBucket: bucket,
      stages: [
        {
          stageName: "Source",
          actions: [sourceAction],
        },
        {
          stageName: "Build",
          actions: [buildAction],
        },
      ],
    });
  }

  private createBuildProject(
    bucketName: string,
    distributionId: string,
    staticWebsiteBucket: string,
    account: string,
    nodejs: string, // "16" ...
    environmentVariables: FrontendEnvVars,
    logGroup: LogGroup
  ) {
    const buildProject = new PipelineProject(
      this,
      `${bucketName}-build-project`,
      {
        logging: {
          cloudWatch: {
            logGroup,
          },
        },
        environmentVariables,
        buildSpec: BuildSpec.fromObject({
          version: "0.2",
          phases: {
            install: {
              "runtime-versions": {
                nodejs,
              },
              commands: ["npm i -g pnpm", "pnpm install"],
            },
            build: {
              commands: ["pnpm run build"],
            },
            post_build: {
              commands: [
                `aws s3 sync "dist" "s3://${staticWebsiteBucket}" --delete`,
                `aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "/*"`,
              ],
            },
          },
        }),
        environment: {
          buildImage: LinuxBuildImage.AMAZON_LINUX_2_4,
        },
      }
    );

    const codeBuildS3ListObjectsPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "s3:GetObject",
        "s3:GetBucketLocation",
        "s3:ListBucket",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl",
        "cloudwatch:PutMetricData",
      ],
      resources: [
        `arn:aws:s3:::${staticWebsiteBucket}`,
        `arn:aws:s3:::${staticWebsiteBucket}/*`,
      ],
    });
    buildProject.role?.addToPrincipalPolicy(codeBuildS3ListObjectsPolicy);
    const codeBuildCreateInvalidationPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["cloudfront:CreateInvalidation"],
      resources: [
        `arn:aws:cloudfront::${account}:distribution/${distributionId}`,
      ],
    });
    buildProject.role?.addToPrincipalPolicy(codeBuildCreateInvalidationPolicy);

    return buildProject;
  }
}
