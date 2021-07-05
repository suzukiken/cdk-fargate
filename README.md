Example CDK Project

## Resources to be created

* Dockerfile: To create ECR docker image (docker/Dockerfile)
    * Python Script: Run in the Docker container (docker/script.py)
* S3 Bucket (lib/cdk-fargate-storage-stack.ts)
    * Initial Asset (sample)
* ECR Repository (lib/cdk-fargate-repo-stack.ts)
* ECS cluster (lib/cdk-fargate-stack.ts)
    * Scheduled Fargete Task

## Commands

 * `cdk deploy CdkFargateStack`
 * `cdk deploy CdkFargateStorageStack`
 * `cdk deploy CdkFargateRepoStack`
