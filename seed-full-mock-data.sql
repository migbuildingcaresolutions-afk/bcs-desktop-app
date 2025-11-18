---------------------------------------------------------
-- COMPANY SETTINGS (SAFE: INSERT OR IGNORE)
---------------------------------------------------------
INSERT OR IGNORE INTO company_settings (
  id, company_name, business_name, address_line1, city, state, zip,
  phone, email, website, license_number, payment_terms
) VALUES (
  1,
  'Building Care Solutions',
  'Building Care Solutions',
  '8889 Caminito Plaza Centro #7117',
  'San Diego',
  'CA',
  '92122',
  '858-737-8499',
  'mig.buildingcaresolutions@gmail.com',
  'https://www.sd-bcs.com',
  'CA-123456-C39',
  'Net 30'
);

---------------------------------------------------------
-- CLIENTS (3)
---------------------------------------------------------
INSERT INTO clients (name, email, phone, address, company)
VALUES
  ('Cindy Fontanares', 'cindy.fontanares@hotmail.com', '619-274-7878',
   '3440 Lebon Dr Unit 4101, San Diego CA 92122', NULL),
  ('Matt Samar', 'matt.samar@yahoo.com', '858-699-4683',
   '3550 Lebon Dr Units 5306 & 5206, San Diego CA 92122', NULL),
  ('Canyon Colony HOA', 'hoa@canyoncolony.example.com', '858-555-0101',
   '2020 Camino De La Reina, San Diego CA 92108', 'Canyon Colony');

---------------------------------------------------------
-- EMPLOYEES (3)
---------------------------------------------------------
INSERT INTO employees (name, email, phone, position, hire_date, hourly_rate, status)
VALUES
  ('Miguel Martinez', 'mig.buildingcaresolutions@gmail.com', '858-737-8499',
   'Owner / Project Manager', '2018-01-01', 65.00, 'active'),
  ('Edrick Cabello', 'edrick@example.com', '858-555-0123',
   'Lead Technician', '2020-03-15', 40.00, 'active'),
  ('Juan Lopez', 'juan.tech@example.com', '858-555-0456',
   'Field Technician', '2022-06-10', 28.00, 'active');

---------------------------------------------------------
-- VENDORS (3)
---------------------------------------------------------
INSERT INTO vendors (name, contact_person, email, phone, address, services, notes)
VALUES
  ('ABC Dump Services', 'Dispatch', 'dispatch@abcdump.com', '858-555-0200',
   '123 Landfill Rd, San Diego CA 92123', 'Debris hauling & dump fees', ''),
  ('San Diego Flooring Supply', 'Maria Gomez', 'orders@sdflooring.com', '858-555-0300',
   '555 Carpet Ln, San Diego CA 92111', 'Flooring materials', ''),
  ('Precision Mold Lab', 'Lab Intake', 'intake@precisionmoldlab.com', '858-555-0400',
   '789 Lab Ct, San Diego CA 92121', 'Air & surface mold testing', '');

---------------------------------------------------------
-- EQUIPMENT (3)
---------------------------------------------------------
INSERT INTO equipment (name, model, serial_number, purchase_date, purchase_cost, status, notes)
VALUES
  ('LGR Dehumidifier', 'Dri-Eaz LGR 7000', 'LGR-7000-001', '2021-05-10', 2800.00, 'available', ''),
  ('Air Mover', 'Phoenix AirMax', 'AM-100-015', '2022-02-18', 425.00, 'available', ''),
  ('HEPA Air Scrubber', 'DefendAir HEPA 500', 'HEPA-500-009', '2020-09-03', 1100.00, 'available', '');

