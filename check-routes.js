#!/usr/bin/env node

/**
 * Script to check if backend routes are properly structured
 * This will attempt to import each route and verify it exports a router
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routesDir = join(__dirname, 'backend', 'routes');

async function checkRoutes() {
  console.log('🔍 Checking backend routes...\n');
  
  try {
    const files = await readdir(routesDir);
    const routeFiles = files.filter(f => f.endsWith('.mjs') && f !== 'example-route-structure.mjs');
    
    console.log(`Found ${routeFiles.length} route files:\n`);
    
    let passed = 0;
    let failed = 0;
    const errors = [];
    
    for (const file of routeFiles) {
      const routePath = join(routesDir, file);
      const routeName = file.replace('.mjs', '');
      
      try {
        // Try to import the route
        const module = await import(`file://${routePath}`);
        
        // Check if it exports a default router
        if (module.default) {
          console.log(`✅ ${routeName.padEnd(30)} - Valid router exported`);
          passed++;
        } else {
          console.log(`⚠️  ${routeName.padEnd(30)} - No default export found`);
          errors.push({ file, error: 'No default export' });
          failed++;
        }
      } catch (error) {
        console.log(`❌ ${routeName.padEnd(30)} - Import failed`);
        errors.push({ file, error: error.message });
        failed++;
      }
    }
    
    console.log('\n' + '━'.repeat(60));
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
    
    if (errors.length > 0) {
      console.log('❌ Errors found:\n');
      errors.forEach(({ file, error }) => {
        console.log(`   ${file}: ${error}`);
      });
      console.log('');
    }
    
    if (failed === 0) {
      console.log('🎉 All routes are properly structured!\n');
      console.log('Next steps:');
      console.log('1. Start the backend server: cd backend && npm start');
      console.log('2. Test the API: node test-api-connection.js\n');
    } else {
      console.log('⚠️  Some routes need attention. Check the errors above.\n');
    }
    
  } catch (error) {
    console.error('❌ Error reading routes directory:', error.message);
    process.exit(1);
  }
}

checkRoutes().catch(console.error);

