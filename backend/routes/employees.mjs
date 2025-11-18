import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all employees
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM employees ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching employees:', error);
    next(error);
  }
});

// GET single employee by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM employees WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'employee not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching employee:', error);
    next(error);
  }
});

// CREATE new employee
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['name', 'email', 'phone', 'position', 'hire_date'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO employees (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM employees WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating employee:', error);
    next(error);
  }
});

// UPDATE employee
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['name', 'email', 'phone', 'position', 'hire_date'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE employees SET name = ?, email = ?, phone = ?, position = ?, hire_date = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM employees WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating employee:', error);
    next(error);
  }
});

// DELETE employee
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM employees WHERE id = ?', [id]);
    res.json({ message: 'employee deleted successfully', id });
  } catch (error) {
    console.error('Error deleting employee:', error);
    next(error);
  }
});

export default router;