---------------------------------------------------------
-- WORK ORDERS (3)  WO-0001 .. WO-0003
---------------------------------------------------------
INSERT INTO work_orders (
  client_id, employee_id, work_order_number, title, description,
  status, priority, scheduled_date, estimated_cost, location
)
VALUES
  (
    (SELECT id FROM clients WHERE name = 'Cindy Fontanares'),
    (SELECT id FROM employees WHERE name = 'Miguel Martinez'),
    'WO-0001',
    'Water Remediation – 3440 Lebon Dr Unit 4101',
    'Burst hot water supply line in bathroom caused flooding throughout the unit. Full demo, dry out, antimicrobial, encapsulation and rebuild.',
    'in_progress',
    'high',
    '2025-10-02',
    24008.53,
    '3440 Lebon Dr Unit 4101, San Diego CA 92122'
  ),
  (
    (SELECT id FROM clients WHERE name = 'Matt Samar'),
    (SELECT id FROM employees WHERE name = 'Edrick Cabello'),
    'WO-0002',
    'Water Remediation – Lebon Dr Units 5306 & 5206',
    'Washer/dryer leak affecting upstairs and downstairs units. Demo, antimicrobial, dry out and repairs.',
    'in_progress',
    'high',
    '2025-08-10',
    6200.00,
    '3550 Lebon Dr Units 5306 & 5206, San Diego CA 92122'
  ),
  (
    (SELECT id FROM clients WHERE name = 'Canyon Colony HOA'),
    (SELECT id FROM employees WHERE name = 'Miguel Martinez'),
    'WO-0003',
    'Water Remediation – Canyon Colony Unit 214',
    'Water damage affecting laundry, living, dining and home office. Demo, antimicrobial, equipment and clearance testing.',
    'completed',
    'high',
    '2024-09-06',
    15285.00,
    'Unit 214, 2020 Camino De La Reina, San Diego CA 92108'
  );

---------------------------------------------------------
-- ESTIMATES (3)  EST-0001 .. EST-0003
---------------------------------------------------------
INSERT INTO estimates (
  client_id, estimate_number, title, description,
  total_amount, status, valid_until, notes
)
VALUES
  (
    (SELECT id FROM clients WHERE name = 'Cindy Fontanares'),
    'EST-0001',
    'Dryout & Reconstruction – 3440 Lebon Dr',
    'Complete mitigation and reconstruction of water-damaged unit following supply line failure.',
    24008.53,
    'approved',
    '2025-11-01',
    'Pricing based on Category 2 water loss.'
  ),
  (
    (SELECT id FROM clients WHERE name = 'Matt Samar'),
    'EST-0002',
    'Water Remediation – Units 5306 & 5206',
    'Dryout and limited repairs for washer/dryer leak affecting two units.',
    6200.00,
    'sent',
    '2025-09-01',
    'Includes demo, antimicrobial, equipment and basic repairs.'
  ),
  (
    (SELECT id FROM clients WHERE name = 'Canyon Colony HOA'),
    'EST-0003',
    'Remediation – Canyon Colony Unit 214',
    'Remediation scope including demo, antimicrobial, equipment and clearance testing.',
    15285.00,
    'approved',
    '2024-10-01',
    'Based on inspection notes and moisture mapping.'
  );

---------------------------------------------------------
-- ESTIMATE LINE ITEMS (3 x 3)
---------------------------------------------------------
INSERT INTO estimate_line_items (
  estimate_id, item_name, description, quantity, unit_price, total_price, category, sort_order
)
VALUES
  -- EST-0001 (Cindy)
  ((SELECT id FROM estimates WHERE estimate_number='EST-0001'),
   'Emergency Service Call', 'After-hours emergency response and initial mitigation.', 1, 550.00, 550.00, 'Emergency', 1),
  ((SELECT id FROM estimates WHERE estimate_number='EST-0001'),
   'Demo & Disposal', 'Remove damaged drywall, insulation, flooring and haul away debris.', 1, 8200.00, 8200.00, 'Demolition', 2),
  ((SELECT id FROM estimates WHERE estimate_number='EST-0001'),
   'Dryout & Equipment', 'Dehumidifiers, air movers, monitoring and documentation.', 1, 5400.00, 5400.00, 'Dryout', 3),

  -- EST-0002 (Matt)
  ((SELECT id FROM estimates WHERE estimate_number='EST-0002'),
   'Demo – Two Units', 'Remove flooring, drywall and insulation in units 5306 & 5206.', 1, 2600.00, 2600.00, 'Demolition', 1),
  ((SELECT id FROM estimates WHERE estimate_number='EST-0002'),
   'Equipment Package', 'Dehumidifiers, air movers and air scrubbers for 3–4 days.', 1, 2100.00, 2100.00, 'Dryout', 2),
  ((SELECT id FROM estimates WHERE estimate_number='EST-0002'),
   'Antimicrobial & Encapsulation', 'Treat and encapsulate affected framing and surfaces.', 1, 1500.00, 1500.00, 'Remediation', 3),

  -- EST-0003 (Canyon Colony)
  ((SELECT id FROM estimates WHERE estimate_number='EST-0003'),
   'Content Protection', 'Cover and protect contents and electronics.', 1, 900.00, 900.00, 'Contents', 1),
  ((SELECT id FROM estimates WHERE estimate_number='EST-0003'),
   'Remediation Package', 'Demo, antimicrobial, equipment and monitoring.', 1, 9200.00, 9200.00, 'Remediation', 2),
  ((SELECT id FROM estimates WHERE estimate_number='EST-0003'),
   'Clearance Testing', 'Collect and submit samples for lab clearance.', 1, 1185.00, 1185.00, 'Testing', 3);

