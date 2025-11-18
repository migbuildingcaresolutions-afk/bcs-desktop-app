# BCS Desktop App - Complete Setup Guide

Building & Construction Services Desktop Application - Full-featured Electron app for managing construction business operations.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- pnpm (recommended) or npm
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd bcs-desktop-app

# Install all dependencies
npm run install:all

# Initialize the database
npm run db:init

# Seed with sample data (optional)
npm run db:seed

# Start development mode
npm run dev
```

The app will start with:
- Backend API: http://localhost:3000
- Frontend Dev Server: http://localhost:5173
- Electron Desktop App: Opens automatically

## 📁 Project Structure

```
bcs-desktop-app/
├── backend/                 # Express.js API server
│   ├── routes/             # API route modules (.mjs files)
│   ├── controllers/        # Business logic
│   ├── middleware/         # Error handling, validation
│   ├── utils/              # PDF generator, email sender
│   ├── config/             # Database configuration
│   ├── database/           # SQLite database files
│   ├── scripts/            # Database migrations & init
│   └── server.mjs          # Main server file
├── renderer/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (AppContext)
│   │   ├── hooks/          # Custom React hooks (useAPI, useCRUD)
│   │   ├── views/          # Page components
│   │   ├── api-client.js   # API client for backend
│   │   ├── App.jsx         # Main React app with routing
│   │   └── main.jsx        # React entry point
│   ├── public/             # Static assets
│   └── vite.config.js      # Vite configuration
├── main.js                 # Electron main process
├── preload.js              # Electron preload script
└── package.json            # Root package.json

```

## 🎯 Features

### Core Modules
- **Dashboard** - Analytics and overview
- **Clients** - Customer management
- **Work Orders** - Job tracking and assignment
- **Invoices** - Billing and payments
- **Estimates** - Quote generation
- **Change Orders** - Project modifications
- **Employees** - Staff management
- **Equipment** - Tool and equipment tracking
- **Materials** - Inventory management
- **Vendors** - Supplier database

### Additional Features
- Dry-out job tracking
- Remediation management (dryout & reconstruction)
- Xactimate integration
- PDF generation for invoices
- Email notifications
- Job time tracking
- Price lists and pricing

## 🛠️ Development Commands

### Full Stack Development
```bash
# Run everything (backend + frontend + electron)
npm run dev

# Run only backend
npm run backend:dev

# Run only frontend
npm run frontend:dev

# Run only electron (requires frontend running)
npm run electron:dev
```

### Database Management
```bash
# Initialize database (creates all tables)
npm run db:init

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed

# Reset database (delete and recreate)
npm run db:reset

# Delete database
npm run clean:db
```

### Building & Testing
```bash
# Build frontend for production
npm run frontend:build

# Build Electron app for all platforms
npm run build

# Build for specific platform
npm run build:mac
npm run build:win
npm run build:linux

# Test API connection
npm run test:api

# Lint frontend code
npm run frontend:lint
```

### Utilities
```bash
# Clean all node_modules and build files
npm run clean

# Format code with Prettier
npm run format

# Install all dependencies
npm run install:all
```

## 🔧 Configuration

### Environment Variables

**Backend (.env in backend/)**
```env
PORT=3000
NODE_ENV=development
DB_PATH=./database/bcs-database.db

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@bcs-app.com

# PDF Generation
PDF_OUTPUT_PATH=./generated-pdfs

# CORS Origins
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

**Frontend (.env in renderer/)**
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=BCS Desktop App
VITE_APP_VERSION=1.0.0
```

## 📖 API Documentation

See `API-ENDPOINTS.md` for complete API reference.

Base URL: `http://localhost:3000/api`

All resources follow standard REST patterns:
- `GET /api/resource` - List all
- `GET /api/resource/:id` - Get by ID
- `POST /api/resource` - Create new
- `PUT /api/resource/:id` - Update
- `DELETE /api/resource/:id` - Delete

## 🎨 Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Custom Components** - Reusable UI components

### Backend
- **Express.js** - Web framework
- **SQLite3** - Database
- **ES Modules** - Modern JavaScript

### Desktop
- **Electron** - Desktop framework

## 📝 Development Workflow

### Adding a New Feature

1. **Database**: Update schema in `backend/scripts/initDatabase.js`
2. **Backend**: Create route in `backend/routes/[feature].mjs`
3. **API Client**: Add methods in `renderer/src/api-client.js`
4. **View**: Create component in `renderer/src/views/[Feature]View.jsx`
5. **Routing**: Add to navigation in `renderer/src/App.jsx`

### Creating a New View

Follow the pattern in existing views (ClientsView, InvoicesView, etc.):

```javascript
import { useState, useEffect } from 'react';
import { yourAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Card } from '../components';

export const YourView = () => {
  const { items, loading, error, fetchAll, create, update, remove } = useCRUD(yourAPI);

  // Your component logic...
};
```

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Database Locked**
```bash
# Reset database
npm run db:reset
```

**CORS Errors**
- Check backend `.env` has correct CORS_ORIGIN
- Verify frontend `.env` has correct VITE_API_BASE_URL
- Ensure both servers are running

**iCloud Sync Issues**
- Move project out of iCloud-synced folders
- See `ICLOUD-SOLUTION.md` for details

## 📚 Additional Documentation

- `CLAUDE.md` - AI assistant guide for this codebase
- `START-HERE.md` - Quick start guide
- `API-ENDPOINTS.md` - Complete API reference
- `FRONTEND-BACKEND-INTEGRATION-GUIDE.md` - Integration details
- `DASHBOARD-SETUP.md` - Dashboard configuration
- `GENERATED-FILES-SUMMARY.md` - List of all generated files

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Proprietary - All rights reserved

## 📞 Support

For questions or issues, please contact the development team.

---

**Made with ❤️ by BCS Team**
