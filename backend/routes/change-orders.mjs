import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all change-orders
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM change_orders ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching change-orders:', error);
    next(error);
  }
});

// GET single change-order by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM change_orders WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'change-order not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching change-order:', error);
    next(error);
  }
});

// CREATE new change-order
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['work_order_id', 'description', 'amount', 'status', 'approved_date'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO change_orders (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM change_orders WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating change-order:', error);
    next(error);
  }
});

// UPDATE change-order
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['work_order_id', 'description', 'amount', 'status', 'approved_date'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE change_orders SET work_order_id = ?, description = ?, amount = ?, status = ?, approved_date = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM change_orders WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating change-order:', error);
    next(error);
  }
});

// DELETE change-order
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM change_orders WHERE id = ?', [id]);
    res.json({ message: 'change-order deleted successfully', id });
  } catch (error) {
    console.error('Error deleting change-order:', error);
    next(error);
  }
});

export default router;
