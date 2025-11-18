import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all certificates
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM certificates ORDER BY issue_date DESC, id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    next(error);
  }
});

// GET single certificate by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM certificates WHERE id = ?', [id]);

    if (!item) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching certificate:', error);
    next(error);
  }
});

// GET certificate by certificate number
router.get('/number/:certificateNumber', async (req, res, next) => {
  try {
    const { certificateNumber } = req.params;
    const item = await db.get(
      'SELECT * FROM certificates WHERE certificate_number = ?',
      [certificateNumber]
    );

    if (!item) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching certificate by number:', error);
    next(error);
  }
});

// GET certificates by client ID
router.get('/client/:clientId', async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const items = await db.all(
      'SELECT * FROM certificates WHERE client_id = ? ORDER BY issue_date DESC',
      [clientId]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching certificates for client:', error);
    next(error);
  }
});

// GET certificates by work order ID
router.get('/work-order/:workOrderId', async (req, res, next) => {
  try {
    const { workOrderId } = req.params;
    const items = await db.all(
      'SELECT * FROM certificates WHERE work_order_id = ? ORDER BY issue_date DESC',
      [workOrderId]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching certificates for work order:', error);
    next(error);
  }
});

// CREATE new certificate
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = [
      'certificate_number', 'certificate_type', 'work_order_id', 'client_id',
      'issue_date', 'description', 'issued_by', 'file_path', 'notes'
    ];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);

    const result = await db.run(
      `INSERT INTO certificates (${fields.join(', ')})
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    const newItem = await db.get('SELECT * FROM certificates WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating certificate:', error);
    next(error);
  }
});

// UPDATE certificate
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = [
      'certificate_number', 'certificate_type', 'work_order_id', 'client_id',
      'issue_date', 'description', 'issued_by', 'file_path', 'notes'
    ];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);
    values.push(id);

    await db.run(
      `UPDATE certificates SET
       certificate_number = ?, certificate_type = ?, work_order_id = ?, client_id = ?,
       issue_date = ?, description = ?, issued_by = ?, file_path = ?, notes = ?
       WHERE id = ?`,
      values
    );

    const updatedItem = await db.get('SELECT * FROM certificates WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating certificate:', error);
    next(error);
  }
});

// DELETE certificate
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM certificates WHERE id = ?', [id]);
    res.json({ message: 'Certificate deleted successfully', id });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    next(error);
  }
});

export default router;
