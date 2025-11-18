import express from 'express';
import storageService from '../services/storageService.js';

const router = express.Router();

// POST /api/storage/backup
router.post('/backup', async (req, res, next) => {
  try {
    const { includeFiles } = req.body;
    const result = await storageService.createBackup({ includeFiles });
    res.json(result);
  } catch (error) {
    console.error('Create backup error:', error);
    next(error);
  }
});

// GET /api/storage/backups
router.get('/backups', (req, res, next) => {
  try {
    const backups = storageService.listBackups();
    res.json(backups);
  } catch (error) {
    console.error('List backups error:', error);
    next(error);
  }
});

// DELETE /api/storage/backup/:filename
router.delete('/backup/:filename', (req, res, next) => {
  try {
    const { filename } = req.params;
    const result = storageService.deleteBackup(filename);
    res.json(result);
  } catch (error) {
    console.error('Delete backup error:', error);
    next(error);
  }
});

// POST /api/storage/cleanup
router.post('/cleanup', (req, res, next) => {
  try {
    const { keepCount } = req.body;
    const result = storageService.cleanOldBackups(keepCount || 10);
    res.json(result);
  } catch (error) {
    console.error('Cleanup error:', error);
    next(error);
  }
});

// GET /api/storage/stats
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await storageService.getStorageStats();
    res.json(stats);
  } catch (error) {
    console.error('Storage stats error:', error);
    next(error);
  }
});

// POST /api/storage/schedule-backups
router.post('/schedule-backups', (req, res, next) => {
  try {
    const { cronSchedule } = req.body;
    const result = storageService.scheduleAutomaticBackups(cronSchedule);
    res.json(result);
  } catch (error) {
    console.error('Schedule backups error:', error);
    next(error);
  }
});

// POST /api/storage/export/:table
router.post('/export/:table', async (req, res, next) => {
  try {
    const { table } = req.params;
    const result = await storageService.exportToJSON(table);
    res.json(result);
  } catch (error) {
    console.error('Export error:', error);
    next(error);
  }
});

// GET /api/storage/download-backup/:filename
router.get('/download-backup/:filename', (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = `/Users/k4n3/Projects/bcs-desktop-app/backend/backups/${filename}`;

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download backup error:', err);
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
