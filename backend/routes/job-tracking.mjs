import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all job-tracking
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM job_tracking ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching job-tracking:', error);
    next(error);
  }
});

// GET single job-trackin by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM job_tracking WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'job-trackin not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching job-trackin:', error);
    next(error);
  }
});

// CREATE new job-trackin
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['job_id', 'employee_id', 'date', 'hours', 'notes'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO job_tracking (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM job_tracking WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating job-trackin:', error);
    next(error);
  }
});

// UPDATE job-trackin
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['job_id', 'employee_id', 'date', 'hours', 'notes'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE job_tracking SET job_id = ?, employee_id = ?, date = ?, hours = ?, notes = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM job_tracking WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating job-trackin:', error);
    next(error);
  }
});

// DELETE job-trackin
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM job_tracking WHERE id = ?', [id]);
    res.json({ message: 'job-trackin deleted successfully', id });
  } catch (error) {
    console.error('Error deleting job-trackin:', error);
    next(error);
  }
});

export default router;
