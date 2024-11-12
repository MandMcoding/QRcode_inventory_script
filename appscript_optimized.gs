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

    // Determine the last filled row in the specific column for the location
    const columnData = sheet.getRange(3, locationColIndex, sheet.getMaxRows() - 2, 1).getValues();
    let lastRowInColumn = 3;

    for (let i = columnData.length - 1; i >= 0; i--) {
      if (columnData[i][0] !== "") {
        lastRowInColumn = i + 4; // Adjust for actual row number starting from row 3
        break;
      }
    }

    // Check if we need to add more rows
    if (lastRowInColumn > sheet.getMaxRows()) {
      sheet.insertRowsAfter(sheet.getMaxRows(), 100); // Adds 100 more rows if we exceed current limits
    }

    // Set the current datetime in the next available row under the location column
    sheet.getRange(lastRowInColumn, locationColIndex).setValue(now);

    // Send an email notification
    sendNotificationEmail(location);
  }

  // Return a blank response
  return ContentService.createTextOutput("");
}

