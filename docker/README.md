Dockerイメージの作成

このリポのルートディレクトリで
```
docker build -t image-for-fargate .
```

ECRへプッシュ
----
```
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin xxxxxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com
```

```
docker tag image-for-fargate:latest xxxxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com/image-for-fargate:latest
docker push xxxxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com/image-for-fargate:latest
```

その他実験のために利用するコマンド
```
docker run --rm -e BUCKET_NAME=xxxxxxxxxx image-for-fargate
docker run -it image-for-fargate bash
```

Dockerの掃除
```
docker rmi -f $(docker images -a -q)
docker system prune
```
