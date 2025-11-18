-- Insert sample clients
INSERT INTO clients (name, email, phone, address, city, state, zip, notes)
VALUES (
  'Miguel Martinez / Edrick Cabello',
  NULL,
  '(858) 737-8411',
  '2020 Camino De La Reina, Unit 214',
  'San Diego',
  'CA',
  '92108',
  'Policyholder / occupants at Canyon Colony. Farmers claim #7008029982-1.'
);

INSERT INTO clients (name, email, phone, address, city, state, zip, notes)
VALUES (
  'Cindy Fontanares',
  'cindy.fontanares@hotmail.com',
  '619-274-7878',
  '3440 Lebon Dr Unit 4101',
  'San Diego',
  'CA',
  '92122',
  'Insured for USAA claim 015386295-800.'
);

-- Insert sample work orders
INSERT INTO work_orders (work_order_number, client, project_name, status, start_date, end_date, notes)
VALUES (
  '2024-214-REM',
  (SELECT id FROM clients WHERE name = 'Miguel Martinez / Edrick Cabello' LIMIT 1),
  'Unit 214 Canyon Colony – Water Remediation',
  'completed',
  '2024-09-06',
  '2024-09-09',
  'Emergency water remediation due to leak at laundry area. Farmers claim #7008029982-1. Includes drywall removal, contents manipulation, antimicrobial treatment, equipment setup, air scrubbers, dehumidifiers and debris removal.'
);

INSERT INTO work_orders (work_order_number, client, project_name, status, start_date, end_date, notes)
VALUES (
  '4101-REM-2025',
  (SELECT id FROM clients WHERE name = 'Cindy Fontanares' LIMIT 1),
  '3440 Lebon Dr Unit 4101 – Water Loss & Demolition',
  'in_progress',
  '2025-10-02',
  '2025-10-14',
  'Emergency response at 4 a.m. for hot water line failure at bedroom 2 bathroom sink. Entire unit saturated; flooring, walls, cabinetry and contents affected. Includes extraction, demolition, antimicrobial treatment and drying equipment.'
);

-- Insert sample invoices
INSERT INTO invoices (invoice_number, client_id, client_name, project_name, total_amount, subtotal, tax, status, due_date, date_of_issue)
VALUES (
  '2024-214',
  (SELECT id FROM clients WHERE name = 'Miguel Martinez / Edrick Cabello' LIMIT 1),
  'Miguel Martinez / Edrick Cabello',
  'Unit 214 Canyon Colony – Water Remediation',
  15285.00,
  15285.00,
  0.00,
  'sent',
  '2024-09-09',
  '2024-09-06'
);

INSERT INTO invoices (invoice_number, client_id, client_name, project_name, total_amount, subtotal, tax, status, due_date, date_of_issue)
VALUES (
  '2199',
  (SELECT id FROM clients WHERE name = 'Cindy Fontanares' LIMIT 1),
  'Cindy Fontanares',
  '4101 Reconstruction – Water Remediation',
  24008.53,
  21825.94,
  2182.59,
  'sent',
  '2025-10-21',
  '2025-10-14'
);

-- Line items for invoice 2024-214 (Canyon Colony remediation)
INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price, total)
VALUES
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Cover all areas leading to work area with protective floor covering',
   1, 475.00, 475.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Move and store personal belongings to allow demolition to commence',
   1, 585.00, 585.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Cover furniture and electronics in work area',
   1, 250.00, 250.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Remove damaged drywall from laundry, living room, dining room, pony wall and closet',
   1, 1900.00, 1900.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Scrub and treat exposed framing with antimicrobial agent to prevent mold growth',
   1, 2100.00, 2100.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Set 3 dehumidifiers and 4 air movers for 84 hours',
   1, 3200.00, 3200.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Encapsulate exposed areas with mildew-resistant coating',
   1, 1500.00, 1500.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Set 2 air movers for 24 hours',
   1, 130.00, 130.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Set air scrubber for 48 hours',
   1, 380.00, 380.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Collect and send 3 air/surface samples to lab for clearance',
   1, 525.00, 525.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Remove, box and store electronics and personal belongings from home office',
   1, 725.00, 725.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Remove and dispose damaged carpet, pad, tack strip and baseboard in home office',
   1, 680.00, 680.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Scrub and treat home office floor with antimicrobial agent',
   1, 500.00, 500.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Set 1 dehumidifier and 1 air mover for 84 hours in home office',
   1, 980.00, 980.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Set air scrubber for 48 hours in home office',
   1, 380.00, 380.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2024-214'),
   'Dispose of all demolition and remediation debris',
   1, 750.00, 750.00);

-- Line items for invoice 2199 (Lebon Dr 4101 loss)
INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price, total)
VALUES
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Emergency service call (4 a.m. response)',
   1, 550.00, 550.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Content manipulation – move and protect personal belongings',
   6, 95.00, 570.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Water extraction – 2\" standing water across 940 sq ft',
   940, 0.43, 404.20),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Tear out baseboard throughout affected areas',
   320, 1.25, 400.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Tear out wet drywall up to 2 ft, bag and dispose',
   320, 5.15, 1648.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Tear out and bag wet insulation',
   128, 1.40, 179.20),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Tear out non-salvageable floating floor and bag for disposal',
   814, 1.50, 1221.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Tear out non-salvageable underlayment and bag for disposal',
   814, 0.25, 203.50),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Tear out vinyl flooring (kitchen, baths, laundry)',
   126, 3.50, 441.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Tear out lower kitchen cabinetry and detach fixtures/appliances',
   1, 1425.40, 1425.40),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Tear out vanities, counters, sinks, toilets and shower enclosures (both bathrooms)',
   1, 2161.00, 2161.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Debris removal – dump truck including dump fees (2 loads)',
   2, 800.00, 1600.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Scrub and treat affected framing with antimicrobial agent',
   320, 3.95, 1264.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Encapsulate with Aftershock fungicidal coating',
   320, 3.15, 1008.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'LGR dehumidifiers – 6 units for 3 days',
   18, 150.00, 2700.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Air movers – 6 units for 3 days',
   18, 75.00, 1350.00),
  ((SELECT id FROM invoices WHERE invoice_number = '2199'),
   'Air scrubbers – 3 units for 3 days',
   9, 175.00, 1575.00);

