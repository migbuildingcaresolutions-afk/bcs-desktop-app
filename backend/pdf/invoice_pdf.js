import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generate Invoice PDF
 * @param {Object} invoiceData - Invoice data including line items
 * @param {String} outputPath - Path where PDF will be saved
 * @returns {Promise} - Resolves when PDF is generated
 */
export function generateInvoicePDF(invoiceData, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({ size: 'LETTER', margin: 50 });

      // Pipe to file
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Company Header
      doc.fontSize(24)
        .fillColor('#2563eb')
        .text('BCS RESTORATION', { align: 'center' });

      doc.fontSize(10)
        .fillColor('#666666')
        .text('Building Construction Services', { align: 'center' })
        .text('Professional Restoration & Reconstruction', { align: 'center' })
        .moveDown();

      doc.fontSize(9)
        .text('Phone: (555) 123-4567 | Email: info@bcsrestoration.com', { align: 'center' })
        .text('123 Business St, San Diego, CA 92101', { align: 'center' })
        .moveDown(2);

      // Invoice Title
      doc.fontSize(20)
        .fillColor('#1e40af')
        .text('INVOICE', { align: 'center' })
        .moveDown();

      // Invoice Details Section
      const invoiceTopY = doc.y;

      // Left side - Client info
      doc.fontSize(10)
        .fillColor('#000000')
        .text('BILL TO:', 50, invoiceTopY, { underline: true });

      doc.fontSize(9)
        .fillColor('#333333')
        .text(invoiceData.client_name || 'Client Name', 50, invoiceTopY + 20)
        .text(invoiceData.client_address || '', 50)
        .text(`${invoiceData.client_city || ''} ${invoiceData.client_state || ''} ${invoiceData.client_zip || ''}`, 50)
        .text(invoiceData.client_phone || '', 50)
        .text(invoiceData.client_email || '', 50);

      // Right side - Invoice info
      doc.fontSize(10)
        .fillColor('#000000')
        .text('Invoice #:', 350, invoiceTopY)
        .text('Invoice Date:', 350)
        .text('Due Date:', 350)
        .text('Status:', 350);

      doc.fontSize(9)
        .fillColor('#333333')
        .text(invoiceData.invoice_number || 'N/A', 450, invoiceTopY)
        .text(invoiceData.invoice_date || 'N/A', 450)
        .text(invoiceData.due_date || 'N/A', 450)
        .text(invoiceData.status || 'Pending', 450);

      doc.moveDown(3);

      // Line Items Table
      const tableTop = doc.y + 20;
      const col1 = 50;
      const col2 = 250;
      const col3 = 350;
      const col4 = 420;
      const col5 = 500;

      // Table Header
      doc.rect(col1, tableTop - 5, 512, 25)
        .fillAndStroke('#2563eb', '#2563eb');

      doc.fontSize(10)
        .fillColor('#ffffff')
        .text('Description', col1 + 5, tableTop + 5, { width: 190 })
        .text('Qty', col2 + 5, tableTop + 5, { width: 40 })
        .text('Rate', col3 + 5, tableTop + 5, { width: 60 })
        .text('Amount', col5 + 5, tableTop + 5, { width: 60, align: 'right' });

      // Table Rows
      let yPosition = tableTop + 35;
      const lineItems = invoiceData.line_items || [];

      doc.fillColor('#000000');
      lineItems.forEach((item, index) => {
        const rowBg = index % 2 === 0 ? '#f8fafc' : '#ffffff';

        doc.rect(col1, yPosition - 5, 512, 25)
          .fillAndStroke(rowBg, '#e2e8f0');

        doc.fontSize(9)
          .fillColor('#333333')
          .text(item.description || '', col1 + 5, yPosition, { width: 190 })
          .text(item.quantity || 1, col2 + 5, yPosition, { width: 40 })
          .text(`$${parseFloat(item.rate || 0).toFixed(2)}`, col3 + 5, yPosition, { width: 60 })
          .text(`$${parseFloat(item.amount || 0).toFixed(2)}`, col5 + 5, yPosition, { width: 60, align: 'right' });

        yPosition += 30;

        // Add new page if needed
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }
      });

      // Totals Section
      yPosition += 10;
      const totalsX = 400;

      doc.fontSize(10)
        .fillColor('#000000')
        .text('Subtotal:', totalsX, yPosition)
        .text(`$${parseFloat(invoiceData.subtotal || 0).toFixed(2)}`, totalsX + 100, yPosition, { align: 'right' });

      yPosition += 20;
      doc.text('Tax:', totalsX, yPosition)
        .text(`$${parseFloat(invoiceData.tax || 0).toFixed(2)}`, totalsX + 100, yPosition, { align: 'right' });

      yPosition += 20;
      doc.fontSize(12)
        .fillColor('#1e40af')
        .text('Total:', totalsX, yPosition, { underline: true })
        .text(`$${parseFloat(invoiceData.total || 0).toFixed(2)}`, totalsX + 100, yPosition, { align: 'right', underline: true });

      // Notes Section
      if (invoiceData.notes) {
        yPosition += 40;
        doc.fontSize(10)
          .fillColor('#000000')
          .text('Notes:', 50, yPosition, { underline: true });

        doc.fontSize(9)
          .fillColor('#333333')
          .text(invoiceData.notes, 50, yPosition + 15, { width: 500 });
      }

      // Footer
      doc.fontSize(8)
        .fillColor('#666666')
        .text(
          'Thank you for your business!',
          50,
          doc.page.height - 100,
          { align: 'center' }
        )
        .text(
          'Payment terms: Net 30 days | Late fees may apply',
          50,
          doc.page.height - 85,
          { align: 'center' }
        );

      // Finalize PDF
      doc.end();

      stream.on('finish', () => {
        resolve(outputPath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export default generateInvoicePDF;
