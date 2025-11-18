import htmlPdf from 'html-pdf-node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRINT_OUTPUT_DIR = path.join(__dirname, '../prints');

// Ensure prints directory exists
if (!fs.existsSync(PRINT_OUTPUT_DIR)) {
  fs.mkdirSync(PRINT_OUTPUT_DIR, { recursive: true });
}

/**
 * Print Service - Generate printable PDFs from HTML
 */

/**
 * Generate PDF from HTML content
 */
export async function generatePDF(htmlContent, filename, options = {}) {
  try {
    const defaultOptions = {
      format: 'Letter',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      printBackground: true,
      ...options
    };

    const file = { content: htmlContent };
    const pdfBuffer = await htmlPdf.generatePdf(file, defaultOptions);

    const outputPath = path.join(PRINT_OUTPUT_DIR, filename);
    fs.writeFileSync(outputPath, pdfBuffer);

    return {
      success: true,
      filename,
      path: outputPath,
      size: pdfBuffer.length
    };
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}

/**
 * Generate printable invoice
 */
export async function printInvoice(invoice, client, lineItems = []) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #333; }
        .container { padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 20px; }
        .company-name { font-size: 28px; font-weight: bold; color: #1e40af; margin-bottom: 5px; }
        .tagline { font-size: 14px; color: #06b6d4; margin-bottom: 10px; }
        .contact { font-size: 11px; color: #666; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-box { padding: 15px; background: #f9fafb; border-left: 4px solid #3b82f6; }
        .info-label { font-weight: bold; color: #666; font-size: 11px; margin-bottom: 3px; }
        .info-value { font-size: 13px; color: #111; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #1e40af; color: white; padding: 12px; text-align: left; font-size: 11px; }
        td { padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
        tr:nth-child(even) { background: #f9fafb; }
        .totals { margin-top: 20px; float: right; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .total-label { font-weight: bold; }
        .grand-total { background: #1e40af; color: white; padding: 12px; margin-top: 5px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 11px; color: #666; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; }
        .status-paid { background: #d1fae5; color: #065f46; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-overdue { background: #fee2e2; color: #991b1b; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="company-name">BUILDING CARE SOLUTIONS</div>
          <div class="tagline">We Take the Stress Out of Restoration</div>
          <div class="contact">
            8889 Caminito Plaza Centro, San Diego, CA 92122 |
            Phone: 858-573-7849 | Email: m19u3l@sd-bcs.com
          </div>
        </div>

        <!-- Invoice Title -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 32px; color: #1e40af;">INVOICE</h1>
          <div style="margin-top: 10px;">
            <span class="status-badge status-${invoice.status}">${invoice.status.toUpperCase()}</span>
          </div>
        </div>

        <!-- Invoice & Client Info -->
        <div class="info-grid">
          <div class="info-box">
            <div class="info-label">Invoice Number</div>
            <div class="info-value">${invoice.invoice_number}</div>
            <div class="info-label" style="margin-top: 10px;">Invoice Date</div>
            <div class="info-value">${new Date(invoice.created_at).toLocaleDateString()}</div>
            <div class="info-label" style="margin-top: 10px;">Due Date</div>
            <div class="info-value">${new Date(invoice.due_date).toLocaleDateString()}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Bill To</div>
            <div class="info-value" style="font-weight: bold;">${client.name}</div>
            ${client.company ? `<div class="info-value">${client.company}</div>` : ''}
            ${client.address ? `<div class="info-value">${client.address}</div>` : ''}
            ${client.city ? `<div class="info-value">${client.city}, ${client.state} ${client.zip}</div>` : ''}
            ${client.email ? `<div class="info-value" style="margin-top: 5px;">${client.email}</div>` : ''}
            ${client.phone ? `<div class="info-value">${client.phone}</div>` : ''}
          </div>
        </div>

        <!-- Line Items -->
        <div class="section">
          <div class="section-title">Items & Services</div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right; width: 100px;">Quantity</th>
                <th style="text-align: right; width: 120px;">Unit Price</th>
                <th style="text-align: right; width: 120px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${lineItems.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td style="text-align: right;">${item.quantity}</td>
                  <td style="text-align: right;">$${parseFloat(item.unit_price).toFixed(2)}</td>
                  <td style="text-align: right;">$${parseFloat(item.total).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="totals">
          <div class="total-row">
            <div class="total-label">Subtotal:</div>
            <div>$${parseFloat(invoice.amount).toFixed(2)}</div>
          </div>
          <div class="total-row">
            <div class="total-label">Tax (0%):</div>
            <div>$0.00</div>
          </div>
          <div class="total-row grand-total">
            <div style="font-size: 16px; font-weight: bold;">TOTAL DUE:</div>
            <div style="font-size: 18px; font-weight: bold;">$${parseFloat(invoice.amount).toFixed(2)}</div>
          </div>
        </div>

        <div style="clear: both;"></div>

        <!-- Payment Terms -->
        <div class="section" style="margin-top: 40px;">
          <div class="section-title">Payment Terms</div>
          <p>Payment is due within ${invoice.payment_terms || '30'} days of invoice date.</p>
          <p style="margin-top: 10px;">Please make checks payable to <strong>Building Care Solutions</strong></p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Thank you for your business!</p>
          <p style="margin-top: 5px;">For questions about this invoice, please contact us at 858-573-7849</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const filename = `invoice-${invoice.invoice_number}-${Date.now()}.pdf`;
  return await generatePDF(html, filename);
}

/**
 * Generate printable estimate
 */
export async function printEstimate(estimate, client, lineItems = []) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #333; }
        .container { padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #059669; padding-bottom: 20px; }
        .company-name { font-size: 28px; font-weight: bold; color: #059669; margin-bottom: 5px; }
        .tagline { font-size: 14px; color: #10b981; margin-bottom: 10px; }
        .contact { font-size: 11px; color: #666; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #059669; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-box { padding: 15px; background: #f0fdf4; border-left: 4px solid #10b981; }
        .info-label { font-weight: bold; color: #666; font-size: 11px; margin-bottom: 3px; }
        .info-value { font-size: 13px; color: #111; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #059669; color: white; padding: 12px; text-align: left; font-size: 11px; }
        td { padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
        tr:nth-child(even) { background: #f9fafb; }
        .totals { margin-top: 20px; float: right; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .total-label { font-weight: bold; }
        .grand-total { background: #059669; color: white; padding: 12px; margin-top: 5px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 11px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="company-name">BUILDING CARE SOLUTIONS</div>
          <div class="tagline">Professional Restoration Estimate</div>
          <div class="contact">
            8889 Caminito Plaza Centro, San Diego, CA 92122 |
            Phone: 858-573-7849 | Email: m19u3l@sd-bcs.com
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 32px; color: #059669;">ESTIMATE</h1>
        </div>

        <div class="info-grid">
          <div class="info-box">
            <div class="info-label">Estimate Number</div>
            <div class="info-value">${estimate.estimate_number}</div>
            <div class="info-label" style="margin-top: 10px;">Estimate Date</div>
            <div class="info-value">${new Date(estimate.created_at).toLocaleDateString()}</div>
            <div class="info-label" style="margin-top: 10px;">Valid Until</div>
            <div class="info-value">${estimate.valid_until ? new Date(estimate.valid_until).toLocaleDateString() : 'N/A'}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Prepared For</div>
            <div class="info-value" style="font-weight: bold;">${client.name}</div>
            ${client.company ? `<div class="info-value">${client.company}</div>` : ''}
            ${client.address ? `<div class="info-value">${client.address}</div>` : ''}
            ${client.email ? `<div class="info-value" style="margin-top: 5px;">${client.email}</div>` : ''}
            ${client.phone ? `<div class="info-value">${client.phone}</div>` : ''}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Scope of Work</div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right; width: 100px;">Quantity</th>
                <th style="text-align: right; width: 120px;">Unit Price</th>
                <th style="text-align: right; width: 120px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${lineItems.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td style="text-align: right;">${item.quantity}</td>
                  <td style="text-align: right;">$${parseFloat(item.unit_price).toFixed(2)}</td>
                  <td style="text-align: right;">$${parseFloat(item.total).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="totals">
          <div class="total-row grand-total">
            <div style="font-size: 16px; font-weight: bold;">ESTIMATED TOTAL:</div>
            <div style="font-size: 18px; font-weight: bold;">$${parseFloat(estimate.amount).toFixed(2)}</div>
          </div>
        </div>

        <div style="clear: both;"></div>

        <div class="section" style="margin-top: 40px;">
          <div class="section-title">Terms & Conditions</div>
          <p>This estimate is valid for 30 days from the date above.</p>
          <p style="margin-top: 5px;">Prices are subject to change based on unforeseen conditions.</p>
        </div>

        <div class="footer">
          <p>Thank you for considering Building Care Solutions!</p>
          <p style="margin-top: 5px;">Contact us at 858-573-7849 with any questions</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const filename = `estimate-${estimate.estimate_number}-${Date.now()}.pdf`;
  return await generatePDF(html, filename);
}

export default {
  generatePDF,
  printInvoice,
  printEstimate
};
