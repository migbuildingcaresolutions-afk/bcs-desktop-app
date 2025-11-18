/**
 * Enhanced Database Schema Migration
 * Adds Xactimate-inspired features:
 * - User authentication
 * - Enhanced estimates with line items
 * - Price lists with regional support
 * - Notes (text & voice) for items
 * - Document attachments
 * - Improved invoice system
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
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

const enhancedSchema = `
-- ============================================
-- AUTHENTICATION & USER MANAGEMENT
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user', -- 'admin', 'manager', 'user'
  is_active INTEGER DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- ENHANCED CLIENTS (Already exists, but adding fields)
-- ============================================

-- Add new columns to existing clients table if they don't exist
-- ALTER TABLE clients ADD COLUMN city TEXT;
-- ALTER TABLE clients ADD COLUMN state TEXT;
-- ALTER TABLE clients ADD COLUMN zip TEXT;
-- ALTER TABLE clients ADD COLUMN notes TEXT;
-- ALTER TABLE clients ADD COLUMN client_type TEXT DEFAULT 'residential';

-- ============================================
-- PROJECTS
-- ============================================

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  project_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  type TEXT DEFAULT 'restoration', -- 'restoration', 'reconstruction', 'dryout', 'general'
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'on-hold', 'cancelled'
  start_date DATE,
  target_completion_date DATE,
  actual_completion_date DATE,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================
-- ENHANCED ESTIMATES WITH LINE ITEMS
-- ============================================

-- Create new enhanced estimates table
CREATE TABLE IF NOT EXISTS estimates_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER,
  client_id INTEGER,
  estimate_number TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'estimate', -- 'estimate', 'quote', 'proposal'
  title TEXT,
  description TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'sent', 'approved', 'rejected', 'converted'
  subtotal REAL DEFAULT 0,
  tax_rate REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  valid_until DATE,
  notes TEXT,
  terms TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================
-- LINE ITEMS (Core feature from Xactimate)
-- ============================================

CREATE TABLE IF NOT EXISTS line_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estimate_id INTEGER,
  invoice_id INTEGER,
  category TEXT NOT NULL, -- 'material', 'labor', 'equipment', 'custom'
  code TEXT, -- Xactimate code or custom code
  description TEXT NOT NULL,
  quantity REAL DEFAULT 1,
  unit TEXT DEFAULT 'EA', -- 'EA', 'SF', 'LF', 'HR', etc.
  unit_price REAL DEFAULT 0,
  total_price REAL DEFAULT 0,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estimate_id) REFERENCES estimates_new(id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_line_items_estimate ON line_items(estimate_id);
CREATE INDEX IF NOT EXISTS idx_line_items_invoice ON line_items(invoice_id);

-- ============================================
-- PRICE LISTS (Multiple regional price lists)
-- ============================================

CREATE TABLE IF NOT EXISTS price_lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  region TEXT, -- 'US-CA', 'US-NY', 'US-FL', etc.
  version TEXT,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  effective_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_list_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  price_list_id INTEGER NOT NULL,
  code TEXT NOT NULL, -- Xactimate-style code (e.g., 'RMV DRY')
  category TEXT NOT NULL, -- 'Demolition', 'Drywall', 'Painting', etc.
  subcategory TEXT,
  description TEXT NOT NULL,
  unit TEXT DEFAULT 'EA',
  unit_price REAL DEFAULT 0,
  labor_rate REAL DEFAULT 0,
  material_cost REAL DEFAULT 0,
  equipment_cost REAL DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (price_list_id) REFERENCES price_lists(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_price_list_items_code ON price_list_items(code);
CREATE INDEX IF NOT EXISTS idx_price_list_items_category ON price_list_items(category);
CREATE INDEX IF NOT EXISTS idx_price_list_items_price_list ON price_list_items(price_list_id);

-- ============================================
-- ITEM NOTES (Text & Voice)
-- ============================================

CREATE TABLE IF NOT EXISTS item_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  line_item_id INTEGER NOT NULL,
  type TEXT DEFAULT 'text', -- 'text', 'voice'
  content TEXT, -- Text content or transcript
  file_path TEXT, -- For voice notes
  file_size INTEGER,
  duration_seconds INTEGER, -- For voice notes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  FOREIGN KEY (line_item_id) REFERENCES line_items(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================
-- DOCUMENTS & ATTACHMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estimate_id INTEGER,
  invoice_id INTEGER,
  project_id INTEGER,
  line_item_id INTEGER,
  type TEXT NOT NULL, -- 'pdf', 'photo', 'document', 'drawing'
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  uploaded_by INTEGER,
  FOREIGN KEY (estimate_id) REFERENCES estimates_new(id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (line_item_id) REFERENCES line_items(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- ============================================
-- ENHANCED INVOICES
-- ============================================

CREATE TABLE IF NOT EXISTS invoices_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER,
  client_id INTEGER NOT NULL,
  work_order_id INTEGER,
  estimate_id INTEGER, -- Link to estimate if converted
  invoice_number TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'invoice', -- 'invoice', 'credit_memo', 'receipt'
  status TEXT DEFAULT 'draft', -- 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  subtotal REAL DEFAULT 0,
  tax_rate REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  total_amount REAL NOT NULL,
  amount_paid REAL DEFAULT 0,
  amount_due REAL DEFAULT 0,
  issue_date DATE,
  due_date DATE,
  paid_date DATE,
  description TEXT,
  notes TEXT,
  payment_terms TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
  FOREIGN KEY (estimate_id) REFERENCES estimates_new(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================
-- PAYMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL,
  payment_number TEXT UNIQUE NOT NULL,
  amount REAL NOT NULL,
  payment_method TEXT, -- 'cash', 'check', 'credit_card', 'bank_transfer'
  payment_date DATE NOT NULL,
  reference_number TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  FOREIGN KEY (invoice_id) REFERENCES invoices_new(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================
-- ACTIVITY LOG (Audit trail)
-- ============================================

CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
  entity_type TEXT, -- 'estimate', 'invoice', 'client', etc.
  entity_id INTEGER,
  description TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);

-- ============================================
-- SETTINGS / COMPANY INFO
-- ============================================

CREATE TABLE IF NOT EXISTS company_settings (
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
);

-- Insert default settings
INSERT OR IGNORE INTO company_settings (id, company_name) VALUES (1, 'Building Care Solutions');
`;

// Function to run the migration
const runMigration = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Execute the schema
      db.exec(enhancedSchema, (err) => {
        if (err) {
          console.error('Error creating enhanced schema:', err);
          reject(err);
          return;
        }

        console.log('✅ Enhanced database schema created successfully');

        // Create default admin user
        const defaultPassword = 'admin123'; // Change this!
        bcrypt.hash(defaultPassword, 10, (err, hash) => {
          if (err) {
            console.error('Error hashing password:', err);
            reject(err);
            return;
          }

          const createAdminUser = `
            INSERT OR IGNORE INTO users (username, email, password_hash, full_name, role, is_active)
            VALUES ('admin', 'admin@bcs.com', ?, 'System Administrator', 'admin', 1)
          `;

          db.run(createAdminUser, [hash], (err) => {
            if (err) {
              console.error('Error creating admin user:', err);
            } else {
              console.log('✅ Default admin user created (username: admin, password: admin123)');
              console.log('⚠️  IMPORTANT: Change the admin password immediately!');
            }
          });
        });

        // Create default price list
        const createDefaultPriceList = `
          INSERT OR IGNORE INTO price_lists (name, region, version, description, is_active)
          VALUES ('BCS Standard Price List', 'US-CA', '2025.1', 'San Diego region standard pricing', 1)
        `;

        db.run(createDefaultPriceList, (err) => {
          if (err) {
            console.error('Error creating default price list:', err);
          } else {
            console.log('✅ Default price list created');
          }

          resolve();
        });
      });
    });
  });
};

// Run the migration
runMigration()
  .then(() => {
    console.log('\n========================================');
    console.log('Database Enhancement Complete!');
    console.log('========================================');
    console.log('\nNew Features Added:');
    console.log('✓ User authentication system');
    console.log('✓ Projects management');
    console.log('✓ Enhanced estimates with line items');
    console.log('✓ Price lists with regional support');
    console.log('✓ Item notes (text & voice)');
    console.log('✓ Document attachments');
    console.log('✓ Enhanced invoices with payments');
    console.log('✓ Activity logging');
    console.log('✓ Company settings');
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
