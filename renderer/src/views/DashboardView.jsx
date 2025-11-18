import { useEffect, useState } from 'react';
import { dashboardAPI } from '../api-client';
import { useAPI } from '../hooks/useAPI';
import '../styles/DashboardView.css';

/**
 * Dashboard View Component - Building Care Solutions
 * Invoice Ninja-style layout
 * Miguel - m19u3l@sd-bcs.com
 */
export default function DashboardView() {
  const { data: stats, loading, error, execute: fetchStats } = useAPI(
    dashboardAPI.getStats,
    true
  );

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchStats();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading Building Care Solutions dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <h2>⚠️ Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const dashboardData = stats || {};

  return (
    <div className="dashboard-container">
      {/* Recent Transactions Card */}
      <div className="transactions-card">
        <div className="transactions-header">
          <h2>Recent Transactions</h2>
        </div>

        <div className="transaction-row">
          <span className="transaction-label">Invoices</span>
          <span className="transaction-value blue">$ {(dashboardData.totalRevenue || 0).toFixed(2)}</span>
        </div>

        <div className="transaction-row">
          <span className="transaction-label">Payments</span>
          <span className="transaction-value green">$ {(dashboardData.totalRevenue || 0).toFixed(2)}</span>
        </div>

        <div className="transaction-row">
          <span className="transaction-label">Expenses</span>
          <span className="transaction-value gray">$ 0.00</span>
        </div>

        <div className="transaction-row">
          <span className="transaction-label">Outstanding</span>
          <span className="transaction-value red">$ {(dashboardData.outstandingInvoiceAmount || 0).toFixed(2)}</span>
        </div>

        <div className="transaction-row total">
          <span className="transaction-label">Total Invoices Outstanding</span>
          <span className="transaction-value black">{dashboardData.outstandingInvoiceCount || 0}</span>
        </div>
      </div>

      {/* Overview Chart */}
      <div className="overview-card">
        <h2>Overview</h2>
        <div className="chart-container">
          <div className="chart-placeholder">
            <svg viewBox="0 0 800 300" className="overview-chart">
              <line x1="50" y1="250" x2="750" y2="250" stroke="#e5e7eb" strokeWidth="2"/>
              <line x1="50" y1="200" x2="750" y2="200" stroke="#e5e7eb" strokeWidth="1"/>
              <line x1="50" y1="150" x2="750" y2="150" stroke="#e5e7eb" strokeWidth="1"/>
              <line x1="50" y1="100" x2="750" y2="100" stroke="#e5e7eb" strokeWidth="1"/>
              <line x1="50" y1="50" x2="750" y2="50" stroke="#e5e7eb" strokeWidth="1"/>

              <text x="20" y="255" fontSize="12" fill="#64748b">$ 0.00</text>
              <text x="20" y="205" fontSize="12" fill="#64748b">$ 1.00</text>
              <text x="20" y="155" fontSize="12" fill="#64748b">$ 2.00</text>
              <text x="20" y="105" fontSize="12" fill="#64748b">$ 3.00</text>
              <text x="20" y="55" fontSize="12" fill="#64748b">$ 4.00</text>
              <text x="20" y="30" fontSize="12" fill="#64748b">$ 5.00</text>

              <text x="50" y="270" fontSize="12" fill="#64748b">01/01/2025</text>
              <text x="650" y="270" fontSize="12" fill="#64748b">28/04/2025</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="data-card">
        <div className="card-header">
          <h3>📋 Recent Activity</h3>
        </div>
        <div className="card-content">
          {dashboardData.recentWorkOrders && dashboardData.recentWorkOrders.length > 0 ? (
            <div className="data-table">
              {dashboardData.recentWorkOrders.slice(0, 5).map((order, index) => (
                <div key={index} className="data-row">
                  <span>{order.title || order.description || 'Work Order'}</span>
                  <span className="data-meta">{order.client_name || 'Unknown Client'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-message">No records found</div>
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="data-card">
        <div className="card-header green">
          <h3>💰 Recent Payments</h3>
        </div>
        <div className="card-content">
          <div className="data-table-header">
            <span>Number</span>
            <span>Client</span>
            <span>Invoice</span>
            <span>Date</span>
            <span>Amount</span>
          </div>
          <div className="empty-message">No records found</div>
        </div>
      </div>

      {/* Upcoming Invoices */}
      <div className="data-card">
        <div className="card-header blue">
          <h3>📄 Upcoming Invoices</h3>
        </div>
        <div className="card-content">
          <div className="data-table-header">
            <span>Number</span>
            <span>Client</span>
            <span>Due Date</span>
            <span>Balance</span>
          </div>
          <div className="empty-message">No records found</div>
        </div>
      </div>

      {/* Past Due Invoices */}
      <div className="data-card">
        <div className="card-header orange">
          <h3>⚠️ Past Due Invoices</h3>
        </div>
        <div className="card-content">
          <div className="data-table-header">
            <span>Number</span>
            <span>Client</span>
            <span>Due Date</span>
            <span>Balance</span>
          </div>
          <div className="empty-message">No records found</div>
        </div>
      </div>

      {/* Expired Quotes */}
      <div className="data-card">
        <div className="card-header orange">
          <h3>📋 Expired Quotes</h3>
        </div>
        <div className="card-content">
          <div className="data-table-header">
            <span>Number</span>
            <span>Client</span>
            <span>Date</span>
            <span>Amount</span>
          </div>
          <div className="empty-message">No records found</div>
        </div>
      </div>

      {/* Upcoming Quotes */}
      <div className="data-card">
        <div className="card-header blue">
          <h3>📝 Upcoming Quotes</h3>
        </div>
        <div className="card-content">
          <div className="data-table-header">
            <span>Number</span>
            <span>Client</span>
            <span>Date</span>
            <span>Amount</span>
          </div>
          <div className="empty-message">No records found</div>
        </div>
      </div>

      {/* Upcoming Recurring Invoices */}
      <div className="data-card">
        <div className="card-header blue">
          <h3>🔄 Upcoming Recurring Invoices</h3>
        </div>
        <div className="card-content">
          <div className="data-table-header">
            <span>Number</span>
            <span>Client</span>
            <span>Next Send Date</span>
            <span>Amount</span>
          </div>
          <div className="empty-message">No records found</div>
        </div>
      </div>
    </div>
  );
}
