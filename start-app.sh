#!/bin/bash

# BCS Desktop App - Easy Start Script

echo "🚀 Starting BCS Desktop App..."
echo ""

# Start backend server in background
echo "📡 Starting backend server..."
cd backend
node server.mjs &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 2

# Start Electron app
echo "💻 Launching Electron app..."
npm start

# Cleanup when Electron closes
echo "🛑 Shutting down backend server..."
kill $BACKEND_PID 2>/dev/null

echo "✅ App closed"
