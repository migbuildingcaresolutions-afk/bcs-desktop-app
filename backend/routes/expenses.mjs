import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all expenses
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM expenses ORDER BY expense_date DESC, id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    next(error);
  }
});

// GET single expense by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM expenses WHERE id = ?', [id]);

    if (!item) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching expense:', error);
    next(error);
  }
});

// GET expense by expense number
router.get('/number/:expenseNumber', async (req, res, next) => {
  try {
    const { expenseNumber } = req.params;
    const item = await db.get(
      'SELECT * FROM expenses WHERE expense_number = ?',
      [expenseNumber]
    );

    if (!item) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching expense by number:', error);
    next(error);
  }
});

// GET expenses by work order ID
router.get('/work-order/:workOrderId', async (req, res, next) => {
  try {
    const { workOrderId } = req.params;
    const items = await db.all(
      'SELECT * FROM expenses WHERE work_order_id = ? ORDER BY expense_date DESC',
      [workOrderId]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching expenses for work order:', error);
    next(error);
  }
});

// GET expenses by vendor ID
router.get('/vendor/:vendorId', async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const items = await db.all(
      'SELECT * FROM expenses WHERE vendor_id = ? ORDER BY expense_date DESC',
      [vendorId]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching expenses for vendor:', error);
    next(error);
  }
});

// GET expenses by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const items = await db.all(
      'SELECT * FROM expenses WHERE category = ? ORDER BY expense_date DESC',
      [category]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching expenses by category:', error);
    next(error);
  }
});

// GET billable expenses
router.get('/filter/billable', async (req, res, next) => {
  try {
    const items = await db.all(
      'SELECT * FROM expenses WHERE billable = 1 ORDER BY expense_date DESC'
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching billable expenses:', error);
    next(error);
  }
});

// GET reimbursable expenses
router.get('/filter/reimbursable', async (req, res, next) => {
  try {
    const items = await db.all(
      'SELECT * FROM expenses WHERE reimbursable = 1 ORDER BY expense_date DESC'
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching reimbursable expenses:', error);
    next(error);
  }
});

// GET unapproved expenses
router.get('/filter/unapproved', async (req, res, next) => {
  try {
    const items = await db.all(
      'SELECT * FROM expenses WHERE approved = 0 ORDER BY expense_date DESC'
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching unapproved expenses:', error);
    next(error);
  }
});

// CREATE new expense
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = [
      'expense_number', 'work_order_id', 'category', 'vendor_id', 'description',
      'amount', 'expense_date', 'payment_method', 'receipt_url', 'billable',
      'reimbursable', 'approved', 'approved_by', 'notes'
    ];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);

    const result = await db.run(
      `INSERT INTO expenses (${fields.join(', ')})
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    const newItem = await db.get('SELECT * FROM expenses WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating expense:', error);
    next(error);
  }
});

// UPDATE expense
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = [
      'expense_number', 'work_order_id', 'category', 'vendor_id', 'description',
      'amount', 'expense_date', 'payment_method', 'receipt_url', 'billable',
      'reimbursable', 'approved', 'approved_by', 'notes'
    ];
    const values = fields.map(f => data[f] !== undefined ? data[f] : null);
    values.push(id);

    await db.run(
      `UPDATE expenses SET
       expense_number = ?, work_order_id = ?, category = ?, vendor_id = ?, description = ?,
       amount = ?, expense_date = ?, payment_method = ?, receipt_url = ?, billable = ?,
       reimbursable = ?, approved = ?, approved_by = ?, notes = ?
       WHERE id = ?`,
      values
    );

    const updatedItem = await db.get('SELECT * FROM expenses WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating expense:', error);
    next(error);
  }
});

// DELETE expense
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM expenses WHERE id = ?', [id]);
    res.json({ message: 'Expense deleted successfully', id });
  } catch (error) {
    console.error('Error deleting expense:', error);
    next(error);
  }
});

export default router;
