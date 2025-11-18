import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all line_items
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM line_items ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching line_items:', error);
    next(error);
  }
});

// GET single line_item by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM line_items WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'line_item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching line_item:', error);
    next(error);
  }
});

// CREATE new line_item
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['description', 'quantity', 'unit_price', 'total', 'category', 'taxable'];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);

    const result = await db.run(
      `INSERT INTO line_items (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?, ?)`,
      values
    );

    const newItem = await db.get('SELECT * FROM line_items WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating line_item:', error);
    next(error);
  }
});

// UPDATE line_item
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['description', 'quantity', 'unit_price', 'total', 'category', 'taxable'];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);
    values.push(id);

    await db.run(
      `UPDATE line_items SET description = ?, quantity = ?, unit_price = ?, total = ?, category = ?, taxable = ? WHERE id = ?`,
      values
    );

    const updatedItem = await db.get('SELECT * FROM line_items WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating line_item:', error);
    next(error);
  }
});

// DELETE line_item
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM line_items WHERE id = ?', [id]);
    res.json({ message: 'line_item deleted successfully', id });
  } catch (error) {
    console.error('Error deleting line_item:', error);
    next(error);
  }
});

export default router;
