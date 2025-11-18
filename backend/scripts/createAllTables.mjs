/**
 * Complete Database Schema for Building Care Solutions
 * Miguel - m19u3l@sd-bcs.com
 * Creates all tables needed for the business management system
 */

import db from '../db.js';

async function createAllTables() {
  console.log('🔧 Creating all database tables for Building Care Solutions...');

  try {
    // 1. CLIENTS TABLE
    await db.run(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_number TEXT UNIQUE,
        name TEXT NOT NULL,
        company TEXT,
        email TEXT,
        phone TEXT,
        mobile TEXT,
        address_line1 TEXT,
        address_line2 TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        insurance_company TEXT,
        claim_number TEXT,
        policy_number TEXT,
        notes TEXT,
        status TEXT DEFAULT 'active',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Clients table created');

    // 2. EMPLOYEES TABLE
    await db.run(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_number TEXT UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        position TEXT,
        department TEXT,
        hire_date TEXT,
        hourly_rate REAL,
        status TEXT DEFAULT 'active',
        certifications TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Employees table created');

    // 3. EQUIPMENT TABLE
    await db.run(`
      CREATE TABLE IF NOT EXISTS equipment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        equipment_number TEXT UNIQUE,
        name TEXT NOT NULL,
        category TEXT,
        model TEXT,
        serial_number TEXT,
        purchase_date TEXT,
        purchase_price REAL,
        status TEXT DEFAULT 'available',
        location TEXT,
        assigned_to INTEGER,
        maintenance_due_date TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_to) REFERENCES employees(id)
      )
    `);
    console.log('✅ Equipment table created');

    // 4. MATERIALS TABLE
    await db.run(`
      CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        material_number TEXT UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        unit TEXT,
        unit_cost REAL,
        quantity_on_hand INTEGER DEFAULT 0,
        reorder_level INTEGER DEFAULT 0,
        supplier TEXT,
        location TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Materials table created');

    // 5. VENDORS TABLE
    await db.run(`
      CREATE TABLE IF NOT EXISTS vendors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_number TEXT UNIQUE,
        company_name TEXT NOT NULL,
        contact_name TEXT,
        email TEXT,
        phone TEXT,
        address_line1 TEXT,
        address_line2 TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        category TEXT,
        payment_terms TEXT,
        notes TEXT,
        status TEXT DEFAULT 'active',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Vendors table created');

    // 6. WORK ORDERS TABLE
    await db.run(`
      CREATE TABLE IF NOT EXISTS work_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        work_order_number TEXT UNIQUE,
        client_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'pending',
        scheduled_date TEXT,
        completion_date TEXT,
        assigned_to INTEGER,
        estimated_hours REAL,
        actual_hours REAL,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (assigned_to) REFERENCES employees(id)
      )
    `);
    console.log('✅ Work Orders table created');

    // 7. ESTIMATES/QUOTES TABLE
    await db.run(`
      CREATE TABLE IF NOT EXISTS estimates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estimate_number TEXT UNIQUE,
        client_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        subtotal REAL DEFAULT 0,
        tax_rate REAL DEFAULT 0,
        tax_amount REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        status TEXT DEFAULT 'draft',
        valid_until TEXT,
        notes TEXT,
        terms TEXT,
        created_by INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (created_by) REFERENCES employees(id)
      )
    `);
    console.log('✅ Estimates table created');

    // 8. ESTIMATE LINE ITEMS
    await db.run(`
      CREATE TABLE IF NOT EXISTS estimate_line_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estimate_id INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        description TEXT,
        quantity REAL DEFAULT 1,
        unit_price REAL DEFAULT 0,
        total_price REAL DEFAULT 0,
        category TEXT,
        sort_order INTEGER DEFAULT 0,
        FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Estimate Line Items table created');

    // 9. INVOICES TABLE
    await db.run(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_number TEXT UNIQUE,
        client_id INTEGER NOT NULL,
        work_order_id INTEGER,
        estimate_id INTEGER,
        title TEXT,
        description TEXT,
        invoice_date TEXT,
        due_date TEXT,
        subtotal REAL DEFAULT 0,
        tax_rate REAL DEFAULT 0,
        tax_amount REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        amount_paid REAL DEFAULT 0,
        balance REAL DEFAULT 0,
        status TEXT DEFAULT 'draft',
        payment_terms TEXT,
        notes TEXT,
        created_by INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
        FOREIGN KEY (estimate_id) REFERENCES estimates(id),
        FOREIGN KEY (created_by) REFERENCES employees(id)
      )
    `);
    console.log('✅ Invoices table created');

    // 10. INVOICE LINE ITEMS
    await db.run(`
      CREATE TABLE IF NOT EXISTS invoice_line_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        description TEXT,
        quantity REAL DEFAULT 1,
        unit_price REAL DEFAULT 0,
        total_price REAL DEFAULT 0,
        category TEXT,
        sort_order INTEGER DEFAULT 0,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Invoice Line Items table created');

    // 11. PAYMENTS TABLE
    await db.run(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payment_number TEXT UNIQUE,
        invoice_id INTEGER NOT NULL,
        client_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        payment_date TEXT,
        payment_method TEXT,
        reference_number TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id),
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
    console.log('✅ Payments table created');

    // 12. CHANGE ORDERS TABLE
    await db.run(`
      CREATE TABLE IF NOT EXISTS change_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        change_order_number TEXT UNIQUE,
        work_order_id INTEGER NOT NULL,
        client_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        reason TEXT,
        original_amount REAL DEFAULT 0,
        change_amount REAL DEFAULT 0,
        new_total REAL DEFAULT 0,
        status TEXT DEFAULT 'pending',
        approved_by TEXT,
        approved_date TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
    console.log('✅ Change Orders table created');

    // 13. PRICE LIST/DATABASE
    await db.run(`
      CREATE TABLE IF NOT EXISTS price_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_code TEXT UNIQUE,
        item_name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        subcategory TEXT,
        unit TEXT,
        unit_price REAL DEFAULT 0,
        labor_rate REAL DEFAULT 0,
        material_cost REAL DEFAULT 0,
        xactimate_code TEXT,
        active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Price List table created');

    // 14. REMEDIATION DRY-OUT JOBS
    await db.run(`
      CREATE TABLE IF NOT EXISTS remediation_dryout (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_number TEXT UNIQUE,
        work_order_id INTEGER,
        client_id INTEGER NOT NULL,
        loss_type TEXT,
        affected_area_sqft REAL,
        category INTEGER,
        start_date TEXT,
        completion_date TEXT,
        moisture_readings TEXT,
        equipment_used TEXT,
        daily_logs TEXT,
        status TEXT DEFAULT 'in_progress',
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
    console.log('✅ Remediation Dry-out table created');

    // 15. REMEDIATION RECONSTRUCTION
    await db.run(`
      CREATE TABLE IF NOT EXISTS remediation_reconstruction (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_number TEXT UNIQUE,
        dryout_job_id INTEGER,
        work_order_id INTEGER,
        client_id INTEGER NOT NULL,
        scope_of_work TEXT,
        start_date TEXT,
        estimated_completion TEXT,
        actual_completion TEXT,
        permit_number TEXT,
        inspection_dates TEXT,
        status TEXT DEFAULT 'not_started',
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dryout_job_id) REFERENCES remediation_dryout(id),
        FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
    console.log('✅ Remediation Reconstruction table created');

    // 16. EQUIPMENT LOGS
    await db.run(`
      CREATE TABLE IF NOT EXISTS equipment_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER,
        equipment_id INTEGER NOT NULL,
        work_order_id INTEGER,
        deployed_date TEXT,
        retrieved_date TEXT,
        location TEXT,
        readings TEXT,
        hours_used REAL,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (equipment_id) REFERENCES equipment(id),
        FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
      )
    `);
    console.log('✅ Equipment Logs table created');

    // 17. MOISTURE LOGS
    await db.run(`
      CREATE TABLE IF NOT EXISTS moisture_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER NOT NULL,
        work_order_id INTEGER,
        log_date TEXT NOT NULL,
        location TEXT,
        material_type TEXT,
        moisture_reading REAL,
        target_reading REAL,
        temperature REAL,
        humidity REAL,
        technician TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
      )
    `);
    console.log('✅ Moisture Logs table created');

    // 18. STORED ITEMS (Contents/Pack-out)
    await db.run(`
      CREATE TABLE IF NOT EXISTS stored_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER NOT NULL,
        client_id INTEGER NOT NULL,
        work_order_id INTEGER,
        item_description TEXT NOT NULL,
        room TEXT,
        quantity INTEGER DEFAULT 1,
        condition TEXT,
        photo_url TEXT,
        storage_location TEXT,
        packed_date TEXT,
        returned_date TEXT,
        status TEXT DEFAULT 'in_storage',
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
      )
    `);
    console.log('✅ Stored Items table created');

    // 19. CERTIFICATES
    await db.run(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        certificate_number TEXT UNIQUE,
        certificate_type TEXT NOT NULL,
        work_order_id INTEGER,
        client_id INTEGER NOT NULL,
        issue_date TEXT,
        description TEXT,
        issued_by TEXT,
        file_path TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
    console.log('✅ Certificates table created');

    // 20. CALENDAR/APPOINTMENTS
    await db.run(`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        event_type TEXT,
        event_date TEXT NOT NULL,
        start_time TEXT,
        end_time TEXT,
        client_id INTEGER,
        work_order_id INTEGER,
        assigned_to INTEGER,
        location TEXT,
        status TEXT DEFAULT 'scheduled',
        reminder_sent INTEGER DEFAULT 0,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
        FOREIGN KEY (assigned_to) REFERENCES employees(id)
      )
    `);
    console.log('✅ Calendar Events table created');

    // 21. EXPENSES
    await db.run(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        expense_number TEXT UNIQUE,
        work_order_id INTEGER,
        category TEXT,
        vendor_id INTEGER,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        expense_date TEXT,
        payment_method TEXT,
        receipt_url TEXT,
        billable INTEGER DEFAULT 0,
        reimbursable INTEGER DEFAULT 0,
        approved INTEGER DEFAULT 0,
        approved_by INTEGER,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
        FOREIGN KEY (vendor_id) REFERENCES vendors(id),
        FOREIGN KEY (approved_by) REFERENCES employees(id)
      )
    `);
    console.log('✅ Expenses table created');

    // 22. COMPANY SETTINGS
    await db.run(`
      CREATE TABLE IF NOT EXISTS company_settings (
        id INTEGER PRIMARY KEY,
        company_name TEXT,
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
        estimates_legal_disclaimer TEXT,
        invoices_legal_disclaimer TEXT,
        payment_terms TEXT,
        warranty_text TEXT,
        tax_rate REAL DEFAULT 0,
        square_access_token TEXT,
        square_location_id TEXT,
        stripe_api_key TEXT,
        stripe_publishable_key TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Company Settings table created');

    // Insert default company settings if not exists
    await db.run(`
      INSERT OR IGNORE INTO company_settings (id, company_name, business_name, phone, email, address_line1, city, state, zip)
      VALUES (1, 'Building Care Solutions', 'Building Care Solutions', '858-573-7849', 'm19u3l@sd-bcs.com', '8889 Caminito Plaza Centro', 'San Diego', 'CA', '92122')
    `);

    console.log('\n🎉 All tables created successfully!');
    console.log('✅ Database ready for Building Care Solutions');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

// Run the table creation
createAllTables()
  .then(() => {
    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database initialization failed:', error);
    process.exit(1);
  });
