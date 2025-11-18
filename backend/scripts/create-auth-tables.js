import db from '../db.js';
import bcrypt from 'bcryptjs';

/**
 * Create Authentication Tables and Default Admin User
 */

async function createAuthTables() {
  console.log('🔐 Creating authentication tables...\n');

  try {
    // Create users table
    console.log('Creating users table...');
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'user',
        active INTEGER DEFAULT 1,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created\n');

    // Create sessions table
    console.log('Creating sessions table...');
    await db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Sessions table created\n');

    // Create audit_logs table
    console.log('Creating audit_logs table...');
    await db.run(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        resource TEXT,
        resource_id INTEGER,
        details TEXT,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Audit logs table created\n');

    // Check if admin user already exists
    const existingAdmin = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists, skipping creation\n');
    } else {
      // Create default admin user
      console.log('Creating default admin user...');
      const defaultPassword = 'admin123'; // Change this immediately after first login!
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await db.run(
        `INSERT INTO users (username, email, password_hash, full_name, role, active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['admin', 'admin@sd-bcs.com', hashedPassword, 'System Administrator', 'admin', 1]
      );

      console.log('✅ Default admin user created');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ⚠️  IMPORTANT: Change this password immediately after first login!\n');
    }

    console.log('✅ Authentication system setup complete!\n');

  } catch (error) {
    console.error('❌ Error creating auth tables:', error);
    throw error;
  }
}

// Run the migration
createAuthTables()
  .then(() => {
    console.log('✅ Auth setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Auth setup failed:', error);
    process.exit(1);
  });
