import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateWorkOrderPDF(workOrder) {
  const outputDir = path.join(process.cwd(), "backend/pdf/generated");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(outputDir, `work_order_${workOrder.id}.pdf`);

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(26).text("Work Order", { underline: true });
  doc.moveDown();

  doc.fontSize(14);
  doc.text(`Work Order ID: ${workOrder.id}`);
  doc.text(`Work Order Number: ${workOrder.work_order_number}`);
  doc.text(`Title: ${workOrder.title}`);
  doc.text(`Client ID: ${workOrder.client_id}`);
  doc.text(`Status: ${workOrder.status}`);
  doc.text(`Priority: ${workOrder.priority}`);
  doc.text(`Scheduled Date: ${workOrder.scheduled_date}`);
  doc.text(`Estimated Cost: $${workOrder.estimated_cost}`);
  doc.text(`Location: ${workOrder.location}`);
  doc.moveDown();

  doc.fontSize(16).text("Description");
  doc.fontSize(12).text(workOrder.description);

  doc.end();
  return filePath;
}

