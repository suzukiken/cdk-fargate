import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as deployment from '@aws-cdk/aws-s3-deployment';
import * as path from 'path'

export class CdkFargateStorageStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const bucket_name_exportname = this.node.tryGetContext('bucket_name_exportname')

    const bucket = new s3.Bucket(this, "Bucket")
    
    new deployment.BucketDeployment(this, 'SamleText', {
      sources: [
        deployment.Source.asset(path.join(__dirname, '..', 'sample'))
      ],
      destinationBucket: bucket
    })
    
    new cdk.CfnOutput(this, "BucketOutput", { value: bucket.bucketName, exportName: bucket_name_exportname })
  }
}

