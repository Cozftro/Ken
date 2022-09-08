function doPost(e) {
  // スプレッドシートを取得
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // シート名を取得
  var sheet = ss.getActiveSheet();
  
  // タイムスタンプを取得
  var date = new Date(e.parameters.timestamp*1000);

  // Slackに投稿したユーザー名を取得
  var userName = String(e.parameters.user_name);

  // Slackに投稿したメッセージを取得
  var text = String(e.parameters.text);

  // 日付
  var day = Utilities.formatDate(new Date(), "JST","dd");

  // スプレッドシートに書き込むネタまとめ
  var writeData = [date, userName, text, day];
  
  // スプレッドシートのアクティブシートへ書き込む
  sheet.appendRow(writeData);
}  
