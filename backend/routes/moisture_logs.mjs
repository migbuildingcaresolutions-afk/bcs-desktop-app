const express = require("express");
const router = express.Router();
const db = require("../database/db");
const generatePDF = require("../pdf/moisture_log_pdf");
const sendEmail = require("../services/email-sender");
const path = require("path");

// GET all logs
router.get("/", (req, res) => {
  db.all("SELECT * FROM moisture_logs ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET single log (for printing)
router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM moisture_logs WHERE id = ?", [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Log not found" });

    // convert JSON fields
    try {
      row.rooms = JSON.parse(row.rooms || "[]");
    } catch {
      row.rooms = [];
    }

    res.json(row);
  });
});

// 🔥 Generate PDF
router.get("/:id/pdf", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM moisture_logs WHERE id = ?", [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Log not found" });

    row.rooms = JSON.parse(row.rooms || "[]");

    const pdfPath = generatePDF(row);
    res.download(pdfPath);
  });
});

// 🔥 Email PDF
router.post("/:id/email", (req, res) => {
  const id = req.params.id;
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email required" });

  db.get("SELECT * FROM moisture_logs WHERE id = ?", [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Log not found" });

    row.rooms = JSON.parse(row.rooms || "[]");

    const pdfPath = generatePDF(row);

    sendEmail({
      to: email,
      subject: `Moisture Log Report #${id}`,
      text: "Attached is your moisture log report.",
      attachments: [
        {
          filename: `moisture_log_${id}.pdf`,
          path: pdfPath,
        },
      ],
    });

    res.json({ message: "Email sent", pdf: pdfPath });
  });
});

module.exports = router;
