/**
 * Professional Print Templates for BCS Desktop App
 * Includes CSS styling, company branding, and legal disclaimers
 */

const COMPANY_INFO = {
  name: 'Building Care Solutions',
  tagline: 'Professional Water Damage Restoration & Reconstruction',
  address: '8889 Caminito Plaza Centro',
  city: 'San Diego, CA 92122',
  phone: '858-573-7849',
  email: 'm19u3l@sd-bcs.com',
  website: 'www.sd-bcs.com',
  license: 'CA License #1234567',
};

const PRINT_CSS = `
<style>
  @page {
    margin: 0;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 10pt;
    line-height: 1.5;
    color: #1a1a1a;
    background: #ffffff;
  }

  .page-wrapper {
    max-width: 8.5in;
    margin: 0 auto;
    background: white;
    position: relative;
  }

  /* Modern Header with Side Accent */
  .header {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    color: white;
    padding: 50px 60px;
    position: relative;
    overflow: hidden;
  }

  .header::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
    opacity: 0.15;
    clip-path: polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%);
  }

  .header-content {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 40px;
    align-items: center;
  }

  .company-branding h1 {
    font-size: 32pt;
    margin-bottom: 8px;
    font-weight: 700;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .company-branding .tagline {
    font-size: 11pt;
    color: #94a3b8;
    margin-bottom: 20px;
    font-weight: 400;
  }

  .company-branding .contact {
    font-size: 9pt;
    color: #cbd5e1;
    line-height: 1.8;
  }

  .company-branding .contact-item {
    display: inline-block;
    margin-right: 20px;
  }

  .document-badge {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 11pt;
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
  }

  .content-wrapper {
    padding: 50px 60px;
  }

  .document-title {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 3px solid #f1f5f9;
  }

  .document-title h2 {
    font-size: 24pt;
    color: #0f172a;
    margin-bottom: 5px;
    font-weight: 700;
  }

  .document-title .doc-number {
    font-size: 11pt;
    color: #64748b;
    font-weight: 500;
  }

  .document-info {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 30px;
    margin-bottom: 40px;
  }

  .info-box {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 25px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .info-box h3 {
    font-size: 10pt;
    color: #3b82f6;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
  }

  .info-box p {
    margin: 8px 0;
    font-size: 10pt;
    color: #1e293b;
  }

  .info-label {
    font-weight: 600;
    color: #64748b;
    min-width: 110px;
    display: inline-block;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .details-section {
    margin: 35px 0;
  }

  .details-section h3 {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: white;
    padding: 14px 20px;
    font-size: 11pt;
    margin-bottom: 20px;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.3px;
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.1);
  }

  .details-content {
    padding: 20px;
    background: #fafafa;
    border-left: 4px solid #3b82f6;
    border-radius: 6px;
    white-space: pre-wrap;
    line-height: 1.7;
    color: #334155;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 20px 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  th {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: white;
    padding: 14px 16px;
    text-align: left;
    font-size: 9pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 10pt;
    color: #334155;
  }

  tbody tr {
    background: white;
    transition: background 0.2s;
  }

  tbody tr:nth-child(even) {
    background: #f8fafc;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .total-section {
    margin-top: 50px;
    display: flex;
    justify-content: flex-end;
  }

  .total-box {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    color: white;
    padding: 30px 40px;
    border-radius: 12px;
    min-width: 350px;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.3);
    position: relative;
    overflow: hidden;
  }

  .total-box::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 150px;
    height: 100%;
    background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
    opacity: 0.15;
    clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%);
  }

  .total-label {
    font-size: 11pt;
    margin-bottom: 8px;
    color: #cbd5e1;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
  }

  .total-amount {
    font-size: 32pt;
    font-weight: 700;
    letter-spacing: -1px;
    position: relative;
    z-index: 1;
  }

  .disclaimer {
    margin-top: 50px;
    padding: 30px;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    border-left: 6px solid #f59e0b;
    border-radius: 12px;
    font-size: 9pt;
    line-height: 1.7;
    box-shadow: 0 4px 6px rgba(245, 158, 11, 0.1);
    position: relative;
    overflow: hidden;
  }

  .disclaimer::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100%;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    opacity: 0.05;
  }

  .disclaimer h4 {
    color: #92400e;
    font-size: 12pt;
    margin-bottom: 15px;
    font-weight: 700;
    letter-spacing: 0.3px;
    position: relative;
    z-index: 1;
  }

  .disclaimer p {
    margin: 12px 0;
    color: #78350f;
    position: relative;
    z-index: 1;
    padding-left: 5px;
  }

  .disclaimer p strong {
    color: #92400e;
    font-weight: 600;
  }

  .footer {
    margin-top: 60px;
    padding: 40px 60px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-top: 4px solid #3b82f6;
    text-align: center;
    font-size: 9pt;
    color: #64748b;
    border-radius: 12px 12px 0 0;
  }

  .footer p {
    margin: 8px 0;
    line-height: 1.6;
  }

  .footer p:first-child {
    font-size: 11pt;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 12px;
  }

  .footer p:last-child {
    margin-top: 20px;
    font-size: 8pt;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
    padding-top: 15px;
  }

  .signature-section {
    margin-top: 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    padding: 0 20px;
  }

  .signature-box {
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 30px 25px 20px 25px;
    position: relative;
    min-height: 100px;
  }

  .signature-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
    border-radius: 12px 12px 0 0;
  }

  .signature-box p {
    margin: 8px 0;
    font-size: 9pt;
    color: #475569;
    line-height: 1.6;
  }

  .signature-box p:first-of-type {
    font-weight: 700;
    color: #1e293b;
    font-size: 10pt;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .badge {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 9pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid transparent;
  }

  .badge-pending {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
    border-color: #fbbf24;
  }

  .badge-paid {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
    border-color: #10b981;
  }

  .badge-overdue {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #991b1b;
    border-color: #f87171;
  }

  .badge-completed {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
    border-color: #10b981;
  }

  .badge-in-progress {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1e40af;
    border-color: #3b82f6;
  }

  .badge-high {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #991b1b;
    border-color: #f87171;
  }

  .badge-medium {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
    border-color: #fbbf24;
  }

  .badge-low {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
    border-color: #10b981;
  }

  @media print {
    .no-print { display: none; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  }
</style>
`;

