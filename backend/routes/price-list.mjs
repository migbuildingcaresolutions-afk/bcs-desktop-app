import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all price-list with search and filter
router.get('/', async (req, res, next) => {
  try {
    const { search, category, active } = req.query;
    let query = 'SELECT * FROM price_list WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (item_name LIKE ? OR xactimate_code LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (active !== undefined) {
      query += ' AND is_active = ?';
      params.push(active === 'true' ? 1 : 0);
    }

    query += ' ORDER BY category, item_name';

    const items = await db.all(query, params);
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching price-list:', error);
    next(error);
  }
});

// GET price categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await db.all('SELECT DISTINCT category FROM price_list ORDER BY category');
    res.json(categories.map(c => c.category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    next(error);
  }
});

// GET single price-lis by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM price_list WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'price-lis not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching price-lis:', error);
    next(error);
  }
});

// CREATE new price list item
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['xactimate_code', 'item_name', 'category', 'description', 'unit', 'unit_price', 'labor_hours', 'material_cost', 'equipment_cost', 'tax_rate', 'is_active', 'notes'];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);

    const result = await db.run(
      `INSERT INTO price_list (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    const newItem = await db.get('SELECT * FROM price_list WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating price list item:', error);
    next(error);
  }
});

// UPDATE price list item
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['xactimate_code', 'item_name', 'category', 'description', 'unit', 'unit_price', 'labor_hours', 'material_cost', 'equipment_cost', 'tax_rate', 'is_active', 'notes'];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);
    values.push(new Date().toISOString(), id);

    await db.run(
      `UPDATE price_list SET xactimate_code = ?, item_name = ?, category = ?, description = ?, unit = ?, unit_price = ?, labor_hours = ?, material_cost = ?, equipment_cost = ?, tax_rate = ?, is_active = ?, notes = ?, updated_at = ? WHERE id = ?`,
      values
    );

    const updatedItem = await db.get('SELECT * FROM price_list WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating price list item:', error);
    next(error);
  }
});

// DELETE price-lis
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM price_list WHERE id = ?', [id]);
    res.json({ message: 'price-lis deleted successfully', id });
  } catch (error) {
    console.error('Error deleting price-lis:', error);
    next(error);
  }
});

export default router;
