import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all remediation-dryout
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM remediation_dryout ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching remediation-dryout:', error);
    next(error);
  }
});

// GET single remediation-dryou by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM remediation_dryout WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'remediation-dryou not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching remediation-dryou:', error);
    next(error);
  }
});

// CREATE new remediation-dryou
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['job_id', 'area_affected', 'moisture_reading', 'equipment_placed'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO remediation_dryout (${fields.join(', ')}) VALUES (?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM remediation_dryout WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating remediation-dryou:', error);
    next(error);
  }
});

// UPDATE remediation-dryou
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['job_id', 'area_affected', 'moisture_reading', 'equipment_placed'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE remediation_dryout SET job_id = ?, area_affected = ?, moisture_reading = ?, equipment_placed = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM remediation_dryout WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating remediation-dryou:', error);
    next(error);
  }
});

// DELETE remediation-dryou
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM remediation_dryout WHERE id = ?', [id]);
    res.json({ message: 'remediation-dryou deleted successfully', id });
  } catch (error) {
    console.error('Error deleting remediation-dryou:', error);
    next(error);
  }
});

export default router;
