import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all moisture logs
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM moisture_logs ORDER BY log_date DESC, id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching moisture logs:', error);
    next(error);
  }
});

// GET single moisture log by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM moisture_logs WHERE id = ?', [id]);

    if (!item) {
      return res.status(404).json({ error: 'Moisture log not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching moisture log:', error);
    next(error);
  }
});

// GET moisture logs by job ID
router.get('/job/:jobId', async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const items = await db.all(
      'SELECT * FROM moisture_logs WHERE job_id = ? ORDER BY log_date DESC',
      [jobId]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching moisture logs for job:', error);
    next(error);
  }
});

// GET moisture logs by work order ID
router.get('/work-order/:workOrderId', async (req, res, next) => {
  try {
    const { workOrderId } = req.params;
    const items = await db.all(
      'SELECT * FROM moisture_logs WHERE work_order_id = ? ORDER BY log_date DESC',
      [workOrderId]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching moisture logs for work order:', error);
    next(error);
  }
});

// CREATE new moisture log
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = [
      'job_id', 'work_order_id', 'log_date', 'location', 'material_type',
      'moisture_reading', 'target_reading', 'temperature', 'humidity',
      'technician', 'notes'
    ];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);

    const result = await db.run(
      `INSERT INTO moisture_logs (${fields.join(', ')})
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    const newItem = await db.get('SELECT * FROM moisture_logs WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating moisture log:', error);
    next(error);
  }
});

// UPDATE moisture log
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = [
      'job_id', 'work_order_id', 'log_date', 'location', 'material_type',
      'moisture_reading', 'target_reading', 'temperature', 'humidity',
      'technician', 'notes'
    ];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);
    values.push(id);

    await db.run(
      `UPDATE moisture_logs SET
       job_id = ?, work_order_id = ?, log_date = ?, location = ?, material_type = ?,
       moisture_reading = ?, target_reading = ?, temperature = ?, humidity = ?,
       technician = ?, notes = ?
       WHERE id = ?`,
      values
    );

    const updatedItem = await db.get('SELECT * FROM moisture_logs WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating moisture log:', error);
    next(error);
  }
});

// DELETE moisture log
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM moisture_logs WHERE id = ?', [id]);
    res.json({ message: 'Moisture log deleted successfully', id });
  } catch (error) {
    console.error('Error deleting moisture log:', error);
    next(error);
  }
});

export default router;
