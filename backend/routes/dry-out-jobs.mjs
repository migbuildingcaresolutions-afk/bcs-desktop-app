import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all dry-out-jobs
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM dry_out_jobs ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching dry-out-jobs:', error);
    next(error);
  }
});

// GET single dry-out-job by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM dry_out_jobs WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'dry-out-job not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching dry-out-job:', error);
    next(error);
  }
});

// CREATE new dry-out-job
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['client_id', 'location', 'start_date', 'status', 'equipment_used'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO dry_out_jobs (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM dry_out_jobs WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating dry-out-job:', error);
    next(error);
  }
});

// UPDATE dry-out-job
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['client_id', 'location', 'start_date', 'status', 'equipment_used'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE dry_out_jobs SET client_id = ?, location = ?, start_date = ?, status = ?, equipment_used = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM dry_out_jobs WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating dry-out-job:', error);
    next(error);
  }
});

// DELETE dry-out-job
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM dry_out_jobs WHERE id = ?', [id]);
    res.json({ message: 'dry-out-job deleted successfully', id });
  } catch (error) {
    console.error('Error deleting dry-out-job:', error);
    next(error);
  }
});

export default router;
