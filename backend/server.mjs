import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Import route modules
import clientsRouter from './routes/clients.mjs';
import workOrdersRouter from './routes/work-orders.mjs';
import invoicesRouter from './routes/invoices.mjs';
import employeesRouter from './routes/employees.mjs';
import equipmentRouter from './routes/equipment.mjs';
import materialsRouter from './routes/materials.mjs';
import vendorsRouter from './routes/vendors.mjs';
import estimatesRouter from './routes/estimates.mjs';
import changeOrdersRouter from './routes/change-orders.mjs';
import dashboardRouter from './routes/dashboard.mjs';
import dryOutJobsRouter from './routes/dry-out-jobs.mjs';
import smsRouter from './routes/sms.mjs';
import jobTrackingRouter from './routes/job-tracking.mjs';
import lineItemsRouter from './routes/line_items.mjs';
import priceListRouter from './routes/price-list.mjs';
import priceListsRouter from './routes/price-lists.mjs';
import pricingRouter from './routes/pricing.mjs';
import remediationDryoutRouter from './routes/remediation-dryout.mjs';
import remediationReconstructionRouter from './routes/remediation-reconstruction.mjs';
import reportsRouter from './routes/reports.mjs';
import resourcesRouter from './routes/resources.mjs';
import servicesRouter from './routes/services.mjs';
import settingsRouter from './routes/settings.mjs';
import xactimateRouter from './routes/xactimate.mjs';
import quotesRouter from './routes/quotes.mjs';
import companySettingsRouter from './routes/company-settings.mjs';
import notesRouter from './routes/notes.mjs';
import emailRouter from './routes/email.mjs';
import messagingRouter from './routes/messaging.mjs';
import paymentsRouter from './routes/payments.mjs';
import authRouter from './routes/auth.mjs';
import uploadsRouter from './routes/uploads.mjs';
import equipmentLogsRouter from './routes/equipment-logs.mjs';
import printRouter from './routes/print.mjs';
import storageRouter from './routes/storage.mjs';
import moistureLogsRouter from './routes/moisture-logs.mjs';
import storedItemsRouter from './routes/stored-items.mjs';
import certificatesRouter from './routes/certificates.mjs';
import calendarEventsRouter from './routes/calendar-events.mjs';
import expensesRouter from './routes/expenses.mjs';
import documentTemplatesRouter from './routes/document-templates.mjs';
import mediaRouter from './routes/media.mjs';
import categoriesRouter from './routes/categories.mjs';
import priceListMasterRouter from './routes/price-list-master.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'BCS Backend API is running' });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'BCS Desktop App API', version: '1.0.0' });
});

// Auth routes (public - no authentication required)
app.use('/api/auth', authRouter);

app.use('/api/clients', clientsRouter);
app.use('/api/work-orders', workOrdersRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/estimates', estimatesRouter);
app.use('/api/sms', smsRouter);
app.use('/api/change-orders', changeOrdersRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/dry-out-jobs', dryOutJobsRouter);
app.use('/api/job-tracking', jobTrackingRouter);
app.use('/api/line-items', lineItemsRouter);
app.use('/api/price-list', priceListRouter);
app.use('/api/price-lists', priceListsRouter);
app.use('/api/pricing', pricingRouter);
app.use('/api/remediation-dryout', remediationDryoutRouter);
app.use('/api/remediation-reconstruction', remediationReconstructionRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/services', servicesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/xactimate', xactimateRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/company-settings', companySettingsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/email', emailRouter);
app.use('/api/messaging', messagingRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/print', printRouter);
app.use('/api/storage', storageRouter);
app.use('/api/equipment-logs', equipmentLogsRouter);
app.use('/api/moisture-logs', moistureLogsRouter);
app.use('/api/stored-items', storedItemsRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/calendar-events', calendarEventsRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/document-templates', documentTemplatesRouter);
app.use('/api/media', mediaRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/price-list-master', priceListMasterRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
