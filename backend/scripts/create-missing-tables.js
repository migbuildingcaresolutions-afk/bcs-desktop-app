import db from '../db.js';

/**
 * Create Missing Database Tables
 * This script creates tables that are referenced by routes but don't exist in the database
 */

async function createMissingTables() {
  console.log('🔧 Creating missing database tables...\n');

  try {
    // 1. SERVICES TABLE
    console.log('Creating services table...');
    await db.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        unit_price REAL DEFAULT 0,
        unit_type TEXT DEFAULT 'each',
        taxable INTEGER DEFAULT 1,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Services table created\n');

    // 2. RESOURCES TABLE
    console.log('Creating resources table...');
    await db.run(`
      CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT,
        description TEXT,
        location TEXT,
        quantity INTEGER DEFAULT 0,
        unit TEXT DEFAULT 'each',
        cost REAL DEFAULT 0,
        available INTEGER DEFAULT 1,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Resources table created\n');

    // 3. REPORTS TABLE
    console.log('Creating reports table...');
    await db.run(`
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        parameters TEXT,
        generated_by TEXT,
        file_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Reports table created\n');

    // 4. JOB_TRACKING TABLE
    console.log('Creating job_tracking table...');
    await db.run(`
      CREATE TABLE IF NOT EXISTS job_tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        work_order_id INTEGER,
        job_name TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        assigned_to INTEGER,
        start_date DATE,
        end_date DATE,
        completion_percentage INTEGER DEFAULT 0,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Job tracking table created\n');

    // 5. LINE_ITEMS TABLE (generic line items)
    console.log('Creating line_items table...');
    await db.run(`
      CREATE TABLE IF NOT EXISTS line_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        quantity REAL DEFAULT 1,
        unit_price REAL DEFAULT 0,
        total REAL DEFAULT 0,
        category TEXT,
        taxable INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Line items table created\n');

    // 6. PRICING TABLE (pricing rules and tiers)
    console.log('Creating pricing table...');
    await db.run(`
      CREATE TABLE IF NOT EXISTS pricing (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        base_price REAL DEFAULT 0,
        markup_percentage REAL DEFAULT 0,
        category TEXT,
        effective_date DATE,
        expiration_date DATE,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Pricing table created\n');

    // 7. XACTIMATE TABLE (Xactimate estimate data)
    console.log('Creating xactimate table...');
    await db.run(`
      CREATE TABLE IF NOT EXISTS xactimate (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estimate_id INTEGER,
        claim_number TEXT,
        date_of_loss DATE,
        policy_number TEXT,
        insurance_company TEXT,
        adjuster_name TEXT,
        adjuster_phone TEXT,
        rcv_total REAL DEFAULT 0,
        acv_total REAL DEFAULT 0,
        depreciation REAL DEFAULT 0,
        deductible REAL DEFAULT 0,
        tax REAL DEFAULT 0,
        overhead_profit REAL DEFAULT 0,
        net_claim REAL DEFAULT 0,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Xactimate table created\n');

    // 8. DRY_OUT_JOBS TABLE (use remediation_dryout as alias)
    console.log('Creating dry_out_jobs view/alias...');
    // Create a view that references remediation_dryout
    await db.run(`DROP VIEW IF EXISTS dry_out_jobs`);
    await db.run(`
      CREATE VIEW IF NOT EXISTS dry_out_jobs AS
      SELECT * FROM remediation_dryout
    `);
    console.log('✅ Dry out jobs view created (uses remediation_dryout)\n');

    console.log('✅ All missing tables created successfully!\n');

    // Verify tables exist
    console.log('Verifying tables...');
    const tables = await db.all(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    console.log(`\n📊 Total tables in database: ${tables.length}`);
    console.log('Tables:', tables.map(t => t.name).join(', '));

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

// Run the migration
createMissingTables()
  .then(() => {
    console.log('\n✅ Database migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database migration failed:', error);
    process.exit(1);
  });