---------------------------------------------------------
-- INVOICES (3)  INV-4001 .. INV-4003
---------------------------------------------------------
INSERT INTO invoices (
  client_id, work_order_id, invoice_number, amount, status, due_date, description
)
VALUES
  (
    (SELECT id FROM clients WHERE name='Cindy Fontanares'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0001'),
    'INV-4001',
    24008.53,
    'sent',
    '2025-10-21',
    'Water remediation and reconstruction at 3440 Lebon Dr Unit 4101.'
  ),
  (
    (SELECT id FROM clients WHERE name='Matt Samar'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0002'),
    'INV-4002',
    6200.00,
    'sent',
    '2025-08-17',
    'Water remediation and repairs for units 5306 & 5206.'
  ),
  (
    (SELECT id FROM clients WHERE name='Canyon Colony HOA'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0003'),
    'INV-4003',
    15285.00,
    'sent',
    '2024-09-09',
    'Remediation scope for Canyon Colony Unit 214.'
  );

---------------------------------------------------------
-- INVOICE LINE ITEMS (3–5 per invoice)
---------------------------------------------------------
INSERT INTO invoice_line_items (
  invoice_id, item_name, description, quantity, unit_price, total_price, category, sort_order
)
VALUES
  -- INV-4001 (Cindy)
  ((SELECT id FROM invoices WHERE invoice_number='INV-4001'),
   'Emergency Response', 'After-hours response and initial mitigation.', 1, 550.00, 550.00, 'Emergency', 1),
  ((SELECT id FROM invoices WHERE invoice_number='INV-4001'),
   'Demolition', 'Remove wet drywall, insulation and flooring.', 1, 8450.00, 8450.00, 'Demolition', 2),
  ((SELECT id FROM invoices WHERE invoice_number='INV-4001'),
   'Dryout Equipment', 'Dehumidifiers, air movers and monitoring.', 1, 6200.00, 6200.00, 'Dryout', 3),
  ((SELECT id FROM invoices WHERE invoice_number='INV-4001'),
   'Reconstruction', 'Drywall, paint, flooring and trim.', 1, 8200.00, 8200.00, 'Reconstruction', 4),
  ((SELECT id FROM invoices WHERE invoice_number='INV-4001'),
   'Dump & Fees', 'Debris hauling and disposal fees.', 1, 608.53, 608.53, 'Debris', 5),

  -- INV-4002 (Matt)
  ((SELECT id FROM invoices WHERE invoice_number='INV-4002'),
   'Demo – Two Units', 'Remove flooring and affected drywall in both units.', 1, 2600.00, 2600.00, 'Demolition', 1),
  ((SELECT id FROM invoices WHERE invoice_number='INV-4002'),
   'Equipment Package', 'Dehumidifiers, air movers and air scrubbers.', 1, 2100.00, 2100.00, 'Dryout', 2),
  ((SELECT id FROM invoices WHERE invoice_number='INV-4002'),
   'Antimicrobial Treatment', 'Scrub and treat all affected areas.', 1, 1500.00, 1500.00, 'Remediation', 3),

  -- INV-4003 (Canyon Colony)
  ((SELECT id FROM invoices WHERE invoice_number='INV-4003'),
   'Protective Coverings', 'Cover walkways, furniture and electronics.', 1, 1310.00, 1310.00, 'Contents', 1),
  ((SELECT id FROM invoices WHERE invoice_number='INV-4003'),
   'Demolition & Debris', 'Demo of laundry, living, dining and office plus disposal.', 1, 4735.00, 4735.00, 'Demolition', 2),
  ((SELECT id FROM invoices WHERE invoice_number='INV-4003'),
   'Dryout & Equipment', 'Dehumidifiers, air movers and air scrubbers.', 1, 4710.00, 4710.00, 'Dryout', 3),
  ((SELECT id FROM invoices WHERE invoice_number='INV-4003'),
   'Antimicrobial & Encapsulation', 'Treat and encapsulate exposed framing.', 1, 3530.00, 3530.00, 'Remediation', 4);

---------------------------------------------------------
-- CHANGE ORDERS (3)  CO-0001 .. CO-0003
---------------------------------------------------------
INSERT INTO change_orders (
  work_order_id, change_order_number, description, reason,
  cost_impact, time_impact_days, status, requested_date
)
VALUES
  (
    (SELECT id FROM work_orders WHERE work_order_number='WO-0001'),
    'CO-0001',
    'Upgrade to premium LVP flooring in living areas.',
    'Owner requested material upgrade.',
    1850.00,
    3,
    'approved',
    '2025-10-05'
  ),
  (
    (SELECT id FROM work_orders WHERE work_order_number='WO-0002'),
    'CO-0002',
    'Additional demo in downstairs unit due to hidden damage.',
    'Discovered additional moisture behind baseboard.',
    950.00,
    2,
    'approved',
    '2025-08-12'
  ),
  (
    (SELECT id FROM work_orders WHERE work_order_number='WO-0003'),
    'CO-0003',
    'Add extra encapsulation in home office.',
    'Engineer recommendation.',
    650.00,
    1,
    'pending',
    '2024-09-07'
  );

---------------------------------------------------------
-- PRICING RULES (3)
---------------------------------------------------------
INSERT INTO pricing_rules (
  rule_name, category, markup_percentage, overhead_percentage,
  profit_percentage, tax_percentage, minimum_charge, is_active
)
VALUES
  ('Standard Water Damage', 'Water Damage', 0, 10, 10, 0, 350.00, 1),
  ('Remediation Premium', 'Remediation', 5, 12, 15, 0, 500.00, 1),
  ('Reconstruction Standard', 'Reconstruction', 0, 10, 12, 0, 750.00, 1);

---------------------------------------------------------
-- REMEDIATION DRYOUT JOBS (3)  DRY-0001 .. DRY-0003
---------------------------------------------------------
INSERT INTO remediation_dryout (
  job_number, work_order_id, client_id, loss_type, affected_area_sqft,
  category, start_date, completion_date, moisture_readings,
  equipment_used, daily_logs, status, notes
)
VALUES
  (
    'DRY-0001',
    (SELECT id FROM work_orders WHERE work_order_number='WO-0001'),
    (SELECT id FROM clients WHERE name='Cindy Fontanares'),
    'Clean water – supply line',
    940,
    2,
    '2025-10-02',
    '2025-10-06',
    'Living: 33+%, Bedrooms: 33+%, Hall: 33+%',
    '4 LGR dehumidifiers, 9 air movers, 3 air scrubbers',
    'Day 1: setup; Day 2–3: monitoring; Day 4: takedown.',
    'completed',
    'Clearance passed after final inspection.'
  ),
  (
    'DRY-0002',
    (SELECT id FROM work_orders WHERE work_order_number='WO-0002'),
    (SELECT id FROM clients WHERE name='Matt Samar'),
    'Clean water – appliance leak',
    780,
    2,
    '2025-08-10',
    '2025-08-13',
    'LR/DR/Kitchen: 28–32%, Downstairs ceiling: 30+%',
    '3 LGR dehumidifiers, 6 air movers, 2 air scrubbers',
    'Daily moisture readings and equipment adjustments.',
    'completed',
    'Both units dried to target range.'
  ),
  (
    'DRY-0003',
    (SELECT id FROM work_orders WHERE work_order_number='WO-0003'),
    (SELECT id FROM clients WHERE name='Canyon Colony HOA'),
    'Category 2 – unit leak',
    650,
    2,
    '2024-09-06',
    '2024-09-10',
    'Laundry & living areas initially 33+%',
    '3 LGR dehumidifiers, 5 air movers, 1 air scrubber',
    'Containment, negative air and daily monitoring.',
    'completed',
    'Clearance achieved after lab samples.'
  );

---------------------------------------------------------
-- REMEDIATION RECONSTRUCTION JOBS (3)  RECON-0001 .. RECON-0003
---------------------------------------------------------
INSERT INTO remediation_reconstruction (
  job_number, dryout_job_id, work_order_id, client_id,
  scope_of_work, start_date, estimated_completion, actual_completion,
  permit_number, inspection_dates, status, notes
)
VALUES
  (
    'RECON-0001',
    (SELECT id FROM remediation_dryout WHERE job_number='DRY-0001'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0001'),
    (SELECT id FROM clients WHERE name='Cindy Fontanares'),
    'Drywall, texture, paint, flooring and trim replacement throughout unit.',
    '2025-10-07',
    '2025-10-21',
    NULL,
    'PRM-2025-101',
    'Rough: 2025-10-12; Final: TBD',
    'in_progress',
    'Pending final paint and punch list.'
  ),
  (
    'RECON-0002',
    (SELECT id FROM remediation_dryout WHERE job_number='DRY-0002'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0002'),
    (SELECT id FROM clients WHERE name='Matt Samar'),
    'Repair drywall, ceilings and flooring in both units.',
    '2025-08-14',
    '2025-08-28',
    NULL,
    'PRM-2025-082',
    'Rough: 2025-08-20; Final: TBD',
    'in_progress',
    'Coordinating with HOA for access.'
  ),
  (
    'RECON-0003',
    (SELECT id FROM remediation_dryout WHERE job_number='DRY-0003'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0003'),
    (SELECT id FROM clients WHERE name='Canyon Colony HOA'),
    'Limited repairs to affected areas in laundry, living and office.',
    '2024-09-11',
    '2024-09-25',
    '2024-09-23',
    'PRM-2024-209',
    'Rough: 2024-09-18; Final: 2024-09-23',
    'completed',
    'Punch list completed and signed off.'
  );

---------------------------------------------------------
-- EQUIPMENT LOGS (3)
---------------------------------------------------------
INSERT INTO equipment_logs (
  job_id, equipment_id, work_order_id, deployed_date, retrieved_date,
  location, readings, hours_used, notes
)
VALUES
  (
    (SELECT id FROM remediation_dryout WHERE job_number='DRY-0001'),
    (SELECT id FROM equipment WHERE name='LGR Dehumidifier'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0001'),
    '2025-10-02',
    '2025-10-06',
    'Living room / hall',
    'Initial: 33+%, Final: 12–14%',
    96,
    'Unit ran continuously with daily filter checks.'
  ),
  (
    (SELECT id FROM remediation_dryout WHERE job_number='DRY-0002'),
    (SELECT id FROM equipment WHERE name='Air Mover'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0002'),
    '2025-08-10',
    '2025-08-13',
    '5306 & 5206 living areas',
    'Airflow adjusted around containment walls.',
    72,
    'Repositioned daily for coverage.'
  ),
  (
    (SELECT id FROM remediation_dryout WHERE job_number='DRY-0003'),
    (SELECT id FROM equipment WHERE name='HEPA Air Scrubber'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0003'),
    '2024-09-06',
    '2024-09-10',
    'Laundry / living containment',
    'Filter changed on day 3.',
    96,
    'Used for negative air during remediation.'
  );

---------------------------------------------------------
-- MOISTURE LOGS (3)
---------------------------------------------------------
INSERT INTO moisture_logs (
  job_id, work_order_id, log_date, location, material_type,
  moisture_reading, target_reading, temperature, humidity,
  technician, notes
)
VALUES
  (
    (SELECT id FROM remediation_dryout WHERE job_number='DRY-0001'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0001'),
    '2025-10-03',
    'Living room wall base',
    'Drywall',
    22.5,
    12.0,
    74.0,
    45.0,
    'Miguel Martinez',
    'Readings trending down as expected.'
  ),
  (
    (SELECT id FROM remediation_dryout WHERE job_number='DRY-0002'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0002'),
    '2025-08-11',
    'Downstairs ceiling',
    'Drywall',
    24.8,
    12.0,
    73.0,
    47.0,
    'Edrick Cabello',
    'Ceiling still elevated, equipment adjusted.'
  ),
  (
    (SELECT id FROM remediation_dryout WHERE job_number='DRY-0003'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0003'),
    '2024-09-08',
    'Home office floor',
    'Subfloor',
    18.0,
    12.0,
    72.0,
    40.0,
    'Juan Lopez',
    'Approaching dry standard, plan to pull equipment next day.'
  );

---------------------------------------------------------
-- STORED ITEMS (3)
---------------------------------------------------------
INSERT INTO stored_items (
  job_id, client_id, work_order_id, item_description, room, quantity,
  condition, photo_url, storage_location, packed_date, returned_date,
  status, notes
)
VALUES
  (
    (SELECT id FROM remediation_dryout WHERE job_number='DRY-0001'),
    (SELECT id FROM clients WHERE name='Cindy Fontanares'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0001'),
    'Boxed electronics and office equipment',
    'Home office',
    6,
    'Good',
    NULL,
    'On-site hallway containment',
    '2025-10-02',
    NULL,
    'in_storage',
    'Labeled and inventoried for easy return.'
  ),
  (
    (SELECT id FROM remediation_dryout WHERE job_number='DRY-0002'),
    (SELECT id FROM clients WHERE name='Matt Samar'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0002'),
    'Living room furniture and decor',
    'Living room',
    10,
    'Good',
    NULL,
    'Bedroom 5306',
    '2025-08-10',
    NULL,
    'in_storage',
    'Protected with moving blankets and plastic.'
  ),
  (
    (SELECT id FROM remediation_dryout WHERE job_number='DRY-0003'),
    (SELECT id FROM clients WHERE name='Canyon Colony HOA'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0003'),
    'Home office contents',
    'Home office',
    8,
    'Good',
    NULL,
    'On-site containment',
    '2024-09-06',
    '2024-09-20',
    'returned',
    'Returned after reconstruction completed.'
  );

---------------------------------------------------------
-- CERTIFICATES (3)
---------------------------------------------------------
INSERT INTO certificates (
  certificate_number, certificate_type, work_order_id, client_id,
  issue_date, description, issued_by, file_path, notes
)
VALUES
  (
    'CERT-0001',
    'Mold Clearance',
    (SELECT id FROM work_orders WHERE work_order_number='WO-0001'),
    (SELECT id FROM clients WHERE name='Cindy Fontanares'),
    '2025-10-07',
    'Final clearance testing indicates mold levels within normal limits.',
    'Precision Mold Lab',
    NULL,
    'Attached to job file for owner and insurer.'
  ),
  (
    'CERT-0002',
    'Dryout Completion',
    (SELECT id FROM work_orders WHERE work_order_number='WO-0002'),
    (SELECT id FROM clients WHERE name='Matt Samar'),
    '2025-08-14',
    'All affected materials dried to or below target moisture content.',
    'Building Care Solutions',
    NULL,
    'Signed by project manager.'
  ),
  (
    'CERT-0003',
    'Reconstruction Completion',
    (SELECT id FROM work_orders WHERE work_order_number='WO-0003'),
    (SELECT id FROM clients WHERE name='Canyon Colony HOA'),
    '2024-09-25',
    'Repairs completed per approved scope of work.',
    'Building Care Solutions',
    NULL,
    'HOA copy sent via email.'
  );

---------------------------------------------------------
-- CALENDAR EVENTS (3)
---------------------------------------------------------
INSERT INTO calendar_events (
  title, description, event_type, event_date, start_time, end_time,
  client_id, work_order_id, assigned_to, location, status, reminder_sent, notes
)
VALUES
  (
    'Initial Inspection – 3440 Lebon Dr',
    'Meet with client and insurer to review damage and scope.',
    'inspection',
    '2025-10-02',
    '09:00',
    '10:30',
    (SELECT id FROM clients WHERE name='Cindy Fontanares'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0001'),
    (SELECT id FROM employees WHERE name='Miguel Martinez'),
    '3440 Lebon Dr Unit 4101',
    'completed',
    1,
    ''
  ),
  (
    'Equipment Check – Lebon 5306/5206',
    'Moisture readings and equipment adjustments.',
    'site_visit',
    '2025-08-11',
    '13:00',
    '14:00',
    (SELECT id FROM clients WHERE name='Matt Samar'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0002'),
    (SELECT id FROM employees WHERE name='Edrick Cabello'),
    '3550 Lebon Dr',
    'completed',
    0,
    ''
  ),
  (
    'Final Walkthrough – Canyon Colony',
    'Walk unit with HOA rep and resident to confirm completion.',
    'final_walk',
    '2024-09-25',
    '15:00',
    '16:00',
    (SELECT id FROM clients WHERE name='Canyon Colony HOA'),
    (SELECT id FROM work_orders WHERE work_order_number='WO-0003'),
    (SELECT id FROM employees WHERE name='Miguel Martinez'),
    '2020 Camino De La Reina',
    'completed',
    1,
    ''
  );

---------------------------------------------------------
-- EXPENSES (3)
---------------------------------------------------------
INSERT INTO expenses (
  expense_number, work_order_id, category, vendor_id, description,
  amount, expense_date, payment_method, receipt_url,
  billable, reimbursable, approved, approved_by, notes
)
VALUES
  (
    'EXP-0001',
    (SELECT id FROM work_orders WHERE work_order_number='WO-0001'),
    'Dump Fees',
    (SELECT id FROM vendors WHERE name='ABC Dump Services'),
    'Debris disposal fees for 2 dump loads.',
    650.00,
    '2025-10-06',
    'credit_card',
    NULL,
    1,
    0,
    1,
    (SELECT id FROM employees WHERE name='Miguel Martinez'),
    ''
  ),
  (
    'EXP-0002',
    (SELECT id FROM work_orders WHERE work_order_number='WO-0002'),
    'Materials',
    (SELECT id FROM vendors WHERE name='San Diego Flooring Supply'),
    'LVP flooring and baseboard materials.',
    1850.00,
    '2025-08-20',
    'credit_card',
    NULL,
    1,
    0,
    1,
    (SELECT id FROM employees WHERE name='Miguel Martinez'),
    ''
  ),
  (
    'EXP-0003',
    (SELECT id FROM work_orders WHERE work_order_number='WO-0003'),
    'Lab Fees',
    (SELECT id FROM vendors WHERE name='Precision Mold Lab'),
    'Lab analysis for 3 samples.',
    525.00,
    '2024-09-11',
    'credit_card',
    NULL,
    1,
    0,
    1,
    (SELECT id FROM employees WHERE name='Miguel Martinez'),
    ''
  );

---------------------------------------------------------
-- PAYMENTS (3)
---------------------------------------------------------
INSERT INTO payments (
  invoice_id, payment_method, payment_provider, transaction_id,
  amount, payment_date, status, notes
)
VALUES
  (
    (SELECT id FROM invoices WHERE invoice_number='INV-4001'),
    'check',
    'Bank of America',
    'CHK-2401',
    12000.00,
    '2025-10-18',
    'completed',
    'Partial payment from insurer.'
  ),
  (
    (SELECT id FROM invoices WHERE invoice_number='INV-4002'),
    'credit_card',
    'Square',
    'SQ-2025-0817-01',
    6200.00,
    '2025-08-17',
    'completed',
    'Paid in full via Square.'
  ),
  (
    (SELECT id FROM invoices WHERE invoice_number='INV-4003'),
    'check',
    'HOA',
    'CHK-214-2024',
    15285.00,
    '2024-09-20',
    'completed',
    'Paid in full by HOA.'
  );

---------------------------------------------------------
-- DOCUMENT TEMPLATES (3)
---------------------------------------------------------
INSERT INTO document_templates (
  template_name, template_type, html_content, css_styles, is_default
)
VALUES
  (
    'Standard Invoice',
    'invoice',
    '<h1>Invoice</h1><p>Thank you for your business.</p>',
    'body { font-family: system-ui; } h1 { color: #1f2933; }',
    1
  ),
  (
    'Standard Estimate',
    'estimate',
    '<h1>Estimate</h1><p>This is an estimate only.</p>',
    'body { font-family: system-ui; } h1 { color: #1d4ed8; }',
    1
  ),
  (
    'Completion Certificate',
    'certificate',
    '<h1>Certificate of Completion</h1><p>Work completed as described.</p>',
    'body { font-family: system-ui; } h1 { color: #16a34a; }',
    0
  );

