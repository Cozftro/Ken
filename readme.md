# 概要
K村K輔くんからの仕事依頼

# 要件
Slackの特定チャンネルに時間を入力すると、その時間に特定チャンネル（時刻入力チャンネルとは別にすることも可）にリマインド（メンション）する

# フロー
1. Slackに個人アカウントでメッセージ(時刻)を入力
2. OutgoingWebhookにてGoogleスプレッドシートに書き込み
3. GASで１分間に1回、スプレッドシートをスクレイピングする
4. スクレイピングして直近の書き込みと現在時間が合致する場合は、IncomingWebhookにてSlackにAPIを投げる
5. Slackのメンション機能にて特定個人IDに対して通知を行う

# GAS
作るべきfunctionまとめ
- OutgoingWebhook受け取り用(予約関数：doPost)
- スプレッドシートをスクレイピングして打刻した時間を採取
- 現在の時間を取得し、時間を突合
- IncomingWebhookを叩く

# 設計図
![blueprint](https://raw.githubusercontent.com/Cozftro/kensuke/master/.images/kensuke.drawio.png)


# Flow
## ①時刻打刻(トリガー)
特定のチャンネルに打刻する（先頭文字列が[0-9]の場合のみ反応）<br>
```text:入力規則
②のOutgoingWebhookにて設定をする
・0時の場合のみ、00:01 と記入する(スプレッドシートの仕様)
・1~23時の場合は、1:00 や 23:59 記載でOK
・正規表現が使用できない為、下記のようにトリガーを設定
```
![torigger](https://raw.githubusercontent.com/Cozftro/kensuke/master/.images/outgoing_torigger.png)

## ②OutgoingWebhook
OutgoingWebhookをチャンネルに紐づける。<br>
スプレッドシートに文字列を記載。<br>
[詳細な設定方法リンク](https://zenn.dev/cozftro/articles/08745bd17b1dc4)

## ③時刻チェック
GASにて毎分 `cron_main.gs` を実行。

## ④IncomingWebhook
特定のチャンネルと連携する。
指定されたURLとチャンネルに向けてAPIを投げる。

## ⑤メンション
メンションするには管理者になり、ユーザーIDを確認する必要アリ。

#### ユーザーIDリスト取得方法
1. 管理者としてSlackワークスペースにログイン
![workspace_1](https://raw.githubusercontent.com/Cozftro/kensuke/master/.images/workspace_1.png)
2. メンバーリストをエクスポート実施
![workspace_1](https://raw.githubusercontent.com/Cozftro/kensuke/master/.images/workspace_2.png)
3. webブラウザ上で確認画面が出るので、SlackBotからのメッセージを確認
![workspace_1](https://raw.githubusercontent.com/Cozftro/kensuke/master/.images/workspace_3.png)
4. csvをダウンロードしてIDを確認
![workspace_1](https://raw.githubusercontent.com/Cozftro/kensuke/master/.images/workspace_4.png)


# Remarks
## GoogleAppScriptの種類
**コンテナバインド型**
- スプレッドシートやフォームに紐づいている
- 本件はコンテナバインド型を採用

**スタンドアロン型**
- 独立して存在しており、他と依存関係がない

## doPost関数、doGet関数
GASにて予め予約されている関数<br>
WebアプリにPOST・GETリクエストが送られたときに、実行される関数です。<br>
URLを公開することで、当該メソッドが叩かれると反応する。

# issue
## 最終のコメントにしかタイマーが対応しない
複数のタイマーに非対応
どこまで対応させるかは要検討

## 0時台の入力方式の変更
0時については`00:00` と入力しているが、`0:00`で反応するように改良希望