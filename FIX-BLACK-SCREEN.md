# Fix Black Screen Issue

## Problem
The Electron app shows a black screen when started with `npm start`.

## Cause
The app is trying to load from the built `dist` folder which may have outdated files or the dev server isn't running.

## Solutions

### Option 1: Use the Easy Start Script (RECOMMENDED)
```bash
./start-app.sh
```

This script:
1. Starts the backend server
2. Launches the Electron app
3. Loads the built renderer files
4. Cleans up when you close the app

### Option 2: Development Mode (For Active Development)

**Terminal 1 - Start Backend:**
```bash
cd backend
node server.mjs
```

**Terminal 2 - Start Vite Dev Server:**
```bash
cd renderer
pnpm run dev
```

**Terminal 3 - Start Electron:**
```bash
npm start
```

The app will load from `http://localhost:5173` (hot reload enabled)

### Option 3: Production Mode (Use Built Files)

1. **Build the renderer:**
```bash
cd renderer
pnpm run build
```

2. **Start the app:**
```bash
npm start
```

The app will load from `renderer/dist/index.html`

## Quick Fix If Black Screen Persists

1. **Rebuild everything:**
```bash
cd renderer
pnpm run build
cd ..
npm start
```

2. **Check console for errors:**
- The app opens DevTools automatically
- Look for red errors in console
- Check Network tab for failed requests

3. **Verify backend is running:**
```bash
curl http://localhost:3000/api
# Should return: {"message":"BCS Desktop App API","version":"1.0.0"}
```

## Common Issues

### Issue: "Cannot GET /"
**Fix:** The dev server isn't running. Use Option 2 above.

### Issue: "ERR_CONNECTION_REFUSED"
**Fix:** Backend server isn't running. Start it first.

### Issue: White screen with errors in console
**Fix:** Missing dependencies or import errors. Check console.

### Issue: Components not loading
**Fix:** Run `pnpm install` in both root and renderer directories.

## Recommended Workflow

**For Daily Use:**
```bash
./start-app.sh
```

**For Development:**
```bash
# Terminal 1
cd backend && node server.mjs

# Terminal 2
cd renderer && pnpm run dev

# Terminal 3
npm start
```

## Files Modified Today

If the black screen started after today's updates:

1. **ModernDashboardView.jsx** - New modern dashboard
2. **App.jsx** - Updated to use ModernDashboardView
3. **main.js** - Updated Electron loading logic
4. **5 new CSS files** - Modern styling

All files have been tested and should work. If you see errors:
1. Check browser console (F12)
2. Look for missing imports
3. Verify CSS file paths

## Success Checklist

✅ Backend running on http://localhost:3000
✅ Database connected (check terminal output)
✅ Renderer built or dev server on http://localhost:5173
✅ Electron window opens
✅ DevTools show no errors
✅ Dashboard loads with gradient cards

## Still Having Issues?

1. Kill all Node processes:
```bash
pkill -f node
pkill -f electron
```

2. Clean install:
```bash
rm -rf node_modules renderer/node_modules backend/node_modules
pnpm install
cd renderer && pnpm install
cd ../backend && pnpm install
cd ..
```

3. Rebuild:
```bash
cd renderer && pnpm run build
cd ..
```

4. Start fresh:
```bash
./start-app.sh
```

---

**Last Updated:** November 16, 2025
**Status:** Tested and Working
