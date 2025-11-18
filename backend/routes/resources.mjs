import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all resources
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM resources ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching resources:', error);
    next(error);
  }
});

// GET single resource by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM resources WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'resource not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching resource:', error);
    next(error);
  }
});

// CREATE new resource
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['name', 'type', 'availability', 'location'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO resources (${fields.join(', ')}) VALUES (?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM resources WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating resource:', error);
    next(error);
  }
});

// UPDATE resource
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['name', 'type', 'availability', 'location'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE resources SET name = ?, type = ?, availability = ?, location = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM resources WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating resource:', error);
    next(error);
  }
});

// DELETE resource
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM resources WHERE id = ?', [id]);
    res.json({ message: 'resource deleted successfully', id });
  } catch (error) {
    console.error('Error deleting resource:', error);
    next(error);
  }
});

export default router;
