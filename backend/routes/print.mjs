import express from 'express';
import db from '../db.js';
import printService from '../services/printService.js';

const router = express.Router();

// POST /api/print/invoice/:id
router.post('/invoice/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get invoice
    const invoice = await db.get('SELECT * FROM invoices WHERE id = ?', [id]);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Get client
    const client = await db.get('SELECT * FROM clients WHERE id = ?', [invoice.client_id]);

    // Get line items
    const lineItems = await db.all(
      'SELECT * FROM invoice_line_items WHERE invoice_id = ?',
      [id]
    );

    // Generate PDF
    const result = await printService.printInvoice(invoice, client, lineItems);

    res.json(result);
  } catch (error) {
    console.error('Print invoice error:', error);
    next(error);
  }
});

// POST /api/print/estimate/:id
router.post('/estimate/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get estimate
    const estimate = await db.get('SELECT * FROM estimates WHERE id = ?', [id]);
    if (!estimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    // Get client
    const client = await db.get('SELECT * FROM clients WHERE id = ?', [estimate.client_id]);

    // Get line items
    const lineItems = await db.all(
      'SELECT * FROM estimate_line_items WHERE estimate_id = ?',
      [id]
    );

    // Generate PDF
    const result = await printService.printEstimate(estimate, client, lineItems);

    res.json(result);
  } catch (error) {
    console.error('Print estimate error:', error);
    next(error);
  }
});

// GET /api/print/download/:filename
router.get('/download/:filename', (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = `/Users/k4n3/Projects/bcs-desktop-app/backend/prints/${filename}`;

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
