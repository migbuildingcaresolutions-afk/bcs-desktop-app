import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all xactimate
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM xactimate ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching xactimate:', error);
    next(error);
  }
});

// GET single xactimat by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM xactimate WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'xactimat not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching xactimat:', error);
    next(error);
  }
});

// CREATE new xactimat
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['estimate_id', 'xactimate_code', 'description', 'quantity', 'unit_price'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO xactimate (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM xactimate WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating xactimat:', error);
    next(error);
  }
});

// UPDATE xactimat
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['estimate_id', 'xactimate_code', 'description', 'quantity', 'unit_price'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE xactimate SET estimate_id = ?, xactimate_code = ?, description = ?, quantity = ?, unit_price = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM xactimate WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating xactimat:', error);
    next(error);
  }
});

// DELETE xactimat
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM xactimate WHERE id = ?', [id]);
    res.json({ message: 'xactimat deleted successfully', id });
  } catch (error) {
    console.error('Error deleting xactimat:', error);
    next(error);
  }
});

export default router;
