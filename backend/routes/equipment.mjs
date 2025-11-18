import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all equipment
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM equipment ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    next(error);
  }
});

// GET single equipmen by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM equipment WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'equipmen not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching equipmen:', error);
    next(error);
  }
});

// CREATE new equipmen
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['name', 'description', 'serial_number', 'status', 'purchase_date'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO equipment (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM equipment WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating equipmen:', error);
    next(error);
  }
});

// UPDATE equipmen
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['name', 'description', 'serial_number', 'status', 'purchase_date'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE equipment SET name = ?, description = ?, serial_number = ?, status = ?, purchase_date = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM equipment WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating equipmen:', error);
    next(error);
  }
});

// DELETE equipmen
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM equipment WHERE id = ?', [id]);
    res.json({ message: 'equipmen deleted successfully', id });
  } catch (error) {
    console.error('Error deleting equipmen:', error);
    next(error);
  }
});

export default router;
