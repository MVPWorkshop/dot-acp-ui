#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { DOT_UI } from "./config";
import { Route53Stack } from "./route53-stack";
import { SecretsStack } from "./secrets-stack";
import { WebReactStack } from "./index";


const _APPLICATION_NAME = process.env.APPLICATION_NAME
if(!_APPLICATION_NAME) throw new Error("APPLICATION_NAME is not defined")

const app = new cdk.App();

const route53Stack = new Route53Stack(app, `${_APPLICATION_NAME}-route53`);
const { zone } = route53Stack;

const secrets = new SecretsStack(app, `${_APPLICATION_NAME}-secrets`, {
  name: _APPLICATION_NAME,
});

const dot_ui = new WebReactStack(app, `${_APPLICATION_NAME}-dot-ui`, {
  zone,
  config: DOT_UI,
  account: process.env.CDK_DEFAULT_ACCOUNT!,
  secrets: secrets.secrets,
});

