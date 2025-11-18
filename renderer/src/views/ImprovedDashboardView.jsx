import { useEffect, useState } from 'react';
import { dashboardAPI, notesAPI, emailAPI, mediaAPI } from '../api-client';
import { useAPI } from '../hooks/useAPI';
import MediaUploader from '../components/MediaUploader';
import '../styles/DashboardView.css';

/**
 * Improved Dashboard View - Building Care Solutions
 * Professional 2-column card layout with real data and navigation
 * Miguel - m19u3l@sd-bcs.com
 */
export default function ImprovedDashboardView({ onNavigate }) {
  const { data: stats, loading, error, execute: fetchStats } = useAPI(
    dashboardAPI.getStats,
    true
  );

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [revenueOverview, setRevenueOverview] = useState([]);
  const [upcomingInvoices, setUpcomingInvoices] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [pastDueInvoices, setPastDueInvoices] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  const [emails, setEmails] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoadingData(true);
      const [transactions, activity, revenue, upcoming, payments, pastDue, notesList] = await Promise.all([
        dashboardAPI.getRecentTransactions(),
        dashboardAPI.getRecentActivity(),
        dashboardAPI.getRevenueOverview(),
        dashboardAPI.getUpcomingInvoices(),
        dashboardAPI.getRecentPayments(),
        dashboardAPI.getPastDueInvoices(),
        notesAPI.getAll(),
      ]);

      setRecentTransactions(transactions);
      setRecentActivity(activity);
      setRevenueOverview(revenue);
      setUpcomingInvoices(upcoming);
      setRecentPayments(payments);
      setPastDueInvoices(pastDue);
      setNotes(notesList);

      // Load emails separately (non-blocking)
      loadEmails();
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const loadEmails = async () => {
    try {
      setLoadingEmails(true);
      const inbox = await emailAPI.getInbox(5);
      setEmails(inbox);
    } catch (err) {
      console.error('Error loading emails:', err);
      setEmails([]); // Set empty on error
    } finally {
      setLoadingEmails(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    try {
      const newNote = await notesAPI.create({
        title: newNoteTitle,
        content: newNoteContent,
        category: 'general',
        priority: 'normal'
      });

      setNotes([newNote, ...notes]);
      setNewNoteTitle('');
      setNewNoteContent('');
      setShowNoteForm(false);
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await notesAPI.delete(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchStats();
      await loadDashboardData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleMediaUpload = async (files) => {
    try {
      const result = await mediaAPI.upload(files);
      console.log('Files uploaded successfully:', result);
      // Optionally show a success message to the user
      alert(`Successfully uploaded ${result.files.length} file(s)`);
    } catch (err) {
      console.error('Error uploading files:', err);
      alert('Failed to upload files. Please try again.');
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* BIG Building Care Solutions Branding Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-10 mb-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            BUILDING CARE SOLUTIONS
          </h1>
          <p className="text-2xl text-blue-100 font-semibold mb-2">
            We Take the Stress Out of Restoration
          </p>
          <div className="flex justify-center items-center space-x-8 mt-6 text-white">
            <div className="flex items-center space-x-2">
              <span className="text-xl">📍</span>
              <span className="text-sm font-medium">8889 Caminito Plaza Centro, San Diego, CA 92122</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">📞</span>
              <span className="text-sm font-medium">858-573-7849</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">✉️</span>
              <span className="text-sm font-medium">m19u3l@sd-bcs.com</span>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Dashboard'}
          </button>
        </div>
      </div>

      {/* 2-Column Card Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Recent Transactions Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Transactions</h2>

            <div className="space-y-3">
              <div
                className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => onNavigate && onNavigate('invoices')}
              >
                <span className="font-medium text-gray-700">Total Invoices</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(dashboardData.totalRevenue)}
                </span>
              </div>

              <div
                className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-l-4 border-green-500 cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => onNavigate && onNavigate('invoices')}
              >
                <span className="font-medium text-gray-700">Paid ({dashboardData.paidInvoicesCount || 0})</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(dashboardData.totalRevenue)}
                </span>
              </div>

              <div
                className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 cursor-pointer hover:bg-yellow-100 transition-colors"
                onClick={() => onNavigate && onNavigate('invoices')}
              >
                <span className="font-medium text-gray-700">Pending ({dashboardData.pendingInvoicesCount || 0})</span>
                <span className="text-xl font-bold text-yellow-600">
                  {formatCurrency(dashboardData.pendingRevenue)}
                </span>
              </div>

              <div
                className="flex justify-between items-center p-4 bg-red-50 rounded-lg border-l-4 border-red-500 cursor-pointer hover:bg-red-100 transition-colors"
                onClick={() => onNavigate && onNavigate('invoices')}
              >
                <span className="font-medium text-gray-700">Past Due ({dashboardData.outstandingInvoiceCount || 0})</span>
                <span className="text-xl font-bold text-red-600">
                  {formatCurrency(dashboardData.outstandingInvoiceAmount)}
                </span>
              </div>

              {recentTransactions.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase">Latest Transactions</h3>
                  {recentTransactions.slice(0, 3).map((txn) => (
                    <div
                      key={txn.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => onNavigate && onNavigate('invoices')}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">{txn.invoice_number}</p>
                          <p className="text-xs text-gray-600">{txn.client_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(txn.amount)}</p>
                          <p className={`text-xs font-medium ${
                            txn.status === 'paid' ? 'text-green-600' :
                            txn.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {txn.status.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3
              className="text-xl font-bold text-gray-800 mb-4 flex items-center cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onNavigate && onNavigate('workorders')}
            >
              <span className="text-2xl mr-2">📋</span>
              Recent Activity
              <span className="ml-auto text-sm text-gray-500 hover:text-blue-600">View All →</span>
            </h3>
            {loadingData ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-2">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => onNavigate && onNavigate('workorders')}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{activity.title || activity.description || 'Work Order'}</p>
                        <p className="text-sm text-gray-600">{activity.client_name || 'Unknown Client'}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.work_order_number} • {activity.status}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                        activity.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity</p>
              </div>
            )}
          </div>

          {/* Upcoming Invoices Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3
              className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onNavigate && onNavigate('invoices')}
            >
              <span className="flex items-center">
                <span className="text-2xl mr-2">📄</span>
                Upcoming Invoices
              </span>
              <span className="text-sm font-normal text-gray-500 hover:text-blue-600">Next 30 days →</span>
            </h3>
            {loadingData ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : upcomingInvoices.length > 0 ? (
              <div className="space-y-3">
                {upcomingInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onNavigate && onNavigate('invoices')}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{invoice.invoice_number}</p>
                        <p className="text-sm text-gray-600">{invoice.client_name}</p>
                        <p className="text-xs text-gray-500 mt-1">Due: {formatDate(invoice.due_date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(invoice.amount)}</p>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-medium">
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No upcoming invoices</p>
              </div>
            )}
          </div>

          {/* Email Inbox Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="text-2xl mr-2">📧</span>
                Inbox
              </h3>
              <button
                onClick={loadEmails}
                disabled={loadingEmails}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold disabled:opacity-50"
              >
                {loadingEmails ? '⟳' : '🔄'}
              </button>
            </div>

            {loadingEmails ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-500 mt-2">Connecting to m19u3l@sd-bcs.com...</p>
              </div>
            ) : emails.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 border-l-4 border-blue-400 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-800 text-sm truncate flex-1">
                        {email.subject || '(No Subject)'}
                      </p>
                      <span className="text-xs text-gray-500 ml-2">
                        {email.date ? new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{email.from}</p>
                    {email.text && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{email.text.substring(0, 60)}...</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>📭 No emails found</p>
                <p className="text-xs mt-2">Click refresh to check for new mail</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Notes Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="text-2xl mr-2">📝</span>
                Quick Notes
              </h3>
              <button
                onClick={() => setShowNoteForm(!showNoteForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                {showNoteForm ? '✕ Cancel' : '+ Add Note'}
              </button>
            </div>

            {showNoteForm && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <input
                  type="text"
                  placeholder="Note Title..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Note content..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Note
                </button>
              </div>
            )}

            {loadingData ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : notes.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notes.slice(0, 10).map((note) => (
                  <div
                    key={note.id}
                    className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{note.title}</h4>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-semibold"
                        title="Delete note"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(note.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>📝 No notes yet. Click "Add Note" to create one!</p>
              </div>
            )}
          </div>

          {/* Media Upload Card */}
          <MediaUploader onUpload={handleMediaUpload} />

          {/* Revenue Overview Chart Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2
              className="text-2xl font-bold text-gray-800 mb-4 cursor-pointer hover:text-blue-600 transition-colors flex items-center justify-between"
              onClick={() => onNavigate && onNavigate('invoices')}
            >
              <span>Revenue Overview</span>
              <span className="text-sm font-normal text-gray-500 hover:text-blue-600">View Details →</span>
            </h2>
            {loadingData ? (
              <div className="h-64 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : revenueOverview.length > 0 ? (
              <div className="h-64">
                <div className="h-full flex items-end justify-around bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
                  {revenueOverview.map((data, index) => {
                    const maxRevenue = Math.max(...revenueOverview.map(d => d.revenue));
                    const height = (data.revenue / maxRevenue) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1 mx-1">
                        <div className="text-xs font-semibold text-gray-700 mb-1">
                          {formatCurrency(data.revenue)}
                        </div>
                        <div
                          className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                          style={{ height: `${height}%`, minHeight: '20px' }}
                          title={`${data.month}: ${formatCurrency(data.revenue)}`}
                        ></div>
                        <div className="text-xs text-gray-600 mt-2">
                          {new Date(data.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                <p className="text-gray-500">No revenue data available</p>
              </div>
            )}
          </div>

          {/* Recent Payments Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3
              className="text-xl font-bold text-gray-800 mb-4 flex items-center cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onNavigate && onNavigate('invoices')}
            >
              <span className="text-2xl mr-2">💰</span>
              Recent Payments
              <span className="ml-auto text-sm text-gray-500 hover:text-blue-600">View All →</span>
            </h3>
            {loadingData ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : recentPayments.length > 0 ? (
              <div className="space-y-3">
                {recentPayments.slice(0, 5).map((payment) => (
                  <div
                    key={payment.id}
                    className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500 hover:bg-green-100 transition-colors cursor-pointer"
                    onClick={() => onNavigate && onNavigate('invoices')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{payment.invoice_number}</p>
                        <p className="text-sm text-gray-600">{payment.client_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-700">{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-gray-500">{formatDate(payment.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent payments</p>
              </div>
            )}
          </div>

          {/* Past Due Invoices Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3
              className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between cursor-pointer hover:text-red-600 transition-colors"
              onClick={() => onNavigate && onNavigate('invoices')}
            >
              <span className="flex items-center">
                <span className="text-2xl mr-2">⚠️</span>
                Past Due Invoices
                <span className="ml-3 text-sm text-gray-500 hover:text-red-600">View All →</span>
              </span>
              {pastDueInvoices.length > 0 && (
                <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                  {pastDueInvoices.length}
                </span>
              )}
            </h3>
            {loadingData ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : pastDueInvoices.length > 0 ? (
              <div className="space-y-3">
                {pastDueInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                    onClick={() => onNavigate && onNavigate('invoices')}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{invoice.invoice_number}</p>
                        <p className="text-sm text-gray-700">{invoice.client_name}</p>
                        <p className="text-xs text-red-600 font-medium mt-1">
                          {invoice.days_overdue} days overdue
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-700">{formatCurrency(invoice.amount)}</p>
                        <p className="text-xs text-gray-600 mt-1">{formatDate(invoice.due_date)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>✅ No past due invoices</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
