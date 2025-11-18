# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BCS Desktop App is an Electron-based desktop application for managing building construction and restoration services. It provides comprehensive tools for handling clients, work orders, invoices, employees, equipment tracking, and Xactimate integration.

## Technology Stack

- **Desktop Framework**: Electron (main process entry: `main.js`)
- **Frontend**: React + Vite + Tailwind CSS (in `renderer/` directory)
- **Backend**: Express.js server (using ES modules `.mjs` files)
- **Database**: SQLite3 (managed via `backend/db.js`)
- **Package Manager**: pnpm (monorepo workspace setup)

## Project Structure

```
bcs-desktop-app/
├── main.js                 # Electron main process
├── preload.js              # Electron preload script
├── backend/                # Express API server
│   ├── server.mjs          # Main server file (ES modules)
│   ├── db.js               # SQLite database connection
│   ├── routes/             # API route modules (all .mjs files)
│   ├── controllers/        # Business logic controllers
│   ├── utils/              # Utilities (PDF generator, email sender, etc.)
│   └── scripts/            # Database migration scripts
├── renderer/               # Vite + React frontend
│   ├── src/
│   │   ├── App.jsx         # Main React application
│   │   ├── api-client.js   # Complete API client for backend
│   │   ├── hooks/          # Custom React hooks (useAPI.js)
│   │   ├── views/          # Page components
│   │   ├── examples/       # Example components
│   │   └── styles/         # CSS files
│   ├── vite.config.js      # Vite configuration
│   └── tailwind.config.js  # Tailwind CSS configuration
└── pnpm-workspace.yaml     # pnpm monorepo configuration
```

## Core Business Modules

The application manages the following entities (each with full CRUD operations):

1. **Clients** - Customer management
2. **Work Orders** - Job assignments and tracking
3. **Invoices** - Billing and payments
4. **Employees** - Staff management
5. **Equipment** - Tool and equipment tracking
6. **Materials** - Building materials inventory
7. **Vendors** - Supplier management
8. **Estimates** - Job cost estimation
9. **Change Orders** - Project modifications
10. **Dry-Out Jobs** - Water damage remediation tracking
11. **Remediation (Dryout & Reconstruction)** - Specialized job types
12. **Xactimate** - Insurance estimation software integration
13. **Dashboard** - Analytics and statistics

## Development Commands

### Root Level (Electron App)
```bash
# Install all dependencies (backend + renderer)
pnpm install

# Start the Electron application
npm start                    # Runs Electron with the built renderer

# Development mode (if configured)
npm run dev                  # Hot reload for both frontend and backend
```

### Backend Server (`cd backend/`)
```bash
# Install backend dependencies
pnpm install

# Start the Express server
node server.mjs              # Port 3000 (default)
npm start                    # If defined in package.json

# Run database migrations
node scripts/autoPatchSchema.js

# Seed the database with test data
node seed-data.js
```

### Frontend Development (`cd renderer/`)
```bash
# Install frontend dependencies
pnpm install

# Start Vite dev server (standalone)
pnpm run dev                 # Usually runs on http://localhost:5173

# Build for production
pnpm run build               # Outputs to dist/

# Preview production build
pnpm run preview

# Lint code
pnpm run lint
```

### Testing API Connection
```bash
# Test backend connectivity from root
node test-api-connection.js
```

## Important Implementation Details

### Backend Architecture

1. **ES Modules**: All backend route files use `.mjs` extension and ES6 import/export syntax
2. **Route Pattern**: Every route module in `backend/routes/` follows a consistent structure:
   - GET `/api/:resource` - List all
   - GET `/api/:resource/:id` - Get by ID
   - POST `/api/:resource` - Create new
   - PUT `/api/:resource/:id` - Update
   - DELETE `/api/:resource/:id` - Delete

3. **CORS Configuration**: Backend requires CORS enabled for frontend communication:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:5173', 'http://localhost:5174'],
     credentials: true
   }));
   ```

4. **Database**: SQLite database with automatic schema patching via `autoPatchSchema.js`

### Frontend Architecture

1. **API Client**: Centralized API communication in `renderer/src/api-client.js`
   - Exports individual API objects for each resource (e.g., `clientsAPI`, `workOrdersAPI`)
   - Each API object has methods: `getAll()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`

2. **React Hooks**: Custom hooks in `renderer/src/hooks/useAPI.js`:
   - `useCRUD(apiClient)` - Complete CRUD operations with loading/error states
   - `useAPI(apiFunction)` - Generic API call wrapper

3. **Environment Variables**: Frontend uses `.env` file (see `.env.example`):
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

### Electron Integration

- **Main Process** (`main.js`): Manages application window and system integration
- **Renderer Process**: React application running in the Electron window
- **Preload Script** (`preload.js`): Secure bridge between main and renderer processes

## Common Development Workflows

### Adding a New Entity/Resource

1. Create database migration in `backend/scripts/autoPatchSchema.js`
2. Add route file in `backend/routes/[resource-name].mjs` following the existing pattern
3. Register route in `backend/server.mjs`
4. Add API client methods in `renderer/src/api-client.js`
5. Create view component in `renderer/src/views/[ResourceName]View.jsx`
6. Update navigation/routing in `renderer/src/App.jsx`

### Running Full Stack Development

1. **Terminal 1** - Backend:
   ```bash
   cd backend && node server.mjs
   ```

2. **Terminal 2** - Frontend:
   ```bash
   cd renderer && pnpm run dev
   ```

3. **Terminal 3** - Electron (if testing desktop app):
   ```bash
   npm start
   ```

## Important Files & Documentation

- **START-HERE.md** - Quick start guide for frontend-backend integration
- **API-ENDPOINTS.md** - Complete API reference with all available endpoints
- **FRONTEND-BACKEND-INTEGRATION-GUIDE.md** - Detailed integration instructions
- **DASHBOARD-SETUP.md** - Dashboard component configuration
- **INTEGRATION-CHECKLIST.md** - Step-by-step integration tasks
- **ICLOUD-SOLUTION.md** - Fix for iCloud sync issues with project files
- **ROUTE-STATUS-REPORT.md** - Status of all backend routes

## Known Issues & Solutions

### iCloud File Sync Problem
If you encounter "Operation timed out" or "dataless" file errors:
- **Cause**: Project folder may be in iCloud-synced Documents/Desktop folder
- **Solution**: See `ICLOUD-SOLUTION.md` for complete fix
- **Quick Fix**: Move entire project to non-synced location like `~/Projects/`

### CORS Errors
- Ensure backend `server.mjs` has CORS middleware configured
- Verify frontend `.env` has correct `VITE_API_BASE_URL`
- Check that both frontend and backend are running

### Database Schema Changes
- Run `node backend/scripts/autoPatchSchema.js` after pulling schema changes
- Database file location: Check `backend/db.js` for SQLite file path

## Code Style & Conventions

- Backend routes use `.mjs` extension for ES modules
- Frontend components use `.jsx` extension
- API endpoints follow REST conventions with kebab-case URLs (`/api/work-orders`, not `/api/workOrders`)
- Database table names match route names
- Use async/await for all database operations
- Error handling should return appropriate HTTP status codes (400, 404, 500)

## Utilities

- **PDF Generation**: `backend/utils/pdf-generator.js` - Generate invoices and reports
- **Email Sender**: `backend/utils/email-sender.js` - Send emails to clients
- **Database Helper**: `backend/utils/database.js` - Common database operations
