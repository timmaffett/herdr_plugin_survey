/**
 * Isolated Worker Thread for User-Submitted Custom SQL Queries
 * Runs outside the main Express event loop with strict memory & timeout protection.
 */
const { parentPort, workerData } = require('worker_threads');
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../plugins.db');

try {
  const db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  const t0 = Date.now();
  const stmt = db.prepare(workerData.sql);

  const MAX_ROWS = 1000;
  const rows = [];
  let isTruncated = false;

  // Use iterator to stream rows lazily and abort immediately after MAX_ROWS
  for (const row of stmt.iterate()) {
    if (rows.length < MAX_ROWS) {
      rows.push(row);
    } else {
      isTruncated = true;
      break; // Abort immediately to prevent runaway memory allocation
    }
  }

  const durationMs = Date.now() - t0;

  parentPort.postMessage({
    success: true,
    duration_ms: durationMs,
    row_count: rows.length,
    truncated: isTruncated,
    columns: rows.length > 0 ? Object.keys(rows[0]) : [],
    rows: rows
  });
} catch (err) {
  parentPort.postMessage({
    success: false,
    error: err.message
  });
}
