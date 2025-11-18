# ✅ Frontend-Backend Integration Checklist

Use this checklist to ensure your frontend and backend are properly connected.

## 🔧 Backend Setup

### Server Configuration
- [ ] Backend server has CORS enabled
- [ ] CORS allows your frontend origin (http://localhost:5173)
- [ ] Server is running on port 3000 (or update .env)
- [ ] All routes are registered in server.mjs with `/api` prefix
- [ ] Health check endpoint works: `curl http://localhost:3000/health`

### Route Structure
- [ ] Each route file exports an Express router
- [ ] Routes follow REST conventions (GET, POST, PUT, DELETE)
- [ ] Routes return JSON responses
- [ ] Error handling is implemented
- [ ] Database connections are working

### Example Backend Route Check
```bash
# Test if routes are accessible
curl http://localhost:3000/api/clients
curl http://localhost:3000/api/work-orders
curl http://localhost:3000/api/invoices
```

## 🎨 Frontend Setup

### Environment Configuration
- [ ] `.env` file exists in renderer directory
- [ ] `VITE_API_URL` is set correctly
- [ ] Environment variables are loaded (restart dev server if needed)

### API Client
- [ ] `api-client.js` is in `renderer/src/`
- [ ] API client imports work in your components
- [ ] Base URL matches your backend server

### React Integration
- [ ] `useAPI.js` hook is in `renderer/src/hooks/`
- [ ] Components can import API functions
- [ ] No CORS errors in browser console
- [ ] Network tab shows successful API calls

## 🧪 Testing

### Manual Tests
- [ ] Run `node test-api-connection.js` - all tests pass
- [ ] Open browser dev tools - no CORS errors
- [ ] Network tab shows requests to `http://localhost:3000/api/*`
- [ ] API responses return expected data

### Component Tests
- [ ] Can fetch data on component mount
- [ ] Can create new items
- [ ] Can update existing items
- [ ] Can delete items
- [ ] Loading states work correctly
- [ ] Error messages display properly

## 📝 Code Integration

### Update Existing Components

For each component that needs API access:

- [ ] Import the appropriate API from `api-client.js`
- [ ] Replace old fetch/axios calls with new API client
- [ ] Use `useCRUD` or `useAPI` hooks for state management
- [ ] Add loading and error states
- [ ] Test CRUD operations

### Example Migration

**Before:**
```javascript
const [data, setData] = useState([]);

useEffect(() => {
  fetch('http://localhost:3000/api/clients')
    .then(res => res.json())
    .then(setData);
}, []);
```

**After:**
```javascript
import { clientsAPI } from './api-client';
import { useCRUD } from './hooks/useAPI';

const { items, loading, error, fetchAll } = useCRUD(clientsAPI);

useEffect(() => {
  fetchAll();
}, [fetchAll]);
```

## 🔍 Troubleshooting Checklist

### If you see CORS errors:
- [ ] Backend has `cors` package installed
- [ ] CORS middleware is configured in server.mjs
- [ ] Frontend URL is in CORS whitelist
- [ ] Backend server was restarted after CORS changes

### If you see "Connection Refused":
- [ ] Backend server is running
- [ ] Backend is on correct port (3000)
- [ ] `.env` file has correct API URL
- [ ] No firewall blocking localhost

### If you see 404 errors:
- [ ] Route exists in backend/routes/
- [ ] Route is registered in server.mjs
- [ ] Endpoint path matches exactly (check /api prefix)
- [ ] HTTP method is correct (GET, POST, PUT, DELETE)

### If data doesn't load:
- [ ] API call is being made (check Network tab)
- [ ] Backend returns data (test with curl)
- [ ] Response format matches expected structure
- [ ] State is being updated correctly

## 📚 Reference Files

When stuck, check these files:

1. **`START-HERE.md`** - Quick start guide
2. **`FRONTEND-BACKEND-INTEGRATION-GUIDE.md`** - Detailed guide
3. **`API-ENDPOINTS.md`** - All available endpoints
4. **`renderer/src/examples/ClientsExample.jsx`** - Working example
5. **`backend/routes/example-route-structure.mjs`** - Route template

## 🎯 Success Criteria

You'll know everything is working when:

✅ Backend server starts without errors
✅ Frontend dev server starts without errors
✅ `node test-api-connection.js` shows all tests passing
✅ Browser console has no CORS errors
✅ You can view data from the backend in your frontend
✅ You can create, update, and delete items
✅ Loading states work correctly
✅ Error messages display when something goes wrong

## 🚀 Next Steps After Integration

Once everything is checked off:

1. [ ] Remove old API code (if any)
2. [ ] Update all components to use new API client
3. [ ] Add proper error handling throughout app
4. [ ] Implement loading states consistently
5. [ ] Add user feedback (success/error messages)
6. [ ] Test all CRUD operations
7. [ ] Consider adding API caching if needed
8. [ ] Add authentication if required

---

**Pro Tip**: Work through one component at a time. Start with a simple one (like Clients) to verify everything works, then move to more complex components.

