# API Endpoints Reference

Base URL: `http://localhost:3000/api`

## 📋 Standard CRUD Endpoints

All resources follow this pattern:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/resource` | Get all items |
| GET | `/resource/:id` | Get single item by ID |
| POST | `/resource` | Create new item |
| PUT | `/resource/:id` | Update item by ID |
| DELETE | `/resource/:id` | Delete item by ID |

## 🔗 Available Resources

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Work Orders
- `GET /api/work-orders` - Get all work orders
- `GET /api/work-orders/:id` - Get work order by ID
- `POST /api/work-orders` - Create new work order
- `PUT /api/work-orders/:id` - Update work order
- `DELETE /api/work-orders/:id` - Delete work order

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Materials
- `GET /api/materials` - Get all materials
- `GET /api/materials/:id` - Get material by ID
- `POST /api/materials` - Create new material
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material

### Vendors
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get vendor by ID
- `POST /api/vendors` - Create new vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

### Estimates
- `GET /api/estimates` - Get all estimates
- `GET /api/estimates/:id` - Get estimate by ID
- `POST /api/estimates` - Create new estimate
- `PUT /api/estimates/:id` - Update estimate
- `DELETE /api/estimates/:id` - Delete estimate

### Change Orders
- `GET /api/change-orders` - Get all change orders
- `GET /api/change-orders/:id` - Get change order by ID
- `POST /api/change-orders` - Create new change order
- `PUT /api/change-orders/:id` - Update change order
- `DELETE /api/change-orders/:id` - Delete change order

### Dry Out Jobs
- `GET /api/dry-out-jobs` - Get all dry out jobs
- `GET /api/dry-out-jobs/:id` - Get dry out job by ID
- `POST /api/dry-out-jobs` - Create new dry out job
- `PUT /api/dry-out-jobs/:id` - Update dry out job
- `DELETE /api/dry-out-jobs/:id` - Delete dry out job

### Job Tracking
- `GET /api/job-tracking` - Get all job tracking entries
- `GET /api/job-tracking/:id` - Get job tracking by ID
- `POST /api/job-tracking` - Create new job tracking
- `PUT /api/job-tracking/:id` - Update job tracking
- `DELETE /api/job-tracking/:id` - Delete job tracking

### Price List
- `GET /api/price-list` - Get all price list items
- `GET /api/price-list/:id` - Get price list item by ID
- `POST /api/price-list` - Create new price list item
- `PUT /api/price-list/:id` - Update price list item
- `DELETE /api/price-list/:id` - Delete price list item

### Pricing
- `GET /api/pricing` - Get all pricing entries
- `GET /api/pricing/:id` - Get pricing by ID
- `POST /api/pricing` - Create new pricing
- `PUT /api/pricing/:id` - Update pricing
- `DELETE /api/pricing/:id` - Delete pricing

### Remediation Dryout
- `GET /api/remediation-dryout` - Get all remediation dryout entries
- `GET /api/remediation-dryout/:id` - Get remediation dryout by ID
- `POST /api/remediation-dryout` - Create new remediation dryout
- `PUT /api/remediation-dryout/:id` - Update remediation dryout
- `DELETE /api/remediation-dryout/:id` - Delete remediation dryout

### Remediation Reconstruction
- `GET /api/remediation-reconstruction` - Get all remediation reconstruction entries
- `GET /api/remediation-reconstruction/:id` - Get remediation reconstruction by ID
- `POST /api/remediation-reconstruction` - Create new remediation reconstruction
- `PUT /api/remediation-reconstruction/:id` - Update remediation reconstruction
- `DELETE /api/remediation-reconstruction/:id` - Delete remediation reconstruction

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports/:type` - Generate report of specific type

### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get resource by ID
- `POST /api/resources` - Create new resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Settings
- `GET /api/settings` - Get all settings
- `GET /api/settings/:key` - Get setting by key
- `PUT /api/settings/:key` - Update setting

### Xactimate
- `GET /api/xactimate` - Get all xactimate entries
- `POST /api/xactimate/import` - Import xactimate data
- `GET /api/xactimate/export/:id` - Export xactimate data

### Line Items
- `GET /api/line_items` - Get all line items
- `GET /api/line_items/:id` - Get line item by ID
- `POST /api/line_items` - Create new line item
- `PUT /api/line_items/:id` - Update line item
- `DELETE /api/line_items/:id` - Delete line item

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## 🏥 Health Check
- `GET /health` - Server health check (no /api prefix)

