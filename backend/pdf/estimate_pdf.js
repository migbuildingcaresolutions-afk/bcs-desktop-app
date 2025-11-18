import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generate Estimate PDF
 * @param {Object} estimateData - Estimate data including line items
 * @param {String} outputPath - Path where PDF will be saved
 * @returns {Promise} - Resolves when PDF is generated
 */
export function generateEstimatePDF(estimateData, outputPath) {
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

      // Estimate Title
      doc.fontSize(20)
        .fillColor('#059669')
        .text('PROJECT ESTIMATE', { align: 'center' })
        .moveDown();

      // Estimate Details Section
      const estimateTopY = doc.y;

      // Left side - Client info
      doc.fontSize(10)
        .fillColor('#000000')
        .text('PREPARED FOR:', 50, estimateTopY, { underline: true });

      doc.fontSize(9)
        .fillColor('#333333')
        .text(estimateData.client_name || 'Client Name', 50, estimateTopY + 20)
        .text(estimateData.client_address || '', 50)
        .text(`${estimateData.client_city || ''} ${estimateData.client_state || ''} ${estimateData.client_zip || ''}`, 50)
        .text(estimateData.client_phone || '', 50)
        .text(estimateData.client_email || '', 50);

      // Right side - Estimate info
      doc.fontSize(10)
        .fillColor('#000000')
        .text('Estimate #:', 350, estimateTopY)
        .text('Estimate Date:', 350)
        .text('Valid Until:', 350)
        .text('Status:', 350);

      doc.fontSize(9)
        .fillColor('#333333')
        .text(estimateData.estimate_number || 'N/A', 450, estimateTopY)
        .text(estimateData.estimate_date || 'N/A', 450)
        .text(estimateData.valid_until || 'N/A', 450)
        .text(estimateData.status || 'Draft', 450);

      doc.moveDown(3);

      // Project Description
      if (estimateData.project_description) {
        doc.fontSize(10)
          .fillColor('#000000')
          .text('PROJECT DESCRIPTION:', 50, doc.y, { underline: true });

        doc.fontSize(9)
          .fillColor('#333333')
          .text(estimateData.project_description, 50, doc.y + 10, { width: 500 })
          .moveDown();
      }

      // Line Items Table
      const tableTop = doc.y + 20;
      const col1 = 50;
      const col2 = 250;
      const col3 = 350;
      const col4 = 420;
      const col5 = 500;

      // Table Header
      doc.rect(col1, tableTop - 5, 512, 25)
        .fillAndStroke('#059669', '#059669');

      doc.fontSize(10)
        .fillColor('#ffffff')
        .text('Description', col1 + 5, tableTop + 5, { width: 190 })
        .text('Qty', col2 + 5, tableTop + 5, { width: 40 })
        .text('Rate', col3 + 5, tableTop + 5, { width: 60 })
        .text('Amount', col5 + 5, tableTop + 5, { width: 60, align: 'right' });

      // Table Rows
      let yPosition = tableTop + 35;
      const lineItems = estimateData.line_items || [];

      doc.fillColor('#000000');
      lineItems.forEach((item, index) => {
        const rowBg = index % 2 === 0 ? '#f0fdf4' : '#ffffff';

        doc.rect(col1, yPosition - 5, 512, 25)
          .fillAndStroke(rowBg, '#d1fae5');

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
        .text(`$${parseFloat(estimateData.subtotal || 0).toFixed(2)}`, totalsX + 100, yPosition, { align: 'right' });

      yPosition += 20;
      doc.text('Tax:', totalsX, yPosition)
        .text(`$${parseFloat(estimateData.tax || 0).toFixed(2)}`, totalsX + 100, yPosition, { align: 'right' });

      yPosition += 20;
      doc.fontSize(12)
        .fillColor('#059669')
        .text('Total Estimate:', totalsX, yPosition, { underline: true })
        .text(`$${parseFloat(estimateData.total || 0).toFixed(2)}`, totalsX + 100, yPosition, { align: 'right', underline: true });

      // Terms & Conditions
      yPosition += 40;
      doc.fontSize(10)
        .fillColor('#000000')
        .text('TERMS & CONDITIONS:', 50, yPosition, { underline: true });

      const terms = estimateData.terms || 'This estimate is valid for 30 days from the date above. Final pricing may vary based on unforeseen conditions discovered during work. A 50% deposit is required to begin work.';

      doc.fontSize(9)
        .fillColor('#333333')
        .text(terms, 50, yPosition + 15, { width: 500 });

      // Notes Section
      if (estimateData.notes) {
        yPosition += 60;
        doc.fontSize(10)
          .fillColor('#000000')
          .text('NOTES:', 50, yPosition, { underline: true });

        doc.fontSize(9)
          .fillColor('#333333')
          .text(estimateData.notes, 50, yPosition + 15, { width: 500 });
      }

      // Footer
      doc.fontSize(8)
        .fillColor('#666666')
        .text(
          'This is an estimate only. Actual costs may vary.',
          50,
          doc.page.height - 100,
          { align: 'center' }
        )
        .text(
          'Please contact us with any questions about this estimate.',
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

export default generateEstimatePDF;
