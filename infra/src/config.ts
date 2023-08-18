export interface FrontendEnvVars {
  [key: string]: {
    value: string | undefined;
  };
}

export interface FrontendS3Config {
  bucketName: string;
  hostname: string;
  env: FrontendEnvVars;
  nodejs: string; //16.x.x, 16.17.0
  repoBranch: string;
  repoName: string;
}

export const YELLYWEB: FrontendS3Config = {
  nodejs: process.env.FRONTEND_NODEJS_VERSION!,
  hostname: process.env.FRONTEND_HOSTNAME!,
  bucketName: process.env.FRONTEND_BUCKET_NAME!,
  repoBranch: process.env.FRONTEND_REPO_BRANCH!,
  repoName: process.env.FRONTEND_REPO_NAME!,
  env: {},
};

export const DOT_UI: FrontendS3Config = {
  nodejs: process.env.FRONTEND_NODEJS_VERSION!,
  hostname: process.env.DOT_UI_HOSTNAME!,
  bucketName: process.env.DOT_UI_BUCKET_NAME!,
  repoBranch: process.env.DOT_UI_REPO_BRANCH!,
  repoName: process.env.DOT_UI_REPO_NAME!,
  env: {},
};
