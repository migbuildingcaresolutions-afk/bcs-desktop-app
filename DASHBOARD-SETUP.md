# Dashboard Integration Guide

You now have a fully functional Dashboard component connected to the API! Here's what was created:

## 📊 What's New

### Frontend Component
**File**: `renderer/src/views/DashboardView.jsx`

A professional dashboard with:
- ✅ Real-time data fetching from `/api/dashboard` endpoint
- ✅ Beautiful metric cards (Clients, Work Orders, Invoices, Employees, Equipment, Materials)
- ✅ Recent work orders activity feed
- ✅ Summary statistics section
- ✅ Loading and error states
- ✅ Refresh button with manual data reloading
- ✅ Responsive design (mobile-friendly)

### Dashboard Stylesheet
**File**: `renderer/src/styles/DashboardView.css`

Fully styled dashboard with:
- Modern gradient background
- Card-based layout with hover effects
- Color-coded metrics
- Activity feed styling
- Mobile-responsive grid

## 🚀 How to Use

### 1. Import and Use the Component

Add the dashboard to your main App.jsx:

```jsx
import DashboardView from './views/DashboardView';

function App() {
  return <DashboardView />;
}
```

Or use in routing (if you have React Router):

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardView from './views/DashboardView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardView />} />
      </Routes>
    </Router>
  );
}
```

### 2. Implement the Backend Route

The dashboard component calls `GET /api/dashboard`. You need to implement this route to return business metrics.

**Expected Response Format**:

```json
{
  "totalClients": 42,
  "activeWorkOrders": 12,
  "pendingWorkOrders": 5,
  "totalEmployees": 8,
  "totalEquipment": 24,
  "totalMaterials": 150,
  "outstandingInvoiceAmount": 15000,
  "outstandingInvoiceCount": 3,
  "monthlyRevenue": 45000,
  "availableEquipment": 18,
  "availableEmployees": 5,
  "lowStockMaterials": 2,
  "newClientsThisMonth": 4,
  "recentWorkOrders": [
    {
      "id": 1,
      "title": "Water Damage Restoration",
      "description": "Basement flood cleanup",
      "status": "In Progress",
      "clientName": "John Smith"
    }
  ]
}
```

### 3. Update Your Backend Route

Edit `backend/routes/dashboard.mjs` to query your database and return metrics:

```javascript
router.get('/', async (req, res, next) => {
  try {
    // Query your database for metrics
    const stats = {
      totalClients: await getTotalClients(),
      activeWorkOrders: await getActiveWorkOrders(),
      // ... more metrics
      recentWorkOrders: await getRecentWorkOrders(),
    };
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
});
```

## 📋 Available Metrics

The dashboard component displays these metrics (all optional with defaults):

| Metric | Type | Display |
|--------|------|---------|
| `totalClients` | number | Total Clients card |
| `newClientsThisMonth` | number | Subtitle in Clients card |
| `activeWorkOrders` | number | Active Work Orders card |
| `pendingWorkOrders` | number | Subtitle in Work Orders card |
| `outstandingInvoiceAmount` | number | Outstanding Invoices card (formatted as currency) |
| `outstandingInvoiceCount` | number | Subtitle in Invoices card |
| `totalEmployees` | number | Team Members card |
| `availableEmployees` | number | Subtitle in Team Members card |
| `totalEquipment` | number | Equipment card |
| `availableEquipment` | number | Subtitle in Equipment card |
| `totalMaterials` | number | Materials in Stock card |
| `lowStockMaterials` | number | Subtitle in Materials card (highlighted in red) |
| `monthlyRevenue` | number | Summary section (formatted as currency) |
| `completionRate` | number | Summary section (as percentage) |
| `averageJobDuration` | number | Summary section (in days) |
| `clientSatisfaction` | number | Summary section (0-1 scale, shown as percentage) |
| `recentWorkOrders` | array | Activity feed (shows last 5) |

## 🔧 Customization

### Change Colors
Edit `renderer/src/styles/DashboardView.css`:

```css
.metric-card {
  border-left-color: #667eea; /* Change this color */
}
```

### Add More Metrics
1. Update backend `/api/dashboard` response with new metrics
2. Add new card to the metrics grid in `DashboardView.jsx`
3. The dashboard handles missing data gracefully with defaults

### Change Refresh Frequency
Add auto-refresh to the component:

```jsx
useEffect(() => {
  const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
  return () => clearInterval(interval);
}, []);
```

## 🧪 Testing

### 1. Test API Connection
```bash
# In the project root
node test-api-connection.js
```

### 2. Test Dashboard API Endpoint
```bash
# Make sure backend is running
curl http://localhost:3000/api/dashboard
```

### 3. Run the App
```bash
# Terminal 1: Start backend
cd backend && npm start

# Terminal 2: Start frontend
cd renderer && npm run dev

# Terminal 3: Open browser
# Navigate to http://localhost:5173
```

## 📝 Database Queries

If you're implementing the backend route, here are example SQL queries:

```sql
-- Total clients
SELECT COUNT(*) as count FROM clients;

-- Active work orders
SELECT COUNT(*) as count FROM work_orders WHERE status IN ('in progress', 'pending');

-- Outstanding invoices
SELECT COUNT(*) as count, SUM(amount) as total FROM invoices 
WHERE status IN ('pending', 'overdue');

-- Total employees
SELECT COUNT(*) as count FROM employees;

-- Team members available
SELECT COUNT(*) as count FROM employees WHERE status = 'available';

-- Equipment in stock
SELECT COUNT(*) as count FROM equipment WHERE status = 'available';

-- Materials low on stock
SELECT COUNT(*) as count FROM materials WHERE quantity < min_stock_level;

-- Monthly revenue
SELECT SUM(amount) as total FROM invoices 
WHERE status = 'paid' AND DATE(paid_date) >= DATE('now', '-30 days');

-- Recent work orders
SELECT id, title, status, client_id FROM work_orders 
ORDER BY created_at DESC LIMIT 5;
```

## 🎯 Integration Checklist

- [ ] Dashboard route file exists at `backend/routes/dashboard.mjs`
- [ ] Dashboard route returns JSON with metrics
- [ ] Backend server includes dashboard route with `/api` prefix
- [ ] Frontend has `.env` with `VITE_API_URL=http://localhost:3000/api`
- [ ] DashboardView.jsx is imported in App.jsx or router
- [ ] CSS file is imported in DashboardView.jsx
- [ ] Backend server is running on port 3000
- [ ] Frontend dev server is running on port 5173
- [ ] Dashboard loads without errors in browser
- [ ] Metrics display correctly from your data

## 🐛 Troubleshooting

### Dashboard Shows "No data available"
- Check browser console for fetch errors
- Verify backend is running: `curl http://localhost:3000/health`
- Check `/api/dashboard` endpoint returns data: `curl http://localhost:3000/api/dashboard`
- Verify CORS is enabled in backend

### Metrics Show 0 Values
- Check your database has data
- Verify SQL queries are correct
- Check API response in browser Network tab

### Styling Issues
- Verify CSS file is imported: `import '../styles/DashboardView.css';`
- Check browser DevTools for CSS loading errors
- Ensure directory structure: `renderer/src/styles/DashboardView.css`

## 📚 Related Files

- `renderer/src/api-client.js` - API client configuration
- `renderer/src/hooks/useAPI.js` - Custom hooks for API calls
- `backend/routes/example-route-structure.mjs` - Example route template
- `FRONTEND-BACKEND-INTEGRATION-GUIDE.md` - Full integration guide
- `API-ENDPOINTS.md` - All available endpoints

## ✨ Next Steps

1. ✅ Implement the backend `/api/dashboard` route
2. ✅ Test the endpoint with curl
3. ✅ Run the frontend and view the dashboard
4. ✅ Customize metrics based on your business needs
5. ✅ Add more views (Clients, Work Orders, etc.) using the same pattern

Your dashboard is ready to go! 🎉
