import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all estimates
router.get('/', async (req, res, next) => {
  try {
    const items = await db.all('SELECT * FROM estimates ORDER BY id DESC');
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching estimates:', error);
    next(error);
  }
});

// GET single estimate by ID with line items
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.get('SELECT * FROM estimates WHERE id = ?', [id]);

    if (!item) {
      return res.status(404).json({ error: 'estimate not found' });
    }

    // Get line items for this estimate
    const lineItems = await db.all(
      'SELECT * FROM line_items WHERE estimate_id = ? ORDER BY sort_order, id',
      [id]
    );

    item.line_items = lineItems || [];

    res.json(item);
  } catch (error) {
    console.error('Error fetching estimate:', error);
    next(error);
  }
});

// CREATE new estimate
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const fields = ['client_id', 'title', 'description', 'total_amount', 'status'];
    const values = fields.map(f => data[f]);
    
    const result = await db.run(
      `INSERT INTO estimates (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?)`,
      values
    );
    
    const newItem = await db.get('SELECT * FROM estimates WHERE id = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating estimate:', error);
    next(error);
  }
});

// UPDATE estimate
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = ['client_id', 'title', 'description', 'total_amount', 'status'];
    const values = fields.map(f => data[f]);
    values.push(id);
    
    await db.run(
      `UPDATE estimates SET client_id = ?, title = ?, description = ?, total_amount = ?, status = ? WHERE id = ?`,
      values
    );
    
    const updatedItem = await db.get('SELECT * FROM estimates WHERE id = ?', [id]);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating estimate:', error);
    next(error);
  }
});

// DELETE estimate
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM estimates WHERE id = ?', [id]);
    res.json({ message: 'estimate deleted successfully', id });
  } catch (error) {
    console.error('Error deleting estimate:', error);
    next(error);
  }
});

// ============================================
// LINE ITEMS ENDPOINTS
// ============================================

// GET line items for an estimate
router.get('/:id/line-items', async (req, res, next) => {
  try {
    const { id } = req.params;
    const items = await db.all(
      'SELECT * FROM line_items WHERE estimate_id = ? ORDER BY sort_order, id',
      [id]
    );
    res.json(items || []);
  } catch (error) {
    console.error('Error fetching line items:', error);
    next(error);
  }
});

// ADD line item to estimate
router.post('/:id/line-items', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, code, description, quantity, unit, unit_price, notes } = req.body;

    const total_price = (quantity || 0) * (unit_price || 0);

    const result = await db.run(
      `INSERT INTO line_items (estimate_id, category, code, description, quantity, unit, unit_price, total_price, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, category, code, description, quantity || 1, unit || 'EA', unit_price || 0, total_price, notes]
    );

    const newItem = await db.get('SELECT * FROM line_items WHERE id = ?', [result.lastID]);

    // Recalculate estimate totals
    await recalculateEstimateTotals(id);

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding line item:', error);
    next(error);
  }
});

// UPDATE line item
router.put('/:id/line-items/:itemId', async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { category, code, description, quantity, unit, unit_price, notes } = req.body;

    const total_price = (quantity || 0) * (unit_price || 0);

    await db.run(
      `UPDATE line_items
       SET category = ?, code = ?, description = ?, quantity = ?, unit = ?, unit_price = ?, total_price = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [category, code, description, quantity, unit, unit_price, total_price, notes, itemId]
    );

    const updatedItem = await db.get('SELECT * FROM line_items WHERE id = ?', [itemId]);

    // Recalculate estimate totals
    const lineItem = await db.get('SELECT estimate_id FROM line_items WHERE id = ?', [itemId]);
    if (lineItem) {
      await recalculateEstimateTotals(lineItem.estimate_id);
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating line item:', error);
    next(error);
  }
});

// DELETE line item
router.delete('/:id/line-items/:itemId', async (req, res, next) => {
  try {
    const { id, itemId } = req.params;

    await db.run('DELETE FROM line_items WHERE id = ?', [itemId]);

    // Recalculate estimate totals
    await recalculateEstimateTotals(id);

    res.json({ message: 'Line item deleted successfully' });
  } catch (error) {
    console.error('Error deleting line item:', error);
    next(error);
  }
});

// RECALCULATE estimate totals
router.post('/:id/recalculate', async (req, res, next) => {
  try {
    const { id } = req.params;
    await recalculateEstimateTotals(id);

    const estimate = await db.get('SELECT * FROM estimates WHERE id = ?', [id]);
    res.json(estimate);
  } catch (error) {
    console.error('Error recalculating estimate:', error);
    next(error);
  }
});

// Helper function to recalculate estimate totals
async function recalculateEstimateTotals(estimateId) {
  // Get sum of all line items
  const result = await db.get(
    'SELECT SUM(total_price) as subtotal FROM line_items WHERE estimate_id = ?',
    [estimateId]
  );

  const subtotal = result?.subtotal || 0;

  // Get estimate to check tax rate
  const estimate = await db.get('SELECT tax_rate FROM estimates WHERE id = ?', [estimateId]);
  const tax_rate = estimate?.tax_rate || 0;

  const tax_amount = subtotal * (tax_rate / 100);
  const total_amount = subtotal + tax_amount;

  // Update estimate
  await db.run(
    `UPDATE estimates
     SET subtotal = ?, tax_amount = ?, total_amount = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [subtotal, tax_amount, total_amount, estimateId]
  );
}

export default router;
