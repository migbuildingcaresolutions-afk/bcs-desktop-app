import { useEffect, useState } from 'react';
import {
  dashboardAPI,
  invoicesAPI,
  workOrdersAPI,
  clientsAPI,
  emailAPI
} from '../api-client';
import { useAPI } from '../hooks/useAPI';
import InteractiveDataTable from '../components/InteractiveDataTable';
import StatsCard from '../components/StatsCard';
import '../styles/ModernDashboard.css';

/**
 * Modern Dashboard View - Building Care Solutions
 * Features:
 * - Interactive tables with sorting, filtering, search
 * - PDF export for any table
 * - Print functionality
 * - Email capabilities
 * - Clickable rows with actions
 * - Real-time stats
 */
export default function ModernDashboardView({ onNavigate }) {
  const { data: stats, loading, error, execute: fetchStats } = useAPI(
    dashboardAPI.getStats,
    true
  );

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentWorkOrders, setRecentWorkOrders] = useState([]);
  const [pastDueInvoices, setPastDueInvoices] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      // Load all dashboard data in parallel
      const [invoices, workOrders, pastDue] = await Promise.all([
        invoicesAPI.getAll(),
        workOrdersAPI.getAll(),
        dashboardAPI.getPastDueInvoices()
      ]);

      // Get recent invoices (last 10)
      setRecentInvoices(
        (invoices || [])
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10)
      );

      // Get active work orders
      setRecentWorkOrders(
        (workOrders || [])
          .filter(wo => wo.status === 'In Progress' || wo.status === 'Pending')
          .slice(0, 10)
      );

      setPastDueInvoices(pastDue || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Invoice table columns
  const invoiceColumns = [
    {
      key: 'invoice_number',
      label: 'Invoice #',
      sortable: true,
      searchable: true,
      render: (value, row) => (
        <span className="invoice-number-link" onClick={() => handleViewInvoice(row.id)}>
          {value}
        </span>
      )
    },
    {
      key: 'client_name',
      label: 'Client',
      sortable: true,
      searchable: true
    },
    {
      key: 'total_amount',
      label: 'Amount',
      sortable: true,
      render: (value) => formatCurrency(value)
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`status-badge status-${value.toLowerCase()}`}>
          {value}
        </span>
      )
    },
    {
      key: 'due_date',
      label: 'Due Date',
      sortable: true,
      render: (value) => formatDate(value)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="btn-icon"
            onClick={() => handleViewInvoice(row.id)}
            title="View"
          >
            👁️
          </button>
          <button
            className="btn-icon"
            onClick={() => handlePrintInvoice(row.id)}
            title="Print"
          >
            🖨️
          </button>
          <button
            className="btn-icon"
            onClick={() => handleEmailInvoice(row)}
            title="Email"
          >
            📧
          </button>
          <button
            className="btn-icon"
            onClick={() => handleDownloadPDF(row.id)}
            title="Download PDF"
          >
            📄
          </button>
        </div>
      )
    }
  ];

  // Work Order table columns
  const workOrderColumns = [
    {
      key: 'work_order_number',
      label: 'WO #',
      sortable: true,
      searchable: true,
      render: (value, row) => (
        <span className="wo-number-link" onClick={() => handleViewWorkOrder(row.id)}>
          {value}
        </span>
      )
    },
    {
      key: 'client_name',
      label: 'Client',
      sortable: true,
      searchable: true
    },
    {
      key: 'service_type',
      label: 'Service',
      sortable: true,
      filterable: true
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`status-badge status-${value.toLowerCase().replace(' ', '-')}`}>
          {value}
        </span>
      )
    },
    {
      key: 'scheduled_date',
      label: 'Scheduled',
      sortable: true,
      render: (value) => formatDate(value)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="btn-icon"
            onClick={() => handleViewWorkOrder(row.id)}
            title="View"
          >
            👁️
          </button>
          <button
            className="btn-icon"
            onClick={() => handlePrintWorkOrder(row.id)}
            title="Print"
          >
            🖨️
          </button>
          <button
            className="btn-icon"
            onClick={() => handleEmailWorkOrder(row)}
            title="Email"
          >
            📧
          </button>
        </div>
      )
    }
  ];

  // Past Due Invoices columns
  const pastDueColumns = [
    {
      key: 'invoice_number',
      label: 'Invoice #',
      sortable: true,
      render: (value, row) => (
        <span className="invoice-number-link urgent" onClick={() => handleViewInvoice(row.id)}>
          {value}
        </span>
      )
    },
    {
      key: 'client_name',
      label: 'Client',
      sortable: true,
      searchable: true
    },
    {
      key: 'total_amount',
      label: 'Amount Due',
      sortable: true,
      render: (value) => (
        <span className="amount-due">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'due_date',
      label: 'Due Date',
      sortable: true,
      render: (value) => (
        <span className="overdue-date">{formatDate(value)}</span>
      )
    },
    {
      key: 'days_overdue',
      label: 'Days Overdue',
      sortable: true,
      render: (value) => (
        <span className="days-overdue">{value} days</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="btn-warning"
            onClick={() => handleSendReminder(row)}
            title="Send Reminder"
          >
            📬 Send Reminder
          </button>
          <button
            className="btn-icon"
            onClick={() => handleEmailInvoice(row)}
            title="Email Invoice"
          >
            📧
          </button>
        </div>
      )
    }
  ];

  // Action handlers
  const handleViewInvoice = (id) => {
    if (onNavigate) {
      onNavigate('invoices', { selectedId: id });
    }
  };

  const handleViewWorkOrder = (id) => {
    if (onNavigate) {
      onNavigate('work-orders', { selectedId: id });
    }
  };

  const handlePrintInvoice = async (id) => {
    try {
      const invoice = await invoicesAPI.getById(id);
      // Open print dialog
      window.print();
    } catch (err) {
      console.error('Error printing invoice:', err);
      alert('Failed to print invoice');
    }
  };

  const handlePrintWorkOrder = async (id) => {
    try {
      const workOrder = await workOrdersAPI.getById(id);
      window.print();
    } catch (err) {
      console.error('Error printing work order:', err);
      alert('Failed to print work order');
    }
  };

  const handleEmailInvoice = async (invoice) => {
    try {
      await emailAPI.sendInvoiceEmail({
        invoice_id: invoice.id,
        client_email: invoice.client_email || invoice.email,
        subject: `Invoice ${invoice.invoice_number} from Building Care Solutions`,
        message: `Dear ${invoice.client_name},\n\nPlease find attached your invoice.\n\nThank you for your business!`
      });
      alert(`Invoice emailed to ${invoice.client_email || invoice.email}`);
    } catch (err) {
      console.error('Error emailing invoice:', err);
      alert('Failed to send email');
    }
  };

  const handleEmailWorkOrder = async (workOrder) => {
    try {
      await emailAPI.sendEmail({
        to: workOrder.client_email,
        subject: `Work Order ${workOrder.work_order_number} - Building Care Solutions`,
        body: `Dear ${workOrder.client_name},\n\nYour work order has been scheduled.\n\nService: ${workOrder.service_type}\nScheduled Date: ${formatDate(workOrder.scheduled_date)}\n\nThank you!`
      });
      alert(`Work order details emailed to ${workOrder.client_email}`);
    } catch (err) {
      console.error('Error emailing work order:', err);
      alert('Failed to send email');
    }
  };

  const handleSendReminder = async (invoice) => {
    try {
      await emailAPI.sendPastDueReminder({
        invoice_id: invoice.id,
        client_email: invoice.client_email,
        days_overdue: invoice.days_overdue
      });
      alert(`Payment reminder sent to ${invoice.client_name}`);
    } catch (err) {
      console.error('Error sending reminder:', err);
      alert('Failed to send reminder');
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      // Trigger PDF download
      window.open(`/api/invoices/${id}/pdf`, '_blank');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading || loadingData) {
    return (
      <div className="modern-dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Building Care Solutions Dashboard</h1>
        <button className="btn-refresh" onClick={loadDashboardData}>
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats?.total_revenue || 0)}
          icon="💰"
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Active Jobs"
          value={stats?.active_jobs || 0}
          icon="🔨"
          trend="+5"
          trendUp={true}
        />
        <StatsCard
          title="Pending Invoices"
          value={stats?.pending_invoices || 0}
          icon="📄"
        />
        <StatsCard
          title="Past Due"
          value={formatCurrency(stats?.past_due_amount || 0)}
          icon="⚠️"
          className="alert"
        />
      </div>

      {/* Past Due Invoices - Priority Alert */}
      {pastDueInvoices.length > 0 && (
        <div className="dashboard-section alert-section">
          <div className="section-header">
            <h2>⚠️ Past Due Invoices ({pastDueInvoices.length})</h2>
          </div>
          <InteractiveDataTable
            data={pastDueInvoices}
            columns={pastDueColumns}
            enableSearch={true}
            enableExport={true}
            enablePrint={true}
            exportFilename="past-due-invoices"
            emptyMessage="No past due invoices"
          />
        </div>
      )}

      {/* Recent Invoices */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>📄 Recent Invoices</h2>
          <button className="btn-secondary" onClick={() => onNavigate('invoices')}>
            View All →
          </button>
        </div>
        <InteractiveDataTable
          data={recentInvoices}
          columns={invoiceColumns}
          enableSearch={true}
          enableFilter={true}
          enableExport={true}
          enablePrint={true}
          exportFilename="recent-invoices"
          emptyMessage="No recent invoices"
          rowsPerPage={10}
        />
      </div>

      {/* Active Work Orders */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>🔨 Active Work Orders</h2>
          <button className="btn-secondary" onClick={() => onNavigate('work-orders')}>
            View All →
          </button>
        </div>
        <InteractiveDataTable
          data={recentWorkOrders}
          columns={workOrderColumns}
          enableSearch={true}
          enableFilter={true}
          enableExport={true}
          enablePrint={true}
          exportFilename="active-work-orders"
          emptyMessage="No active work orders"
          rowsPerPage={10}
        />
      </div>
    </div>
  );
}
