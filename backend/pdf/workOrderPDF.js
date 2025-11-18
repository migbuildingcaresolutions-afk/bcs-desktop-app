import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateWorkOrderPDF(workOrder) {
  const outputDir = path.join(process.cwd(), "backend", "pdf", "generated");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(outputDir, `work_order_${workOrder.id}.pdf`);
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Work Order", { underline: true });
  doc.moveDown();

  doc.fontSize(14).text(`Work Order ID: ${workOrder.id}`);
  doc.text(`Work Order Number: ${workOrder.work_order_number}`);
  doc.text(`Title: ${workOrder.title}`);
  doc.text(`Client: ${workOrder.client_id}`);
  doc.text(`Status: ${workOrder.status}`);
  doc.text(`Priority: ${workOrder.priority}`);
  doc.text(`Scheduled Date: ${workOrder.scheduled_date || "N/A"}`);
  doc.text(`Estimated Cost: $${workOrder.estimated_cost || 0}`);
  doc.text(`Location: ${workOrder.location}`);
  doc.moveDown();

  doc.fontSize(14).text("Description:", { underline: true });
  doc.fontSize(12).text(workOrder.description || "No description available.");

  doc.end();
  return filePath;
}

