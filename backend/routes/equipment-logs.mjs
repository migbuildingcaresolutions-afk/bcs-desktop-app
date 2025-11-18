import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all equipment logs
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM equipment_logs ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching equipment logs:', error);
    next(error);
  }
});

// GET single equipment log by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM equipment_logs WHERE id = ?', [id]);

    if (!item) {
      return res.status(404).json({ error: 'Equipment log not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching equipment log:', error);
    next(error);
  }
});

// GET equipment logs by work order ID
router.get('/work-order/:workOrderId', async (req, res, next) => {
  try {
    const { workOrderId } = req.params;
    const items = await db.all(
      'SELECT * FROM equipment_logs WHERE work_order_id = ? ORDER BY deployed_date DESC',
      [workOrderId]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching equipment logs for work order:', error);
    next(error);
  }
});

// GET equipment logs by equipment ID
router.get('/equipment/:equipmentId', async (req, res, next) => {
  try {
    const { equipmentId } = req.params;
    const items = await db.all(
      'SELECT * FROM equipment_logs WHERE equipment_id = ? ORDER BY deployed_date DESC',
      [equipmentId]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching equipment logs for equipment:', error);
    next(error);
  }
});

// CREATE new equipment log
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = [
      'job_id', 'equipment_id', 'work_order_id', 'deployed_date',
      'retrieved_date', 'location', 'readings', 'hours_used', 'notes'
    ];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);

    const result = await db.run(
      `INSERT INTO equipment_logs (${fields.join(', ')})
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    const newItem = await db.get('SELECT * FROM equipment_logs WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating equipment log:', error);
    next(error);
  }
});

// UPDATE equipment log
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = [
      'job_id', 'equipment_id', 'work_order_id', 'deployed_date',
      'retrieved_date', 'location', 'readings', 'hours_used', 'notes'
    ];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);
    values.push(id);

    await db.run(
      `UPDATE equipment_logs SET
       job_id = ?, equipment_id = ?, work_order_id = ?, deployed_date = ?,
       retrieved_date = ?, location = ?, readings = ?, hours_used = ?, notes = ?
       WHERE id = ?`,
      values
    );

    const updatedItem = await db.get('SELECT * FROM equipment_logs WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating equipment log:', error);
    next(error);
  }
});

// DELETE equipment log
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM equipment_logs WHERE id = ?', [id]);
    res.json({ message: 'Equipment log deleted successfully', id });
  } catch (error) {
    console.error('Error deleting equipment log:', error);
    next(error);
  }
});

export default router;
