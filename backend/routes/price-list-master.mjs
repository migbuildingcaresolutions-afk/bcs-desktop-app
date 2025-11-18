import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all price list items with search, filter, and category
router.get('/', async (req, res, next) => {
  try {
    const { search, category_id, subcategory_id, active, min_price, max_price } = req.query;
    let query = `
      SELECT plm.*, c.code as category_code, c.name as category_name,
             s.code as subcategory_code, s.name as subcategory_name
      FROM price_list_master plm
      LEFT JOIN categories c ON plm.category_id = c.id
      LEFT JOIN subcategories s ON plm.subcategory_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (plm.code LIKE ? OR plm.description LIKE ? OR c.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category_id) {
      query += ' AND plm.category_id = ?';
      params.push(category_id);
    }

    if (subcategory_id) {
      query += ' AND plm.subcategory_id = ?';
      params.push(subcategory_id);
    }

    if (active !== undefined) {
      query += ' AND plm.is_active = ?';
      params.push(active === 'true' ? 1 : 0);
    }

    if (min_price) {
      query += ' AND plm.final_price >= ?';
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      query += ' AND plm.final_price <= ?';
      params.push(parseFloat(max_price));
    }

    query += ' ORDER BY c.sort_order, plm.code';

    const items = await db.all(query, params);
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching price list master:', error);
    next(error);
  }
});

// GET price list using the full view (includes all calculated fields)
router.get('/full', async (req, res, next) => {
  try {
    const { category_code, search } = req.query;
    let query = 'SELECT * FROM v_price_list_full WHERE 1=1';
    const params = [];

    if (category_code) {
      query += ' AND category_code = ?';
      params.push(category_code);
    }

    if (search) {
      query += ' AND (code LIKE ? OR description LIKE ? OR category_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY category_code, code';

    const items = await db.all(query, params);
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching full price list:', error);
    next(error);
  }
});

// GET pricing summary by category
router.get('/summary', async (req, res, next) => {
  try {
    const summary = await db.all(`
      SELECT
        c.id,
        c.code,
        c.name,
        COUNT(plm.id) as item_count,
        ROUND(AVG(plm.final_price), 2) as avg_price,
        ROUND(MIN(plm.final_price), 2) as min_price,
        ROUND(MAX(plm.final_price), 2) as max_price
      FROM categories c
      LEFT JOIN price_list_master plm ON c.id = plm.category_id
      WHERE c.is_active = 1
      GROUP BY c.id
      ORDER BY c.sort_order
    `);
    res.json(summary || []);
  } catch (error) {
    console.error('Error fetching pricing summary:', error);
    next(error);
  }
});

// GET single price list item by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get(`
      SELECT plm.*, c.code as category_code, c.name as category_name,
             s.code as subcategory_code, s.name as subcategory_name
      FROM price_list_master plm
      LEFT JOIN categories c ON plm.category_id = c.id
      LEFT JOIN subcategories s ON plm.subcategory_id = s.id
      WHERE plm.id = ?
    `, [id]);

    if (!item) {
      return res.status(404).json({ error: 'Price list item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching price list item:', error);
    next(error);
  }
});

// CREATE new price list item
router.post('/', async (req, res, next) => {
  try {
    const {
      category_id,
      subcategory_id,
      code,
      description,
      unit,
      labor_cost,
      material_cost,
      equipment_cost,
      regional_modifier,
      bcs_markup,
      is_taxable,
      is_active,
      notes,
      xactimate_code
    } = req.body;

    // Calculate prices
    const base = (labor_cost || 0) + (material_cost || 0) + (equipment_cost || 0);
    const modifier = regional_modifier || 1.15;
    const markup = bcs_markup || 1.28;
    const adjusted = base * modifier;
    const final = adjusted * markup;

    const result = await db.run(`
      INSERT INTO price_list_master (
        category_id, subcategory_id, code, description, unit,
        labor_cost, material_cost, equipment_cost, base_price,
        regional_modifier, adjusted_price, bcs_markup, final_price,
        is_taxable, is_active, notes, xactimate_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      category_id,
      subcategory_id || null,
      code,
      description,
      unit,
      labor_cost || 0,
      material_cost || 0,
      equipment_cost || 0,
      base,
      modifier,
      adjusted,
      markup,
      final,
      is_taxable !== undefined ? is_taxable : 1,
      is_active !== undefined ? is_active : 1,
      notes || null,
      xactimate_code || null
    ]);

    const newItem = await db.get('SELECT * FROM price_list_master WHERE id = ?', [result.lastID]);
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
    const {
      category_id,
      subcategory_id,
      code,
      description,
      unit,
      labor_cost,
      material_cost,
      equipment_cost,
      regional_modifier,
      bcs_markup,
      is_taxable,
      is_active,
      notes,
      xactimate_code
    } = req.body;

    // Calculate prices
    const base = (labor_cost || 0) + (material_cost || 0) + (equipment_cost || 0);
    const modifier = regional_modifier || 1.15;
    const markup = bcs_markup || 1.28;
    const adjusted = base * modifier;
    const final = adjusted * markup;

    await db.run(`
      UPDATE price_list_master SET
        category_id = ?, subcategory_id = ?, code = ?, description = ?, unit = ?,
        labor_cost = ?, material_cost = ?, equipment_cost = ?, base_price = ?,
        regional_modifier = ?, adjusted_price = ?, bcs_markup = ?, final_price = ?,
        is_taxable = ?, is_active = ?, notes = ?, xactimate_code = ?, updated_at = ?
      WHERE id = ?
    `, [
      category_id,
      subcategory_id || null,
      code,
      description,
      unit,
      labor_cost || 0,
      material_cost || 0,
      equipment_cost || 0,
      base,
      modifier,
      adjusted,
      markup,
      final,
      is_taxable,
      is_active,
      notes,
      xactimate_code,
      new Date().toISOString(),
      id
    ]);

    const updatedItem = await db.get('SELECT * FROM price_list_master WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating price list item:', error);
    next(error);
  }
});

