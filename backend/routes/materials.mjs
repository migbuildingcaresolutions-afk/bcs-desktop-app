import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all materials
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM materials ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching materials:', error);
    next(error);
  }
});

// GET single material by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM materials WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'material not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching material:', error);
    next(error);
  }
});

// CREATE new material
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['name', 'description', 'unit', 'unit_price', 'quantity'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO materials (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM materials WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating material:', error);
    next(error);
  }
});

// UPDATE material
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['name', 'description', 'unit', 'unit_price', 'quantity'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE materials SET name = ?, description = ?, unit = ?, unit_price = ?, quantity = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM materials WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating material:', error);
    next(error);
  }
});

// DELETE material
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM materials WHERE id = ?', [id]);
    res.json({ message: 'material deleted successfully', id });
  } catch (error) {
    console.error('Error deleting material:', error);
    next(error);
  }
});

export default router;
