/**
 * Seed Price List with Xactimate-Style Items
 * Common restoration and construction items
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../database/bcs-database.db');

const db = new sqlite3.Database(DB_PATH);

// Sample price list items (Xactimate-style)
const priceListItems = [
  // DEMOLITION & REMOVAL
  { code: 'RMV DRY', category: 'Demolition', description: 'Remove drywall', unit: 'SF', unit_price: 2.50, labor_rate: 45, material_cost: 0 },
  { code: 'RMV INS', category: 'Demolition', description: 'Remove insulation', unit: 'SF', unit_price: 1.25, labor_rate: 35, material_cost: 0 },
  { code: 'RMV FLR', category: 'Demolition', description: 'Remove flooring', unit: 'SF', unit_price: 3.00, labor_rate: 45, material_cost: 0 },
  { code: 'RMV CAB', category: 'Demolition', description: 'Remove cabinet - base', unit: 'LF', unit_price: 15.00, labor_rate: 50, material_cost: 0 },
  { code: 'DEM GEN', category: 'Demolition', description: 'General demolition labor', unit: 'HR', unit_price: 45.00, labor_rate: 45, material_cost: 0 },

  // DRYWALL
  { code: 'INS DRY', category: 'Drywall', description: 'Install drywall 1/2"', unit: 'SF', unit_price: 3.50, labor_rate: 45, material_cost: 0.75 },
  { code: 'INS DRY 5/8', category: 'Drywall', description: 'Install drywall 5/8"', unit: 'SF', unit_price: 4.00, labor_rate: 45, material_cost: 0.90 },
  { code: 'TEX SPR', category: 'Drywall', description: 'Texture - spray', unit: 'SF', unit_price: 1.50, labor_rate: 35, material_cost: 0.25 },
  { code: 'TEX KNO', category: 'Drywall', description: 'Texture - knockdown', unit: 'SF', unit_price: 1.75, labor_rate: 35, material_cost: 0.30 },

  // INSULATION
  { code: 'INS INS R13', category: 'Insulation', description: 'Install insulation R-13', unit: 'SF', unit_price: 1.50, labor_rate: 35, material_cost: 0.80 },
  { code: 'INS INS R19', category: 'Insulation', description: 'Install insulation R-19', unit: 'SF', unit_price: 1.75, labor_rate: 35, material_cost: 1.00 },
  { code: 'INS INS R30', category: 'Insulation', description: 'Install insulation R-30', unit: 'SF', unit_price: 2.25, labor_rate: 35, material_cost: 1.40 },

  // PAINTING
  { code: 'PNT INT', category: 'Painting', description: 'Paint interior - 2 coats', unit: 'SF', unit_price: 2.00, labor_rate: 40, material_cost: 0.50 },
  { code: 'PNT EXT', category: 'Painting', description: 'Paint exterior - 2 coats', unit: 'SF', unit_price: 2.50, labor_rate: 40, material_cost: 0.60 },
  { code: 'PNT PRM', category: 'Painting', description: 'Prime & seal', unit: 'SF', unit_price: 1.25, labor_rate: 35, material_cost: 0.35 },

  // FLOORING
  { code: 'INS CAR', category: 'Flooring', description: 'Install carpet - standard', unit: 'SF', unit_price: 4.50, labor_rate: 35, material_cost: 2.50 },
  { code: 'INS VNL', category: 'Flooring', description: 'Install vinyl plank flooring', unit: 'SF', unit_price: 5.00, labor_rate: 40, material_cost: 3.00 },
  { code: 'INS TLE', category: 'Flooring', description: 'Install tile - ceramic', unit: 'SF', unit_price: 8.00, labor_rate: 50, material_cost: 4.00 },
  { code: 'INS HWD', category: 'Flooring', description: 'Install hardwood flooring', unit: 'SF', unit_price: 10.00, labor_rate: 55, material_cost: 6.00 },
  { code: 'INS LAM', category: 'Flooring', description: 'Install laminate flooring', unit: 'SF', unit_price: 4.00, labor_rate: 35, material_cost: 2.25 },

  // CABINETRY
  { code: 'INS CAB BSE', category: 'Cabinetry', description: 'Install base cabinet', unit: 'LF', unit_price: 125.00, labor_rate: 60, material_cost: 75.00 },
  { code: 'INS CAB UPR', category: 'Cabinetry', description: 'Install upper cabinet', unit: 'LF', unit_price: 100.00, labor_rate: 55, material_cost: 60.00 },
  { code: 'INS CNT', category: 'Cabinetry', description: 'Install countertop - laminate', unit: 'SF', unit_price: 35.00, labor_rate: 50, material_cost: 20.00 },
  { code: 'INS CNT GRN', category: 'Cabinetry', description: 'Install countertop - granite', unit: 'SF', unit_price: 75.00, labor_rate: 60, material_cost: 50.00 },

  // EQUIPMENT RENTAL
  { code: 'EQP DHU', category: 'Equipment', description: 'Dehumidifier rental - per day', unit: 'DAY', unit_price: 75.00, labor_rate: 0, equipment_cost: 75.00 },
  { code: 'EQP FAN', category: 'Equipment', description: 'Air mover rental - per day', unit: 'DAY', unit_price: 25.00, labor_rate: 0, equipment_cost: 25.00 },
  { code: 'EQP SCF', category: 'Equipment', description: 'Scaffolding rental - per day', unit: 'DAY', unit_price: 65.00, labor_rate: 0, equipment_cost: 65.00 },
  { code: 'EQP DMP', category: 'Equipment', description: 'Dumpster rental - 20 yard', unit: 'EA', unit_price: 450.00, labor_rate: 0, equipment_cost: 450.00 },

  // PLUMBING
  { code: 'INS PLM FXT', category: 'Plumbing', description: 'Install plumbing fixture', unit: 'EA', unit_price: 250.00, labor_rate: 85, material_cost: 150.00 },
  { code: 'INS PLM PIP', category: 'Plumbing', description: 'Install PEX piping', unit: 'LF', unit_price: 8.00, labor_rate: 75, material_cost: 2.50 },

  // ELECTRICAL
  { code: 'INS ELC OUT', category: 'Electrical', description: 'Install electrical outlet', unit: 'EA', unit_price: 85.00, labor_rate: 75, material_cost: 15.00 },
  { code: 'INS ELC SWH', category: 'Electrical', description: 'Install light switch', unit: 'EA', unit_price: 75.00, labor_rate: 75, material_cost: 12.00 },
  { code: 'INS ELC FXT', category: 'Electrical', description: 'Install light fixture', unit: 'EA', unit_price: 150.00, labor_rate: 80, material_cost: 75.00 },

  // ROOFING
  { code: 'INS RFG SHG', category: 'Roofing', description: 'Install asphalt shingles', unit: 'SQ', unit_price: 350.00, labor_rate: 100, material_cost: 150.00 },
  { code: 'RMV RFG', category: 'Roofing', description: 'Remove roofing - 1 layer', unit: 'SQ', unit_price: 125.00, labor_rate: 85, material_cost: 0 },

  // MISC
  { code: 'CLN GEN', category: 'Cleaning', description: 'General cleaning - post construction', unit: 'SF', unit_price: 0.50, labor_rate: 30, material_cost: 0.10 },
  { code: 'DSP HAZ', category: 'Disposal', description: 'Hazmat disposal', unit: 'CF', unit_price: 15.00, labor_rate: 0, material_cost: 15.00 },
  { code: 'PAD CAR', category: 'Protection', description: 'Floor protection - carpet shield', unit: 'SF', unit_price: 0.75, labor_rate: 15, material_cost: 0.40 },
];

async function seedPriceList() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Get the default price list ID
      db.get('SELECT id FROM price_lists WHERE id = 1', (err, priceList) => {
        if (err) {
          console.error('Error getting price list:', err);
          reject(err);
          return;
        }

        if (!priceList) {
          console.error('Default price list not found. Run enhanceDatabase-v2.js first');
          reject(new Error('Price list not found'));
          return;
        }

        const priceListId = priceList.id;
        console.log(`Using price list ID: ${priceListId}`);

        // Clear existing items
        db.run('DELETE FROM price_list_items WHERE price_list_id = ?', [priceListId], (err) => {
          if (err) {
            console.error('Error clearing price list items:', err);
          } else {
            console.log('Cleared existing price list items');
          }
        });

        // Insert new items
        const stmt = db.prepare(`
          INSERT INTO price_list_items
          (price_list_id, code, category, description, unit, unit_price, labor_rate, material_cost, equipment_cost)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        let count = 0;
        priceListItems.forEach((item) => {
          stmt.run(
            priceListId,
            item.code,
            item.category,
            item.description,
            item.unit,
            item.unit_price,
            item.labor_rate || 0,
            item.material_cost || 0,
            item.equipment_cost || 0,
            (err) => {
              if (err) {
                console.error(`Error inserting ${item.code}:`, err.message);
              } else {
                count++;
              }
            }
          );
        });

        stmt.finalize((err) => {
          if (err) {
            console.error('Error finalizing statement:', err);
            reject(err);
          } else {
            console.log(`\n✅ Successfully seeded ${count} price list items!`);
            resolve(count);
          }
        });
      });
    });
  });
}

// Run the seeding
seedPriceList()
  .then((count) => {
    console.log('\n========================================');
    console.log(`🎉 Price List Seeded with ${count} Items!`);
    console.log('========================================');
    console.log('\nCategories included:');
    console.log('  - Demolition');
    console.log('  - Drywall');
    console.log('  - Insulation');
    console.log('  - Painting');
    console.log('  - Flooring');
    console.log('  - Cabinetry');
    console.log('  - Equipment');
    console.log('  - Plumbing');
    console.log('  - Electrical');
    console.log('  - Roofing');
    console.log('  - Misc');
    console.log('\n========================================\n');

    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
        process.exit(1);
      }
      process.exit(0);
    });
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    db.close();
    process.exit(1);
  });
