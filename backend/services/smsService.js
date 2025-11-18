import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const client = twilio(accountSid, authToken);

const BCS_SIGNATURE = `

---
Building Care Solutions
📍 8889 Caminito Plaza Centro
   San Diego, CA 92122
📞 858-573-7849
📧 m19u3l@sd-bcs.com

Water Remediation • Mold Clearance
Full Reconstruction
Serving San Diego County`;

/**
 * Send SMS notification
 */
export const sendSMS = async (to, message) => {
  try {
    const fullMessage = `${message}${BCS_SIGNATURE}`;
    
    const response = await client.messages.create({
      body: fullMessage,
      messagingServiceSid: messagingServiceSid,
      to: to,
    });

    console.log('✅ SMS sent successfully:', response.sid);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error('❌ SMS sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send appointment reminder
 */
export const sendAppointmentReminder = async (clientPhone, appointment) => {
  const message = `Reminder: ${appointment.title}

Date: ${new Date(appointment.date).toLocaleDateString('en-US', { 
  weekday: 'long', 
  month: 'long', 
  day: 'numeric',
  year: 'numeric'
})}
Time: ${new Date(appointment.date).toLocaleTimeString('en-US', { 
  hour: '2-digit', 
  minute: '2-digit' 
})}

${appointment.description || ''}`;

  return await sendSMS(clientPhone, message);
};

/**
 * Send estimate notification
 */
export const sendEstimateNotification = async (clientPhone, estimateNumber) => {
  const message = `Your estimate #${estimateNumber} is ready!

Please check your email or contact us to review.`;

  return await sendSMS(clientPhone, message);
};

/**
 * Send invoice notification
 */
export const sendInvoiceNotification = async (clientPhone, invoiceNumber, amount) => {
  const message = `Invoice #${invoiceNumber} - $${amount}

Your invoice is ready. Payment link sent to your email.`;

  return await sendSMS(clientPhone, message);
};

/**
 * Send job completion notification
 */
export const sendJobCompletionNotification = async (clientPhone, jobNumber) => {
  const message = `Job #${jobNumber} Complete! ✅

Your project has been completed. 
Certificate of completion available.

Thank you for choosing BCS!`;

  return await sendSMS(clientPhone, message);
};

export default {
  sendSMS,
  sendAppointmentReminder,
  sendEstimateNotification,
  sendInvoiceNotification,
  sendJobCompletionNotification,
};
