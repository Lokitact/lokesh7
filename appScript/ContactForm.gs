function handleContactForm(e) {
  const data = e.parameter;
  const ss = SpreadsheetApp.openById('1htZldTcUW3MvZFCtOG3TpnXrnN5fOzICDrx6FMT_RmM');

  const sheet = ss.getSheetByName('Contact Form');
  sheet.appendRow([new Date(), data.name, data.email, data.subject, data.message, "New"]);

  function escapeHTML(str) {
    return String(str || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  const name = escapeHTML(data.name || "User");
  const email = data.email;
  const subject = escapeHTML(data.subject || "(No Subject)");
  const message = escapeHTML(data.message || "(No Message)").replace(/\n/g, "<br>");
  const timestamp = new Date().toLocaleString();

  // ✅ Save or update User sheet
  const userSheet = ss.getSheetByName('User');
  const users = userSheet.getDataRange().getValues();
  let emailFound = false;

  for (let i = 1; i < users.length; i++) {
    if (users[i][1] === email) {
      userSheet.getRange(i + 1, 1).setValue(name);
      emailFound = true;
      break;
    }
  }
  if (!emailFound) userSheet.appendRow([name, email]);

  // ✅ Notify Admin
  const adminTemplate = HtmlService.createTemplateFromFile("AdminReply");
  adminTemplate.name = name;
  adminTemplate.email = email;
  adminTemplate.subject = subject;
  adminTemplate.message = message;
  adminTemplate.timestamp = timestamp;

  MailApp.sendEmail({
    to: "tactloki@gmail.com",
    subject: "New Contact Form Submission",
    htmlBody: adminTemplate.evaluate().getContent()
  });

  // ✅ Auto-reply to user
  const template = HtmlService.createTemplateFromFile("AutoReply");
  template.name = name;
  template.subject = subject;
  template.message = message;

  MailApp.sendEmail({
    to: email,
    subject: "Thank you for reaching out",
    name: "Lokesh",
    body: `Hi ${name},\n\nThank you for contacting us. We'll reply within 48 working hours.\n\n– Lokesh Team`,
    htmlBody: template.evaluate().getContent()
  });

  return ContentService.createTextOutput("Success")
    .setMimeType(ContentService.MimeType.TEXT);
}
