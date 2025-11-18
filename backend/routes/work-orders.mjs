import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all work-orders
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM work_orders ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching work-orders:', error);
    next(error);
  }
});

// GET single work-order by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM work_orders WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'work-order not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching work-order:', error);
    next(error);
  }
});

// CREATE new work-order
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['client_id', 'title', 'description', 'status', 'start_date', 'end_date'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO work_orders (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM work_orders WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating work-order:', error);
    next(error);
  }
});

// UPDATE work-order
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['client_id', 'title', 'description', 'status', 'start_date', 'end_date'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE work_orders SET client_id = ?, title = ?, description = ?, status = ?, start_date = ?, end_date = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM work_orders WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating work-order:', error);
    next(error);
  }
});

// DELETE work-order
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM work_orders WHERE id = ?', [id]);
    res.json({ message: 'work-order deleted successfully', id });
  } catch (error) {
    console.error('Error deleting work-order:', error);
    next(error);
  }
});

export default router;
