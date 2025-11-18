import express from 'express';
import emailService from '../services/emailService.js';

const router = express.Router();

// Get recent emails from inbox
router.get('/inbox', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const emails = await emailService.getRecentEmails(limit);
    res.json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    next(error);
  }
});

// Send a generic email
router.post('/send', async (req, res, next) => {
  try {
    const { to, subject, html, text } = req.body;

    if (!to || !subject) {
      return res.status(400).json({ error: 'Missing required fields: to, subject' });
    }

    const result = await emailService.sendEmail({ to, subject, html, text });
    res.json(result);
  } catch (error) {
    console.error('Error sending email:', error);
    next(error);
  }
});

// Send invoice email
router.post('/send-invoice', async (req, res, next) => {
  try {
    const { clientEmail, clientName, invoiceNumber, amount, dueDate } = req.body;

    if (!clientEmail || !invoiceNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await emailService.sendInvoiceEmail({
      clientEmail,
      clientName,
      invoiceNumber,
      amount,
      dueDate
    });

    res.json(result);
  } catch (error) {
    console.error('Error sending invoice email:', error);
    next(error);
  }
});

// Send past due reminder
router.post('/send-past-due-reminder', async (req, res, next) => {
  try {
    const { clientEmail, clientName, invoiceNumber, amount, daysOverdue } = req.body;

    if (!clientEmail || !invoiceNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await emailService.sendPastDueReminder({
      clientEmail,
      clientName,
      invoiceNumber,
      amount,
      daysOverdue
    });

    res.json(result);
  } catch (error) {
    console.error('Error sending past due reminder:', error);
    next(error);
  }
});

export default router;
