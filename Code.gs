// ============================================================
// Barber Tracker — Google Apps Script
// Paste this entire script into your Google Sheet's Apps Script
// editor, then deploy it as a Web App.
// ============================================================

const SHEET_NAME = 'Income';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet with headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Date', 'Gross', 'Cash', 'Venmo', 'Apple Pay',
        'Cash App', 'Square Gross', 'Square Fee', 'Square Net', 'Zelle',
        'Last Synced'
      ]);
      sheet.setFrozenRows(1);
      // Format header row
      sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#0a0a0a').setFontColor('#C9A84C');
    }

    const action = data.action;

    if (action === 'sync_all') {
      // Full sync — clear all data rows and rewrite
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }
      const entries = data.entries || [];
      entries.forEach(entry => {
        const t = entry.totals || {};
        sheet.appendRow([
          entry.date,
          entry.gross,
          t['Cash'] || 0,
          t['Venmo'] || 0,
          t['Apple Pay'] || 0,
          t['Cash App'] || 0,
          t['Square'] || 0,
          entry.sqFee || 0,
          entry.sqNet || 0,
          t['Zelle'] || 0,
          new Date().toISOString()
        ]);
      });
      // Sort by date descending
      if (sheet.getLastRow() > 2) {
        sheet.getRange(2, 1, sheet.getLastRow() - 1, 11).sort({column: 1, ascending: false});
      }
      return ContentService.createTextOutput(JSON.stringify({ status: 'ok', synced: entries.length }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'upsert') {
      // Single day upsert — find existing row by date and update, or append
      const entry = data.entry;
      const t = entry.totals || {};
      const dateStr = entry.date;
      const allData = sheet.getDataRange().getValues();
      let rowIndex = -1;
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][0] === dateStr) { rowIndex = i + 1; break; }
      }
      const rowData = [
        entry.date,
        entry.gross,
        t['Cash'] || 0,
        t['Venmo'] || 0,
        t['Apple Pay'] || 0,
        t['Cash App'] || 0,
        t['Square'] || 0,
        entry.sqFee || 0,
        entry.sqNet || 0,
        t['Zelle'] || 0,
        new Date().toISOString()
      ];
      if (rowIndex > 0) {
        sheet.getRange(rowIndex, 1, 1, 11).setValues([rowData]);
      } else {
        sheet.appendRow(rowData);
      }
      // Re-sort
      if (sheet.getLastRow() > 2) {
        sheet.getRange(2, 1, sheet.getLastRow() - 1, 11).sort({column: 1, ascending: false});
      }
      return ContentService.createTextOutput(JSON.stringify({ status: 'ok', action: rowIndex > 0 ? 'updated' : 'inserted' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'delete') {
      const dateStr = data.date;
      const allData = sheet.getDataRange().getValues();
      for (let i = allData.length - 1; i >= 1; i--) {
        if (allData[i][0] === dateStr) { sheet.deleteRow(i + 1); break; }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: 'ok', action: 'deleted' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Unknown action' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok', message: 'Barber Tracker script is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
