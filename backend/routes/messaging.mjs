import express from 'express';
import messagingService from '../services/messagingService.js';

const router = express.Router();

// Send bulk email
router.post('/bulk-email', async (req, res, next) => {
  try {
    const { clientIds, subject, message, htmlMessage } = req.body;

    if (!clientIds || clientIds.length === 0) {
      return res.status(400).json({ error: 'No clients selected' });
    }

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    const results = await messagingService.sendBulkEmail({
      clientIds,
      subject,
      message,
      htmlMessage
    });

    res.json({
      message: 'Bulk email sent',
      sent: results.success.length,
      failed: results.failed.length,
      results
    });
  } catch (error) {
    console.error('Error sending bulk email:', error);
    next(error);
  }
});

// Send bulk SMS
router.post('/bulk-sms', async (req, res, next) => {
  try {
    const { clientIds, message } = req.body;

    if (!clientIds || clientIds.length === 0) {
      return res.status(400).json({ error: 'No clients selected' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const results = await messagingService.sendBulkSMS({
      clientIds,
      message
    });

    res.json({
      message: 'Bulk SMS sent',
      sent: results.success.length,
      failed: results.failed.length,
      results
    });
  } catch (error) {
    console.error('Error sending bulk SMS:', error);
    next(error);
  }
});

// Send both email and SMS
router.post('/bulk-message', async (req, res, next) => {
  try {
    const { clientIds, emailSubject, emailMessage, smsMessage, sendEmail, sendSMS } = req.body;

    if (!clientIds || clientIds.length === 0) {
      return res.status(400).json({ error: 'No clients selected' });
    }

    if (!sendEmail && !sendSMS) {
      return res.status(400).json({ error: 'Select at least one messaging method (email or SMS)' });
    }

    const results = await messagingService.sendBulkMessage({
      clientIds,
      emailSubject,
      emailMessage,
      smsMessage,
      sendEmail,
      sendSMS
    });

    const totalSent = (results.email?.success?.length || 0) + (results.sms?.success?.length || 0);
    const totalFailed = (results.email?.failed?.length || 0) + (results.sms?.failed?.length || 0);

    res.json({
      message: 'Bulk message sent',
      sent: totalSent,
      failed: totalFailed,
      results
    });
  } catch (error) {
    console.error('Error sending bulk message:', error);
    next(error);
  }
});

// Get email templates
router.get('/templates', (req, res) => {
  res.json(messagingService.emailTemplates);
});

export default router;
