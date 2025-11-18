import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all settings
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM settings ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching settings:', error);
    next(error);
  }
});

// GET single setting by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM settings WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'setting not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching setting:', error);
    next(error);
  }
});

// CREATE new setting
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['key', 'value', 'description'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO settings (${fields.join(', ')}) VALUES (?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM settings WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating setting:', error);
    next(error);
  }
});

// UPDATE setting
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['key', 'value', 'description'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE settings SET key = ?, value = ?, description = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM settings WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating setting:', error);
    next(error);
  }
});

// DELETE setting
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM settings WHERE id = ?', [id]);
    res.json({ message: 'setting deleted successfully', id });
  } catch (error) {
    console.error('Error deleting setting:', error);
    next(error);
  }
});

export default router;
