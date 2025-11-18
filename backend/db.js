import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database', 'bcs-database.db');

// Create SQLite database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log(`✅ Connected to SQLite database at ${DB_PATH}`);
});

// Promisify database methods with proper context
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

// Custom run method that preserves 'this' context and returns lastID
const dbRun = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};

// Export promisified methods
export default {
  run: dbRun,
  get: dbGet,
  all: dbAll,
  close: () => {
    return new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};
