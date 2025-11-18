const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = function generateMoistureLogPDF(log) {
  const pdfPath = path.join(__dirname, `../documents/moisture_log_${log.id}.pdf`);
  const doc = new PDFDocument({ margin: 40 });

  doc.pipe(fs.createWriteStream(pdfPath));

  doc.fontSize(22).text("Moisture Log Report", { align: "center" }).moveDown();

  doc
    .fontSize(12)
    .text(`Log Date: ${log.log_date}`)
    .text(`Technician: ${log.technician}`)
    .text(`Location: ${log.location || "—"}`)
    .moveDown();

  doc.fontSize(14).text("Environmental Readings").moveDown(0.5);
  doc.text(`Temperature: ${log.temperature}°F`);
  doc.text(`Humidity: ${log.humidity}%`).moveDown();

  doc.fontSize(14).text("Rooms & Readings").moveDown(0.5);

  (log.rooms || []).forEach((room) => {
    doc.text(`${room.name}: ${room.material} - ${room.reading}%`);
  });

  doc.moveDown();
  doc.fontSize(14).text("Notes").moveDown(0.5);
  doc.fontSize(12).text(log.notes || "—");

  doc.end();

  return pdfPath;
};
