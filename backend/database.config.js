import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const databaseConfig = {
  // Database file path
  path: process.env.DB_PATH || path.join(__dirname, '../database/bcs-database.db'),

  // SQLite options
  options: {
    verbose: process.env.NODE_ENV === 'development',
  },

  // Connection pool settings (for better-sqlite3 if needed)
  pool: {
    min: 1,
    max: 10,
  },
};

export default databaseConfig;
