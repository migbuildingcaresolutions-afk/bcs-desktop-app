import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET estimate with line items
router.get('/:estimateId', async (req, res, next) => {
  try {
    const { estimateId } = req.params;

    // Get estimate details
    const estimate = await db.get('SELECT * FROM estimates WHERE id = ?', [estimateId]);
    if (!estimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    // Get line items
    const lineItems = await db.all(
      'SELECT * FROM xactimate_line_items WHERE estimate_id = ? ORDER BY sort_order, id',
      [estimateId]
    );

    // Calculate totals
    const subtotal = lineItems.reduce((sum, item) => sum + item.line_total, 0);
    const totalLaborHours = lineItems.reduce((sum, item) => sum + (item.labor_hours * item.quantity), 0);

    res.json({
      estimate,
      lineItems,
      totals: {
        subtotal,
        totalLaborHours,
        itemCount: lineItems.length
      }
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    next(error);
  }
});

// CREATE new quote with line items
router.post('/', async (req, res, next) => {
  try {
    const { client_id, title, description, pricing_rule_id, line_items } = req.body;

    // Get pricing rule
    const pricingRule = await db.get('SELECT * FROM pricing_rules WHERE id = ?', [pricing_rule_id || 1]);
    if (!pricingRule) {
      return res.status(400).json({ error: 'Invalid pricing rule' });
    }

    // Generate estimate number
    const count = await db.get('SELECT COUNT(*) as count FROM estimates');
    const estimate_number = `EST-${String(count.count + 1).padStart(5, '0')}`;

    // Create estimate
    const estimateResult = await db.run(
      `INSERT INTO estimates (client_id, estimate_number, title, description, status, total_amount, valid_until)
       VALUES (?, ?, ?, ?, 'draft', 0, date('now', '+30 days'))`,
      [client_id, estimate_number, title, description]
    );

    const estimateId = estimateResult.lastID;
    let totalAmount = 0;

    // Add line items
    for (let i = 0; i < line_items.length; i++) {
      const item = line_items[i];

      // Calculate line item totals
      const totalPrice = item.quantity * item.unit_price;
      const overheadProfit = totalPrice * ((pricingRule.overhead_percentage + pricingRule.profit_percentage) / 100);
      const taxAmount = (totalPrice + overheadProfit) * (pricingRule.tax_percentage / 100);
      const lineTotal = totalPrice + overheadProfit + taxAmount;

      await db.run(
        `INSERT INTO xactimate_line_items
         (estimate_id, price_list_id, xactimate_code, description, quantity, unit, unit_price, total_price, labor_hours, overhead_profit, tax_amount, line_total, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          estimateId,
          item.price_list_id,
          item.xactimate_code,
          item.description,
          item.quantity,
          item.unit,
          item.unit_price,
          totalPrice,
          item.labor_hours || 0,
          overheadProfit,
          taxAmount,
          lineTotal,
          i
        ]
      );

      totalAmount += lineTotal;
    }

    // Update estimate total
    await db.run(
      'UPDATE estimates SET total_amount = ? WHERE id = ?',
      [totalAmount, estimateId]
    );

    // Return complete quote
    const estimate = await db.get('SELECT * FROM estimates WHERE id = ?', [estimateId]);
    const lineItemsResult = await db.all(
      'SELECT * FROM xactimate_line_items WHERE estimate_id = ? ORDER BY sort_order',
      [estimateId]
    );

    res.status(201).json({
      estimate,
      lineItems: lineItemsResult,
      totals: {
        subtotal: totalAmount - lineItemsResult.reduce((sum, item) => sum + item.tax_amount, 0),
        overheadProfit: lineItemsResult.reduce((sum, item) => sum + item.overhead_profit, 0),
        tax: lineItemsResult.reduce((sum, item) => sum + item.tax_amount, 0),
        total: totalAmount
      }
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    next(error);
  }
});

// UPDATE quote line items
router.put('/:estimateId', async (req, res, next) => {
  try {
    const { estimateId } = req.params;
    const { title, description, line_items, pricing_rule_id } = req.body;

    // Get pricing rule
    const pricingRule = await db.get('SELECT * FROM pricing_rules WHERE id = ?', [pricing_rule_id || 1]);

    // Update estimate details
    await db.run(
      'UPDATE estimates SET title = ?, description = ? WHERE id = ?',
      [title, description, estimateId]
    );

    // Delete existing line items
    await db.run('DELETE FROM xactimate_line_items WHERE estimate_id = ?', [estimateId]);

    let totalAmount = 0;

    // Add updated line items
    for (let i = 0; i < line_items.length; i++) {
      const item = line_items[i];

      const totalPrice = item.quantity * item.unit_price;
      const overheadProfit = totalPrice * ((pricingRule.overhead_percentage + pricingRule.profit_percentage) / 100);
      const taxAmount = (totalPrice + overheadProfit) * (pricingRule.tax_percentage / 100);
      const lineTotal = totalPrice + overheadProfit + taxAmount;

      await db.run(
        `INSERT INTO xactimate_line_items
         (estimate_id, price_list_id, xactimate_code, description, quantity, unit, unit_price, total_price, labor_hours, overhead_profit, tax_amount, line_total, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          estimateId,
          item.price_list_id,
          item.xactimate_code,
          item.description,
          item.quantity,
          item.unit,
          item.unit_price,
          totalPrice,
          item.labor_hours || 0,
          overheadProfit,
          taxAmount,
          lineTotal,
          i
        ]
      );

      totalAmount += lineTotal;
    }

    // Update estimate total
    await db.run(
      'UPDATE estimates SET total_amount = ? WHERE id = ?',
      [totalAmount, estimateId]
    );

    // Return updated quote
    const estimate = await db.get('SELECT * FROM estimates WHERE id = ?', [estimateId]);
    const lineItemsResult = await db.all(
      'SELECT * FROM xactimate_line_items WHERE estimate_id = ? ORDER BY sort_order',
      [estimateId]
    );

    res.json({
      estimate,
      lineItems: lineItemsResult,
      totals: {
        subtotal: totalAmount - lineItemsResult.reduce((sum, item) => sum + item.tax_amount, 0),
        overheadProfit: lineItemsResult.reduce((sum, item) => sum + item.overhead_profit, 0),
        tax: lineItemsResult.reduce((sum, item) => sum + item.tax_amount, 0),
        total: totalAmount
      }
    });
  } catch (error) {
    console.error('Error updating quote:', error);
    next(error);
  }
});

// GET pricing rules
router.get('/pricing-rules/list', async (req, res, next) => {
  try {
    const rules = await db.all('SELECT * FROM pricing_rules WHERE is_active = 1 ORDER BY rule_name');
    res.json(rules);
  } catch (error) {
    console.error('Error fetching pricing rules:', error);
    next(error);
  }
});

export default router;
