//sheetLastrow関数で最終行を取得する関数
function sheetLastrow() {
  let sheet = SpreadsheetApp.getActiveSheet();
  let lastRow = sheet.getLastRow();
  /* debug
　let msg = "getLastRowで取得した最終行：" + lastRow + " 行";
  console.log(msg);
  */
  return lastRow;
}

//IncomingWebhookにてSlackにて通知関数
function notifySlack(notifyTime) {
  // 通知したいユーザーID
  // 例：const uid = '<@11111AAAAAA>'
  const uid = '';

  // Slackで通知するユーザー名（任意）
  // 例：const username = 'BotNock';
  const username = '';

  // IncomingWebhookにて設定してチャンネルを設定
  const channel = '';

  // Slackで通知する際のアイコンを設定
  // 例：const icon = ':innocent:';
  // https://www.webfx.com/tools/emoji-cheat-sheet/
  const icon = '';

  // Slackにて通知する本文
  const message = ''

  // payload用に文章を整形
  var text = (uid + "\n" + notifyTime);
  
  //payload変数
  var payload = {
    'username' : username,
    'text' : text,
    'channel' : channel,
    'icon_emoji' : icon
  }
    
  //通知オプション変数
  var options = {
    'method' : 'post',
    'contentType' : 'applocation/json',
    'payload' : JSON.stringify(payload),
    'muteHttpExceptions' : false
  }
  
  // 通知先SlackのIncomingWebhook
  // 例：var url = 'https://hooks.slack.com/services/AAAAAAAAAAA/BBBBBBBBBBB/CCCCCCCCCCCCCCCCCCCCCCCC'
  var url = ''

  // Slackへ通知
  UrlFetchApp.fetch(url,options);
}

// main関数
function cron_main() {
  // スプレッドシートの縦列を指定
  const colVal  = "C"
  const colday  = "D"

  // 現在の時間を取得(hh:mm 形式でjikan変数に格納)
  let date = new Date();
  var jikan = ''
  if (Number(date.getMinutes()) < 10){
    jikan = (date.getHours() + ":0" + date.getMinutes());
  }else{
    jikan = (date.getHours() + ":" + date.getMinutes());
  }

  // 現在の日付を取得
  let hiduke = date.getDate();

  // 最終行を取得(sheetLastrow関数にて取得)
  let valCol = sheetLastrow();

  // 取得対象のセルを指定(scraping*に格納)
  let scrapingCell = colVal + valCol;
  let scrapingDay  = colday + valCol;

  // スプレッドシートからvalueを取得(rtValに格納)
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let as = ss.getActiveSheet();
  let rtVal = as.getRange(scrapingCell).getDisplayValue();

  // スプレッドシートから入力日付を取得
  let rtDay = as.getRange(scrapingDay).getDisplayValue();
  
  // 時間の判定 
  if (rtVal == jikan && rtDay ==  hiduke) {
      notifySlack(rtVal);
  }else{
    console.log(jikan,rtVal);
    console.log(rtDay,hiduke);
  }
}
