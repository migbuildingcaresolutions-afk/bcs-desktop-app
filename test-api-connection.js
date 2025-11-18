#!/usr/bin/env node

/**
 * Simple script to test API connectivity
 * Run with: node test-api-connection.js
 */

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

async function testEndpoint(name, endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const data = await response.json();
    console.log(`✅ ${name}: OK (${response.status})`);
    console.log(`   Response:`, JSON.stringify(data).substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.log(`❌ ${name}: FAILED`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testHealthCheck() {
  try {
    const response = await fetch('http://localhost:3000/health');
    const data = await response.json();
    console.log(`✅ Health Check: OK`);
    console.log(`   Server Status:`, data.status);
    return true;
  } catch (error) {
    console.log(`❌ Health Check: FAILED`);
    console.log(`   Error: ${error.message}`);
    console.log(`   Make sure the backend server is running!`);
    return false;
  }
}

async function runTests() {
  console.log('🔍 Testing API Connection...\n');
  console.log(`API Base URL: ${API_BASE_URL}\n`);

  // Test health check first
  const healthOk = await testHealthCheck();
  console.log('');

  if (!healthOk) {
    console.log('⚠️  Backend server is not running. Start it with:');
    console.log('   cd backend && npm start\n');
    return;
  }

  // Test various endpoints
  const endpoints = [
    ['Clients', '/clients'],
    ['Work Orders', '/work-orders'],
    ['Invoices', '/invoices'],
    ['Employees', '/employees'],
    ['Dashboard', '/dashboard'],
  ];

  let passed = 0;
  let failed = 0;

  for (const [name, endpoint] of endpoints) {
    const result = await testEndpoint(name, endpoint);
    if (result) passed++;
    else failed++;
    console.log('');
  }

  console.log('━'.repeat(50));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('🎉 All tests passed! Your API is ready to use.\n');
  } else {
    console.log('⚠️  Some endpoints failed. Check your backend routes.\n');
  }
}

// Run the tests
runTests().catch(console.error);