// BULK update prices (e.g., apply new regional modifier)
router.put('/bulk/update-modifier', async (req, res, next) => {
  try {
    const { regional_modifier, category_id } = req.body;

    let query = `
      UPDATE price_list_master SET
        regional_modifier = ?,
        adjusted_price = base_price * ?,
        final_price = base_price * ? * bcs_markup,
        updated_at = ?
    `;
    const params = [regional_modifier, regional_modifier, regional_modifier, new Date().toISOString()];

    if (category_id) {
      query += ' WHERE category_id = ?';
      params.push(category_id);
    }

    const result = await db.run(query, params);
    res.json({ message: 'Prices updated successfully', changes: result.changes });
  } catch (error) {
    console.error('Error bulk updating prices:', error);
    next(error);
  }
});

// BULK update markup
router.put('/bulk/update-markup', async (req, res, next) => {
  try {
    const { bcs_markup, category_id } = req.body;

    let query = `
      UPDATE price_list_master SET
        bcs_markup = ?,
        final_price = adjusted_price * ?,
        updated_at = ?
    `;
    const params = [bcs_markup, bcs_markup, new Date().toISOString()];

    if (category_id) {
      query += ' WHERE category_id = ?';
      params.push(category_id);
    }

    const result = await db.run(query, params);
    res.json({ message: 'Markup updated successfully', changes: result.changes });
  } catch (error) {
    console.error('Error bulk updating markup:', error);
    next(error);
  }
});

// DELETE price list item
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM price_list_master WHERE id = ?', [id]);
    res.json({ message: 'Price list item deleted successfully', id });
  } catch (error) {
    console.error('Error deleting price list item:', error);
    next(error);
  }
});

export default router;
