import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all payments
router.get('/', async (req, res, next) => {
  try {
    const payments = await db.all(`
      SELECT p.*,
             i.invoice_number,
             c.name as client_name,
             c.company as client_company
      FROM payments p
      LEFT JOIN invoices i ON p.invoice_id = i.id
      LEFT JOIN clients c ON i.client_id = c.id
      ORDER BY p.payment_date DESC, p.created_at DESC
    `);
    res.json(payments || []);
  } catch (error) {
    console.error('Error fetching payments:', error);
    next(error);
  }
});

// GET single payment by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await db.get(`
      SELECT p.*,
             i.invoice_number,
             i.amount as invoice_amount,
             c.name as client_name,
             c.company as client_company
      FROM payments p
      LEFT JOIN invoices i ON p.invoice_id = i.id
      LEFT JOIN clients c ON i.client_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    next(error);
  }
});

// GET payments for a specific invoice
router.get('/invoice/:invoiceId', async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const payments = await db.all(`
      SELECT * FROM payments
      WHERE invoice_id = ?
      ORDER BY payment_date DESC
    `, [invoiceId]);
    res.json(payments || []);
  } catch (error) {
    console.error('Error fetching invoice payments:', error);
    next(error);
  }
});

// CREATE new payment
router.post('/', async (req, res, next) => {
  try {
    const {
      invoice_id,
      amount,
      payment_method,
      payment_date,
      transaction_id,
      notes
    } = req.body;

    if (!invoice_id || !amount) {
      return res.status(400).json({ error: 'Invoice ID and amount are required' });
    }

    // Get invoice details
    const invoice = await db.get('SELECT * FROM invoices WHERE id = ?', [invoice_id]);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Insert payment
    const result = await db.run(
      `INSERT INTO payments (invoice_id, amount, payment_method, payment_date, transaction_id, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        invoice_id,
        amount,
        payment_method || 'cash',
        payment_date || new Date().toISOString().split('T')[0],
        transaction_id,
        notes
      ]
    );

    // Calculate total paid for this invoice
    const paymentsSum = await db.get(`
      SELECT SUM(amount) as total_paid FROM payments WHERE invoice_id = ?
    `, [invoice_id]);

    const totalPaid = paymentsSum?.total_paid || 0;

    // Update invoice status based on payment
    let newStatus = 'pending';
    if (totalPaid >= invoice.amount) {
      newStatus = 'paid';
    } else if (totalPaid > 0) {
      newStatus = 'partial';
    }

    await db.run(
      'UPDATE invoices SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStatus, invoice_id]
    );

    // Get the newly created payment
    const newPayment = await db.get(
      'SELECT * FROM payments ORDER BY id DESC LIMIT 1'
    );

    res.status(201).json({
      ...newPayment,
      invoice_status: newStatus,
      total_paid: totalPaid
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    next(error);
  }
});

// UPDATE payment
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      invoice_id,
      amount,
      payment_method,
      payment_date,
      transaction_id,
      notes
    } = req.body;

    await db.run(
      `UPDATE payments
       SET invoice_id = ?, amount = ?, payment_method = ?,
           payment_date = ?, transaction_id = ?, notes = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [invoice_id, amount, payment_method, payment_date, transaction_id, notes, id]
    );

    // Recalculate invoice status
    if (invoice_id) {
      const invoice = await db.get('SELECT * FROM invoices WHERE id = ?', [invoice_id]);
      const paymentsSum = await db.get(`
        SELECT SUM(amount) as total_paid FROM payments WHERE invoice_id = ?
      `, [invoice_id]);

      const totalPaid = paymentsSum?.total_paid || 0;
      let newStatus = 'pending';
      if (totalPaid >= invoice.amount) {
        newStatus = 'paid';
      } else if (totalPaid > 0) {
        newStatus = 'partial';
      }

      await db.run(
        'UPDATE invoices SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newStatus, invoice_id]
      );
    }

    const updatedPayment = await db.get('SELECT * FROM payments WHERE id = ?', [id]);
    res.json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment:', error);
    next(error);
  }
});

// DELETE payment
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get payment details before deleting
    const payment = await db.get('SELECT * FROM payments WHERE id = ?', [id]);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    await db.run('DELETE FROM payments WHERE id = ?', [id]);

    // Recalculate invoice status
    const invoice = await db.get('SELECT * FROM invoices WHERE id = ?', [payment.invoice_id]);
    const paymentsSum = await db.get(`
      SELECT SUM(amount) as total_paid FROM payments WHERE invoice_id = ?
    `, [payment.invoice_id]);

    const totalPaid = paymentsSum?.total_paid || 0;
    let newStatus = 'pending';
    if (totalPaid >= invoice.amount) {
      newStatus = 'paid';
    } else if (totalPaid > 0) {
      newStatus = 'partial';
    }

    await db.run(
      'UPDATE invoices SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStatus, payment.invoice_id]
    );

    res.json({ message: 'Payment deleted successfully', id });
  } catch (error) {
    console.error('Error deleting payment:', error);
    next(error);
  }
});

export default router;
