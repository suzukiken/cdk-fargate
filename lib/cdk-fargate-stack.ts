import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3 from '@aws-cdk/aws-s3';

export class CdkFargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const vpc_id = this.node.tryGetContext('vpc_id')
    const vpc_name = this.node.tryGetContext('vpc_name')
    const repository_name = this.node.tryGetContext('repository_name')
    const repository = ecr.Repository.fromRepositoryName(this, 'Repository', repository_name)
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: vpc_id, vpcName: vpc_name })
    const bucket_name_exportname = this.node.tryGetContext('bucket_name_exportname')
    const bucket = s3.Bucket.fromBucketName(this, "Bucket", bucket_name_exportname)
    
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc })
    
    const task_definition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 256,
    })
    
    const container = task_definition.addContainer("Container", {
      image: ecs.ContainerImage.fromEcrRepository(repository),
      environment: {
        BUCKET_NAME: bucket.bucketName
      }
    })
    
    const service = new ecs.FargateService(this, 'Service', {
      cluster: cluster,
      taskDefinition: task_definition,
      desiredCount: 1
    })
    
  }
}

