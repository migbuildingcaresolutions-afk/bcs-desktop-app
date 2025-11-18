import { createTransport } from 'nodemailer';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';

dotenv.config();

// SMTP Transporter for sending emails
const transporter = createTransport({
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

// IMAP Configuration for receiving emails
const imapConfig = {
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.IMAP_HOST || 'imap.ionos.com',
  port: parseInt(process.env.IMAP_PORT) || 993,
  tls: process.env.IMAP_TLS !== 'false',
  tlsOptions: { rejectUnauthorized: false }
};

/**
 * Send an email
 */
export async function sendEmail({ to, subject, html, text, attachments = [] }) {
  try {
    const mailOptions = {
      from: `"Building Care Solutions" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

/**
 * Get recent emails from inbox
 */
export async function getRecentEmails(limit = 10) {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);
    const emails = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          imap.end();
          return reject(err);
        }

        const totalMessages = box.messages.total;
        if (totalMessages === 0) {
          imap.end();
          return resolve([]);
        }

        // Fetch last N messages
        const start = Math.max(1, totalMessages - limit + 1);
        const end = totalMessages;

        const fetch = imap.seq.fetch(`${start}:${end}`, {
          bodies: ['HEADER', 'TEXT'],
          struct: true
        });

        fetch.on('message', (msg, seqno) => {
          let emailData = { seqno };
          let buffer = '';

          msg.on('body', (stream, info) => {
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });

            stream.once('end', () => {
              if (info.which === 'HEADER') {
                simpleParser(buffer).then(parsed => {
                  emailData.from = parsed.from?.text || 'Unknown';
                  emailData.subject = parsed.subject || '(No Subject)';
                  emailData.date = parsed.date || new Date();
                }).catch(console.error);
              } else {
                simpleParser(buffer).then(parsed => {
                  emailData.text = parsed.text || '';
                  emailData.html = parsed.html || '';
                }).catch(console.error);
              }
            });
          });

          msg.once('end', () => {
            emails.push(emailData);
          });
        });

        fetch.once('error', reject);

        fetch.once('end', () => {
          imap.end();
          // Sort by seqno descending (newest first)
          emails.sort((a, b) => b.seqno - a.seqno);
          resolve(emails);
        });
      });
    });

    imap.once('error', (err) => {
      console.error('IMAP Error:', err);
      reject(err);
    });

    imap.connect();
  });
}

/**
 * Send invoice email to client
 */
export async function sendInvoiceEmail({ clientEmail, clientName, invoiceNumber, amount, dueDate, pdfAttachment }) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #06b6d4 100%); padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">BUILDING CARE SOLUTIONS</h1>
        <p style="color: #e0f2fe; margin: 10px 0 0 0;">We Take the Stress Out of Restoration</p>
      </div>

      <div style="padding: 40px; background: #f9fafb;">
        <h2 style="color: #1f2937;">Invoice ${invoiceNumber}</h2>
        <p style="color: #4b5563; font-size: 16px;">Dear ${clientName},</p>
        <p style="color: #4b5563; font-size: 16px;">
          Thank you for choosing Building Care Solutions. Please find attached your invoice for the services provided.
        </p>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 5px 0; color: #6b7280;"><strong>Invoice Number:</strong> ${invoiceNumber}</p>
          <p style="margin: 5px 0; color: #6b7280;"><strong>Amount Due:</strong> <span style="color: #1f2937; font-size: 20px; font-weight: bold;">$${amount.toLocaleString()}</span></p>
          <p style="margin: 5px 0; color: #6b7280;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
        </div>

        <p style="color: #4b5563; font-size: 16px;">
          If you have any questions regarding this invoice, please don't hesitate to contact us.
        </p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
            📍 8889 Caminito Plaza Centro, San Diego, CA 92122
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
            📞 858-573-7849
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
            ✉️ m19u3l@sd-bcs.com
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: clientEmail,
    subject: `Invoice ${invoiceNumber} from Building Care Solutions`,
    html,
    text: `Invoice ${invoiceNumber} - Amount Due: $${amount} - Due Date: ${new Date(dueDate).toLocaleDateString()}`,
    attachments: pdfAttachment ? [pdfAttachment] : []
  });
}

/**
 * Send past due reminder
 */
export async function sendPastDueReminder({ clientEmail, clientName, invoiceNumber, amount, daysOverdue }) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #f59e0b 100%); padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">⚠️ PAYMENT REMINDER</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0;">Building Care Solutions</p>
      </div>

      <div style="padding: 40px; background: #fef2f2;">
        <h2 style="color: #991b1b;">Past Due Invoice</h2>
        <p style="color: #4b5563; font-size: 16px;">Dear ${clientName},</p>
        <p style="color: #4b5563; font-size: 16px;">
          This is a friendly reminder that invoice ${invoiceNumber} is now <strong>${daysOverdue} days overdue</strong>.
        </p>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 5px 0; color: #6b7280;"><strong>Invoice Number:</strong> ${invoiceNumber}</p>
          <p style="margin: 5px 0; color: #dc2626;"><strong>Amount Due:</strong> <span style="font-size: 24px; font-weight: bold;">$${amount.toLocaleString()}</span></p>
          <p style="margin: 5px 0; color: #dc2626;"><strong>Days Overdue:</strong> ${daysOverdue} days</p>
        </div>

        <p style="color: #4b5563; font-size: 16px;">
          Please arrange payment at your earliest convenience. If you have any questions or concerns, please contact us immediately.
        </p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
            📞 858-573-7849 | ✉️ m19u3l@sd-bcs.com
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: clientEmail,
    subject: `⚠️ Past Due Reminder: Invoice ${invoiceNumber}`,
    html,
    text: `Your invoice ${invoiceNumber} is ${daysOverdue} days overdue. Amount due: $${amount}`
  });
}

export default {
  sendEmail,
  getRecentEmails,
  sendInvoiceEmail,
  sendPastDueReminder
};
