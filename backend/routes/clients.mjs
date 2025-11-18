import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all clients
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM clients ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching clients:', error);
    next(error);
  }
});

// GET single client by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM clients WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'client not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching client:', error);
    next(error);
  }
});

// CREATE new client
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['name', 'email', 'phone', 'address', 'company'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO clients (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM clients WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating client:', error);
    next(error);
  }
});

// UPDATE client
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['name', 'email', 'phone', 'address', 'company'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE clients SET name = ?, email = ?, phone = ?, address = ?, company = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM clients WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating client:', error);
    next(error);
  }
});

// DELETE client
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM clients WHERE id = ?', [id]);
    res.json({ message: 'client deleted successfully', id });
  } catch (error) {
    console.error('Error deleting client:', error);
    next(error);
  }
});

export default router;
