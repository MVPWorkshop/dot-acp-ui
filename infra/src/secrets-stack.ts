import * as cdk from "aws-cdk-lib";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { SecretValue } from "aws-cdk-lib";

export interface SecretsStackProps extends cdk.StackProps {
  name: string;
}

export interface ISecrets {
  gitHubSecret: secretsmanager.ISecret;
  dockerHubSecret: secretsmanager.ISecret;

  //workaround for mapping a secrets to service
  [key: string]: secretsmanager.ISecret;
}

export class SecretsStack extends cdk.Stack {
  private gitHubSecret: secretsmanager.ISecret;
  private dockerHubSecret: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props: SecretsStackProps) {
    super(scope, id, props);

    const gitHubSecret = {
      gitOwner: process.env.GIT_OWNER!,
      gitToken: process.env.GIT_TOKEN!,
    };

    const dockerHubSecret = {
      username: process.env.DOCKER_HUB_USERNAME!,
      password: process.env.DOCKER_HUB_PASSWORD!,
    };

    // Create a new Secret for GitHub
    this.gitHubSecret = new secretsmanager.Secret(
      this,
      `${this.stackName}-github`,
      {
        secretName: `${this.stackName}-github`,
        secretStringValue: new SecretValue(JSON.stringify(gitHubSecret)),
      }
    );

    this.dockerHubSecret = new secretsmanager.Secret(
      this,
      `${this.stackName}-docker-hub`,
      {
        secretName: `${this.stackName}-docker-hub`,
        secretStringValue: new SecretValue(JSON.stringify(dockerHubSecret)),
      }
    );
  }

  get secrets(): ISecrets {
    const secrets: ISecrets = {
      gitHubSecret: this.gitHubSecret,
      dockerHubSecret: this.dockerHubSecret,
    };
    return secrets;
  }
}
