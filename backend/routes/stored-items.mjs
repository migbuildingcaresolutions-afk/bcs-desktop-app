import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all stored items
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM stored_items ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching stored items:', error);
    next(error);
  }
});

// GET single stored item by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM stored_items WHERE id = ?', [id]);

    if (!item) {
      return res.status(404).json({ error: 'Stored item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching stored item:', error);
    next(error);
  }
});

// GET stored items by job ID
router.get('/job/:jobId', async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const items = await db.all(
      'SELECT * FROM stored_items WHERE job_id = ? ORDER BY id DESC',
      [jobId]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching stored items for job:', error);
    next(error);
  }
});

// GET stored items by client ID
router.get('/client/:clientId', async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const items = await db.all(
      'SELECT * FROM stored_items WHERE client_id = ? ORDER BY id DESC',
      [clientId]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching stored items for client:', error);
    next(error);
  }
});

// GET stored items by status
router.get('/status/:status', async (req, res, next) => {
  try {
    const { status } = req.params;
    const items = await db.all(
      'SELECT * FROM stored_items WHERE status = ? ORDER BY id DESC',
      [status]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching stored items by status:', error);
    next(error);
  }
});

// CREATE new stored item
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = [
      'job_id', 'client_id', 'work_order_id', 'item_description', 'room',
      'quantity', 'condition', 'photo_url', 'storage_location',
      'packed_date', 'returned_date', 'status', 'notes'
    ];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);

    const result = await db.run(
      `INSERT INTO stored_items (${fields.join(', ')})
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    const newItem = await db.get('SELECT * FROM stored_items WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating stored item:', error);
    next(error);
  }
});

// UPDATE stored item
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = [
      'job_id', 'client_id', 'work_order_id', 'item_description', 'room',
      'quantity', 'condition', 'photo_url', 'storage_location',
      'packed_date', 'returned_date', 'status', 'notes'
    ];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);
    values.push(id);

    await db.run(
      `UPDATE stored_items SET
       job_id = ?, client_id = ?, work_order_id = ?, item_description = ?, room = ?,
       quantity = ?, condition = ?, photo_url = ?, storage_location = ?,
       packed_date = ?, returned_date = ?, status = ?, notes = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      values
    );

    const updatedItem = await db.get('SELECT * FROM stored_items WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating stored item:', error);
    next(error);
  }
});

// DELETE stored item
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM stored_items WHERE id = ?', [id]);
    res.json({ message: 'Stored item deleted successfully', id });
  } catch (error) {
    console.error('Error deleting stored item:', error);
    next(error);
  }
});

export default router;
