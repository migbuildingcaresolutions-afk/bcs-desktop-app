import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from '../db.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'media');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

// POST - Upload media files
router.post('/upload', upload.array('files', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const fileRecords = [];

    for (const file of req.files) {
      const result = await db.run(
        `INSERT INTO media (filename, original_name, file_path, file_type, file_size, uploaded_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`,
        [
          file.filename,
          file.originalname,
          file.path,
          file.mimetype,
          file.size
        ]
      );

      fileRecords.push({
        id: result.lastID,
        filename: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileType: file.mimetype,
        fileSize: file.size
      });
    }

    res.status(201).json({
      message: 'Files uploaded successfully',
      files: fileRecords
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    next(error);
  }
});

// GET all media
router.get('/', async (req, res, next) => {
  try {
    const media = await db.all('SELECT * FROM media ORDER BY uploaded_at DESC');
    res.json(media || []);
  } catch (error) {
    console.error('Error fetching media:', error);
    next(error);
  }
});

// GET single media by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await db.get('SELECT * FROM media WHERE id = ?', [id]);

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    next(error);
  }
});

// DELETE media
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get file info before deleting
    const media = await db.get('SELECT * FROM media WHERE id = ?', [id]);

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete from database
    await db.run('DELETE FROM media WHERE id = ?', [id]);

    // Delete file from filesystem
    if (fs.existsSync(media.file_path)) {
      fs.unlinkSync(media.file_path);
    }

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    next(error);
  }
});

export default router;
