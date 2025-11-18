import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all pricing
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM pricing ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching pricing:', error);
    next(error);
  }
});

// GET single pricin by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM pricing WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'pricin not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching pricin:', error);
    next(error);
  }
});

// CREATE new pricin
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['service_id', 'base_price', 'markup_percentage', 'final_price'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO pricing (${fields.join(', ')}) VALUES (?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM pricing WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating pricin:', error);
    next(error);
  }
});

// UPDATE pricin
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['service_id', 'base_price', 'markup_percentage', 'final_price'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE pricing SET service_id = ?, base_price = ?, markup_percentage = ?, final_price = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM pricing WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating pricin:', error);
    next(error);
  }
});

// DELETE pricin
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM pricing WHERE id = ?', [id]);
    res.json({ message: 'pricin deleted successfully', id });
  } catch (error) {
    console.error('Error deleting pricin:', error);
    next(error);
  }
});

export default router;
