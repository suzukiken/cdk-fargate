import boto3
import os
from datetime import datetime

client = boto3.client('s3')

BUCKET_NAME = os.environ.get('BUCKET_NAME')
  
response = client.get_object(
    Bucket=BUCKET_NAME,
    Key='text.txt'
)

print(response)

content = response['Body'].read().decode('utf-8')

print(content)

response = client.put_object(
    Bucket=BUCKET_NAME,
    Key='copy-{}.txt'.format(datetime.now().isoformat()),
    Body=content
)

print(response)