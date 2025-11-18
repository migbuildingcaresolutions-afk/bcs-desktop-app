# Frontend-Backend Integration Guide

This guide explains how to connect your React frontend with your Express backend API.

## 📁 Project Structure

```
bcs-desktop-app/
├── backend/
│   ├── server.mjs              # Express server
│   ├── routes/                 # API route handlers
│   │   ├── clients.mjs
│   │   ├── work-orders.mjs
│   │   ├── invoices.mjs
│   │   └── ... (other routes)
│   └── db.js                   # Database connection
└── renderer/
    └── src/
        ├── api-client.js       # ✨ NEW: API client for all endpoints
        ├── hooks/
        │   └── useAPI.js       # ✨ NEW: React hooks for API calls
        └── examples/
            └── ClientsExample.jsx  # ✨ NEW: Example component
```

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the `renderer` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Backend Server Configuration

Your backend server should have CORS enabled. Check `backend/server.mjs`:

```javascript
import cors from 'cors';

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
```

### 3. Using the API Client in React Components

#### Option A: Using the useCRUD Hook (Recommended)

```javascript
import { useEffect } from 'react';
import { clientsAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';

function ClientsComponent() {
  const { items, loading, error, fetchAll, create, update, remove } = useCRUD(clientsAPI);

  useEffect(() => {
    fetchAll(); // Load data on mount
  }, [fetchAll]);

  const handleCreate = async () => {
    await create({ name: 'New Client', email: 'client@example.com' });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
}
```

#### Option B: Direct API Calls

```javascript
import { clientsAPI } from '../api-client';

async function loadClients() {
  try {
    const clients = await clientsAPI.getAll();
    console.log(clients);
  } catch (error) {
    console.error('Error loading clients:', error);
  }
}
```

## 📚 Available APIs

All APIs follow the same pattern with these methods:
- `getAll()` - Get all items
- `getById(id)` - Get single item
- `create(data)` - Create new item
- `update(id, data)` - Update existing item
- `delete(id)` - Delete item

### Available API Modules

```javascript
import {
  clientsAPI,
  workOrdersAPI,
  invoicesAPI,
  employeesAPI,
  equipmentAPI,
  materialsAPI,
  vendorsAPI,
  estimatesAPI,
  changeOrdersAPI,
  dashboardAPI,
  dryOutJobsAPI,
  jobTrackingAPI,
  priceListAPI,
  pricingAPI,
  remediationDryoutAPI,
  remediationReconstructionAPI,
  reportsAPI,
  resourcesAPI,
  servicesAPI,
  settingsAPI,
  xactimateAPI,
  lineItemsAPI,
} from './api-client';
```

Or import all at once:

```javascript
import api from './api-client';

// Use as:
api.clients.getAll();
api.workOrders.create(data);
```

## 🔧 Backend Route Structure

Each route file should export an Express router with CRUD endpoints:

```javascript
// backend/routes/your-route.mjs
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => { /* Get all */ });
router.get('/:id', async (req, res) => { /* Get one */ });
router.post('/', async (req, res) => { /* Create */ });
router.put('/:id', async (req, res) => { /* Update */ });
router.delete('/:id', async (req, res) => { /* Delete */ });

export default router;
```

See `backend/routes/example-route-structure.mjs` for a complete example.

## 🎯 Common Patterns

### Pattern 1: Load Data on Component Mount

```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data);
    } catch (error) {
      console.error(error);
    }
  };
  loadData();
}, []);
```

### Pattern 2: Form Submission

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await clientsAPI.create(formData);
    // Refresh list or show success message
  } catch (error) {
    // Handle error
  }
};
```

### Pattern 3: Delete with Confirmation

```javascript
const handleDelete = async (id) => {
  if (window.confirm('Are you sure?')) {
    await clientsAPI.delete(id);
    // Refresh list
  }
};
```

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend has CORS enabled
- Check that frontend URL is in CORS whitelist
- Verify backend is running on correct port

### Connection Refused
- Check backend server is running: `cd backend && npm start`
- Verify port in VITE_API_URL matches server port

### 404 Errors
- Verify route exists in backend
- Check API endpoint path matches route definition
- Ensure `/api` prefix is correct

## 📝 Next Steps

1. ✅ Review `renderer/src/examples/ClientsExample.jsx` for a complete working example
2. ✅ Check your backend routes match the expected structure
3. ✅ Update your existing components to use the new API client
4. ✅ Test each endpoint with your frontend

## 🔗 File References

- **API Client**: `renderer/src/api-client.js`
- **React Hooks**: `renderer/src/hooks/useAPI.js`
- **Example Component**: `renderer/src/examples/ClientsExample.jsx`
- **Backend Example**: `backend/server-example.mjs`
- **Route Example**: `backend/routes/example-route-structure.mjs`

