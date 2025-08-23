function handleChatbot(e) {
  const messages = JSON.parse(e.parameter.messages);
  const apiKey = PropertiesService.getScriptProperties().getProperty("OPENROUTER_API_KEY");

  const ss = SpreadsheetApp.openById("1htZldTcUW3MvZFCtOG3TpnXrnN5fOzICDrx6FMT_RmM");
  let sheet = ss.getSheetByName("ChatLog");
  if (!sheet) {
    sheet = ss.insertSheet("ChatLog");
    sheet.appendRow(["Timestamp", "Role", "Message"]);
  }

  const timestamp = new Date();
  messages.forEach((msg) => {
    if (msg.role === "user" || msg.role === "system") {
      sheet.appendRow([timestamp, msg.role, msg.content]);
    }
  });

  const response = UrlFetchApp.fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: `Bearer ${apiKey}` },
    payload: JSON.stringify({ model: "deepseek/deepseek-r1:free", messages }),
    muteHttpExceptions: true,
  });

  const replyText = response.getContentText();
  const json = JSON.parse(replyText);
  const assistantReply = json?.choices?.[0]?.message?.content;
  if (assistantReply) {
    sheet.appendRow([timestamp, "assistant", assistantReply]);
  }

  return ContentService.createTextOutput(replyText)
    .setMimeType(ContentService.MimeType.JSON);
}
