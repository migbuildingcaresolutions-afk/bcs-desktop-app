import { createTransport } from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';
import db from '../db.js';

dotenv.config();

// Email transporter
const emailTransporter = createTransport({
  host: process.env.SMTP_HOST || 'smtp.ionos.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Twilio client (will only work if credentials are provided)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'your_account_sid_here') {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

/**
 * Send bulk emails to multiple clients
 */
export async function sendBulkEmail({ clientIds, subject, message, htmlMessage }) {
  try {
    // Get clients
    const clients = await db.all(
      `SELECT * FROM clients WHERE id IN (${clientIds.map(() => '?').join(',')})`,
      clientIds
    );

    const results = {
      success: [],
      failed: []
    };

    // Send email to each client
    for (const client of clients) {
      try {
        await emailTransporter.sendMail({
          from: `"Building Care Solutions" <${process.env.EMAIL_USER}>`,
          to: client.email,
          subject,
          text: message,
          html: htmlMessage || generateMarketingEmailHTML(client.name, message)
        });

        results.success.push({ clientId: client.id, name: client.name, email: client.email });
      } catch (error) {
        console.error(`Failed to send email to ${client.email}:`, error);
        results.failed.push({ clientId: client.id, name: client.name, email: client.email, error: error.message });
      }
    }

    return results;
  } catch (error) {
    console.error('Bulk email error:', error);
    throw error;
  }
}

/**
 * Send bulk SMS to multiple clients
 */
export async function sendBulkSMS({ clientIds, message }) {
  if (!twilioClient) {
    throw new Error('Twilio not configured. Please add your Twilio credentials to .env file');
  }

  try {
    // Get clients with phone numbers
    const clients = await db.all(
      `SELECT * FROM clients WHERE id IN (${clientIds.map(() => '?').join(',')}) AND phone IS NOT NULL`,
      clientIds
    );

    const results = {
      success: [],
      failed: []
    };

    // Send SMS to each client
    for (const client of clients) {
      try {
        // Clean phone number (remove formatting)
        const phoneNumber = client.phone.replace(/[^\d+]/g, '');

        await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber
        });

        results.success.push({ clientId: client.id, name: client.name, phone: client.phone });
      } catch (error) {
        console.error(`Failed to send SMS to ${client.phone}:`, error);
        results.failed.push({ clientId: client.id, name: client.name, phone: client.phone, error: error.message });
      }
    }

    return results;
  } catch (error) {
    console.error('Bulk SMS error:', error);
    throw error;
  }
}

/**
 * Send both email and SMS to clients
 */
export async function sendBulkMessage({ clientIds, emailSubject, emailMessage, smsMessage, sendEmail, sendSMS }) {
  const results = {
    email: null,
    sms: null
  };

  if (sendEmail) {
    results.email = await sendBulkEmail({
      clientIds,
      subject: emailSubject,
      message: emailMessage
    });
  }

  if (sendSMS && twilioClient) {
    results.sms = await sendBulkSMS({
      clientIds,
      message: smsMessage
    });
  }

  return results;
}

/**
 * Generate HTML for marketing email
 */
function generateMarketingEmailHTML(clientName, message) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1e40af 0%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">
                    BUILDING CARE SOLUTIONS
                  </h1>
                  <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">
                    We Take the Stress Out of Restoration
                  </p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="color: #1f2937; font-size: 18px; margin: 0 0 20px 0;">
                    Hello ${clientName || 'Valued Customer'},
                  </p>

                  <div style="color: #4b5563; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
                    ${message}
                  </div>
                </td>
              </tr>

              <!-- CTA Button (optional) -->
              <tr>
                <td style="padding: 0 30px 40px 30px; text-align: center;">
                  <a href="tel:858-573-7849" style="display: inline-block; background-color: #3b82f6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                    📞 Call Us: 858-573-7849
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="text-align: center; color: #6b7280; font-size: 14px;">
                        <p style="margin: 0 0 10px 0;">
                          <strong>Building Care Solutions</strong>
                        </p>
                        <p style="margin: 0 0 5px 0;">
                          📍 8889 Caminito Plaza Centro, San Diego, CA 92122
                        </p>
                        <p style="margin: 0 0 5px 0;">
                          📞 858-573-7849
                        </p>
                        <p style="margin: 0 0 5px 0;">
                          ✉️ m19u3l@sd-bcs.com
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Get email templates
 */
export const emailTemplates = {
  promotion: {
    subject: '🎉 Special Offer from Building Care Solutions',
    message: `We\'re excited to offer you an exclusive promotion!\n\nAs a valued customer, you\'re entitled to special pricing on our restoration services. Contact us today to learn more about how we can help with your next project.\n\nDon\'t miss out on this limited-time offer!`
  },
  seasonal: {
    subject: '🌟 Seasonal Maintenance Reminder',
    message: `It\'s time for your seasonal property maintenance check!\n\nAt Building Care Solutions, we recommend regular inspections to prevent costly repairs. Our team is ready to help ensure your property stays in top condition.\n\nSchedule your inspection today!`
  },
  followUp: {
    subject: '👋 We\'d Love to Hear From You',
    message: `Thank you for choosing Building Care Solutions!\n\nWe hope you were satisfied with our service. We\'d love to hear your feedback and are here if you need any additional assistance.\n\nYour satisfaction is our priority!`
  },
  emergency: {
    subject: '🚨 24/7 Emergency Service Available',
    message: `Water damage? Fire damage? We\'re here to help 24/7!\n\nBuilding Care Solutions offers emergency restoration services whenever you need us. Don\'t wait - every minute counts in an emergency.\n\nCall us now: 858-573-7849`
  }
};

export default {
  sendBulkEmail,
  sendBulkSMS,
  sendBulkMessage,
  emailTemplates
};
