/**
 * Seed Price Database with Common Xactimate Codes
 */
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../database/bcs-database.db');

const db = new sqlite3.Database(DB_PATH);

// Common Xactimate-style price list items
const priceListItems = [
  // DEMOLITION
  { xactimate_code: 'DEM-001', item_name: 'Remove Drywall', category: 'Demolition', description: 'Remove and dispose drywall', unit: 'SF', unit_price: 1.25, labor_hours: 0.01, material_cost: 0.15, equipment_cost: 0.10 },
  { xactimate_code: 'DEM-002', item_name: 'Remove Flooring', category: 'Demolition', description: 'Remove and dispose flooring material', unit: 'SF', unit_price: 2.50, labor_hours: 0.02, material_cost: 0.20, equipment_cost: 0.30 },
  { xactimate_code: 'DEM-003', item_name: 'Remove Baseboards', category: 'Demolition', description: 'Remove and dispose baseboards', unit: 'LF', unit_price: 1.75, labor_hours: 0.015, material_cost: 0, equipment_cost: 0.25 },
  { xactimate_code: 'DEM-004', item_name: 'Remove Cabinets', category: 'Demolition', description: 'Remove and dispose cabinets', unit: 'LF', unit_price: 8.50, labor_hours: 0.25, material_cost: 0, equipment_cost: 1.00 },

  // DRYWALL
  { xactimate_code: 'DRY-001', item_name: 'Install 1/2" Drywall', category: 'Drywall', description: 'Install 1/2" drywall on walls', unit: 'SF', unit_price: 2.85, labor_hours: 0.02, material_cost: 0.85, equipment_cost: 0.20 },
  { xactimate_code: 'DRY-002', item_name: 'Install 5/8" Drywall', category: 'Drywall', description: 'Install 5/8" drywall on ceiling', unit: 'SF', unit_price: 3.15, labor_hours: 0.025, material_cost: 1.15, equipment_cost: 0.20 },
  { xactimate_code: 'DRY-003', item_name: 'Tape & Texture Level 4', category: 'Drywall', description: 'Tape, mud, and texture drywall - Level 4 finish', unit: 'SF', unit_price: 1.85, labor_hours: 0.015, material_cost: 0.35, equipment_cost: 0.10 },
  { xactimate_code: 'DRY-004', item_name: 'Tape & Texture Level 5', category: 'Drywall', description: 'Tape, mud, and texture drywall - Level 5 finish', unit: 'SF', unit_price: 2.25, labor_hours: 0.02, material_cost: 0.45, equipment_cost: 0.10 },

  // PAINTING
  { xactimate_code: 'PNT-001', item_name: 'Prime Walls', category: 'Painting', description: 'Prime walls with primer sealer', unit: 'SF', unit_price: 0.85, labor_hours: 0.008, material_cost: 0.25, equipment_cost: 0.05 },
  { xactimate_code: 'PNT-002', item_name: 'Paint Walls (2 coats)', category: 'Painting', description: 'Paint walls with 2 coats premium paint', unit: 'SF', unit_price: 1.75, labor_hours: 0.015, material_cost: 0.55, equipment_cost: 0.10 },
  { xactimate_code: 'PNT-003', item_name: 'Paint Ceiling', category: 'Painting', description: 'Paint ceiling with 2 coats', unit: 'SF', unit_price: 1.95, labor_hours: 0.018, material_cost: 0.55, equipment_cost: 0.15 },
  { xactimate_code: 'PNT-004', item_name: 'Paint Trim', category: 'Painting', description: 'Paint trim and baseboards', unit: 'LF', unit_price: 2.25, labor_hours: 0.02, material_cost: 0.35, equipment_cost: 0.05 },

  // FLOORING
  { xactimate_code: 'FLR-001', item_name: 'Vinyl Plank Flooring', category: 'Flooring', description: 'Install luxury vinyl plank flooring', unit: 'SF', unit_price: 8.50, labor_hours: 0.08, material_cost: 3.50, equipment_cost: 0.50 },
  { xactimate_code: 'FLR-002', item_name: 'Carpet Standard', category: 'Flooring', description: 'Install standard carpet with pad', unit: 'SF', unit_price: 6.75, labor_hours: 0.06, material_cost: 2.75, equipment_cost: 0.50 },
  { xactimate_code: 'FLR-003', item_name: 'Hardwood Flooring', category: 'Flooring', description: 'Install prefinished hardwood flooring', unit: 'SF', unit_price: 12.50, labor_hours: 0.12, material_cost: 6.00, equipment_cost: 1.00 },
  { xactimate_code: 'FLR-004', item_name: 'Tile Flooring', category: 'Flooring', description: 'Install ceramic tile flooring', unit: 'SF', unit_price: 10.25, labor_hours: 0.15, material_cost: 4.25, equipment_cost: 0.75 },

  // TRIM & DOORS
  { xactimate_code: 'TRM-001', item_name: 'Baseboards', category: 'Trim', description: 'Install 3.5" MDF baseboards', unit: 'LF', unit_price: 4.75, labor_hours: 0.04, material_cost: 1.75, equipment_cost: 0.25 },
  { xactimate_code: 'TRM-002', item_name: 'Door Casing', category: 'Trim', description: 'Install door casing trim', unit: 'EA', unit_price: 45.00, labor_hours: 0.75, material_cost: 15.00, equipment_cost: 2.00 },
  { xactimate_code: 'DOR-001', item_name: 'Interior Door - 6 Panel', category: 'Doors', description: 'Install interior 6-panel hollow core door', unit: 'EA', unit_price: 285.00, labor_hours: 2.5, material_cost: 125.00, equipment_cost: 10.00 },
  { xactimate_code: 'DOR-002', item_name: 'Exterior Door - Steel', category: 'Doors', description: 'Install steel exterior door with frame', unit: 'EA', unit_price: 875.00, labor_hours: 4.0, material_cost: 425.00, equipment_cost: 25.00 },

  // WATER DAMAGE / RESTORATION
  { xactimate_code: 'WTR-001', item_name: 'Water Extraction', category: 'Water Damage', description: 'Emergency water extraction per 100 SF', unit: 'SF', unit_price: 3.50, labor_hours: 0.05, material_cost: 0.25, equipment_cost: 1.25 },
  { xactimate_code: 'WTR-002', item_name: 'Dehumidification - Day 1', category: 'Water Damage', description: 'Set up dehumidifiers (per day, first 3 days)', unit: 'EA', unit_price: 85.00, labor_hours: 1.0, material_cost: 5.00, equipment_cost: 35.00 },
  { xactimate_code: 'WTR-003', item_name: 'Air Mover Rental', category: 'Water Damage', description: 'Air mover rental per day', unit: 'EA', unit_price: 45.00, labor_hours: 0.25, material_cost: 2.00, equipment_cost: 25.00 },
  { xactimate_code: 'WTR-004', item_name: 'Antimicrobial Treatment', category: 'Water Damage', description: 'Apply antimicrobial treatment', unit: 'SF', unit_price: 1.25, labor_hours: 0.008, material_cost: 0.45, equipment_cost: 0.15 },

  // INSULATION
  { xactimate_code: 'INS-001', item_name: 'R-13 Batt Insulation', category: 'Insulation', description: 'Install R-13 fiberglass batt insulation', unit: 'SF', unit_price: 1.45, labor_hours: 0.01, material_cost: 0.65, equipment_cost: 0.05 },
  { xactimate_code: 'INS-002', item_name: 'R-30 Blown Insulation', category: 'Insulation', description: 'Install R-30 blown-in insulation', unit: 'SF', unit_price: 2.15, labor_hours: 0.015, material_cost: 0.95, equipment_cost: 0.25 },

  // ROOFING
  { xactimate_code: 'RFG-001', item_name: 'Asphalt Shingles', category: 'Roofing', description: 'Install architectural asphalt shingles', unit: 'SQ', unit_price: 425.00, labor_hours: 8.0, material_cost: 185.00, equipment_cost: 40.00 },
  { xactimate_code: 'RFG-002', item_name: 'Ice & Water Shield', category: 'Roofing', description: 'Install ice & water shield underlayment', unit: 'SQ', unit_price: 95.00, labor_hours: 1.5, material_cost: 45.00, equipment_cost: 5.00 },

  // PLUMBING
  { xactimate_code: 'PLM-001', item_name: 'Toilet Replacement', category: 'Plumbing', description: 'Replace standard toilet', unit: 'EA', unit_price: 385.00, labor_hours: 2.0, material_cost: 185.00, equipment_cost: 15.00 },
  { xactimate_code: 'PLM-002', item_name: 'Sink Replacement', category: 'Plumbing', description: 'Replace bathroom sink and faucet', unit: 'EA', unit_price: 425.00, labor_hours: 2.5, material_cost: 225.00, equipment_cost: 10.00 },

  // ELECTRICAL
  { xactimate_code: 'ELC-001', item_name: 'Outlet/Switch Replacement', category: 'Electrical', description: 'Replace standard outlet or switch', unit: 'EA', unit_price: 85.00, labor_hours: 0.75, material_cost: 12.00, equipment_cost: 3.00 },
  { xactimate_code: 'ELC-002', item_name: 'Light Fixture', category: 'Electrical', description: 'Install standard light fixture', unit: 'EA', unit_price: 165.00, labor_hours: 1.25, material_cost: 55.00, equipment_cost: 5.00 },
];

