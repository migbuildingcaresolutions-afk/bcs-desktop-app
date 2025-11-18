/**
 * Enhanced Database Schema Migration V2
 * Simplified approach without complex foreign keys
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../database/bcs-database.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database for enhancement');
});

// Run migrations step by step
const migrations = [
  // 1. Users table
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user',
    is_active INTEGER DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 2. Sessions
  `CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 3. Projects
  `CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    project_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    type TEXT DEFAULT 'restoration',
    status TEXT DEFAULT 'active',
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
  )`,

  // 4. Line Items
  `CREATE TABLE IF NOT EXISTS line_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estimate_id INTEGER,
    invoice_id INTEGER,
    category TEXT NOT NULL,
    code TEXT,
    description TEXT NOT NULL,
    quantity REAL DEFAULT 1,
    unit TEXT DEFAULT 'EA',
    unit_price REAL DEFAULT 0,
    total_price REAL DEFAULT 0,
    notes TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 5. Price Lists
  `CREATE TABLE IF NOT EXISTS price_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    region TEXT,
    version TEXT,
    description TEXT,
    is_active INTEGER DEFAULT 1,
    effective_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 6. Price List Items
  `CREATE TABLE IF NOT EXISTS price_list_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    price_list_id INTEGER NOT NULL,
    code TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT NOT NULL,
    unit TEXT DEFAULT 'EA',
    unit_price REAL DEFAULT 0,
    labor_rate REAL DEFAULT 0,
    material_cost REAL DEFAULT 0,
    equipment_cost REAL DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 7. Item Notes
  `CREATE TABLE IF NOT EXISTS item_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    line_item_id INTEGER NOT NULL,
    type TEXT DEFAULT 'text',
    content TEXT,
    file_path TEXT,
    file_size INTEGER,
    duration_seconds INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
  )`,

  // 8. Documents
  `CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estimate_id INTEGER,
    invoice_id INTEGER,
    project_id INTEGER,
    line_item_id INTEGER,
    type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER
  )`,

  // 9. Payments
  `CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    payment_number TEXT UNIQUE NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT,
    payment_date DATE NOT NULL,
    reference_number TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
  )`,

  // 10. Activity Log
  `CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id INTEGER,
    description TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 11. Company Settings
  `CREATE TABLE IF NOT EXISTS company_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_path TEXT,
    tax_id TEXT,
    default_tax_rate REAL DEFAULT 0,
    default_payment_terms TEXT DEFAULT 'Net 30',
    invoice_prefix TEXT DEFAULT 'INV',
    estimate_prefix TEXT DEFAULT 'EST',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 12. Create indexes
  `CREATE INDEX IF NOT EXISTS idx_line_items_estimate ON line_items(estimate_id)`,
  `CREATE INDEX IF NOT EXISTS idx_line_items_invoice ON line_items(invoice_id)`,
  `CREATE INDEX IF NOT EXISTS idx_price_list_items_code ON price_list_items(code)`,
  `CREATE INDEX IF NOT EXISTS idx_price_list_items_category ON price_list_items(category)`,
  `CREATE INDEX IF NOT EXISTS idx_price_list_items_price_list ON price_list_items(price_list_id)`,
  `CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id)`
];

// Add columns to existing estimates table
const alterEstimates = [
  `ALTER TABLE estimates ADD COLUMN project_id INTEGER`,
  `ALTER TABLE estimates ADD COLUMN type TEXT DEFAULT 'estimate'`,
  `ALTER TABLE estimates ADD COLUMN subtotal REAL DEFAULT 0`,
  `ALTER TABLE estimates ADD COLUMN tax_rate REAL DEFAULT 0`,
  `ALTER TABLE estimates ADD COLUMN tax_amount REAL DEFAULT 0`,
  `ALTER TABLE estimates ADD COLUMN discount_amount REAL DEFAULT 0`,
  `ALTER TABLE estimates ADD COLUMN terms TEXT`,
  `ALTER TABLE estimates ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
  `ALTER TABLE estimates ADD COLUMN created_by INTEGER`
];

// Add columns to existing invoices table
const alterInvoices = [
  `ALTER TABLE invoices ADD COLUMN project_id INTEGER`,
  `ALTER TABLE invoices ADD COLUMN estimate_id INTEGER`,
  `ALTER TABLE invoices ADD COLUMN type TEXT DEFAULT 'invoice'`,
  `ALTER TABLE invoices ADD COLUMN subtotal REAL DEFAULT 0`,
  `ALTER TABLE invoices ADD COLUMN tax_rate REAL DEFAULT 0`,
  `ALTER TABLE invoices ADD COLUMN tax_amount REAL DEFAULT 0`,
  `ALTER TABLE invoices ADD COLUMN discount_amount REAL DEFAULT 0`,
  `ALTER TABLE invoices ADD COLUMN total_amount REAL DEFAULT 0`,
  `ALTER TABLE invoices ADD COLUMN amount_paid REAL DEFAULT 0`,
  `ALTER TABLE invoices ADD COLUMN amount_due REAL DEFAULT 0`,
  `ALTER TABLE invoices ADD COLUMN issue_date DATE`,
  `ALTER TABLE invoices ADD COLUMN paid_date DATE`,
  `ALTER TABLE invoices ADD COLUMN notes TEXT`,
  `ALTER TABLE invoices ADD COLUMN payment_terms TEXT`,
  `ALTER TABLE invoices ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
  `ALTER TABLE invoices ADD COLUMN created_by INTEGER`
];

// Run all migrations
async function runMigrations() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create new tables
      migrations.forEach((sql, index) => {
        db.run(sql, (err) => {
          if (err) {
            console.error(`Error in migration ${index + 1}:`, err.message);
          } else {
            console.log(`✅ Migration ${index + 1} completed`);
          }
        });
      });

      // Alter existing tables (may fail if columns exist, that's OK)
      alterEstimates.forEach((sql) => {
        db.run(sql, (err) => {
          if (err && !err.message.includes('duplicate column')) {
            console.log(`⚠️  ${err.message}`);
          }
        });
      });

      alterInvoices.forEach((sql) => {
        db.run(sql, (err) => {
          if (err && !err.message.includes('duplicate column')) {
            console.log(`⚠️  ${err.message}`);
          }
        });
      });

      // Create default admin user
      const defaultPassword = 'admin123';
      bcrypt.hash(defaultPassword, 10, (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err);
          return;
        }

        db.run(
          `INSERT OR IGNORE INTO users (username, email, password_hash, full_name, role)
           VALUES (?, ?, ?, ?, ?)`,
          ['admin', 'admin@bcs.com', hash, 'System Administrator', 'admin'],
          (err) => {
            if (err) {
              console.log('⚠️  Admin user may already exist');
            } else {
              console.log('✅ Admin user created (username: admin, password: admin123)');
            }
          }
        );
      });

      // Create default price list
      db.run(
        `INSERT OR IGNORE INTO price_lists (id, name, region, version, description, is_active)
         VALUES (1, 'BCS Standard Price List', 'US-CA', '2025.1', 'San Diego region standard pricing', 1)`,
        (err) => {
          if (err) {
            console.log('⚠️  Default price list may already exist');
          } else {
            console.log('✅ Default price list created');
          }
        }
      );

      // Create default company settings
      db.run(
        `INSERT OR IGNORE INTO company_settings (id, company_name, phone, email)
         VALUES (1, 'Building Care Solutions', '(619) 555-0100', 'info@buildingcaresolutions.com')`,
        (err) => {
          if (err) {
            console.log('⚠️  Company settings may already exist');
          } else {
            console.log('✅ Company settings created');
          }

          setTimeout(resolve, 1000); // Wait for all operations to complete
        }
      );
    });
  });
}

// Run the migrations
runMigrations()
  .then(() => {
    console.log('\n========================================');
    console.log('🎉 Database Enhancement Complete!');
    console.log('========================================');
    console.log('\n✨ New Features Added:');
    console.log('  ✓ User authentication system');
    console.log('  ✓ Projects management');
    console.log('  ✓ Enhanced estimates with line items');
    console.log('  ✓ Price lists with regional support');
    console.log('  ✓ Item notes (text & voice)');
    console.log('  ✓ Document attachments');
    console.log('  ✓ Enhanced invoices with payments');
    console.log('  ✓ Activity logging');
    console.log('  ✓ Company settings');
    console.log('\n📝 Default Credentials:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('  ⚠️  Change this password immediately!');
    console.log('\n========================================\n');

    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
        process.exit(1);
      }
      console.log('Database connection closed');
      process.exit(0);
    });
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    db.close();
    process.exit(1);
  });
