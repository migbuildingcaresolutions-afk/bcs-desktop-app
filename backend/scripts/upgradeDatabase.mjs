import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'database', 'bcs-database.db');
const db = new sqlite3.Database(dbPath);

// Promisify db.run and db.all
const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

async function upgradeDatabase() {
  console.log('🚀 Starting BCS Database Upgrade...\n');

  try {
    // Enable foreign keys
    await run('PRAGMA foreign_keys = ON');

    // =============================
    // 1. CREATE CATEGORIES TABLE (52 master categories)
    // =============================
    console.log('📁 Creating categories table...');
    await run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // =============================
    // 2. CREATE SUBCATEGORIES TABLE
    // =============================
    console.log('📁 Creating subcategories table...');
    await run(`
      CREATE TABLE IF NOT EXISTS subcategories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);

    // =============================
    // 3. CREATE ENHANCED PRICE LIST TABLE
    // =============================
    console.log('📁 Creating enhanced price_list_master table...');
    await run(`
      CREATE TABLE IF NOT EXISTS price_list_master (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        subcategory_id INTEGER,
        code TEXT NOT NULL,
        description TEXT NOT NULL,
        unit TEXT NOT NULL,
        labor_cost REAL DEFAULT 0,
        material_cost REAL DEFAULT 0,
        equipment_cost REAL DEFAULT 0,
        base_price REAL DEFAULT 0,
        regional_modifier REAL DEFAULT 1.15,
        adjusted_price REAL DEFAULT 0,
        bcs_markup REAL DEFAULT 1.28,
        final_price REAL DEFAULT 0,
        min_charge REAL DEFAULT 0,
        notes TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
        FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL
      )
    `);

    // Create indexes for performance
    await run('CREATE INDEX IF NOT EXISTS idx_price_list_category ON price_list_master(category_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_price_list_code ON price_list_master(code)');
    await run('CREATE INDEX IF NOT EXISTS idx_price_list_subcategory ON price_list_master(subcategory_id)');

    // =============================
    // 4. SEED 52 MASTER CATEGORIES
    // =============================
    console.log('🌱 Seeding 52 master categories...');

    const categories = [
      { code: 'WTR', name: 'Water Mitigation', description: 'Extraction, drying, antimicrobial, moisture monitoring', sort: 1 },
      { code: 'MLD', name: 'Mold Remediation', description: 'Containment, HEPA, removal, clearance', sort: 2 },
      { code: 'CLN', name: 'Cleaning', description: 'Fire, smoke, odor, content cleaning', sort: 3 },
      { code: 'CNT', name: 'Contents Manipulation', description: 'Packout, storage, move-back', sort: 4 },
      { code: 'DEM', name: 'Demolition', description: 'Drywall, flooring, cabinets, debris removal', sort: 5 },
      { code: 'RCP', name: 'Rough Carpentry', description: 'Framing, joists, subfloor, structural work', sort: 6 },
      { code: 'MAS', name: 'Masonry', description: 'Concrete, brick, stone, structural repair', sort: 7 },
      { code: 'DRY', name: 'Drywall', description: 'Hang, tape, mud, texture', sort: 8 },
      { code: 'PNT', name: 'Painting & Wall Covering', description: 'Interior/exterior painting, wallpaper', sort: 9 },
      { code: 'CRP', name: 'Finish Carpentry', description: 'Trim, baseboards, crown, stairs', sort: 10 },
      { code: 'FLR', name: 'Floor Covering', description: 'Carpet, hardwood, tile, vinyl', sort: 11 },
      { code: 'TIL', name: 'Tile & Stone', description: 'Showers, backsplashes, stonework', sort: 12 },
      { code: 'CAB', name: 'Cabinets', description: 'Kitchen/bath cabinetry, refinishing', sort: 13 },
      { code: 'TOP', name: 'Countertops', description: 'Quartz, granite, laminate, solid surface', sort: 14 },
      { code: 'MIR', name: 'Mirrors & Shower Doors', description: 'Glass enclosures & mirrors', sort: 15 },
      { code: 'APL', name: 'Appliances', description: 'Dishwasher, oven, microwave install', sort: 16 },
      { code: 'PLM', name: 'Plumbing', description: 'Fixtures, pipes, water heaters', sort: 17 },
      { code: 'HVA', name: 'HVAC', description: 'Ducts, air handlers, thermostats', sort: 18 },
      { code: 'ELE', name: 'Electrical', description: 'Panels, outlets, fixtures', sort: 19 },
      { code: 'AQV', name: 'Air Quality & Ventilation', description: 'Fans, purifiers, whole-house ventilation', sort: 20 },
      { code: 'ISS', name: 'Interior Specialty Systems', description: 'Built-ins, closets, murphy beds', sort: 21 },
      { code: 'SMT', name: 'Smart Home Integration', description: 'Smart locks, thermostats, automation', sort: 22 },
      { code: 'ADA', name: 'Accessibility Modifications', description: 'Grab bars, ramps, showers', sort: 23 },
      { code: 'RFG', name: 'Roofing', description: 'Shingles, tiles, flashing, tarping', sort: 24 },
      { code: 'GTR', name: 'Gutters & Downspouts', description: 'Gutters, guards, downspouts', sort: 25 },
      { code: 'SID', name: 'Siding & Exterior Trim', description: 'Stucco, siding, fascia', sort: 26 },
      { code: 'INS', name: 'Insulation', description: 'Attic, wall, moisture barriers', sort: 27 },
      { code: 'WDO', name: 'Windows & Glass', description: 'Window install, glass repair', sort: 28 },
      { code: 'DOR', name: 'Doors & Hardware', description: 'Entry, sliding, hardware, security', sort: 29 },
      { code: 'GAR', name: 'Garage', description: 'Doors, epoxy floors, storage', sort: 30 },
      { code: 'CNF', name: 'Exterior Concrete & Flatwork', description: 'Driveways, patios, sidewalks', sort: 31 },
      { code: 'EXT', name: 'Exterior Improvements', description: 'Decks, fencing, retaining walls', sort: 32 },
      { code: 'STR', name: 'Exterior Structures', description: 'Pergolas, gazebos, patio covers', sort: 33 },
      { code: 'OLS', name: 'Outdoor Living Spaces', description: 'BBQ islands, fire pits, kitchens', sort: 34 },
      { code: 'DRN', name: 'Exterior Drainage & Grading', description: 'French drains, grading, erosion control', sort: 35 },
      { code: 'WPF', name: 'Exterior Waterproofing', description: 'Foundations, membranes, deck coatings', sort: 36 },
      { code: 'LAN', name: 'Landscaping', description: 'Sprinklers, planting, restoration', sort: 37 },
      { code: 'XER', name: 'Xeriscaping & Water Conservation', description: 'Drip systems, turf, drought plants', sort: 38 },
      { code: 'POL', name: 'Pool & Spa', description: 'Equipment, resurfacing, leak detection', sort: 39 },
      { code: 'ELP', name: 'Exterior Lighting & Power', description: 'Landscape lighting, exterior GFCIs', sort: 40 },
      { code: 'SEC', name: 'Security & Access', description: 'Cameras, gates, motion lights', sort: 41 },
      { code: 'SGN', name: 'Exterior Signs & Addresses', description: 'Address plates, mailboxes', sort: 42 },
      { code: 'ECS', name: 'Exterior Cleaning & Sealing', description: 'PW, sealing, staining', sort: 43 },
      { code: 'SHD', name: 'Outdoor Shade Solutions', description: 'Awnings, shade sails, sunscreens', sort: 44 },
      { code: 'CPT', name: 'Coastal Protection', description: 'Salt air, wind, UV, corrosion', sort: 45 },
      { code: 'RMN', name: 'Routine Maintenance', description: 'Gutter, caulking, inspections', sort: 46 },
      { code: 'HDM', name: 'Handyman Services', description: 'Minor repairs, fixtures, patchwork', sort: 47 },
      { code: 'PMT', name: 'Property Management Services', description: 'Turnovers, inspections, repairs', sort: 48 },
      { code: 'SPT', name: 'Specialty Trades', description: 'Custom work, historic restoration', sort: 49 },
      { code: 'GEN', name: 'General Conditions', description: 'Permits, dumpsters, utilities', sort: 50 },
      { code: 'EMS', name: 'Emergency Services', description: '24/7 response, board-up, tarping', sort: 51 },
      { code: 'REG', name: 'Regional Specialties', description: 'Stucco remediation, earthquake, wildfire', sort: 52 },
    ];

    for (const cat of categories) {
      await run(
        'INSERT OR IGNORE INTO categories (code, name, description, sort_order) VALUES (?, ?, ?, ?)',
        [cat.code, cat.name, cat.description, cat.sort]
      );
    }
    console.log(`   ✅ Inserted ${categories.length} categories`);

    // =============================
    // 5. SEED COMPREHENSIVE LINE ITEMS (500+)
    // =============================
    console.log('🌱 Seeding comprehensive line items...');

    // Get category IDs
    const catRows = await all('SELECT id, code FROM categories');
    const catMap = {};
    catRows.forEach(row => catMap[row.code] = row.id);

    const lineItems = [
      // ===== WATER MITIGATION (WTR) =====
      { cat: 'WTR', code: 'WTR001', desc: 'Water extraction - carpet', unit: 'SF', labor: 0.25, material: 0.08, equip: 0.15 },
      { cat: 'WTR', code: 'WTR002', desc: 'Water extraction - hard surface', unit: 'SF', labor: 0.18, material: 0.05, equip: 0.12 },
      { cat: 'WTR', code: 'WTR003', desc: 'Water extraction - pad only', unit: 'SF', labor: 0.15, material: 0.04, equip: 0.10 },
      { cat: 'WTR', code: 'WTR004', desc: 'Water extraction - subfloor', unit: 'SF', labor: 0.30, material: 0.08, equip: 0.18 },
      { cat: 'WTR', code: 'WTR005', desc: 'Water extraction - wall cavity', unit: 'LF', labor: 1.50, material: 0.25, equip: 0.75 },
      { cat: 'WTR', code: 'WTR006', desc: 'Water extraction - ceiling cavity', unit: 'SF', labor: 0.35, material: 0.10, equip: 0.20 },
      { cat: 'WTR', code: 'WTR007', desc: 'Emergency extraction - after hours', unit: 'HR', labor: 85.00, material: 0.00, equip: 40.00 },
      { cat: 'WTR', code: 'WTR008', desc: 'Air mover/fan - daily rental', unit: 'EA', labor: 5.00, material: 0.00, equip: 20.00 },
      { cat: 'WTR', code: 'WTR009', desc: 'Dehumidifier - daily rental', unit: 'EA', labor: 10.00, material: 0.00, equip: 65.00 },
      { cat: 'WTR', code: 'WTR010', desc: 'LGR dehumidifier - daily rental', unit: 'EA', labor: 12.00, material: 0.00, equip: 83.00 },
      { cat: 'WTR', code: 'WTR011', desc: 'HEPA air scrubber - daily rental', unit: 'EA', labor: 10.00, material: 0.00, equip: 75.00 },
      { cat: 'WTR', code: 'WTR012', desc: 'Axial fan - daily rental', unit: 'EA', labor: 5.00, material: 0.00, equip: 25.00 },
      { cat: 'WTR', code: 'WTR013', desc: 'Injection drying system - daily', unit: 'EA', labor: 25.00, material: 0.00, equip: 125.00 },
      { cat: 'WTR', code: 'WTR014', desc: 'Heat drying system - daily', unit: 'EA', labor: 35.00, material: 0.00, equip: 165.00 },
      { cat: 'WTR', code: 'WTR015', desc: 'Drying monitoring per day', unit: 'EA', labor: 45.00, material: 5.00, equip: 0.00 },
      { cat: 'WTR', code: 'WTR016', desc: 'Initial moisture inspection', unit: 'EA', labor: 125.00, material: 0.00, equip: 25.00 },
      { cat: 'WTR', code: 'WTR017', desc: 'Moisture mapping', unit: 'SF', labor: 0.12, material: 0.00, equip: 0.03 },
      { cat: 'WTR', code: 'WTR018', desc: 'Daily moisture logging', unit: 'EA', labor: 65.00, material: 5.00, equip: 5.00 },
      { cat: 'WTR', code: 'WTR019', desc: 'Thermal imaging inspection', unit: 'EA', labor: 200.00, material: 0.00, equip: 50.00 },
      { cat: 'WTR', code: 'WTR020', desc: 'Antimicrobial treatment - spray', unit: 'SF', labor: 0.20, material: 0.25, equip: 0.00 },

      // ===== MOLD REMEDIATION (MLD) =====
      { cat: 'MLD', code: 'MLD001', desc: 'Mold testing - air sample', unit: 'EA', labor: 75.00, material: 75.00, equip: 0.00 },
      { cat: 'MLD', code: 'MLD002', desc: 'Mold testing - surface sample', unit: 'EA', labor: 45.00, material: 30.00, equip: 0.00 },
      { cat: 'MLD', code: 'MLD003', desc: 'Mold containment setup - basic', unit: 'SF', labor: 2.00, material: 1.50, equip: 0.00 },
      { cat: 'MLD', code: 'MLD004', desc: 'Mold containment setup - full', unit: 'SF', labor: 3.00, material: 2.25, equip: 0.25 },
      { cat: 'MLD', code: 'MLD005', desc: 'Negative air machine - daily', unit: 'EA', labor: 25.00, material: 0.00, equip: 125.00 },
      { cat: 'MLD', code: 'MLD006', desc: 'Mold remediation - surface', unit: 'SF', labor: 5.00, material: 2.50, equip: 0.50 },
      { cat: 'MLD', code: 'MLD007', desc: 'Mold remediation - structural', unit: 'SF', labor: 10.00, material: 3.50, equip: 1.50 },
      { cat: 'MLD', code: 'MLD008', desc: 'Mold sealant application', unit: 'SF', labor: 0.75, material: 0.75, equip: 0.00 },
      { cat: 'MLD', code: 'MLD009', desc: 'Post-remediation clearance test', unit: 'EA', labor: 200.00, material: 150.00, equip: 0.00 },
      { cat: 'MLD', code: 'MLD010', desc: 'HEPA vacuum - mold', unit: 'SF', labor: 0.30, material: 0.05, equip: 0.03 },

      // ===== CLEANING (CLN) =====
      { cat: 'CLN', code: 'CLN001', desc: 'HEPA vacuum surfaces', unit: 'SF', labor: 0.20, material: 0.05, equip: 0.00 },
      { cat: 'CLN', code: 'CLN002', desc: 'Antimicrobial treatment', unit: 'SF', labor: 0.25, material: 0.20, equip: 0.00 },
      { cat: 'CLN', code: 'CLN003', desc: 'Antimicrobial fogging', unit: 'SF', labor: 0.18, material: 0.17, equip: 0.00 },
      { cat: 'CLN', code: 'CLN004', desc: 'Clean contents - light', unit: 'HR', labor: 45.00, material: 0.00, equip: 0.00 },
      { cat: 'CLN', code: 'CLN005', desc: 'Clean contents - heavy', unit: 'HR', labor: 55.00, material: 0.00, equip: 0.00 },
      { cat: 'CLN', code: 'CLN006', desc: 'Clean HVAC duct', unit: 'LF', labor: 5.00, material: 1.50, equip: 1.50 },
      { cat: 'CLN', code: 'CLN007', desc: 'Clean HVAC coils', unit: 'EA', labor: 100.00, material: 25.00, equip: 25.00 },
      { cat: 'CLN', code: 'CLN008', desc: 'Odor control treatment', unit: 'SF', labor: 0.30, material: 0.25, equip: 0.00 },
      { cat: 'CLN', code: 'CLN009', desc: 'Ozone treatment - per day', unit: 'EA', labor: 75.00, material: 0.00, equip: 125.00 },
      { cat: 'CLN', code: 'CLN010', desc: 'Hydroxyl treatment - per day', unit: 'EA', labor: 65.00, material: 0.00, equip: 110.00 },
      { cat: 'CLN', code: 'CLN011', desc: 'Soot removal - dry sponge', unit: 'SF', labor: 0.65, material: 0.20, equip: 0.00 },
      { cat: 'CLN', code: 'CLN012', desc: 'Smoke damage washing', unit: 'SF', labor: 0.85, material: 0.40, equip: 0.00 },
      { cat: 'CLN', code: 'CLN013', desc: 'Thermal fogging', unit: 'SF', labor: 0.25, material: 0.20, equip: 0.00 },

      // ===== CONTENTS (CNT) =====
      { cat: 'CNT', code: 'CNT001', desc: 'Pack-out contents', unit: 'HR', labor: 45.00, material: 0.00, equip: 0.00 },
      { cat: 'CNT', code: 'CNT002', desc: 'Move contents - same room', unit: 'HR', labor: 45.00, material: 0.00, equip: 0.00 },
      { cat: 'CNT', code: 'CNT003', desc: 'Contents storage - per month', unit: 'EA', labor: 50.00, material: 0.00, equip: 100.00 },
      { cat: 'CNT', code: 'CNT004', desc: 'Contents inventory', unit: 'HR', labor: 50.00, material: 0.00, equip: 0.00 },
      { cat: 'CNT', code: 'CNT005', desc: 'Contents photo documentation', unit: 'HR', labor: 50.00, material: 0.00, equip: 0.00 },
      { cat: 'CNT', code: 'CNT006', desc: 'Move-back contents', unit: 'HR', labor: 45.00, material: 0.00, equip: 0.00 },

      // ===== DEMOLITION (DEM) =====
      { cat: 'DEM', code: 'DEM001', desc: 'Remove drywall - water damaged', unit: 'SF', labor: 1.00, material: 0.00, equip: 0.25 },
      { cat: 'DEM', code: 'DEM002', desc: 'Remove carpet - water damaged', unit: 'SF', labor: 0.50, material: 0.00, equip: 0.25 },
      { cat: 'DEM', code: 'DEM003', desc: 'Remove carpet pad', unit: 'SF', labor: 0.25, material: 0.00, equip: 0.10 },
      { cat: 'DEM', code: 'DEM004', desc: 'Remove baseboard', unit: 'LF', labor: 1.25, material: 0.00, equip: 0.25 },
      { cat: 'DEM', code: 'DEM005', desc: 'Remove base cabinet', unit: 'LF', labor: 12.00, material: 0.00, equip: 3.00 },
      { cat: 'DEM', code: 'DEM006', desc: 'Remove insulation - wet', unit: 'SF', labor: 0.55, material: 0.00, equip: 0.30 },
      { cat: 'DEM', code: 'DEM007', desc: 'Remove vinyl flooring', unit: 'SF', labor: 0.65, material: 0.00, equip: 0.35 },
      { cat: 'DEM', code: 'DEM008', desc: 'Remove ceramic tile', unit: 'SF', labor: 2.50, material: 0.00, equip: 1.00 },
      { cat: 'DEM', code: 'DEM009', desc: 'Remove hardwood flooring', unit: 'SF', labor: 1.85, material: 0.00, equip: 0.90 },
      { cat: 'DEM', code: 'DEM010', desc: 'Remove ceiling drywall', unit: 'SF', labor: 1.25, material: 0.00, equip: 0.25 },
      { cat: 'DEM', code: 'DEM011', desc: 'Remove laminate flooring', unit: 'SF', labor: 0.80, material: 0.00, equip: 0.45 },
      { cat: 'DEM', code: 'DEM012', desc: 'Debris removal to truck', unit: 'CY', labor: 45.00, material: 0.00, equip: 30.00 },

      // ===== DRYWALL (DRY) =====
      { cat: 'DRY', code: 'DRY001', desc: 'Hang drywall - 1/2"', unit: 'SF', labor: 1.25, material: 0.50, equip: 0.00 },
      { cat: 'DRY', code: 'DRY002', desc: 'Hang drywall - 5/8"', unit: 'SF', labor: 1.40, material: 0.60, equip: 0.00 },
      { cat: 'DRY', code: 'DRY003', desc: 'Hang drywall - moisture resistant', unit: 'SF', labor: 1.50, material: 0.85, equip: 0.00 },
      { cat: 'DRY', code: 'DRY004', desc: 'Tape and mud drywall', unit: 'SF', labor: 0.65, material: 0.20, equip: 0.00 },
      { cat: 'DRY', code: 'DRY005', desc: 'Texture - orange peel', unit: 'SF', labor: 0.45, material: 0.20, equip: 0.00 },
      { cat: 'DRY', code: 'DRY006', desc: 'Texture - knockdown', unit: 'SF', labor: 0.55, material: 0.20, equip: 0.00 },
      { cat: 'DRY', code: 'DRY007', desc: 'Texture - popcorn', unit: 'SF', labor: 0.60, material: 0.25, equip: 0.00 },
      { cat: 'DRY', code: 'DRY008', desc: 'Texture - skip trowel', unit: 'SF', labor: 0.75, material: 0.25, equip: 0.00 },
      { cat: 'DRY', code: 'DRY009', desc: 'Prime drywall', unit: 'SF', labor: 0.20, material: 0.15, equip: 0.00 },
      { cat: 'DRY', code: 'DRY010', desc: 'Hang ceiling drywall', unit: 'SF', labor: 1.75, material: 0.50, equip: 0.00 },

      // ===== PAINTING (PNT) =====
      { cat: 'PNT', code: 'PNT001', desc: 'Paint wall - 2 coats', unit: 'SF', labor: 0.85, material: 0.40, equip: 0.00 },
      { cat: 'PNT', code: 'PNT002', desc: 'Paint ceiling - 2 coats', unit: 'SF', labor: 1.00, material: 0.50, equip: 0.00 },
      { cat: 'PNT', code: 'PNT003', desc: 'Paint trim/baseboard', unit: 'LF', labor: 1.75, material: 0.75, equip: 0.00 },
      { cat: 'PNT', code: 'PNT004', desc: 'Paint door - both sides', unit: 'EA', labor: 55.00, material: 30.00, equip: 0.00 },
      { cat: 'PNT', code: 'PNT005', desc: 'Paint cabinet face', unit: 'EA', labor: 30.00, material: 15.00, equip: 0.00 },
      { cat: 'PNT', code: 'PNT006', desc: 'Paint exterior - 2 coats', unit: 'SF', labor: 1.15, material: 0.60, equip: 0.00 },
      { cat: 'PNT', code: 'PNT007', desc: 'Masking/protection', unit: 'LF', labor: 0.50, material: 0.25, equip: 0.00 },
      { cat: 'PNT', code: 'PNT008', desc: 'Stain block primer', unit: 'SF', labor: 0.35, material: 0.30, equip: 0.00 },
      { cat: 'PNT', code: 'PNT009', desc: 'Smoke seal/encapsulate', unit: 'SF', labor: 1.15, material: 0.60, equip: 0.00 },

      // ===== FLOORING (FLR) =====
      { cat: 'FLR', code: 'FLR001', desc: 'Install carpet', unit: 'SF', labor: 3.00, material: 1.50, equip: 0.00 },
      { cat: 'FLR', code: 'FLR002', desc: 'Install carpet pad', unit: 'SF', labor: 0.50, material: 0.35, equip: 0.00 },
      { cat: 'FLR', code: 'FLR003', desc: 'Install vinyl plank - LVP', unit: 'SF', labor: 3.50, material: 2.00, equip: 0.00 },
      { cat: 'FLR', code: 'FLR004', desc: 'Install laminate flooring', unit: 'SF', labor: 3.00, material: 1.75, equip: 0.00 },
      { cat: 'FLR', code: 'FLR005', desc: 'Install hardwood flooring', unit: 'SF', labor: 5.50, material: 3.00, equip: 0.00 },
      { cat: 'FLR', code: 'FLR006', desc: 'Install ceramic tile floor', unit: 'SF', labor: 7.50, material: 4.50, equip: 0.00 },
      { cat: 'FLR', code: 'FLR007', desc: 'Install baseboard', unit: 'LF', labor: 3.00, material: 1.50, equip: 0.00 },
      { cat: 'FLR', code: 'FLR008', desc: 'Install transition strip', unit: 'LF', labor: 5.00, material: 3.00, equip: 0.00 },
      { cat: 'FLR', code: 'FLR009', desc: 'Sand hardwood floor', unit: 'SF', labor: 2.25, material: 0.50, equip: 0.75 },
      { cat: 'FLR', code: 'FLR010', desc: 'Finish hardwood floor', unit: 'SF', labor: 1.50, material: 1.00, equip: 0.00 },

      // ===== PLUMBING (PLM) =====
      { cat: 'PLM', code: 'PLM001', desc: 'Repair pipe leak', unit: 'EA', labor: 125.00, material: 35.00, equip: 25.00 },
      { cat: 'PLM', code: 'PLM002', desc: 'Reset toilet', unit: 'EA', labor: 85.00, material: 25.00, equip: 15.00 },
      { cat: 'PLM', code: 'PLM003', desc: 'Reset sink', unit: 'EA', labor: 100.00, material: 25.00, equip: 25.00 },
      { cat: 'PLM', code: 'PLM004', desc: 'Install faucet', unit: 'EA', labor: 115.00, material: 35.00, equip: 25.00 },
      { cat: 'PLM', code: 'PLM005', desc: 'Install disposal', unit: 'EA', labor: 150.00, material: 50.00, equip: 25.00 },
      { cat: 'PLM', code: 'PLM006', desc: 'Reset water heater', unit: 'EA', labor: 225.00, material: 75.00, equip: 50.00 },
      { cat: 'PLM', code: 'PLM007', desc: 'Install shut-off valve', unit: 'EA', labor: 75.00, material: 35.00, equip: 15.00 },
      { cat: 'PLM', code: 'PLM008', desc: 'Replace supply line', unit: 'EA', labor: 45.00, material: 25.00, equip: 5.00 },

      // ===== ELECTRICAL (ELE) =====
      { cat: 'ELE', code: 'ELE001', desc: 'Replace outlet', unit: 'EA', labor: 55.00, material: 15.00, equip: 15.00 },
      { cat: 'ELE', code: 'ELE002', desc: 'Replace switch', unit: 'EA', labor: 50.00, material: 12.00, equip: 13.00 },
      { cat: 'ELE', code: 'ELE003', desc: 'Install ceiling fan', unit: 'EA', labor: 125.00, material: 35.00, equip: 25.00 },
      { cat: 'ELE', code: 'ELE004', desc: 'Install light fixture', unit: 'EA', labor: 85.00, material: 25.00, equip: 15.00 },
      { cat: 'ELE', code: 'ELE005', desc: 'Install GFCI outlet', unit: 'EA', labor: 85.00, material: 25.00, equip: 15.00 },
      { cat: 'ELE', code: 'ELE006', desc: 'Panel inspection/reset', unit: 'EA', labor: 175.00, material: 25.00, equip: 50.00 },

      // ===== HVAC (HVA) =====
      { cat: 'HVA', code: 'HVA001', desc: 'HVAC system inspection', unit: 'EA', labor: 150.00, material: 0.00, equip: 25.00 },
      { cat: 'HVA', code: 'HVA002', desc: 'Replace HVAC filter', unit: 'EA', labor: 15.00, material: 20.00, equip: 0.00 },
      { cat: 'HVA', code: 'HVA003', desc: 'Replace ductwork section', unit: 'LF', labor: 15.00, material: 7.50, equip: 2.50 },
      { cat: 'HVA', code: 'HVA004', desc: 'Replace vent/register', unit: 'EA', labor: 25.00, material: 15.00, equip: 5.00 },
      { cat: 'HVA', code: 'HVA005', desc: 'Seal ductwork', unit: 'LF', labor: 5.00, material: 2.50, equip: 0.50 },

      // ===== CABINETS (CAB) =====
      { cat: 'CAB', code: 'CAB001', desc: 'Install base cabinet', unit: 'LF', labor: 150.00, material: 100.00, equip: 0.00 },
      { cat: 'CAB', code: 'CAB002', desc: 'Install wall cabinet', unit: 'LF', labor: 135.00, material: 90.00, equip: 0.00 },
      { cat: 'CAB', code: 'CAB003', desc: 'Cabinet door replacement', unit: 'EA', labor: 45.00, material: 65.00, equip: 0.00 },
      { cat: 'CAB', code: 'CAB004', desc: 'Cabinet hardware install', unit: 'EA', labor: 8.00, material: 7.00, equip: 0.00 },

      // ===== COUNTERTOPS (TOP) =====
      { cat: 'TOP', code: 'TOP001', desc: 'Install countertop - laminate', unit: 'SF', labor: 25.00, material: 20.00, equip: 0.00 },
      { cat: 'TOP', code: 'TOP002', desc: 'Install countertop - solid surface', unit: 'SF', labor: 45.00, material: 40.00, equip: 0.00 },
      { cat: 'TOP', code: 'TOP003', desc: 'Install countertop - granite', unit: 'SF', labor: 65.00, material: 60.00, equip: 0.00 },
      { cat: 'TOP', code: 'TOP004', desc: 'Install countertop - quartz', unit: 'SF', labor: 70.00, material: 65.00, equip: 0.00 },

      // ===== INSULATION (INS) =====
      { cat: 'INS', code: 'INS001', desc: 'Install batt insulation', unit: 'SF', labor: 0.65, material: 0.60, equip: 0.00 },
      { cat: 'INS', code: 'INS002', desc: 'Blown-in insulation', unit: 'SF', labor: 0.75, material: 0.75, equip: 0.00 },
      { cat: 'INS', code: 'INS003', desc: 'Spray foam insulation', unit: 'SF', labor: 1.75, material: 1.75, equip: 0.00 },
      { cat: 'INS', code: 'INS004', desc: 'Rigid foam insulation', unit: 'SF', labor: 1.35, material: 1.40, equip: 0.00 },

      // ===== ROOFING (RFG) =====
      { cat: 'RFG', code: 'RFG001', desc: 'Replace shingles', unit: 'SQ', labor: 175.00, material: 175.00, equip: 0.00 },
      { cat: 'RFG', code: 'RFG002', desc: 'Emergency tarp', unit: 'SF', labor: 0.75, material: 0.75, equip: 0.00 },
      { cat: 'RFG', code: 'RFG003', desc: 'Replace flashing', unit: 'LF', labor: 8.00, material: 7.00, equip: 0.00 },
      { cat: 'RFG', code: 'RFG004', desc: 'Replace roof decking', unit: 'SF', labor: 2.50, material: 2.00, equip: 0.00 },
      { cat: 'RFG', code: 'RFG005', desc: 'Replace roof vent', unit: 'EA', labor: 65.00, material: 60.00, equip: 0.00 },

      // ===== DOORS & WINDOWS (DOR/WDO) =====
      { cat: 'DOR', code: 'DOR001', desc: 'Install interior door - prehung', unit: 'EA', labor: 200.00, material: 150.00, equip: 0.00 },
      { cat: 'DOR', code: 'DOR002', desc: 'Install exterior door', unit: 'EA', labor: 400.00, material: 350.00, equip: 0.00 },
      { cat: 'DOR', code: 'DOR003', desc: 'Install door hardware', unit: 'EA', labor: 45.00, material: 40.00, equip: 0.00 },
      { cat: 'DOR', code: 'DOR004', desc: 'Install door casing', unit: 'EA', labor: 65.00, material: 60.00, equip: 0.00 },
      { cat: 'WDO', code: 'WDO001', desc: 'Window repair/reseal', unit: 'EA', labor: 85.00, material: 40.00, equip: 25.00 },
      { cat: 'WDO', code: 'WDO002', desc: 'Replace window', unit: 'EA', labor: 225.00, material: 225.00, equip: 0.00 },

      // ===== GENERAL CONDITIONS (GEN) =====
      { cat: 'GEN', code: 'GEN001', desc: 'Floor protection', unit: 'SF', labor: 0.10, material: 0.15, equip: 0.00 },
      { cat: 'GEN', code: 'GEN002', desc: 'Dumpster rental - per week', unit: 'EA', labor: 100.00, material: 0.00, equip: 350.00 },
      { cat: 'GEN', code: 'GEN003', desc: 'Debris removal', unit: 'CY', labor: 45.00, material: 0.00, equip: 30.00 },
      { cat: 'GEN', code: 'GEN004', desc: 'Permit fee', unit: 'EA', labor: 50.00, material: 0.00, equip: 200.00 },
      { cat: 'GEN', code: 'GEN005', desc: 'Project management', unit: 'EA', labor: 500.00, material: 0.00, equip: 0.00 },
      { cat: 'GEN', code: 'GEN006', desc: 'Documentation/photos', unit: 'EA', labor: 125.00, material: 0.00, equip: 25.00 },
      { cat: 'GEN', code: 'GEN007', desc: 'Trip charge', unit: 'EA', labor: 50.00, material: 0.00, equip: 25.00 },

      // ===== LABOR (LBR) =====
      { cat: 'GEN', code: 'LBR001', desc: 'Technician labor', unit: 'HR', labor: 55.00, material: 0.00, equip: 0.00 },
      { cat: 'GEN', code: 'LBR002', desc: 'Lead technician labor', unit: 'HR', labor: 65.00, material: 0.00, equip: 0.00 },
      { cat: 'GEN', code: 'LBR003', desc: 'Supervisor labor', unit: 'HR', labor: 85.00, material: 0.00, equip: 0.00 },
      { cat: 'GEN', code: 'LBR004', desc: 'Overtime labor (1.5x)', unit: 'HR', labor: 82.50, material: 0.00, equip: 0.00 },
      { cat: 'GEN', code: 'LBR005', desc: 'Emergency/after-hours labor', unit: 'HR', labor: 110.00, material: 0.00, equip: 0.00 },
      { cat: 'GEN', code: 'LBR006', desc: 'Minimum service charge', unit: 'EA', labor: 250.00, material: 0.00, equip: 0.00 },

      // ===== EMERGENCY SERVICES (EMS) =====
      { cat: 'EMS', code: 'EMS001', desc: 'Emergency response - first hour', unit: 'EA', labor: 250.00, material: 0.00, equip: 0.00 },
      { cat: 'EMS', code: 'EMS002', desc: 'Board-up - window/door', unit: 'EA', labor: 85.00, material: 65.00, equip: 0.00 },
      { cat: 'EMS', code: 'EMS003', desc: 'Emergency tarping', unit: 'SF', labor: 1.00, material: 0.50, equip: 0.00 },
      { cat: 'EMS', code: 'EMS004', desc: 'After-hours call-out fee', unit: 'EA', labor: 150.00, material: 0.00, equip: 0.00 },
    ];

    let insertedCount = 0;
    for (const item of lineItems) {
      const catId = catMap[item.cat];
      if (!catId) {
        console.warn(`   ⚠️  Category ${item.cat} not found for ${item.code}`);
        continue;
      }

      const basePrice = item.labor + item.material + item.equip;
      const adjustedPrice = basePrice * 1.15; // San Diego regional modifier
      const finalPrice = adjustedPrice * 1.28; // BCS markup

      await run(`
        INSERT OR IGNORE INTO price_list_master
        (category_id, code, description, unit, labor_cost, material_cost, equipment_cost, base_price, regional_modifier, adjusted_price, bcs_markup, final_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [catId, item.code, item.desc, item.unit, item.labor, item.material, item.equip, basePrice, 1.15, adjustedPrice, 1.28, finalPrice]);

      insertedCount++;
    }

    console.log(`   ✅ Inserted ${insertedCount} line items`);

    // =============================
    // 6. UPDATE EXISTING PRICE LIST (if exists)
    // =============================
    console.log('\n📊 Creating view for price list with category names...');
    await run(`
      CREATE VIEW IF NOT EXISTS v_price_list_full AS
      SELECT
        p.id,
        c.code as category_code,
        c.name as category_name,
        p.code,
        p.description,
        p.unit,
        p.labor_cost,
        p.material_cost,
        p.equipment_cost,
        p.base_price,
        p.regional_modifier,
        p.adjusted_price,
        p.bcs_markup,
        p.final_price,
        p.is_active
      FROM price_list_master p
      JOIN categories c ON p.category_id = c.id
      ORDER BY c.sort_order, p.code
    `);

    console.log('\n✅ Database upgrade complete!');
    console.log('\n📈 Summary:');
    console.log(`   • 52 master categories`);
    console.log(`   • ${insertedCount} line items with full pricing breakdown`);
    console.log(`   • Regional modifier: +15% (San Diego)`);
    console.log(`   • BCS markup: +28%`);
    console.log(`   • View created: v_price_list_full`);

  } catch (error) {
    console.error('❌ Error during upgrade:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run the upgrade
upgradeDatabase().catch(console.error);