const LEGAL_DISCLAIMERS = {
  invoice: `
    <div class="disclaimer">
      <h4>⚠️ Payment Terms & Conditions</h4>
      <p><strong>Payment Due:</strong> Net 30 days from invoice date. Late payments subject to 1.5% monthly interest charge.</p>
      <p><strong>Lien Rights:</strong> Building Care Solutions reserves the right to file a mechanic's lien for unpaid services in accordance with California Civil Code Section 8400 et seq.</p>
      <p><strong>Collection:</strong> Client agrees to pay all collection costs and reasonable attorney fees if legal action is required.</p>
      <p><strong>Warranty:</strong> All work is guaranteed for 1 year from completion date. Customer must provide written notice of defects within warranty period.</p>
      <p><strong>Dispute Resolution:</strong> Any disputes shall be resolved through binding arbitration in San Diego County, California.</p>
    </div>
  `,

  workOrder: `
    <div class="disclaimer">
      <h4>⚠️ Work Order Terms</h4>
      <p><strong>Authorization:</strong> Client authorizes Building Care Solutions to perform the work described above.</p>
      <p><strong>Access:</strong> Client will provide reasonable access to the property during normal business hours.</p>
      <p><strong>Changes:</strong> Any changes to scope of work must be approved in writing and may result in additional charges.</p>
      <p><strong>Insurance:</strong> Building Care Solutions maintains general liability and workers' compensation insurance as required by California law.</p>
      <p><strong>Estimated Cost:</strong> Final cost may vary based on actual conditions discovered during work. Client will be notified of significant changes.</p>
    </div>
  `,

  quote: `
    <div class="disclaimer">
      <h4>⚠️ Estimate Terms</h4>
      <p><strong>Validity:</strong> This estimate is valid for 30 days from date issued and subject to material cost changes.</p>
      <p><strong>Not a Guarantee:</strong> Final costs may vary based on actual site conditions, unforeseen circumstances, and material availability.</p>
      <p><strong>Insurance Claims:</strong> If this is for an insurance claim, final billing may differ based on insurance company adjustments.</p>
      <p><strong>Acceptance:</strong> Client acceptance of this estimate constitutes agreement to proceed with work as described.</p>
      <p><strong>Permits & Compliance:</strong> All work will be performed in compliance with local building codes. Permit costs are additional unless specified.</p>
    </div>
  `,

  moistureLog: `
    <div class="disclaimer">
      <h4>📋 Moisture Log Information</h4>
      <p><strong>Documentation:</strong> This log is maintained for insurance and restoration tracking purposes.</p>
      <p><strong>Readings:</strong> All moisture readings taken with calibrated instruments in accordance with IICRC standards.</p>
      <p><strong>Retention:</strong> Records maintained for minimum 7 years as required by California law.</p>
      <p><strong>Disclaimer:</strong> Readings represent conditions at time of measurement and may change over time.</p>
    </div>
  `
};

/**
 * Generate a professional print document
 */
export function generatePrintDocument(type, data) {
  const { documentTitle, documentNumber, date, content, disclaimer } = data;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${documentTitle} ${documentNumber} - ${COMPANY_INFO.name}</title>
      ${PRINT_CSS}
    </head>
    <body>
      <div class="page-wrapper">
        <!-- Modern Company Header -->
        <div class="header">
          <div class="header-content">
            <div class="company-branding">
              <h1>${COMPANY_INFO.name}</h1>
              <div class="tagline">${COMPANY_INFO.tagline}</div>
              <div class="contact">
                <span class="contact-item">📍 ${COMPANY_INFO.address}, ${COMPANY_INFO.city}</span>
                <span class="contact-item">📞 ${COMPANY_INFO.phone}</span>
                <span class="contact-item">📧 ${COMPANY_INFO.email}</span>
              </div>
              <div class="contact" style="margin-top: 8px;">
                <span class="contact-item">🌐 ${COMPANY_INFO.website}</span>
                <span class="contact-item">${COMPANY_INFO.license}</span>
              </div>
            </div>
            <div class="document-badge">
              ${documentTitle}
            </div>
          </div>
        </div>

        <!-- Content Wrapper -->
        <div class="content-wrapper">
          <!-- Document Title -->
          <div class="document-title">
            <div>
              <h2>${documentTitle}</h2>
              <div class="doc-number">${documentNumber}</div>
            </div>
            <div style="text-align: right; color: #64748b;">
              <div style="font-size: 9pt; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Date</div>
              <div style="font-size: 11pt; font-weight: 600; color: #1e293b;">${date}</div>
            </div>
          </div>

          <!-- Main Content -->
          ${content}

          <!-- Legal Disclaimer -->
          ${disclaimer || ''}

          <!-- Professional Footer -->
          <div class="footer">
            <p>${COMPANY_INFO.name}</p>
            <p>Water Remediation • Mold Clearance • Full Reconstruction</p>
            <p>Serving San Diego County with Pride</p>
            <p>
              This document was generated electronically and is valid without signature.<br>
              For questions, please contact us at ${COMPANY_INFO.phone}
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Open print window with styled content
 */
export function printDocument(html) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

export { COMPANY_INFO, LEGAL_DISCLAIMERS };
