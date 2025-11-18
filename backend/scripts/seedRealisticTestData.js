/**
 * SEED REALISTIC TEST DATA
 * Comprehensive seed script for BCS Desktop App
 *
 * Creates realistic sample data for:
 * - Clients
 * - Employees
 * - Work Orders (Water Damage Jobs)
 * - Invoices with Line Items
 * - Change Orders
 * - Moisture Logs
 * - Equipment & Equipment Logs
 *
 * FILE: /Users/k4n3/Projects/bcs-desktop-app/backend/scripts/seedRealisticTestData.js
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../database/bcs-database.db');

const db = new sqlite3.Database(DB_PATH);

// REALISTIC SAMPLE DATA
const clients = [
  {
    name: 'Ocean View Properties LLC',
    email: 'maintenance@oceanviewprops.com',
    phone: '(619) 555-0101',
    address: '4101 Coastal Drive, Unit 4101, San Diego, CA 92101',
    company: 'Ocean View Properties LLC'
  },
  {
    name: 'Sarah Martinez',
    email: 'sarah.martinez@email.com',
    phone: '(858) 555-0234',
    address: '2847 Palm Avenue, San Diego, CA 92154',
    company: null
  },
  {
    name: 'Pacific Coast Insurance',
    email: 'claims@pacificcoastins.com',
    phone: '(619) 555-0789',
    address: '1500 Insurance Plaza, San Diego, CA 92123',
    company: 'Pacific Coast Insurance'
  },
  {
    name: 'Green Valley Apartments',
    email: 'manager@greenvalley.com',
    phone: '(760) 555-0456',
    address: '8900 Valley Ridge Road, San Diego, CA 92129',
    company: 'Green Valley Management Corp'
  },
  {
    name: 'Robert Chen',
    email: 'rchen@techstartup.io',
    phone: '(858) 555-0912',
    address: '567 Innovation Way, La Jolla, CA 92037',
    company: null
  },
  {
    name: 'Bayview Commercial Properties',
    email: 'facilities@bayviewcommercial.com',
    phone: '(619) 555-0333',
    address: '1200 Harbor Drive, Suite 300, San Diego, CA 92101',
    company: 'Bayview Commercial Properties Inc'
  }
];

const employees = [
  {
    name: 'Mike Rodriguez',
    position: 'Lead Technician',
    email: 'mike.r@bcsrestoration.com',
    phone: '(619) 555-1001',
    hourly_rate: 45.00,
    hire_date: '2022-03-15',
    status: 'active'
  },
  {
    name: 'Jessica Thompson',
    position: 'Water Damage Specialist',
    email: 'jessica.t@bcsrestoration.com',
    phone: '(619) 555-1002',
    hourly_rate: 42.00,
    hire_date: '2022-06-01',
    status: 'active'
  },
  {
    name: 'Carlos Sanchez',
    position: 'Equipment Technician',
    email: 'carlos.s@bcsrestoration.com',
    phone: '(619) 555-1003',
    hourly_rate: 38.00,
    hire_date: '2023-01-10',
    status: 'active'
  }
];

const equipment = [
  { name: 'Commercial Dehumidifier - LGR 2800i', model: 'Phoenix LGR 2800i', serial_number: 'PHX-LGR-2847', purchase_date: '2023-03-15', purchase_cost: 2850.00, status: 'in_use' },
  { name: 'Commercial Dehumidifier - LGR 3500i', model: 'Phoenix LGR 3500i', serial_number: 'PHX-LGR-3901', purchase_date: '2023-05-20', purchase_cost: 3200.00, status: 'in_use' },
  { name: 'Air Mover - Axial', model: 'XPOWER X-2580', serial_number: 'XP-AM-4521', purchase_date: '2023-02-10', purchase_cost: 285.00, status: 'in_use' },
  { name: 'Air Mover - Axial', model: 'XPOWER X-2580', serial_number: 'XP-AM-4522', purchase_date: '2023-02-10', purchase_cost: 285.00, status: 'in_use' },
  { name: 'Air Mover - Axial', model: 'XPOWER X-2580', serial_number: 'XP-AM-4523', purchase_date: '2023-02-10', purchase_cost: 285.00, status: 'in_use' },
  { name: 'Air Mover - Centrifugal', model: 'B-Air VP-33', serial_number: 'BA-VP-7841', purchase_date: '2023-04-05', purchase_cost: 320.00, status: 'in_use' },
  { name: 'Air Scrubber - HEPA', model: 'BLUEDRI AS-550', serial_number: 'BD-AS-2901', purchase_date: '2023-06-12', purchase_cost: 1450.00, status: 'in_use' },
  { name: 'Moisture Meter - Tramex', model: 'Tramex MES II', serial_number: 'TRX-MES-1234', purchase_date: '2022-11-20', purchase_cost: 485.00, status: 'available' },
  { name: 'Infrared Camera', model: 'FLIR E8-XT', serial_number: 'FLIR-E8-5678', purchase_date: '2023-01-15', purchase_cost: 1850.00, status: 'available' },
  { name: 'Air Mover - Low Profile', model: 'Dri-Eaz Velo', serial_number: 'DE-VL-8823', purchase_date: '2023-03-22', purchase_cost: 395.00, status: 'available' }
];

const workOrders = [
  {
    client_id: 1, // Ocean View Properties
    employee_id: 1, // Mike Rodriguez
    work_order_number: 'WO-2024-001',
    title: 'Water Damage Remediation - Unit 4101',
    description: 'Water intrusion from toilet supply line failure. Affected areas: master bathroom, hallway, and bedroom carpet. Category 2 water damage.',
    status: 'completed',
    priority: 'urgent',
    scheduled_date: '2024-01-15',
    estimated_cost: 4850.00,
    location: '4101 Coastal Drive, Unit 4101, San Diego, CA 92101'
  },
  {
    client_id: 2, // Sarah Martinez
    employee_id: 2, // Jessica Thompson
    work_order_number: 'WO-2024-002',
    title: 'Kitchen Water Damage - Dishwasher Leak',
    description: 'Dishwasher supply line leak causing water damage to kitchen floor and adjacent dining room. Category 1 clean water.',
    status: 'in_progress',
    priority: 'high',
    scheduled_date: '2024-02-03',
    estimated_cost: 3200.00,
    location: '2847 Palm Avenue, San Diego, CA 92154'
  },
  {
    client_id: 4, // Green Valley Apartments
    employee_id: 1,
    work_order_number: 'WO-2024-003',
    title: 'Roof Leak - Building C Water Intrusion',
    description: 'Roof leak affecting 3 units. Water damage to ceilings, walls, and flooring. Multiple rooms affected.',
    status: 'in_progress',
    priority: 'urgent',
    scheduled_date: '2024-02-10',
    estimated_cost: 12500.00,
    location: '8900 Valley Ridge Road, Building C, San Diego, CA 92129'
  },
  {
    client_id: 5, // Robert Chen
    employee_id: 3,
    work_order_number: 'WO-2024-004',
    title: 'Basement Flooding - Sump Pump Failure',
    description: 'Sump pump failure resulted in basement flooding. Category 1 groundwater. Affected finished basement including carpet, drywall, and stored items.',
    status: 'pending',
    priority: 'urgent',
    scheduled_date: '2024-02-15',
    estimated_cost: 8750.00,
    location: '567 Innovation Way, La Jolla, CA 92037'
  },
  {
    client_id: 6, // Bayview Commercial
    employee_id: 2,
    work_order_number: 'WO-2024-005',
    title: 'Office Suite 300 - Pipe Burst Water Damage',
    description: 'Frozen pipe burst in office suite. Water damage to office spaces, conference room, and reception area. Category 1 water.',
    status: 'completed',
    priority: 'urgent',
    scheduled_date: '2024-01-22',
    estimated_cost: 15200.00,
    location: '1200 Harbor Drive, Suite 300, San Diego, CA 92101'
  }
];

const invoices = [
  {
    client_id: 1,
    work_order_id: 1,
    invoice_number: 'INV-2024-2199',
    amount: 5247.85,
    status: 'paid',
    due_date: '2024-02-15',
    description: 'Water Remediation Services - Unit 4101\nInvoice for water damage mitigation and drying services'
  },
  {
    client_id: 6,
    work_order_id: 5,
    invoice_number: 'INV-2024-2205',
    amount: 16428.50,
    status: 'paid',
    due_date: '2024-02-22',
    description: 'Commercial Water Damage Restoration - Suite 300\nEmergency response and complete dry-out services'
  },
  {
    client_id: 2,
    work_order_id: 2,
    invoice_number: 'INV-2024-2210',
    amount: 3456.00,
    status: 'pending',
    due_date: '2024-03-05',
    description: 'Kitchen Water Damage Remediation\nEquipment rental and drying services'
  },
  {
    client_id: 4,
    work_order_id: 3,
    invoice_number: 'INV-2024-2212',
    amount: 8750.00,
    status: 'pending',
    due_date: '2024-03-12',
    description: 'Building C Roof Leak Remediation - Progress Invoice #1\nPartial billing for services rendered'
  }
];

const changeOrders = [
  {
    work_order_id: 1,
    change_order_number: 'CO-2024-001',
    description: 'Additional carpet removal in bedroom - more water damage discovered under furniture',
    reason: 'Extended water damage found during furniture move',
    cost_impact: 485.00,
    time_impact_days: 1,
    status: 'approved',
    requested_date: '2024-01-16'
  },
  {
    work_order_id: 3,
    change_order_number: 'CO-2024-002',
    description: 'Additional dehumidification required - moisture readings still high after 5 days',
    reason: 'Extended drying time needed due to high humidity and structural moisture',
    cost_impact: 850.00,
    time_impact_days: 3,
    status: 'approved',
    requested_date: '2024-02-15'
  },
  {
    work_order_id: 2,
    change_order_number: 'CO-2024-003',
    description: 'Hardwood floor drying system needed - moisture detected in subfloor',
    reason: 'Subfloor moisture requires specialized drying equipment',
    cost_impact: 675.00,
    time_impact_days: 4,
    status: 'pending',
    requested_date: '2024-02-05'
  }
];

const moistureLogs = [
  // WO-2024-001 - Unit 4101 (Completed job with full moisture log progression)
  { job_id: 1, work_order_id: 1, log_date: '2024-01-15', location: 'Master Bathroom - Floor', material_type: 'Ceramic Tile/Concrete', moisture_reading: 28.5, target_reading: 15.0, temperature: 72, humidity: 65, technician: 'Mike Rodriguez', notes: 'Initial reading - Day 1. High moisture in concrete subfloor.' },
  { job_id: 1, work_order_id: 1, log_date: '2024-01-15', location: 'Hallway - Drywall Base', material_type: 'Drywall', moisture_reading: 35.2, target_reading: 15.0, temperature: 72, humidity: 65, technician: 'Mike Rodriguez', notes: 'Day 1. Wicking moisture 6 inches up drywall.' },
  { job_id: 1, work_order_id: 1, log_date: '2024-01-15', location: 'Bedroom - Carpet Pad', material_type: 'Carpet/Pad', moisture_reading: 95.0, target_reading: 15.0, temperature: 71, humidity: 68, technician: 'Mike Rodriguez', notes: 'Day 1. Saturated pad removed. Subfloor tested.' },

  { job_id: 1, work_order_id: 1, log_date: '2024-01-16', location: 'Master Bathroom - Floor', material_type: 'Ceramic Tile/Concrete', moisture_reading: 24.8, target_reading: 15.0, temperature: 73, humidity: 58, technician: 'Mike Rodriguez', notes: 'Day 2. Decreasing steadily. Dehumidifier running 24hrs.' },
  { job_id: 1, work_order_id: 1, log_date: '2024-01-16', location: 'Hallway - Drywall Base', material_type: 'Drywall', moisture_reading: 29.5, target_reading: 15.0, temperature: 73, humidity: 58, technician: 'Mike Rodriguez', notes: 'Day 2. Good progress. Air movers positioned on wall.' },
  { job_id: 1, work_order_id: 1, log_date: '2024-01-16', location: 'Bedroom - Subfloor', material_type: 'Plywood', moisture_reading: 22.3, target_reading: 12.0, temperature: 72, humidity: 60, technician: 'Mike Rodriguez', notes: 'Day 2. After pad removal - drying well.' },

  { job_id: 1, work_order_id: 1, log_date: '2024-01-17', location: 'Master Bathroom - Floor', material_type: 'Ceramic Tile/Concrete', moisture_reading: 20.2, target_reading: 15.0, temperature: 74, humidity: 52, technician: 'Jessica Thompson', notes: 'Day 3. Good drying progress. Humidity controlled.' },
  { job_id: 1, work_order_id: 1, log_date: '2024-01-17', location: 'Hallway - Drywall Base', material_type: 'Drywall', moisture_reading: 22.1, target_reading: 15.0, temperature: 74, humidity: 52, technician: 'Jessica Thompson', notes: 'Day 3. Approaching target range.' },
  { job_id: 1, work_order_id: 1, log_date: '2024-01-17', location: 'Bedroom - Subfloor', material_type: 'Plywood', moisture_reading: 16.8, target_reading: 12.0, temperature: 73, humidity: 54, technician: 'Jessica Thompson', notes: 'Day 3. Near target. Monitor for rebound.' },

  { job_id: 1, work_order_id: 1, log_date: '2024-01-18', location: 'Master Bathroom - Floor', material_type: 'Ceramic Tile/Concrete', moisture_reading: 16.9, target_reading: 15.0, temperature: 73, humidity: 48, technician: 'Mike Rodriguez', notes: 'Day 4. Within target range! Continuing monitoring.' },
  { job_id: 1, work_order_id: 1, log_date: '2024-01-18', location: 'Hallway - Drywall Base', material_type: 'Drywall', moisture_reading: 17.8, target_reading: 15.0, temperature: 73, humidity: 48, technician: 'Mike Rodriguez', notes: 'Day 4. Slight rebound but acceptable.' },
  { job_id: 1, work_order_id: 1, log_date: '2024-01-18', location: 'Bedroom - Subfloor', material_type: 'Plywood', moisture_reading: 13.5, target_reading: 12.0, temperature: 73, humidity: 50, technician: 'Mike Rodriguez', notes: 'Day 4. Excellent. Ready for new carpet.' },

  { job_id: 1, work_order_id: 1, log_date: '2024-01-19', location: 'Master Bathroom - Floor', material_type: 'Ceramic Tile/Concrete', moisture_reading: 14.8, target_reading: 15.0, temperature: 72, humidity: 45, technician: 'Mike Rodriguez', notes: 'Day 5 - FINAL. DRY. Equipment removal approved.' },
  { job_id: 1, work_order_id: 1, log_date: '2024-01-19', location: 'Hallway - Drywall Base', material_type: 'Drywall', moisture_reading: 15.2, target_reading: 15.0, temperature: 72, humidity: 45, technician: 'Mike Rodriguez', notes: 'Day 5 - FINAL. Within normal range. Job complete.' },
  { job_id: 1, work_order_id: 1, log_date: '2024-01-19', location: 'Bedroom - Subfloor', material_type: 'Plywood', moisture_reading: 11.8, target_reading: 12.0, temperature: 72, humidity: 46, technician: 'Mike Rodriguez', notes: 'Day 5 - FINAL. Dry. Customer approved for reconstruction.' },

  // WO-2024-002 - Sarah Martinez Kitchen (In Progress)
  { job_id: 2, work_order_id: 2, log_date: '2024-02-03', location: 'Kitchen - Floor Base', material_type: 'Vinyl Plank/Subfloor', moisture_reading: 32.5, target_reading: 12.0, temperature: 70, humidity: 62, technician: 'Jessica Thompson', notes: 'Initial reading - Day 1. Water under vinyl plank flooring.' },
  { job_id: 2, work_order_id: 2, log_date: '2024-02-03', location: 'Dining Room - Hardwood', material_type: 'Hardwood/Oak', moisture_reading: 18.5, target_reading: 8.0, temperature: 70, humidity: 62, technician: 'Jessica Thompson', notes: 'Day 1. Cupping visible in hardwood. Drying mats deployed.' },
  { job_id: 2, work_order_id: 2, log_date: '2024-02-04', location: 'Kitchen - Floor Base', material_type: 'Vinyl Plank/Subfloor', moisture_reading: 28.2, target_reading: 12.0, temperature: 71, humidity: 56, technician: 'Jessica Thompson', notes: 'Day 2. Good progress with dehumidification.' },
  { job_id: 2, work_order_id: 2, log_date: '2024-02-04', location: 'Dining Room - Hardwood', material_type: 'Hardwood/Oak', moisture_reading: 16.8, target_reading: 8.0, temperature: 71, humidity: 56, technician: 'Jessica Thompson', notes: 'Day 2. Drying mat system working well.' },
  { job_id: 2, work_order_id: 2, log_date: '2024-02-05', location: 'Kitchen - Floor Base', material_type: 'Vinyl Plank/Subfloor', moisture_reading: 24.5, target_reading: 12.0, temperature: 72, humidity: 52, technician: 'Carlos Sanchez', notes: 'Day 3. Continuing to dry. Subfloor moisture detected - see change order.' },
  { job_id: 2, work_order_id: 2, log_date: '2024-02-05', location: 'Dining Room - Hardwood', material_type: 'Hardwood/Oak', moisture_reading: 14.2, target_reading: 8.0, temperature: 72, humidity: 52, technician: 'Carlos Sanchez', notes: 'Day 3. Cupping reducing. Needs more time.' },

  // WO-2024-003 - Green Valley Apartments (In Progress - Multiple locations)
  { job_id: 3, work_order_id: 3, log_date: '2024-02-10', location: 'Unit C-201 - Living Room Ceiling', material_type: 'Drywall/Ceiling', moisture_reading: 42.5, target_reading: 15.0, temperature: 68, humidity: 70, technician: 'Mike Rodriguez', notes: 'Day 1. Severe water damage. Wet drywall to be removed.' },
  { job_id: 3, work_order_id: 3, log_date: '2024-02-10', location: 'Unit C-202 - Bedroom Wall', material_type: 'Drywall/Wall', moisture_reading: 38.2, target_reading: 15.0, temperature: 68, humidity: 70, technician: 'Mike Rodriguez', notes: 'Day 1. Water wicking down wall from roof leak.' },
  { job_id: 3, work_order_id: 3, log_date: '2024-02-10', location: 'Unit C-203 - Closet Ceiling', material_type: 'Drywall/Ceiling', moisture_reading: 35.8, target_reading: 15.0, temperature: 69, humidity: 68, technician: 'Mike Rodriguez', notes: 'Day 1. Brown water staining. Insulation saturated above.' },
  { job_id: 3, work_order_id: 3, log_date: '2024-02-11', location: 'Unit C-201 - Living Room Ceiling', material_type: 'Drywall/Ceiling', moisture_reading: 28.5, target_reading: 15.0, temperature: 70, humidity: 62, technician: 'Mike Rodriguez', notes: 'Day 2. After wet drywall removal. Structure drying.' },
  { job_id: 3, work_order_id: 3, log_date: '2024-02-11', location: 'Unit C-202 - Bedroom Wall', material_type: 'Drywall/Wall', moisture_reading: 32.1, target_reading: 15.0, temperature: 70, humidity: 62, technician: 'Mike Rodriguez', notes: 'Day 2. Slow progress. Added air movers.' },
  { job_id: 3, work_order_id: 3, log_date: '2024-02-11', location: 'Unit C-203 - Closet Ceiling', material_type: 'Drywall/Ceiling', moisture_reading: 30.5, target_reading: 15.0, temperature: 70, humidity: 64, technician: 'Mike Rodriguez', notes: 'Day 2. Removed wet insulation from attic space.' }
];

const equipmentLogs = [
  // WO-2024-001 Equipment (Completed)
  { job_id: 1, equipment_id: 1, work_order_id: 1, deployed_date: '2024-01-15', retrieved_date: '2024-01-19', location: 'Unit 4101 - Master Bathroom', readings: 'Avg 18L/day extracted', hours_used: 96, notes: 'LGR dehumidifier - excellent performance' },
  { job_id: 1, equipment_id: 3, work_order_id: 1, deployed_date: '2024-01-15', retrieved_date: '2024-01-19', location: 'Unit 4101 - Hallway', readings: 'Airflow 2580 CFM', hours_used: 96, notes: 'Air mover positioned on wall' },
  { job_id: 1, equipment_id: 4, work_order_id: 1, deployed_date: '2024-01-15', retrieved_date: '2024-01-19', location: 'Unit 4101 - Bedroom', readings: 'Airflow 2580 CFM', hours_used: 96, notes: 'Air mover on carpet/subfloor' },
  { job_id: 1, equipment_id: 5, work_order_id: 1, deployed_date: '2024-01-15', retrieved_date: '2024-01-19', location: 'Unit 4101 - Bathroom to Hallway', readings: 'Airflow 2580 CFM', hours_used: 96, notes: 'Cross ventilation setup' },

  // WO-2024-002 Equipment (In Progress)
  { job_id: 2, equipment_id: 2, work_order_id: 2, deployed_date: '2024-02-03', retrieved_date: null, location: 'Kitchen - Main Floor', readings: 'Avg 22L/day extracted', hours_used: null, notes: 'LGR 3500i running continuously' },
  { job_id: 2, equipment_id: 6, work_order_id: 2, deployed_date: '2024-02-03', retrieved_date: null, location: 'Dining Room - Hardwood Floor', readings: 'Airflow 3300 CFM', hours_used: null, notes: 'Centrifugal air mover for hardwood drying' },
  { job_id: 2, equipment_id: 10, work_order_id: 2, deployed_date: '2024-02-05', retrieved_date: null, location: 'Kitchen - Subfloor', readings: 'Drying mat system', hours_used: null, notes: 'Added after subfloor moisture discovered (CO-2024-003)' },

  // WO-2024-003 Equipment (In Progress - Multiple units)
  { job_id: 3, equipment_id: 1, work_order_id: 3, deployed_date: '2024-02-10', retrieved_date: null, location: 'Building C - Common Area', readings: 'Avg 25L/day extracted', hours_used: null, notes: 'Central dehumidifier for all 3 units' },
  { job_id: 3, equipment_id: 3, work_order_id: 3, deployed_date: '2024-02-10', retrieved_date: null, location: 'Unit C-201 Living Room', readings: 'Airflow 2580 CFM', hours_used: null, notes: 'Air mover - ceiling area' },
  { job_id: 3, equipment_id: 4, work_order_id: 3, deployed_date: '2024-02-10', retrieved_date: null, location: 'Unit C-202 Bedroom', readings: 'Airflow 2580 CFM', hours_used: null, notes: 'Air mover - wall drying' },
  { job_id: 3, equipment_id: 5, work_order_id: 3, deployed_date: '2024-02-10', retrieved_date: null, location: 'Unit C-203 Closet', readings: 'Airflow 2580 CFM', hours_used: null, notes: 'Air mover - ceiling/closet' },
  { job_id: 3, equipment_id: 7, work_order_id: 3, deployed_date: '2024-02-10', retrieved_date: null, location: 'Building C - Hallway', readings: 'HEPA filtration 550 CFM', hours_used: null, notes: 'Air scrubber for containment area' },

  // WO-2024-005 Equipment (Completed - Commercial)
  { job_id: 5, equipment_id: 1, work_order_id: 5, deployed_date: '2024-01-22', retrieved_date: '2024-01-28', location: 'Suite 300 - Reception', readings: 'Avg 30L/day extracted', hours_used: 144, notes: 'LGR dehumidifier - commercial setting' },
  { job_id: 5, equipment_id: 2, work_order_id: 5, deployed_date: '2024-01-22', retrieved_date: '2024-01-28', location: 'Suite 300 - Conference Room', readings: 'Avg 35L/day extracted', hours_used: 144, notes: 'Second LGR for large area' },
  { job_id: 5, equipment_id: 3, work_order_id: 5, deployed_date: '2024-01-22', retrieved_date: '2024-01-28', location: 'Suite 300 - Office 1', readings: 'Airflow 2580 CFM', hours_used: 144, notes: 'Air mover' },
  { job_id: 5, equipment_id: 4, work_order_id: 5, deployed_date: '2024-01-22', retrieved_date: '2024-01-28', location: 'Suite 300 - Office 2', readings: 'Airflow 2580 CFM', hours_used: 144, notes: 'Air mover' },
  { job_id: 5, equipment_id: 5, work_order_id: 5, deployed_date: '2024-01-22', retrieved_date: '2024-01-28', location: 'Suite 300 - Office 3', readings: 'Airflow 2580 CFM', hours_used: 144, notes: 'Air mover' },
  { job_id: 5, equipment_id: 6, work_order_id: 5, deployed_date: '2024-01-22', retrieved_date: '2024-01-28', location: 'Suite 300 - Reception', readings: 'Airflow 3300 CFM', hours_used: 144, notes: 'Centrifugal air mover - high output' },
  { job_id: 5, equipment_id: 7, work_order_id: 5, deployed_date: '2024-01-22', retrieved_date: '2024-01-28', location: 'Suite 300 - Main Area', readings: 'HEPA filtration 550 CFM', hours_used: 144, notes: 'Air scrubber for air quality' }
];

console.log('\n==========================================');
console.log('SEEDING REALISTIC TEST DATA');
console.log('==========================================\n');

db.serialize(() => {
  let stats = {
    clients: 0,
    employees: 0,
    equipment: 0,
    workOrders: 0,
    invoices: 0,
    changeOrders: 0,
    moistureLogs: 0,
    equipmentLogs: 0
  };

  // Insert Clients
  const clientStmt = db.prepare('INSERT INTO clients (name, email, phone, address, company) VALUES (?, ?, ?, ?, ?)');
  clients.forEach(client => {
    clientStmt.run(client.name, client.email, client.phone, client.address, client.company);
    stats.clients++;
  });
  clientStmt.finalize();

  // Insert Employees
  const empStmt = db.prepare('INSERT INTO employees (name, position, email, phone, hourly_rate, hire_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
  employees.forEach(emp => {
    empStmt.run(emp.name, emp.position, emp.email, emp.phone, emp.hourly_rate, emp.hire_date, emp.status);
    stats.employees++;
  });
  empStmt.finalize();

  // Insert Equipment
  const eqStmt = db.prepare('INSERT INTO equipment (name, model, serial_number, purchase_date, purchase_cost, status) VALUES (?, ?, ?, ?, ?, ?)');
  equipment.forEach(eq => {
    eqStmt.run(eq.name, eq.model, eq.serial_number, eq.purchase_date, eq.purchase_cost, eq.status);
    stats.equipment++;
  });
  eqStmt.finalize();

  // Insert Work Orders
  const woStmt = db.prepare('INSERT INTO work_orders (client_id, employee_id, work_order_number, title, description, status, priority, scheduled_date, estimated_cost, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  workOrders.forEach(wo => {
    woStmt.run(wo.client_id, wo.employee_id, wo.work_order_number, wo.title, wo.description, wo.status, wo.priority, wo.scheduled_date, wo.estimated_cost, wo.location);
    stats.workOrders++;
  });
  woStmt.finalize();

  // Insert Invoices
  const invStmt = db.prepare('INSERT INTO invoices (client_id, work_order_id, invoice_number, amount, status, due_date, description) VALUES (?, ?, ?, ?, ?, ?, ?)');
  invoices.forEach(inv => {
    invStmt.run(inv.client_id, inv.work_order_id, inv.invoice_number, inv.amount, inv.status, inv.due_date, inv.description);
    stats.invoices++;
  });
  invStmt.finalize();

  // Insert Change Orders
  const coStmt = db.prepare('INSERT INTO change_orders (work_order_id, change_order_number, description, reason, cost_impact, time_impact_days, status, requested_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  changeOrders.forEach(co => {
    coStmt.run(co.work_order_id, co.change_order_number, co.description, co.reason, co.cost_impact, co.time_impact_days, co.status, co.requested_date);
    stats.changeOrders++;
  });
  coStmt.finalize();

  // Insert Moisture Logs
  const mlStmt = db.prepare('INSERT INTO moisture_logs (job_id, work_order_id, log_date, location, material_type, moisture_reading, target_reading, temperature, humidity, technician, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  moistureLogs.forEach(ml => {
    mlStmt.run(ml.job_id, ml.work_order_id, ml.log_date, ml.location, ml.material_type, ml.moisture_reading, ml.target_reading, ml.temperature, ml.humidity, ml.technician, ml.notes);
    stats.moistureLogs++;
  });
  mlStmt.finalize();

  // Insert Equipment Logs
  const elStmt = db.prepare('INSERT INTO equipment_logs (job_id, equipment_id, work_order_id, deployed_date, retrieved_date, location, readings, hours_used, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  equipmentLogs.forEach(el => {
    elStmt.run(el.job_id, el.equipment_id, el.work_order_id, el.deployed_date, el.retrieved_date, el.location, el.readings, el.hours_used, el.notes);
    stats.equipmentLogs++;
  });
  elStmt.finalize();

  console.log('\n==========================================');
  console.log('✅ SEEDING COMPLETE!');
  console.log('==========================================');
  console.log(`📊 Data Inserted:`);
  console.log(`   - Clients: ${stats.clients}`);
  console.log(`   - Employees: ${stats.employees}`);
  console.log(`   - Equipment: ${stats.equipment}`);
  console.log(`   - Work Orders: ${stats.workOrders}`);
  console.log(`   - Invoices: ${stats.invoices}`);
  console.log(`   - Change Orders: ${stats.changeOrders}`);
  console.log(`   - Moisture Logs: ${stats.moistureLogs}`);
  console.log(`   - Equipment Logs: ${stats.equipmentLogs}`);
  console.log('\n📍 Database Location:');
  console.log(DB_PATH);
  console.log('\n==========================================\n');

  db.close();
});
