import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import schedule from 'node-schedule';
import db from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.join(__dirname, '../backups');
const DB_PATH = path.join(__dirname, '../database/bcs-database.db');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Storage & Backup Service
 */

/**
 * Create full database backup
 */
export async function createBackup(options = {}) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = `bcs-backup-${timestamp}.zip`;
    const backupPath = path.join(BACKUP_DIR, backupFilename);

    const output = fs.createWriteStream(backupPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', () => {
        const stats = fs.statSync(backupPath);
        resolve({
          success: true,
          filename: backupFilename,
          path: backupPath,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size),
          timestamp: new Date()
        });
      });

      archive.on('error', reject);
      archive.pipe(output);

      // Add database file
      if (fs.existsSync(DB_PATH)) {
        archive.file(DB_PATH, { name: 'database/bcs-database.db' });
      }

      // Add uploads directory if exists and includeFiles option is true
      if (options.includeFiles && fs.existsSync(UPLOADS_DIR)) {
        archive.directory(UPLOADS_DIR, 'uploads');
      }

      // Add backup metadata
      const metadata = {
        created_at: new Date().toISOString(),
        database_size: fs.existsSync(DB_PATH) ? fs.statSync(DB_PATH).size : 0,
        includes_files: options.includeFiles || false,
        app_version: '1.0.0'
      };
      archive.append(JSON.stringify(metadata, null, 2), { name: 'backup-info.json' });

      archive.finalize();
    });
  } catch (error) {
    console.error('Backup error:', error);
    throw error;
  }
}

/**
 * List all available backups
 */
export function listBackups() {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return [];
    }

    const files = fs.readdirSync(BACKUP_DIR);
    const backups = files
      .filter(file => file.endsWith('.zip'))
      .map(file => {
        const stats = fs.statSync(path.join(BACKUP_DIR, file));
        return {
          filename: file,
          path: path.join(BACKUP_DIR, file),
          size: stats.size,
          sizeFormatted: formatBytes(stats.size),
          created_at: stats.birthtime,
          modified_at: stats.mtime
        };
      })
      .sort((a, b) => b.created_at - a.created_at);

    return backups;
  } catch (error) {
    console.error('List backups error:', error);
    return [];
  }
}

/**
 * Delete a backup file
 */
export function deleteBackup(filename) {
  try {
    const backupPath = path.join(BACKUP_DIR, filename);

    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup file not found');
    }

    fs.unlinkSync(backupPath);

    return {
      success: true,
      message: 'Backup deleted successfully',
      filename
    };
  } catch (error) {
    console.error('Delete backup error:', error);
    throw error;
  }
}

/**
 * Clean old backups (keep only last N backups)
 */
export function cleanOldBackups(keepCount = 10) {
  try {
    const backups = listBackups();

    if (backups.length <= keepCount) {
      return {
        success: true,
        message: 'No backups to clean',
        deleted: 0
      };
    }

    const toDelete = backups.slice(keepCount);
    let deletedCount = 0;

    toDelete.forEach(backup => {
      try {
        fs.unlinkSync(backup.path);
        deletedCount++;
      } catch (err) {
        console.error(`Failed to delete ${backup.filename}:`, err);
      }
    });

    return {
      success: true,
      message: `Cleaned ${deletedCount} old backups`,
      deleted: deletedCount,
      remaining: backups.length - deletedCount
    };
  } catch (error) {
    console.error('Clean backups error:', error);
    throw error;
  }
}

/**
 * Get storage statistics
 */
export async function getStorageStats() {
  try {
    const stats = {
      database: { size: 0, path: DB_PATH },
      uploads: { size: 0, count: 0, path: UPLOADS_DIR },
      backups: { size: 0, count: 0, path: BACKUP_DIR },
      total: 0
    };

    // Database size
    if (fs.existsSync(DB_PATH)) {
      stats.database.size = fs.statSync(DB_PATH).size;
    }

    // Uploads size
    if (fs.existsSync(UPLOADS_DIR)) {
      const uploadFiles = fs.readdirSync(UPLOADS_DIR);
      stats.uploads.count = uploadFiles.length;
      uploadFiles.forEach(file => {
        const filePath = path.join(UPLOADS_DIR, file);
        if (fs.statSync(filePath).isFile()) {
          stats.uploads.size += fs.statSync(filePath).size;
        }
      });
    }

    // Backups size
    const backups = listBackups();
    stats.backups.count = backups.length;
    stats.backups.size = backups.reduce((sum, backup) => sum + backup.size, 0);

    // Total
    stats.total = stats.database.size + stats.uploads.size + stats.backups.size;

    // Format sizes
    stats.database.sizeFormatted = formatBytes(stats.database.size);
    stats.uploads.sizeFormatted = formatBytes(stats.uploads.size);
    stats.backups.sizeFormatted = formatBytes(stats.backups.size);
    stats.totalFormatted = formatBytes(stats.total);

    // Get database record counts
    const tables = [
      'clients', 'work_orders', 'invoices', 'estimates', 'employees',
      'equipment', 'materials', 'vendors', 'payments'
    ];

    stats.records = {};
    for (const table of tables) {
      try {
        const result = await db.get(`SELECT COUNT(*) as count FROM ${table}`);
        stats.records[table] = result.count;
      } catch (err) {
        stats.records[table] = 0;
      }
    }

    return stats;
  } catch (error) {
    console.error('Storage stats error:', error);
    throw error;
  }
}

/**
 * Schedule automatic backups
 */
export function scheduleAutomaticBackups(cronSchedule = '0 2 * * *') {
  // Default: 2 AM daily
  const job = schedule.scheduleJob(cronSchedule, async () => {
    try {
      console.log('Starting scheduled backup...');
      const result = await createBackup({ includeFiles: true });
      console.log('Scheduled backup completed:', result.filename);

      // Clean old backups (keep last 30)
      await cleanOldBackups(30);
    } catch (error) {
      console.error('Scheduled backup failed:', error);
    }
  });

  return {
    success: true,
    message: 'Automatic backups scheduled',
    schedule: cronSchedule
  };
}

/**
 * Export data to JSON
 */
export async function exportToJSON(tableName) {
  try {
    const data = await db.all(`SELECT * FROM ${tableName}`);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${tableName}-export-${timestamp}.json`;
    const exportPath = path.join(BACKUP_DIR, filename);

    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));

    return {
      success: true,
      filename,
      path: exportPath,
      records: data.length
    };
  } catch (error) {
    console.error('Export to JSON error:', error);
    throw error;
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default {
  createBackup,
  listBackups,
  deleteBackup,
  cleanOldBackups,
  getStorageStats,
  scheduleAutomaticBackups,
  exportToJSON
};
