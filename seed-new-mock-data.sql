---------------------------------------------------------
-- CLIENTS
---------------------------------------------------------

INSERT INTO clients (name, email, phone, address, company)
VALUES
  ('Jenae (Farmers Insurance)', 'jenae.farmers@example.com', NULL, 'Unit 214 Canyon Colony, 2020 Camino De La Reina, San Diego CA 92108', 'Farmers Insurance'),
  ('Matt Samar', 'matt.samar@yahoo.com', '(858) 699-4683', '3550 Lebon Dr Unit 5306 & 5206, San Diego CA 92122', NULL);


---------------------------------------------------------
-- WORK ORDERS
---------------------------------------------------------

INSERT INTO work_orders (
  client_id, employee_id, work_order_number, title, description,
  status, priority, scheduled_date, estimated_cost, location
)
VALUES
  (
    (SELECT id FROM clients WHERE name LIKE 'Jenae%'),
    NULL,
    'WO-0101',
    'Water Remediation – Canyon Colony',
    'Full water damage remediation including demo, antimicrobial treatment, equipment setup, and clearance testing.',
    'completed',
    'high',
    '2024-09-06',
    15285.00,
    'Unit 214 Canyon Colony, San Diego CA 92108'
  ),
  (
    (SELECT id FROM clients WHERE name = 'Matt Samar'),
    NULL,
    'WO-0102',
    'Water Remediation – Lebon Dr Units 5306 & 5206',
    'After-hours leak, demo, antimicrobial treatment, dry-out, equipment usage, and repairs per report.',
    'completed',
    'high',
    '2025-08-10',
    6200.00,
    '3550 Lebon Dr Units 5306 & 5206, San Diego CA 92122'
  );


---------------------------------------------------------
-- INVOICES
---------------------------------------------------------

INSERT INTO invoices (
  client_id, work_order_id, invoice_number, amount, status, due_date, description
)
VALUES
  (
    (SELECT id FROM clients WHERE name LIKE 'Jenae%'),
    (SELECT id FROM work_orders WHERE work_order_number = 'WO-0101'),
    'INV-3001',
    15285.00,
    'sent',
    '2024-09-09',
    'Water Remediation and Dry-Out Services for Canyon Colony Unit 214'
  ),
  (
    (SELECT id FROM clients WHERE name = 'Matt Samar'),
    (SELECT id FROM work_orders WHERE work_order_number = 'WO-0102'),
    'INV-3002',
    6200.00,
    'sent',
    '2025-08-17',
    'Water Remediation & Repairs for Lebon Dr Units 5306 & 5206'
  );


---------------------------------------------------------
-- INVOICE LINE ITEMS FOR INV-3001 (CANYON COLONY)
---------------------------------------------------------

INSERT INTO invoice_line_items (
  invoice_id, item_name, description, quantity, unit_price, total_price
)
VALUES
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Protective Floor Coverings', 'Cover all areas leading to work area with protective coverings.', 1, 475.00, 475.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Content Manipulation', 'Move and store personal belongings to allow demolition.', 1, 585.00, 585.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Cover Furniture & Electronics', 'Full protection of furniture and electronics.', 1, 250.00, 250.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Remove Fixtures', 'Remove washer/dryer, shelves, bifold doors and store appropriately.', 1, 425.00, 425.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Drywall Demo', 'Remove damaged drywall (walls & ceilings) in multiple rooms.', 1, 1900.00, 1900.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Antimicrobial Treatment', 'Scrub & treat exposed framing with antimicrobial solution.', 1, 2100.00, 2100.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Equipment Setup – Multiple Units', '3 dehumidifiers + 4 air movers for 84 hours.', 1, 3200.00, 3200.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Encapsulation', 'Encapsulate exposed areas with mildew-resistant coating.', 1, 1500.00, 1500.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Air Movers (24 hrs)', 'Set 2 air movers for 24 hours.', 1, 130.00, 130.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Air Scrubber (48 hrs)', 'HEPA air scrubber setup for 48 hours.', 1, 380.00, 380.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Lab Samples', 'Collect 3 samples and deliver to lab for mold clearance.', 1, 525.00, 525.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Home Office Electronics Packing', 'Remove, box, and store electronics & belongings.', 1, 725.00, 725.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Carpet & Baseboard Removal', 'Remove damaged carpet, pad, tack strip & baseboard.', 1, 680.00, 680.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Antimicrobial – Home Office', 'Scrub & treat home office floor.', 1, 500.00, 500.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Equipment Setup – Home Office', '1 dehumidifier + 1 air mover for 84 hours.', 1, 980.00, 980.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Air Scrubber – Home Office', 'HEPA scrubber for 48 hours.', 1, 380.00, 380.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3001'),
    'Debris Disposal', 'Full disposal of all demolition and remediation debris.', 1, 750.00, 750.00);


---------------------------------------------------------
-- INVOICE LINE ITEMS FOR INV-3002 (LEBON DR 5306 & 5206)
---------------------------------------------------------

INSERT INTO invoice_line_items (
  invoice_id, item_name, description, quantity, unit_price, total_price
)
VALUES
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Emergency Response', '4 a.m. emergency service call.', 1, 550.00, 550.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Content Manipulation', 'Move & protect personal belongings.', 6, 95.00, 570.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Water Extraction', '2" standing water removal – 940 sq ft.', 940, 0.43, 404.20),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Baseboard Removal', 'Remove all affected baseboard.', 320, 1.25, 400.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Drywall Removal (2 ft)', 'Remove wet drywall up to 2 ft height.', 320, 5.15, 1648.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Remove Wet Insulation', 'Tear out & bag wet insulation.', 128, 1.40, 179.20),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Floating Floor Removal', 'Remove damaged floating floor.', 814, 1.50, 1221.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Underlayment Removal', 'Remove underlayment & dispose.', 814, 0.25, 203.50),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Vinyl Flooring Removal', 'Remove vinyl flooring (kitchen/baths/laundry).', 126, 3.50, 441.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Kitchen Demo', 'Remove base cabinets, detach fixtures & appliances.', 1, 1425.40, 1425.40),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Bathroom Demo', 'Remove vanities, counters, sinks, showers & toilets.', 1, 2161.00, 2161.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Debris Removal', 'Dump truck + dump fees (2 loads).', 2, 800.00, 1600.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Antimicrobial Treatment', 'Scrub & treat affected framing.', 320, 3.95, 1264.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Encapsulation', 'Apply Aftershock Fungicidal Coating.', 320, 3.15, 1008.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Dehumidifiers', '6 LGR units × 3 days.', 18, 150.00, 2700.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Air Movers', '6 units × 3 days.', 18, 75.00, 1350.00),
  ((SELECT id FROM invoices WHERE invoice_number='INV-3002'),
    'Air Scrubbers', '3 units × 3 days.', 9, 175.00, 1575.00);

