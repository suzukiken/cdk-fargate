import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3 from '@aws-cdk/aws-s3';
import * as patterns from '@aws-cdk/aws-ecs-patterns';
import * as events from '@aws-cdk/aws-events';

export class CdkFargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const vpc_id = this.node.tryGetContext('vpc_id')
    const vpc_name = this.node.tryGetContext('vpc_name')
    const repository_name = this.node.tryGetContext('repository_name')
    const repository = ecr.Repository.fromRepositoryName(this, 'Repository', repository_name)
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: vpc_id, vpcName: vpc_name })
    const bucket_name_exportname = cdk.Fn.importValue(this.node.tryGetContext('bucket_name_exportname'))
    const bucket = s3.Bucket.fromBucketName(this, "Bucket", bucket_name_exportname)
    
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc })
    
    // https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task-cpu-memory-error.html
    const scheduled_fargate_task = new patterns.ScheduledFargateTask(this, 'ScheduledFargateTask', {
      cluster,
      scheduledFargateTaskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(repository),
        memoryLimitMiB: 512,
        cpu: 256,
        environment: {
          BUCKET_NAME: bucket.bucketName
        },
      },
      subnetSelection: {
        subnetType: ec2.SubnetType.PUBLIC
      },
      schedule: events.Schedule.expression('cron(40 6 * * ? *)'),
      platformVersion: ecs.FargatePlatformVersion.LATEST,
    })
    
    bucket.grantReadWrite(scheduled_fargate_task.taskDefinition.taskRole)
    
  }
}

