+++
title = "Scheduled Farget Task"
category = "Farget"
tags = ["Farget", "ECR", "Docker"]
date = "2021-06-28"
update = "2021-06-29"
+++

何かの処理をするときにLambda関数でできる範囲ならそれが楽だと思うけど、Lambda関数の制限の範囲で作るのが難しかったり不可能だったりする場合は、EC2だとかECSとかFargateとかを使うことになると思う。

特に15分以上の時間がかかる処理であるとか、処理の途中でシステム内にファイルを書き出す必要があるとか、そういったことはLambdaで頑張らない方が楽かもしれない。

このリポジトリでは1日一度とか、毎月一度とか必要な処理をするだけで良いという場合に使えそうな、仕組みを用意してみた。

用意してみたと言っても自分のリポジトリのほとんどがそうであるように、所詮CDKの使い方を勉強してそういう仕組みをパッと作りたい時に再利用できそうなコードの集まりをリポジトリとして置いておいた、というだけのことではある。

このリポジトリの構成はこのようになっている

* [Dockerfile](../docker/Dockerfile)
* [Dockerで動くPythonのスクリプト](../docker/script.py)
* [Pythonのスクリプトが読み書きするS3 Bucket](../lib/cdk-fargate-storage-stack.ts)
* [Pythonのスクリプトが読み書きするS3 BucketにCDKのdeploy時に置かれるファイル](../sample)
* [ECR Repository](../lib/cdk-fargate-repo-stack.ts)
* [Scheduled Fargete Task](../lib/cdk-fargate-stack.ts)

メモ

* ECSで利用する既存のVPCのidやname、このCDKで作成するECRのRepository名、S3のBucket名は[cdk.json](../cdk.json)で指定するようにしている。
* この処理をするためにコンテナには[S3バケットへのアクセス権限を付与している](https://github.com/suzukiken/cdk-fargate/blob/711f92bb1ffef2e0220fff166e6c92f678707a3b/lib/cdk-fargate-stack.ts#L41)。
* 毎日日本時間の[20時に起動](https://github.com/suzukiken/cdk-fargate/blob/711f92bb1ffef2e0220fff166e6c92f678707a3b/lib/cdk-fargate-stack.ts#L37)するようにしている。
* 未確認だけど未指定の場合CDKはECSクラスタをVPCのプライベートのサブネットに置こうとするようで、自分の場合プライベートなサブネットを用意していなかったのでそのままではデプロイできず、[パブリックのサブネットに置くように指定](https://github.com/suzukiken/cdk-fargate/blob/711f92bb1ffef2e0220fff166e6c92f678707a3b/lib/cdk-fargate-stack.ts#L34-L36)した。
* 一切の設定をしないでもCloudWatchにDockerのログが残るのが便利（DockerイメージはAmazonlinux2をベースにしているためか、それともDebianなどでもそうなのか未確認）

こうした定期実行のFargateを作るCDKのコードは簡潔だった。Dockerを作ってECRに置いて、という作業が面倒ではあるけれど全体の仕組みは把握しやすくて手軽に使えると思った。

なおPythonのスクリプトはS3バケットのテキストファイルを読み取って、そのコピーを別のファイル名で同じバケットに保存するという処理だけをしていて、ただのサンプルなので役には立たない。
