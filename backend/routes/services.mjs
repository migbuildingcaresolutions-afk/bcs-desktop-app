import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all services
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM services ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching services:', error);
    next(error);
  }
});

// GET single service by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM services WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'service not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching service:', error);
    next(error);
  }
});

// CREATE new service
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['name', 'description', 'category', 'base_price'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO services (${fields.join(', ')}) VALUES (?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM services WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating service:', error);
    next(error);
  }
});

// UPDATE service
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['name', 'description', 'category', 'base_price'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE services SET name = ?, description = ?, category = ?, base_price = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM services WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating service:', error);
    next(error);
  }
});

// DELETE service
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM services WHERE id = ?', [id]);
    res.json({ message: 'service deleted successfully', id });
  } catch (error) {
    console.error('Error deleting service:', error);
    next(error);
  }
});

export default router;
