import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all reports
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM reports ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching reports:', error);
    next(error);
  }
});

// GET single report by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM reports WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'report not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching report:', error);
    next(error);
  }
});

// CREATE new report
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['title', 'type', 'generated_date', 'data'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO reports (${fields.join(', ')}) VALUES (?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM reports WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating report:', error);
    next(error);
  }
});

// UPDATE report
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['title', 'type', 'generated_date', 'data'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE reports SET title = ?, type = ?, generated_date = ?, data = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM reports WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating report:', error);
    next(error);
  }
});

// DELETE report
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM reports WHERE id = ?', [id]);
    res.json({ message: 'report deleted successfully', id });
  } catch (error) {
    console.error('Error deleting report:', error);
    next(error);
  }
});

export default router;
