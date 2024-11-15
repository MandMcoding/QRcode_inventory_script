function doGet(e) {
  // Retrieve the 'location' parameter from the QR code URL
  const location = e.parameter.location;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1'); // Sheet name
  const now = new Date();

  // Find the column with the location header (L1, L2, etc.)
  const headers = sheet.getRange(1, 2, 1, sheet.getLastColumn()).getValues()[0];
  const locationColIndex = headers.indexOf(location) + 2; // Adjust for 1-based index and 'Locations' column

  if (locationColIndex > 1) {
    // Set status as "Empty" under the location's column
    sheet.getRange(2, locationColIndex).setValue("Empty");

    // Determine the next available row in the specific column for the location
    const columnData = sheet.getRange(3, locationColIndex, sheet.getMaxRows() - 2, 1).getValues();
    let emptyRow = 3;

    for (let i = 0; i < columnData.length; i++) {
      if (columnData[i][0] === "") {
        emptyRow = i + 3; // Adjust for actual row number starting from row 3
        break;
      }
    }

    // Set the current datetime in the next available row under the location column
    sheet.getRange(emptyRow, locationColIndex).setValue(now);

    // Send an email notification
    sendNotificationEmail(location);
  }

  // Return a blank response
  return ContentService.createTextOutput("");
}

function sendNotificationEmail(location) {
  const recipients = "team@example.com"; // Replace with your team's email
  const subject = `Dispenser Out of Stock Alert - ${location}`;
  const message = `The dispenser at location ${location} is empty as of ${new Date().toLocaleString()}. Please restock it.`;
  MailApp.sendEmail(recipients, subject, message);
}

