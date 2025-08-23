function doPost(e) {
  try {
    // ✅ Ensure request is valid
    if (!e) {
      return ContentService.createTextOutput("No data received")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    // Case 1: Chatbot request (JSON with messages array)
    if (e.parameter.messages) {
      return handleChatbot(e);
    }

    // Case 2: Contact Form submission (form parameters: name, email, subject, message)
    if (e.parameter.name && e.parameter.email) {
      return handleContactForm(e);
    }

    // Case 3: Unsubscribe request (JSON with email)
    if (e.postData && e.postData.contents) {
      const data = JSON.parse(e.postData.contents);
      if (data.email) {
        return handleUnsubscribe(data.email);
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "Invalid request." })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
