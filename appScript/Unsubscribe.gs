function handleUnsubscribe(email) {
  const ss = SpreadsheetApp.openById('1htZldTcUW3MvZFCtOG3TpnXrnN5fOzICDrx6FMT_RmM');
  const userSheet = ss.getSheetByName("User");
  const unsubscribeSheet = ss.getSheetByName("Unsubscribe");

  const users = userSheet.getDataRange().getValues();
  let rowIndex = -1;
  let removedRow = null;

  for (let i = 1; i < users.length; i++) {
    if (users[i][1].toString().toLowerCase() === email.toLowerCase()) {
      rowIndex = i + 1;
      removedRow = users[i];
      break;
    }
  }

  if (rowIndex > 0) {
    userSheet.deleteRow(rowIndex);
    unsubscribeSheet.appendRow([removedRow[0], removedRow[1], new Date()]);
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: `${email} has been unsubscribed.` })
    ).setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: `Email ${email} does not exist in User sheet.` })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
