import express from 'express';
import { 
  sendSMS, 
  sendAppointmentReminder, 
  sendEstimateNotification,
  sendInvoiceNotification,
  sendJobCompletionNotification 
} from '../services/smsService.js';

const router = express.Router();

// Send general SMS
router.post('/send', async (req, res) => {
  const { to, message } = req.body;
  
  if (!to || !message) {
    return res.status(400).json({ error: 'Phone number and message required' });
  }
  
  const result = await sendSMS(to, message);
  
  if (result.success) {
    res.json({ success: true, sid: result.sid });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

// Send appointment reminder
router.post('/appointment-reminder', async (req, res) => {
  const { clientPhone, appointment } = req.body;
  const result = await sendAppointmentReminder(clientPhone, appointment);
  res.json(result);
});

// Send estimate notification
router.post('/estimate', async (req, res) => {
  const { clientPhone, estimateNumber } = req.body;
  const result = await sendEstimateNotification(clientPhone, estimateNumber);
  res.json(result);
});

// Send invoice notification
router.post('/invoice', async (req, res) => {
  const { clientPhone, invoiceNumber, amount } = req.body;
  const result = await sendInvoiceNotification(clientPhone, invoiceNumber, amount);
  res.json(result);
});

// Send job completion notification
router.post('/job-complete', async (req, res) => {
  const { clientPhone, jobNumber } = req.body;
  const result = await sendJobCompletionNotification(clientPhone, jobNumber);
  res.json(result);
});

export default router;
