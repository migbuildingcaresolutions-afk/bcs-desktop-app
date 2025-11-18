import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all invoices
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM invoices ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    next(error);
  }
});

// GET single invoice by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM invoices WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'invoice not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    next(error);
  }
});

// CREATE new invoice
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['client_id', 'work_order_id', 'amount', 'status', 'due_date'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO invoices (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM invoices WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating invoice:', error);
    next(error);
  }
});

// UPDATE invoice
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['client_id', 'work_order_id', 'amount', 'status', 'due_date'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE invoices SET client_id = ?, work_order_id = ?, amount = ?, status = ?, due_date = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM invoices WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating invoice:', error);
    next(error);
  }
});

// DELETE invoice
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM invoices WHERE id = ?', [id]);
    res.json({ message: 'invoice deleted successfully', id });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    next(error);
  }
});

export default router;