// Pricing rules
const pricingRules = [
  { rule_name: 'Standard Residential', category: 'General', markup_percentage: 20, overhead_percentage: 10, profit_percentage: 10, tax_percentage: 8.5, minimum_charge: 150 },
  { rule_name: 'Commercial Projects', category: 'General', markup_percentage: 25, overhead_percentage: 12, profit_percentage: 13, tax_percentage: 8.5, minimum_charge: 500 },
  { rule_name: 'Emergency Water Damage', category: 'Water Damage', markup_percentage: 15, overhead_percentage: 8, profit_percentage: 12, tax_percentage: 8.5, minimum_charge: 250 },
  { rule_name: 'Insurance Restoration', category: 'Restoration', markup_percentage: 20, overhead_percentage: 10, profit_percentage: 10, tax_percentage: 8.5, minimum_charge: 200 },
];

db.serialize(() => {
  const stmt = db.prepare(`
    INSERT INTO price_list (xactimate_code, item_name, category, description, unit, unit_price, labor_hours, material_cost, equipment_cost)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  priceListItems.forEach(item => {
    stmt.run(
      item.xactimate_code,
      item.item_name,
      item.category,
      item.description,
      item.unit,
      item.unit_price,
      item.labor_hours,
      item.material_cost,
      item.equipment_cost
    );
  });

  stmt.finalize();

  const ruleStmt = db.prepare(`
    INSERT INTO pricing_rules (rule_name, category, markup_percentage, overhead_percentage, profit_percentage, tax_percentage, minimum_charge)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  pricingRules.forEach(rule => {
    ruleStmt.run(
      rule.rule_name,
      rule.category,
      rule.markup_percentage,
      rule.overhead_percentage,
      rule.profit_percentage,
      rule.tax_percentage,
      rule.minimum_charge
    );
  });

  ruleStmt.finalize();

  console.log('✅ Price database seeded successfully!');
  console.log(`📊 Added ${priceListItems.length} price list items`);
  console.log(`📐 Added ${pricingRules.length} pricing rules`);

  db.close();
});
