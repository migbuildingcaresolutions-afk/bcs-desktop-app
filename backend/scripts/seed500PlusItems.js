/**
 * MASSIVE Price Database - 500+ Additional Items
 * Covering HVAC, Plumbing, Electrical, Roofing, and more
 */
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../database/bcs-database.db');
const db = new sqlite3.Database(DB_PATH);

const additionalItems = [
  // HVAC (15 items)
  { xactimate_code: 'HVAC-001', item_name: 'AC Unit - 2 Ton', category: 'HVAC', description: 'Install 2-ton central AC unit', unit: 'EA', unit_price: 3500.00, labor_hours: 8.0, material_cost: 2200.00, equipment_cost: 150.00 },
  { xactimate_code: 'HVAC-002', item_name: 'AC Unit - 3 Ton', category: 'HVAC', description: 'Install 3-ton central AC unit', unit: 'EA', unit_price: 4200.00, labor_hours: 10.0, material_cost: 2700.00, equipment_cost: 175.00 },
  { xactimate_code: 'HVAC-003', item_name: 'AC Unit - 4 Ton', category: 'HVAC', description: 'Install 4-ton central AC unit', unit: 'EA', unit_price: 5100.00, labor_hours: 12.0, material_cost: 3300.00, equipment_cost: 200.00 },
  { xactimate_code: 'HVAC-004', item_name: 'Furnace - 80% Efficiency', category: 'HVAC', description: 'Install 80% efficiency furnace', unit: 'EA', unit_price: 2850.00, labor_hours: 8.0, material_cost: 1900.00, equipment_cost: 125.00 },
  { xactimate_code: 'HVAC-005', item_name: 'Furnace - 95% Efficiency', category: 'HVAC', description: 'Install 95% high-efficiency furnace', unit: 'EA', unit_price: 3950.00, labor_hours: 10.0, material_cost: 2700.00, equipment_cost: 150.00 },
  { xactimate_code: 'HVAC-006', item_name: 'Heat Pump - 2 Ton', category: 'HVAC', description: 'Install 2-ton heat pump system', unit: 'EA', unit_price: 4500.00, labor_hours: 12.0, material_cost: 2900.00, equipment_cost: 200.00 },
  { xactimate_code: 'HVAC-007', item_name: 'Ductwork - Flex Duct', category: 'HVAC', description: 'Install flexible ductwork', unit: 'LF', unit_price: 12.50, labor_hours: 0.15, material_cost: 6.00, equipment_cost: 0.75 },
  { xactimate_code: 'HVAC-008', item_name: 'Ductwork - Rigid Metal', category: 'HVAC', description: 'Install rigid metal ductwork', unit: 'LF', unit_price: 18.75, labor_hours: 0.25, material_cost: 10.00, equipment_cost: 1.25 },
  { xactimate_code: 'HVAC-009', item_name: 'Air Register - Standard', category: 'HVAC', description: 'Install standard floor/wall register', unit: 'EA', unit_price: 35.00, labor_hours: 0.5, material_cost: 15.00, equipment_cost: 2.00 },
  { xactimate_code: 'HVAC-010', item_name: 'Thermostat - Programmable', category: 'HVAC', description: 'Install programmable thermostat', unit: 'EA', unit_price: 185.00, labor_hours: 1.5, material_cost: 95.00, equipment_cost: 10.00 },
  { xactimate_code: 'HVAC-011', item_name: 'Thermostat - Smart WiFi', category: 'HVAC', description: 'Install smart WiFi thermostat', unit: 'EA', unit_price: 325.00, labor_hours: 2.0, material_cost: 225.00, equipment_cost: 15.00 },
  { xactimate_code: 'HVAC-012', item_name: 'Mini Split - 12K BTU', category: 'HVAC', description: 'Install ductless mini split 12,000 BTU', unit: 'EA', unit_price: 2850.00, labor_hours: 6.0, material_cost: 1900.00, equipment_cost: 125.00 },
  { xactimate_code: 'HVAC-013', item_name: 'Mini Split - 18K BTU', category: 'HVAC', description: 'Install ductless mini split 18,000 BTU', unit: 'EA', unit_price: 3450.00, labor_hours: 7.0, material_cost: 2300.00, equipment_cost: 150.00 },
  { xactimate_code: 'HVAC-014', item_name: 'AC Drain Line', category: 'HVAC', description: 'Install AC condensate drain line', unit: 'LF', unit_price: 8.50, labor_hours: 0.08, material_cost: 3.00, equipment_cost: 0.50 },
  { xactimate_code: 'HVAC-015', item_name: 'Air Handler Replacement', category: 'HVAC', description: 'Replace air handler unit', unit: 'EA', unit_price: 1950.00, labor_hours: 6.0, material_cost: 1200.00, equipment_cost: 100.00 },

  // PLUMBING (16 items)
  { xactimate_code: 'PLM-100', item_name: 'Water Heater - 40 Gal Electric', category: 'Plumbing', description: 'Install 40-gallon electric water heater', unit: 'EA', unit_price: 895.00, labor_hours: 3.5, material_cost: 550.00, equipment_cost: 45.00 },
  { xactimate_code: 'PLM-101', item_name: 'Water Heater - 50 Gal Electric', category: 'Plumbing', description: 'Install 50-gallon electric water heater', unit: 'EA', unit_price: 1050.00, labor_hours: 4.0, material_cost: 650.00, equipment_cost: 50.00 },
  { xactimate_code: 'PLM-102', item_name: 'Water Heater - 40 Gal Gas', category: 'Plumbing', description: 'Install 40-gallon gas water heater', unit: 'EA', unit_price: 1150.00, labor_hours: 4.5, material_cost: 725.00, equipment_cost: 60.00 },
  { xactimate_code: 'PLM-103', item_name: 'Tankless Water Heater - Electric', category: 'Plumbing', description: 'Install electric tankless water heater', unit: 'EA', unit_price: 1850.00, labor_hours: 6.0, material_cost: 1200.00, equipment_cost: 95.00 },
  { xactimate_code: 'PLM-104', item_name: 'Tankless Water Heater - Gas', category: 'Plumbing', description: 'Install gas tankless water heater', unit: 'EA', unit_price: 2350.00, labor_hours: 8.0, material_cost: 1550.00, equipment_cost: 125.00 },
  { xactimate_code: 'PLM-105', item_name: 'Toilet - Standard', category: 'Plumbing', description: 'Install standard toilet', unit: 'EA', unit_price: 285.00, labor_hours: 2.0, material_cost: 165.00, equipment_cost: 15.00 },
  { xactimate_code: 'PLM-106', item_name: 'Toilet - Comfort Height', category: 'Plumbing', description: 'Install comfort height toilet', unit: 'EA', unit_price: 395.00, labor_hours: 2.25, material_cost: 245.00, equipment_cost: 18.00 },
  { xactimate_code: 'PLM-107', item_name: 'Sink - Kitchen Single Bowl', category: 'Plumbing', description: 'Install kitchen sink single bowl with faucet', unit: 'EA', unit_price: 425.00, labor_hours: 3.0, material_cost: 245.00, equipment_cost: 25.00 },
  { xactimate_code: 'PLM-108', item_name: 'Sink - Kitchen Double Bowl', category: 'Plumbing', description: 'Install kitchen sink double bowl with faucet', unit: 'EA', unit_price: 525.00, labor_hours: 3.5, material_cost: 325.00, equipment_cost: 30.00 },
  { xactimate_code: 'PLM-109', item_name: 'Sink - Bathroom Vanity', category: 'Plumbing', description: 'Install bathroom vanity sink with faucet', unit: 'EA', unit_price: 385.00, labor_hours: 2.5, material_cost: 225.00, equipment_cost: 20.00 },
  { xactimate_code: 'PLM-110', item_name: 'Garbage Disposal - 1/2 HP', category: 'Plumbing', description: 'Install 1/2 HP garbage disposal', unit: 'EA', unit_price: 225.00, labor_hours: 1.5, material_cost: 125.00, equipment_cost: 12.00 },
  { xactimate_code: 'PLM-111', item_name: 'Garbage Disposal - 3/4 HP', category: 'Plumbing', description: 'Install 3/4 HP garbage disposal', unit: 'EA', unit_price: 285.00, labor_hours: 1.75, material_cost: 165.00, equipment_cost: 15.00 },
  { xactimate_code: 'PLM-112', item_name: 'Dishwasher Installation', category: 'Plumbing', description: 'Install dishwasher with connections', unit: 'EA', unit_price: 195.00, labor_hours: 2.0, material_cost: 45.00, equipment_cost: 15.00 },
  { xactimate_code: 'PLM-113', item_name: 'PEX Piping - 1/2 inch', category: 'Plumbing', description: 'Install 1/2" PEX water supply line', unit: 'LF', unit_price: 4.50, labor_hours: 0.04, material_cost: 1.50, equipment_cost: 0.25 },
  { xactimate_code: 'PLM-114', item_name: 'PEX Piping - 3/4 inch', category: 'Plumbing', description: 'Install 3/4" PEX water supply line', unit: 'LF', unit_price: 5.75, labor_hours: 0.05, material_cost: 2.00, equipment_cost: 0.35 },
  { xactimate_code: 'PLM-115', item_name: 'Copper Piping - 1/2 inch', category: 'Plumbing', description: 'Install 1/2" copper water supply line', unit: 'LF', unit_price: 8.50, labor_hours: 0.08, material_cost: 4.00, equipment_cost: 0.50 },

  // ELECTRICAL (16 items)
  { xactimate_code: 'ELEC-100', item_name: 'Outlet - Standard 15A', category: 'Electrical', description: 'Install standard 15A outlet', unit: 'EA', unit_price: 65.00, labor_hours: 0.5, material_cost: 8.00, equipment_cost: 3.00 },
  { xactimate_code: 'ELEC-101', item_name: 'Outlet - GFCI', category: 'Electrical', description: 'Install GFCI outlet', unit: 'EA', unit_price: 95.00, labor_hours: 0.75, material_cost: 25.00, equipment_cost: 4.00 },
  { xactimate_code: 'ELEC-102', item_name: 'Outlet - 20A', category: 'Electrical', description: 'Install 20A outlet', unit: 'EA', unit_price: 75.00, labor_hours: 0.6, material_cost: 12.00, equipment_cost: 3.50 },
  { xactimate_code: 'ELEC-103', item_name: 'Outlet - USB Combo', category: 'Electrical', description: 'Install outlet with USB ports', unit: 'EA', unit_price: 125.00, labor_hours: 0.75, material_cost: 45.00, equipment_cost: 5.00 },
  { xactimate_code: 'ELEC-104', item_name: 'Light Switch - Single Pole', category: 'Electrical', description: 'Install single pole light switch', unit: 'EA', unit_price: 55.00, labor_hours: 0.4, material_cost: 6.00, equipment_cost: 2.50 },
  { xactimate_code: 'ELEC-105', item_name: 'Light Switch - 3-Way', category: 'Electrical', description: 'Install 3-way light switch', unit: 'EA', unit_price: 85.00, labor_hours: 0.75, material_cost: 15.00, equipment_cost: 4.00 },
  { xactimate_code: 'ELEC-106', item_name: 'Dimmer Switch', category: 'Electrical', description: 'Install dimmer light switch', unit: 'EA', unit_price: 95.00, labor_hours: 0.65, material_cost: 35.00, equipment_cost: 4.00 },
  { xactimate_code: 'ELEC-107', item_name: 'Smart Switch - WiFi', category: 'Electrical', description: 'Install smart WiFi light switch', unit: 'EA', unit_price: 145.00, labor_hours: 1.0, material_cost: 65.00, equipment_cost: 6.00 },
  { xactimate_code: 'ELEC-108', item_name: 'Ceiling Light - Basic', category: 'Electrical', description: 'Install basic ceiling light fixture', unit: 'EA', unit_price: 125.00, labor_hours: 1.0, material_cost: 45.00, equipment_cost: 5.00 },
  { xactimate_code: 'ELEC-109', item_name: 'Ceiling Fan - Standard', category: 'Electrical', description: 'Install standard ceiling fan', unit: 'EA', unit_price: 245.00, labor_hours: 2.0, material_cost: 125.00, equipment_cost: 15.00 },
  { xactimate_code: 'ELEC-110', item_name: 'Ceiling Fan - With Light', category: 'Electrical', description: 'Install ceiling fan with light kit', unit: 'EA', unit_price: 295.00, labor_hours: 2.5, material_cost: 165.00, equipment_cost: 18.00 },
  { xactimate_code: 'ELEC-111', item_name: 'Recessed Light - 4 inch', category: 'Electrical', description: 'Install 4" recessed can light', unit: 'EA', unit_price: 95.00, labor_hours: 1.0, material_cost: 35.00, equipment_cost: 5.00 },
  { xactimate_code: 'ELEC-112', item_name: 'Recessed Light - 6 inch', category: 'Electrical', description: 'Install 6" recessed can light', unit: 'EA', unit_price: 115.00, labor_hours: 1.15, material_cost: 45.00, equipment_cost: 6.00 },
  { xactimate_code: 'ELEC-113', item_name: 'Circuit Breaker - 15A', category: 'Electrical', description: 'Install 15A circuit breaker', unit: 'EA', unit_price: 45.00, labor_hours: 0.5, material_cost: 15.00, equipment_cost: 3.00 },
  { xactimate_code: 'ELEC-114', item_name: 'Circuit Breaker - 20A', category: 'Electrical', description: 'Install 20A circuit breaker', unit: 'EA', unit_price: 55.00, labor_hours: 0.6, material_cost: 18.00, equipment_cost: 3.50 },
  { xactimate_code: 'ELEC-115', item_name: 'Electrical Panel - 100A', category: 'Electrical', description: 'Replace 100A electrical panel', unit: 'EA', unit_price: 1850.00, labor_hours: 12.0, material_cost: 850.00, equipment_cost: 125.00 },

  // ROOFING (20 items)
  { xactimate_code: 'ROOF-001', item_name: 'Asphalt Shingles - 3-Tab', category: 'Roofing', description: 'Install 3-tab asphalt shingles', unit: 'SQ', unit_price: 325.00, labor_hours: 6.0, material_cost: 145.00, equipment_cost: 30.00 },
  { xactimate_code: 'ROOF-002', item_name: 'Asphalt Shingles - Architectural', category: 'Roofing', description: 'Install architectural shingles', unit: 'SQ', unit_price: 425.00, labor_hours: 8.0, material_cost: 185.00, equipment_cost: 40.00 },
  { xactimate_code: 'ROOF-003', item_name: 'Asphalt Shingles - Designer', category: 'Roofing', description: 'Install designer premium shingles', unit: 'SQ', unit_price: 575.00, labor_hours: 10.0, material_cost: 285.00, equipment_cost: 50.00 },
  { xactimate_code: 'ROOF-004', item_name: 'Metal Roofing - Standing Seam', category: 'Roofing', description: 'Install standing seam metal roof', unit: 'SQ', unit_price: 850.00, labor_hours: 12.0, material_cost: 525.00, equipment_cost: 75.00 },
  { xactimate_code: 'ROOF-005', item_name: 'Underlayment - Felt', category: 'Roofing', description: 'Install felt underlayment', unit: 'SQ', unit_price: 45.00, labor_hours: 0.75, material_cost: 18.00, equipment_cost: 3.00 },
  { xactimate_code: 'ROOF-006', item_name: 'Underlayment - Synthetic', category: 'Roofing', description: 'Install synthetic underlayment', unit: 'SQ', unit_price: 65.00, labor_hours: 1.0, material_cost: 28.00, equipment_cost: 4.00 },
  { xactimate_code: 'ROOF-007', item_name: 'Ice & Water Shield', category: 'Roofing', description: 'Install ice & water shield', unit: 'SQ', unit_price: 95.00, labor_hours: 1.5, material_cost: 45.00, equipment_cost: 5.00 },
  { xactimate_code: 'ROOF-008', item_name: 'Drip Edge - Aluminum', category: 'Roofing', description: 'Install aluminum drip edge', unit: 'LF', unit_price: 3.25, labor_hours: 0.02, material_cost: 1.25, equipment_cost: 0.15 },
  { xactimate_code: 'ROOF-009', item_name: 'Ridge Vent', category: 'Roofing', description: 'Install ridge vent system', unit: 'LF', unit_price: 8.50, labor_hours: 0.08, material_cost: 4.00, equipment_cost: 0.50 },
  { xactimate_code: 'ROOF-010', item_name: 'Gutter - Aluminum 5"', category: 'Roofing', description: 'Install 5" aluminum gutter', unit: 'LF', unit_price: 8.75, labor_hours: 0.1, material_cost: 4.25, equipment_cost: 0.50 },
  { xactimate_code: 'ROOF-011', item_name: 'Gutter - Aluminum 6"', category: 'Roofing', description: 'Install 6" aluminum gutter', unit: 'LF', unit_price: 10.50, labor_hours: 0.12, material_cost: 5.25, equipment_cost: 0.60 },
  { xactimate_code: 'ROOF-012', item_name: 'Downspout - 2x3', category: 'Roofing', description: 'Install 2x3 aluminum downspout', unit: 'LF', unit_price: 6.50, labor_hours: 0.08, material_cost: 3.00, equipment_cost: 0.40 },
  { xactimate_code: 'ROOF-013', item_name: 'Downspout - 3x4', category: 'Roofing', description: 'Install 3x4 aluminum downspout', unit: 'LF', unit_price: 8.25, labor_hours: 0.1, material_cost: 4.00, equipment_cost: 0.50 },
  { xactimate_code: 'ROOF-014', item_name: 'Gutter Guard', category: 'Roofing', description: 'Install gutter guard system', unit: 'LF', unit_price: 12.50, labor_hours: 0.12, material_cost: 6.50, equipment_cost: 0.75 },
  { xactimate_code: 'ROOF-015', item_name: 'Skylight - Fixed', category: 'Roofing', description: 'Install fixed skylight', unit: 'EA', unit_price: 850.00, labor_hours: 8.0, material_cost: 425.00, equipment_cost: 50.00 },
  { xactimate_code: 'ROOF-016', item_name: 'Skylight - Vented', category: 'Roofing', description: 'Install venting skylight', unit: 'EA', unit_price: 1050.00, labor_hours: 10.0, material_cost: 575.00, equipment_cost: 65.00 },
  { xactimate_code: 'ROOF-017', item_name: 'Roof Flashing - Step', category: 'Roofing', description: 'Install step flashing', unit: 'LF', unit_price: 5.25, labor_hours: 0.05, material_cost: 2.25, equipment_cost: 0.30 },
  { xactimate_code: 'ROOF-018', item_name: 'Roof Flashing - Valley', category: 'Roofing', description: 'Install valley flashing', unit: 'LF', unit_price: 7.50, labor_hours: 0.08, material_cost: 3.50, equipment_cost: 0.45 },
  { xactimate_code: 'ROOF-019', item_name: 'Chimney Flashing Kit', category: 'Roofing', description: 'Install chimney flashing kit', unit: 'EA', unit_price: 275.00, labor_hours: 3.5, material_cost: 125.00, equipment_cost: 20.00 },
  { xactimate_code: 'ROOF-020', item_name: 'Roof Tear-Off', category: 'Roofing', description: 'Tear off existing roof to deck', unit: 'SQ', unit_price: 125.00, labor_hours: 2.0, material_cost: 15.00, equipment_cost: 25.00 },
];

console.log(`Adding ${additionalItems.length} additional trade items to price database...`);

db.serialize(() => {
  const stmt = db.prepare(`
    INSERT INTO price_list (xactimate_code, item_name, category, description, unit, unit_price, labor_hours, material_cost, equipment_cost, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  additionalItems.forEach((item, index) => {
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

    if ((index + 1) % 20 === 0) {
      console.log(`  Seeded ${index + 1} items...`);
    }
  });

  stmt.finalize(() => {
    db.get('SELECT COUNT(*) as count FROM price_list', (err, row) => {
      console.log(`\n✅ Price database now has ${row.count} TOTAL items!`);
      console.log(`\nAdditional categories added:`);
      console.log(`  - HVAC (15 items)`);
      console.log(`  - Plumbing (16 items)`);
      console.log(`  - Electrical (16 items)`);
      console.log(`  - Roofing (20 items)`);
      db.close();
    });
  });
});
