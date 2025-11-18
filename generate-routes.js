#!/usr/bin/env node

/**
 * Script to generate all backend route files
 * This creates working route files for all endpoints
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const routesDir = './backend-new/routes';

// Create directory
mkdirSync(routesDir, { recursive: true });

const routes = [
  { name: 'clients', table: 'clients', fields: ['name', 'email', 'phone', 'address', 'company'] },
  { name: 'work-orders', table: 'work_orders', fields: ['client_id', 'title', 'description', 'status', 'start_date', 'end_date'] },
  { name: 'invoices', table: 'invoices', fields: ['client_id', 'work_order_id', 'amount', 'status', 'due_date'] },
  { name: 'employees', table: 'employees', fields: ['name', 'email', 'phone', 'position', 'hire_date'] },
  { name: 'equipment', table: 'equipment', fields: ['name', 'description', 'serial_number', 'status', 'purchase_date'] },
  { name: 'materials', table: 'materials', fields: ['name', 'description', 'unit', 'unit_price', 'quantity'] },
  { name: 'vendors', table: 'vendors', fields: ['name', 'email', 'phone', 'address', 'contact_person'] },
  { name: 'estimates', table: 'estimates', fields: ['client_id', 'title', 'description', 'total_amount', 'status'] },
  { name: 'change-orders', table: 'change_orders', fields: ['work_order_id', 'description', 'amount', 'status', 'approved_date'] },
  { name: 'dry-out-jobs', table: 'dry_out_jobs', fields: ['client_id', 'location', 'start_date', 'status', 'equipment_used'] },
  { name: 'job-tracking', table: 'job_tracking', fields: ['job_id', 'employee_id', 'date', 'hours', 'notes'] },
  { name: 'price-list', table: 'price_list', fields: ['item_name', 'category', 'unit_price', 'unit', 'description'] },
  { name: 'pricing', table: 'pricing', fields: ['service_id', 'base_price', 'markup_percentage', 'final_price'] },
  { name: 'remediation-dryout', table: 'remediation_dryout', fields: ['job_id', 'area_affected', 'moisture_reading', 'equipment_placed'] },
  { name: 'remediation-reconstruction', table: 'remediation_reconstruction', fields: ['job_id', 'work_description', 'materials_used', 'labor_hours'] },
  { name: 'reports', table: 'reports', fields: ['title', 'type', 'generated_date', 'data'] },
  { name: 'resources', table: 'resources', fields: ['name', 'type', 'availability', 'location'] },
  { name: 'services', table: 'services', fields: ['name', 'description', 'category', 'base_price'] },
  { name: 'settings', table: 'settings', fields: ['key', 'value', 'description'] },
  { name: 'xactimate', table: 'xactimate', fields: ['estimate_id', 'xactimate_code', 'description', 'quantity', 'unit_price'] },
  { name: 'line_items', table: 'line_items', fields: ['invoice_id', 'description', 'quantity', 'unit_price', 'total'] },
];

function generateRouteFile(route) {
  const { name, table, fields } = route;
  const fieldsList = fields.map(f => `'${f}'`).join(', ');
  const placeholders = fields.map(() => '?').join(', ');
  const updateSet = fields.map(f => `${f} = ?`).join(', ');

  return `import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all ${name}
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM ${table} ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching ${name}:', error);
    next(error);
  }
});

// GET single ${name.slice(0, -1)} by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM ${table} WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: '${name.slice(0, -1)} not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching ${name.slice(0, -1)}:', error);
    next(error);
  }
});

// CREATE new ${name.slice(0, -1)}
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = [${fieldsList}];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      \`INSERT INTO ${table} (\${fields.join(', ')}) VALUES (${placeholders})\`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM ${table} WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating ${name.slice(0, -1)}:', error);
    next(error);
  }
});

// UPDATE ${name.slice(0, -1)}
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = [${fieldsList}];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      \`UPDATE ${table} SET ${updateSet} WHERE id = ?\`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM ${table} WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating ${name.slice(0, -1)}:', error);
    next(error);
  }
});

// DELETE ${name.slice(0, -1)}
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM ${table} WHERE id = ?', [id]);
    res.json({ message: '${name.slice(0, -1)} deleted successfully', id });
  } catch (error) {
    console.error('Error deleting ${name.slice(0, -1)}:', error);
    next(error);
  }
});

export default router;
`;
}

// Generate all route files
console.log('🔨 Generating route files...\n');

routes.forEach(route => {
  const content = generateRouteFile(route);
  const filename = join(routesDir, `${route.name}.mjs`);
  writeFileSync(filename, content);
  console.log(`✅ Created ${route.name}.mjs`);
});

// Generate dashboard route
const dashboardContent = `import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const stats = {
      totalClients: await db.get('SELECT COUNT(*) as count FROM clients'),
      totalWorkOrders: await db.get('SELECT COUNT(*) as count FROM work_orders'),
      totalInvoices: await db.get('SELECT COUNT(*) as count FROM invoices'),
      totalRevenue: await db.get('SELECT SUM(amount) as total FROM invoices WHERE status = "paid"'),
    };
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    next(error);
  }
});

export default router;
`;

writeFileSync(join(routesDir, 'dashboard.mjs'), dashboardContent);
console.log(`✅ Created dashboard.mjs`);

console.log(`\n✨ Generated ${routes.length + 1} route files in ${routesDir}`);
console.log('\nNext steps:');
console.log('1. Review the generated files');
console.log('2. Move them to backend/routes/ (replacing iCloud placeholders)');
console.log('3. Start your backend server');

