import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET company settings
router.get('/', async (req, res, next) => {
  try {
    let settings = await db.get('SELECT * FROM company_settings WHERE id = 1');

    // If no settings exist, create default
    if (!settings) {
      await db.run(`
        INSERT INTO company_settings (id, company_name)
        VALUES (1, 'Your Company Name')
      `);
      settings = await db.get('SELECT * FROM company_settings WHERE id = 1');
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching company settings:', error);
    next(error);
  }
});

// UPDATE company settings
router.put('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = [
      'company_name', 'business_name', 'logo_url', 'address_line1', 'address_line2',
      'city', 'state', 'zip', 'phone', 'email', 'website', 'license_number', 'ein_tax_id',
      'estimates_legal_disclaimer', 'invoices_legal_disclaimer', 'payment_terms', 'warranty_text',
      'square_access_token', 'square_location_id', 'stripe_api_key', 'stripe_publishable_key'
    ];

    const values = fields.map(f => data[f] !== undefined ? data[f] : null);
    values.push(new Date().toISOString());

    const setClause = fields.map(f => `${f} = ?`).join(', ');

    await db.run(
      `UPDATE company_settings SET ${setClause}, updated_at = ? WHERE id = 1`,
      values
    );

    const updatedSettings = await db.get('SELECT * FROM company_settings WHERE id = 1');
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating company settings:', error);
    next(error);
  }
});

export default router;
