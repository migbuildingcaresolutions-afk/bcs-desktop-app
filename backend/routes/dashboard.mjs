import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const stats = {
      totalClients: await db.get('SELECT COUNT(*) as count FROM clients'),
      totalWorkOrders: await db.get('SELECT COUNT(*) as count FROM work_orders'),
      totalInvoices: await db.get('SELECT COUNT(*) as count FROM invoices'),
      totalRevenue: await db.get('SELECT SUM(amount) as total FROM invoices WHERE status = "paid"'),
    };
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    next(error);
  }
});

// Dashboard stats endpoint (more detailed)
router.get('/stats', async (req, res, next) => {
  try {
    // Get counts
    const clientsCount = await db.get('SELECT COUNT(*) as count FROM clients');
    const workOrdersCount = await db.get('SELECT COUNT(*) as count FROM work_orders');
    const invoicesCount = await db.get('SELECT COUNT(*) as count FROM invoices');
    const employeesCount = await db.get('SELECT COUNT(*) as count FROM employees');
    const equipmentCount = await db.get('SELECT COUNT(*) as count FROM equipment');
    const materialsCount = await db.get('SELECT COUNT(*) as count FROM materials');

    // Get revenue stats
    const paidInvoices = await db.get('SELECT SUM(amount) as total, COUNT(*) as count FROM invoices WHERE status = "paid"');
    const pendingInvoices = await db.get('SELECT SUM(amount) as total, COUNT(*) as count FROM invoices WHERE status = "pending"');
    const overdueInvoices = await db.get(`
      SELECT SUM(amount) as total, COUNT(*) as count
      FROM invoices
      WHERE status != "paid" AND date(due_date) < date('now')
    `);

    // Get recent work orders
    const recentWorkOrders = await db.all(`
      SELECT wo.*, c.name as client_name
      FROM work_orders wo
      LEFT JOIN clients c ON wo.client_id = c.id
      ORDER BY wo.created_at DESC
      LIMIT 5
    `);

    // Get work order status breakdown
    const completedOrders = await db.get('SELECT COUNT(*) as count FROM work_orders WHERE status = "completed"');
    const totalOrders = await db.get('SELECT COUNT(*) as count FROM work_orders');
    const completionRate = totalOrders.count > 0 ? (completedOrders.count / totalOrders.count) * 100 : 0;

    const stats = {
      totalClients: clientsCount.count || 0,
      totalWorkOrders: workOrdersCount.count || 0,
      totalInvoices: invoicesCount.count || 0,
      totalEmployees: employeesCount.count || 0,
      totalEquipment: equipmentCount.count || 0,
      totalMaterials: materialsCount.count || 0,
      totalRevenue: paidInvoices.total || 0,
      pendingRevenue: pendingInvoices.total || 0,
      paidInvoicesCount: paidInvoices.count || 0,
      pendingInvoicesCount: pendingInvoices.count || 0,
      outstandingInvoiceAmount: overdueInvoices.total || 0,
      outstandingInvoiceCount: overdueInvoices.count || 0,
      recentWorkOrders: recentWorkOrders || [],
      completionRate: Math.round(completionRate),
      averageJobDuration: 3.5, // Placeholder - would need actual calculation
      clientSatisfaction: 4.8, // Placeholder - would need actual calculation
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    next(error);
  }
});

// Recent Transactions - Last 10 transactions across invoices and payments
router.get('/recent-transactions', async (req, res, next) => {
  try {
    const transactions = await db.all(`
      SELECT
        i.id,
        i.invoice_number,
        i.amount,
        i.status,
        i.due_date,
        i.created_at,
        c.name as client_name,
        wo.work_order_number,
        'invoice' as transaction_type
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      LEFT JOIN work_orders wo ON i.work_order_id = wo.id
      ORDER BY i.created_at DESC
      LIMIT 10
    `);

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    next(error);
  }
});

// Recent Activity - Recent work orders with details
router.get('/recent-activity', async (req, res, next) => {
  try {
    const activities = await db.all(`
      SELECT
        wo.*,
        c.name as client_name,
        c.company as client_company,
        e.name as employee_name
      FROM work_orders wo
      LEFT JOIN clients c ON wo.client_id = c.id
      LEFT JOIN employees e ON wo.employee_id = e.id
      ORDER BY wo.created_at DESC
      LIMIT 10
    `);

    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    next(error);
  }
});

// Revenue Overview - Monthly revenue for the last 12 months
router.get('/revenue-overview', async (req, res, next) => {
  try {
    const revenueData = await db.all(`
      SELECT
        strftime('%Y-%m', created_at) as month,
        SUM(amount) as revenue,
        COUNT(*) as invoice_count
      FROM invoices
      WHERE status = 'paid'
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
      LIMIT 12
    `);

    res.json(revenueData.reverse());
  } catch (error) {
    console.error('Error fetching revenue overview:', error);
    next(error);
  }
});

// Upcoming Invoices - Invoices due in the next 30 days
router.get('/upcoming-invoices', async (req, res, next) => {
  try {
    const upcomingInvoices = await db.all(`
      SELECT
        i.*,
        c.name as client_name,
        c.company as client_company,
        wo.work_order_number,
        wo.title as work_order_title
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      LEFT JOIN work_orders wo ON i.work_order_id = wo.id
      WHERE i.status != 'paid'
        AND date(i.due_date) >= date('now')
        AND date(i.due_date) <= date('now', '+30 days')
      ORDER BY i.due_date ASC
    `);

    res.json(upcomingInvoices);
  } catch (error) {
    console.error('Error fetching upcoming invoices:', error);
    next(error);
  }
});

// Recent Payments - Last 10 paid invoices
router.get('/recent-payments', async (req, res, next) => {
  try {
    const recentPayments = await db.all(`
      SELECT
        i.*,
        c.name as client_name,
        c.company as client_company,
        wo.work_order_number,
        wo.title as work_order_title
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      LEFT JOIN work_orders wo ON i.work_order_id = wo.id
      WHERE i.status = 'paid'
      ORDER BY i.updated_at DESC
      LIMIT 10
    `);

    res.json(recentPayments);
  } catch (error) {
    console.error('Error fetching recent payments:', error);
    next(error);
  }
});

// Past Due Invoices - Overdue invoices
router.get('/past-due-invoices', async (req, res, next) => {
  try {
    const pastDueInvoices = await db.all(`
      SELECT
        i.*,
        c.name as client_name,
        c.company as client_company,
        c.phone as client_phone,
        c.email as client_email,
        wo.work_order_number,
        wo.title as work_order_title,
        CAST(julianday('now') - julianday(i.due_date) AS INTEGER) as days_overdue
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      LEFT JOIN work_orders wo ON i.work_order_id = wo.id
      WHERE i.status != 'paid'
        AND date(i.due_date) < date('now')
      ORDER BY i.due_date ASC
    `);

    res.json(pastDueInvoices);
  } catch (error) {
    console.error('Error fetching past due invoices:', error);
    next(error);
  }
});

export default router;
