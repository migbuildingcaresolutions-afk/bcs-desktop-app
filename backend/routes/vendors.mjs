import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all vendors
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM vendors ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    next(error);
  }
});

// GET single vendor by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM vendors WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'vendor not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    next(error);
  }
});

// CREATE new vendor
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['name', 'email', 'phone', 'address', 'contact_person'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO vendors (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM vendors WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating vendor:', error);
    next(error);
  }
});

// UPDATE vendor
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['name', 'email', 'phone', 'address', 'contact_person'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE vendors SET name = ?, email = ?, phone = ?, address = ?, contact_person = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM vendors WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating vendor:', error);
    next(error);
  }
});

// DELETE vendor
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM vendors WHERE id = ?', [id]);
    res.json({ message: 'vendor deleted successfully', id });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    next(error);
  }
});

export default router;
