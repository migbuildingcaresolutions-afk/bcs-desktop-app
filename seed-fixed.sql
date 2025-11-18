------------------------------------------------------------------
-- 1. INSERT CLIENTS (correct schema)
------------------------------------------------------------------

INSERT INTO clients (name, email, phone, address, company)
VALUES
('Miguel Martinez / Edrick Cabello', NULL, '(858) 737-8411',
 '2020 Camino De La Reina Unit 214, San Diego CA 92108', 'Farmers Claim #7008029982-1'),

('Cindy Fontanares', 'cindy.fontanares@hotmail.com', '619-274-7878',
 '3440 Lebon Dr Unit 4101, San Diego CA 92122', 'USAA Claim 015386295-800');


------------------------------------------------------------------
-- 2. WORK ORDERS (correct schema)
------------------------------------------------------------------

INSERT INTO work_orders
(client_id, employee_id, work_order_number, title, description, status, priority, scheduled_date, estimated_cost, location)
VALUES
(
 (SELECT id FROM clients WHERE name='Miguel Martinez / Edrick Cabello'),
 NULL,
 '2024-214-REM',
 'Water Remediation – Canyon Colony',
 'Emergency remediation including demo, antimicrobial, equipment, samples, debris removal.',
 'completed',
 'high',
 '2024-09-06',
 15285.00,
 'Unit 214 Canyon Colony'
),

(
 (SELECT id FROM clients WHERE name='Cindy Fontanares'),
 NULL,
 '4101-REM-2025',
 'Water Loss / Demolition – Lebon Unit 4101',
 'Hot water supply line failure flooding entire unit. Extraction, demo, antimicrobial, equipment.',
 'in_progress',
 'high',
 '2025-10-02',
 24008.53,
 '3440 Lebon Dr Unit 4101'
);


------------------------------------------------------------------
-- 3. INVOICES (correct schema)
------------------------------------------------------------------

INSERT INTO invoices
(client_id, work_order_id, invoice_number, amount, status, due_date, description)
VALUES
(
 (SELECT id FROM clients WHERE name='Miguel Martinez / Edrick Cabello'),
 (SELECT id FROM work_orders WHERE work_order_number='2024-214-REM'),
 '2024-214',
 15285.00,
 'sent',
 '2024-09-09',
 'Water Remediation Invoice – Canyon Colony'
),

(
 (SELECT id FROM clients WHERE name='Cindy Fontanares'),
 (SELECT id FROM work_orders WHERE work_order_number='4101-REM-2025'),
 '2199',
 24008.53,
 'sent',
 '2025-10-21',
 'Water Loss / Demo Invoice – Lebon Unit 4101'
);


------------------------------------------------------------------
-- 4. INVOICE LINE ITEMS (correct schema: unit_price + total_price)
------------------------------------------------------------------

-- Canyon Colony – Invoice 2024-214
INSERT INTO invoice_line_items (invoice_id, item_name, description, quantity, unit_price, total_price)
VALUES
((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Floor Protection',
 'Cover all areas leading to work area',
 1, 475.00, 475.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Content Manipulation',
 'Move and store personal belongings',
 1, 585.00, 585.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Furniture Protection',
 'Cover furniture and electronics',
 1, 250.00, 250.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Drywall Removal',
 'Remove damaged drywall in laundry, LR, DR, pony wall, closet',
 1, 1900.00, 1900.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Antimicrobial Treatment',
 'Scrub and treat exposed framing with antimicrobial',
 1, 2100.00, 2100.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Equipment Setup',
 '3 dehus + 4 air movers for 84 hours',
 1, 3200.00, 3200.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Encapsulation',
 'Mildew-resistant coating',
 1, 1500.00, 1500.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Air Movers',
 'Set 2 air movers for 24 hours',
 1, 130.00, 130.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Air Scrubber',
 'Air scrubber for 48 hours',
 1, 380.00, 380.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Lab Samples',
 'Collect and submit 3 clearance samples',
 1, 525.00, 525.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Electronics Packing',
 'Remove, box, store electronics from home office',
 1, 725.00, 725.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Home Office Demo',
 'Remove carpet, padding, tack strips, baseboard',
 1, 680.00, 680.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Home Office Treatment',
 'Scrub and antimicrobial treatment',
 1, 500.00, 500.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Home Office Drying',
 '1 dehu + 1 air mover for 84 hours',
 1, 980.00, 980.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Home Office Air Scrubber',
 'Air scrubber for 48 hours',
 1, 380.00, 380.00),

((SELECT id FROM invoices WHERE invoice_number='2024-214'),
 'Debris Disposal',
 'Dispose of all demolition debris',
 1, 750.00, 750.00);


-- Invoice 2199 – Lebon Unit 4101
INSERT INTO invoice_line_items (invoice_id, item_name, description, quantity, unit_price, total_price)
VALUES
((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Emergency Service Call',
 '4 a.m. emergency response',
 1, 550.00, 550.00),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Content Manipulation',
 'Move and protect contents',
 6, 95.00, 570.00),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Water Extraction',
 '2” water extraction across 940 sq ft',
 940, 0.43, 404.20),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Baseboard Removal',
 'Tear out baseboard',
 320, 1.25, 400.00),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Drywall Demo',
 'Tear out drywall up to 2 ft',
 320, 5.15, 1648.00),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Insulation Removal',
 'Remove wet insulation',
 128, 1.40, 179.20),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Floating Floor Removal',
 'Tear out non-salvageable floating floor and bag for disposal',
 814, 1.50, 1221.00),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Underlayment Removal',
 'Remove and dispose underlayment',
 814, 0.25, 203.50),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Vinyl Flooring Removal',
 'Kitchen + baths + laundry',
 126, 3.50, 441.00),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Kitchen Demo',
 'Cabinets, counters, plumbing, appliances',
 1, 1425.40, 1425.40),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Bathroom Demo',
 'Vanities, counters, sinks, toilets, shower enclosures',
 1, 2161.00, 2161.00),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Debris Removal',
 'Dump truck & dump fees (2 loads)',
 2, 800.00, 1600.00),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Antimicrobial Treatment',
 'Scrub & treat framing with antimicrobial agent',
 320, 3.95, 1264.00),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Encapsulation',
 'Apply Aftershock fungicidal coating',
 320, 3.15, 1008.00),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'LGR Dehumidifiers',
 '6 units – 3 days',
 18, 150.00, 2700.00),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Air Movers',
 '6 units – 3 days',
 18, 75.00, 1350.00),

((SELECT id FROM invoices WHERE invoice_number='2199'),
 'Air Scrubbers',
 '3 units – 3 days',
 9, 175.00, 1575.00);

