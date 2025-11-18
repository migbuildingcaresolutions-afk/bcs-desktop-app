import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generate Certificate of Completion PDF
 * @param {Object} certificateData - Certificate data
 * @param {String} outputPath - Path where PDF will be saved
 * @returns {Promise} - Resolves when PDF is generated
 */
export function generateCertificatePDF(certificateData, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document in landscape for certificate
      const doc = new PDFDocument({
        size: 'LETTER',
        layout: 'landscape',
        margin: 50
      });

      // Pipe to file
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Decorative border
      doc.lineWidth(3)
        .strokeColor('#2563eb')
        .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .stroke();

      doc.lineWidth(1)
        .strokeColor('#93c5fd')
        .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
        .stroke();

      // Company Header
      doc.fontSize(18)
        .fillColor('#2563eb')
        .text('BCS RESTORATION', 0, 80, { align: 'center' });

      doc.fontSize(10)
        .fillColor('#666666')
        .text('Building Construction Services', 0, 105, { align: 'center' })
        .text('Professional Restoration & Reconstruction', 0, 120, { align: 'center' })
        .moveDown(2);

      // Certificate Title
      doc.fontSize(32)
        .fillColor('#1e40af')
        .text('CERTIFICATE OF COMPLETION', 0, 160, { align: 'center' })
        .moveDown(2);

      // Certificate Number
      doc.fontSize(10)
        .fillColor('#666666')
        .text(`Certificate No: ${certificateData.certificate_number || 'N/A'}`, 0, 210, { align: 'center' })
        .moveDown(2);

      // Main Content
      const centerX = doc.page.width / 2;
      let yPosition = 250;

      doc.fontSize(12)
        .fillColor('#000000')
        .text('This certifies that the following project has been completed:', 0, yPosition, { align: 'center' });

      yPosition += 40;

      // Client Information
      doc.fontSize(14)
        .fillColor('#2563eb')
        .text(certificateData.client_name || 'Client Name', 0, yPosition, { align: 'center' });

      yPosition += 30;

      // Project Details Box
      const boxWidth = 500;
      const boxHeight = 120;
      const boxX = centerX - (boxWidth / 2);

      doc.rect(boxX, yPosition, boxWidth, boxHeight)
        .fillAndStroke('#f8fafc', '#cbd5e1');

      yPosition += 15;

      doc.fontSize(11)
        .fillColor('#000000')
        .text('PROJECT DETAILS', 0, yPosition, { align: 'center', underline: true });

      yPosition += 25;

      const leftCol = boxX + 30;
      const rightCol = boxX + 270;

      doc.fontSize(10)
        .fillColor('#666666')
        .text('Certificate Type:', leftCol, yPosition)
        .fillColor('#000000')
        .text(certificateData.certificate_type || 'Completion', rightCol, yPosition);

      yPosition += 20;

      doc.fillColor('#666666')
        .text('Issue Date:', leftCol, yPosition)
        .fillColor('#000000')
        .text(certificateData.issue_date || 'N/A', rightCol, yPosition);

      yPosition += 20;

      doc.fillColor('#666666')
        .text('Work Order:', leftCol, yPosition)
        .fillColor('#000000')
        .text(certificateData.work_order_number || 'N/A', rightCol, yPosition);

      // Description
      if (certificateData.description) {
        yPosition += 50;

        doc.fontSize(11)
          .fillColor('#000000')
          .text('SCOPE OF WORK:', 0, yPosition, { align: 'center', underline: true });

        yPosition += 25;

        doc.fontSize(10)
          .fillColor('#333333')
          .text(certificateData.description, boxX + 20, yPosition, {
            width: boxWidth - 40,
            align: 'left'
          });
      }

      // Issued By Section
      yPosition = doc.page.height - 180;

      doc.fontSize(10)
        .fillColor('#666666')
        .text('Issued by:', leftCol, yPosition);

      yPosition += 25;

      doc.fontSize(11)
        .fillColor('#000000')
        .text(certificateData.issued_by || 'BCS Restoration', leftCol, yPosition);

      // Signature Line
      yPosition += 35;
      doc.moveTo(leftCol, yPosition)
        .lineTo(leftCol + 200, yPosition)
        .stroke();

      doc.fontSize(9)
        .fillColor('#666666')
        .text('Authorized Signature', leftCol, yPosition + 5);

      // Date on right side
      yPosition = doc.page.height - 180;

      doc.fontSize(10)
        .fillColor('#666666')
        .text('Date:', rightCol, yPosition);

      yPosition += 25;

      doc.fontSize(11)
        .fillColor('#000000')
        .text(certificateData.issue_date || new Date().toLocaleDateString(), rightCol, yPosition);

      // Date Line
      yPosition += 35;
      doc.moveTo(rightCol, yPosition)
        .lineTo(rightCol + 150, yPosition)
        .stroke();

      doc.fontSize(9)
        .fillColor('#666666')
        .text('Date Issued', rightCol, yPosition + 5);

      // Footer
      doc.fontSize(8)
        .fillColor('#666666')
        .text(
          'BCS Restoration | 123 Business St, San Diego, CA 92101 | (555) 123-4567 | info@bcsrestoration.com',
          0,
          doc.page.height - 60,
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

export default generateCertificatePDF;
