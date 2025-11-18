/**
 * Database Initialization Script
 */
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../database/bcs-database.db');

const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

const schema = `
CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  company TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  hire_date DATE,
  hourly_rate REAL,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  purchase_cost REAL,
  status TEXT DEFAULT 'available',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT DEFAULT 'each',
  unit_price REAL,
  quantity_on_hand INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 10,
  supplier TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  services TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER,
  employee_id INTEGER,
  work_order_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  scheduled_date DATE,
  estimated_cost REAL,
  location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER,
  work_order_id INTEGER,
  invoice_number TEXT UNIQUE NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE IF NOT EXISTS estimates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER,
  estimate_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  total_amount REAL,
  status TEXT DEFAULT 'draft',
  valid_until DATE,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE IF NOT EXISTS change_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_order_id INTEGER,
  change_order_number TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  reason TEXT,
  cost_impact REAL DEFAULT 0,
  time_impact_days INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  requested_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
);

-- Price Database (Master Price List)
CREATE TABLE IF NOT EXISTS price_list (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  xactimate_code TEXT UNIQUE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  unit TEXT DEFAULT 'EA',
  unit_price REAL NOT NULL,
  labor_hours REAL DEFAULT 0,
  material_cost REAL DEFAULT 0,
  equipment_cost REAL DEFAULT 0,
  tax_rate REAL DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Xactimate Line Items (for estimates/quotes)
CREATE TABLE IF NOT EXISTS xactimate_line_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estimate_id INTEGER,
  price_list_id INTEGER,
  xactimate_code TEXT,
  description TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT DEFAULT 'EA',
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  labor_hours REAL DEFAULT 0,
  overhead_profit REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  line_total REAL NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE,
  FOREIGN KEY (price_list_id) REFERENCES price_list(id)
);

-- Pricing Rules (for dynamic pricing, markups, etc)
CREATE TABLE IF NOT EXISTS pricing_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rule_name TEXT NOT NULL,
  category TEXT,
  markup_percentage REAL DEFAULT 0,
  overhead_percentage REAL DEFAULT 10,
  profit_percentage REAL DEFAULT 10,
  tax_percentage REAL DEFAULT 0,
  minimum_charge REAL DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Company Settings and Branding
CREATE TABLE IF NOT EXISTS company_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  company_name TEXT NOT NULL DEFAULT 'Your Company Name',
  business_name TEXT,
  logo_url TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  license_number TEXT,
  ein_tax_id TEXT,
  estimates_legal_disclaimer TEXT DEFAULT 'This estimate is valid for 30 days. Prices subject to change based on material costs and unforeseen conditions.',
  invoices_legal_disclaimer TEXT DEFAULT 'Payment is due upon receipt. Late payments subject to 1.5% monthly finance charge.',
  payment_terms TEXT DEFAULT 'Net 30',
  warranty_text TEXT DEFAULT 'All work is guaranteed for 1 year from date of completion.',
  square_access_token TEXT,
  square_location_id TEXT,
  stripe_api_key TEXT,
  stripe_publishable_key TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Payment Records
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER,
  payment_method TEXT,
  payment_provider TEXT,
  transaction_id TEXT,
  amount REAL NOT NULL,
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'completed',
  notes TEXT,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- Document Templates
CREATE TABLE IF NOT EXISTS document_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  html_content TEXT,
  css_styles TEXT,
  is_default INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

db.exec(schema, (err) => {
  if (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  }
  console.log('✅ Database tables created successfully!');
  console.log('📊 Database initialized at:', DB_PATH);
  db.close();
});
