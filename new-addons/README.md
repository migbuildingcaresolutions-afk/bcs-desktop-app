# NEW ADDONS - Android Xactimate & Mobile Integration

This folder contains all the new components added from the Android Xactimate integration and mobile app development.

## 📁 Folder Structure

### `/mobile-app/`
Complete React Native mobile application for iOS and Android with Xactimate integration.

**Features:**
- Native mobile UI for field technicians
- Offline-first data sync
- Camera integration for job site photos
- GPS location tracking
- Xactimate line item selection
- Real-time estimate generation

### `/xactimate-integration/`
Xactimate-specific integration components, pricing engine, and estimating tools.

**Features:**
- 2020+ Xactimate line items database
- Pricing calculation engine
- Trade-specific categorization (17 categories)
- Unit conversion utilities
- Cost markup and tax calculations

### `/android-components/`
Android-specific native modules and components.

**Features:**
- Camera module for photo capture
- File system access for PDF storage
- Push notifications
- Offline storage with SQLite
- Barcode/QR scanner for equipment tracking

### `/shared-utilities/`
Shared utilities used by both desktop and mobile apps.

**Features:**
- API client with offline queue
- Data validation schemas
- Date/time formatters
- Currency formatters
- PDF generation utilities
- Email templates

### `/backend-mobile-routes/`
Express.js API routes specifically for mobile app communication.

**Features:**
- Mobile authentication with JWT
- Sync endpoints for offline data
- File upload for job site photos
- Real-time estimate updates
- Push notification triggers

---

## 🚀 Quick Start

### Mobile App Setup

```bash
cd new-addons/mobile-app
npm install
npm run android  # For Android
npm run ios      # For iOS
```

### Backend Mobile Routes

```bash
# Routes are automatically loaded when you start the backend
cd ../../backend
node server.mjs
```

---

## 📊 Database Schema Additions

### New Tables for Mobile Integration

1. **mobile_users** - Mobile app user credentials and device tokens
2. **sync_queue** - Offline data synchronization queue
3. **job_photos** - Photos captured on-site with metadata
4. **mobile_sessions** - Active mobile sessions and last sync times
5. **push_notifications** - Notification history and delivery status

---

## 🔄 Integration Points

### Desktop ↔ Mobile Sync
- Real-time updates via WebSocket
- Offline queue with conflict resolution
- Photo sync from mobile to desktop

### Xactimate Integration
- Full line item database (2020+ items)
- Automatic pricing updates
- Category-based item selection
- Custom item creation

---

## 📱 Mobile App Screens

1. **Login** - JWT authentication
2. **Dashboard** - Today's jobs, quick actions
3. **Job List** - Active jobs with status
4. **Job Details** - Client info, work order details
5. **Estimate Builder** - Xactimate line item selection
6. **Photo Gallery** - Job site photos with annotations
7. **Time Tracking** - Clock in/out for jobs
8. **Equipment Log** - Equipment used on job
9. **Settings** - Sync preferences, offline mode

---

## 🛠 Technologies Used

### Mobile App
- **React Native 0.72+** - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **React Navigation** - Routing and navigation
- **Realm** - Offline-first mobile database
- **React Native Camera** - Photo capture
- **React Native Maps** - Location services

### Backend
- **Express.js** - API server
- **Multer** - File upload handling
- **Socket.io** - Real-time communication
- **JWT** - Mobile authentication

---

## 📝 Migration Guide

To integrate these addons into your existing BCS Desktop App:

### Step 1: Database Migration
```bash
node new-addons/xactimate-integration/scripts/migrate-database.js
```

### Step 2: Install Mobile Backend Routes
```bash
cp -r new-addons/backend-mobile-routes/* backend/routes/mobile/
```

### Step 3: Update Server Configuration
Add to `backend/server.mjs`:
```javascript
import mobileAuthRouter from './routes/mobile/auth.mjs';
import mobileSyncRouter from './routes/mobile/sync.mjs';
import mobilePhotosRouter from './routes/mobile/photos.mjs';

app.use('/api/mobile/auth', mobileAuthRouter);
app.use('/api/mobile/sync', mobileSyncRouter);
app.use('/api/mobile/photos', mobilePhotosRouter);
```

### Step 4: Deploy Mobile App
Follow the React Native deployment guide in `/mobile-app/DEPLOYMENT.md`

---

## 🎯 Key Features Added

### For Desktop App
- ✅ Mobile device management dashboard
- ✅ Real-time mobile user tracking
- ✅ Photo gallery from mobile uploads
- ✅ Mobile estimate approval workflow
- ✅ Offline sync monitoring

### For Mobile App
- ✅ Offline-first architecture
- ✅ Camera integration for job photos
- ✅ Xactimate line item picker
- ✅ Real-time estimate calculations
- ✅ GPS location tracking
- ✅ Push notifications for new jobs

---

## 📞 Support

For questions about the mobile integration:
- Email: m19u3l@sd-bcs.com
- Documentation: See individual README files in each subfolder

---

**Last Updated:** November 16, 2025
**Version:** 2.0.0 - Mobile Integration Release
