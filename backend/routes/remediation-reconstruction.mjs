import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all remediation-reconstruction
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM remediation_reconstruction ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching remediation-reconstruction:', error);
    next(error);
  }
});

// GET single remediation-reconstructio by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM remediation_reconstruction WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'remediation-reconstructio not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching remediation-reconstructio:', error);
    next(error);
  }
});

// CREATE new remediation-reconstructio
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['job_id', 'work_description', 'materials_used', 'labor_hours'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO remediation_reconstruction (${fields.join(', ')}) VALUES (?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM remediation_reconstruction WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating remediation-reconstructio:', error);
    next(error);
  }
});

// UPDATE remediation-reconstructio
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['job_id', 'work_description', 'materials_used', 'labor_hours'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE remediation_reconstruction SET job_id = ?, work_description = ?, materials_used = ?, labor_hours = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM remediation_reconstruction WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating remediation-reconstructio:', error);
    next(error);
  }
});

// DELETE remediation-reconstructio
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM remediation_reconstruction WHERE id = ?', [id]);
    res.json({ message: 'remediation-reconstructio deleted successfully', id });
  } catch (error) {
    console.error('Error deleting remediation-reconstructio:', error);
    next(error);
  }
});

export default router;
