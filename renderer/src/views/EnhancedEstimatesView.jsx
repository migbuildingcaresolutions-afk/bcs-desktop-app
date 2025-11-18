import React, { useState, useEffect } from 'react';
import { estimatesAPI, clientsAPI } from '../api-client';
import EstimateDetailsView from './EstimateDetailsView';

export default function EnhancedEstimatesView() {
  const [estimates, setEstimates] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEstimateId, setSelectedEstimateId] = useState(null);
  const [showNewEstimateModal, setShowNewEstimateModal] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    estimate_number: '',
    title: '',
    description: '',
    status: 'draft',
    tax_rate: 0,
    valid_until: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [estimatesData, clientsData] = await Promise.all([
        estimatesAPI.getAll(),
        clientsAPI.getAll()
      ]);
      setEstimates(estimatesData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEstimate = async (e) => {
    e.preventDefault();

    try {
      // Generate estimate number
      const estimateNumber = `EST-${Date.now()}`;

      const newEstimate = await estimatesAPI.create({
        ...formData,
        estimate_number: estimateNumber,
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0
      });

      setShowNewEstimateModal(false);
      setFormData({
        client_id: '',
        estimate_number: '',
        title: '',
        description: '',
        status: 'draft',
        tax_rate: 0,
        valid_until: ''
      });

      // Open the new estimate in detail view
      setSelectedEstimateId(newEstimate.id);
    } catch (error) {
      console.error('Error creating estimate:', error);
      alert('Failed to create estimate');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      converted: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      draft: '📝',
      sent: '📤',
      approved: '✅',
      rejected: '❌',
      converted: '🔄'
    };
    return icons[status] || '📄';
  };

  // If estimate is selected, show detail view
  if (selectedEstimateId) {
    return (
      <EstimateDetailsView
        estimateId={selectedEstimateId}
        onBack={() => {
          setSelectedEstimateId(null);
          loadData();
        }}
      />
    );
  }

  // Otherwise show list view
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Estimates</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage estimates and convert to invoices
            </p>
          </div>
          <button
            onClick={() => setShowNewEstimateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span> New Estimate
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin text-6xl mb-4">⏳</div>
              <p className="text-gray-600">Loading estimates...</p>
            </div>
          </div>
        ) : estimates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Estimates Yet</h2>
            <p className="text-gray-600 mb-6">Create your first estimate to get started.</p>
            <button
              onClick={() => setShowNewEstimateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Estimate
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estimates.map((estimate) => (
              <div
                key={estimate.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedEstimateId(estimate.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {estimate.title || `Estimate #${estimate.estimate_number}`}
                      </h3>
                      <p className="text-sm text-gray-600 font-mono mt-1">
                        {estimate.estimate_number}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(estimate.status)} flex items-center gap-1`}>
                      <span>{getStatusIcon(estimate.status)}</span>
                      <span className="capitalize">{estimate.status}</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    {estimate.description && (
                      <p className="text-gray-600 line-clamp-2">{estimate.description}</p>
                    )}

                    <div className="pt-3 mt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total:</span>
                        <span className="text-2xl font-bold text-blue-600 font-mono">
                          ${(estimate.total_amount || 0).toFixed(2)}
                        </span>
                      </div>
                      {estimate.line_items && estimate.line_items.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {estimate.line_items.length} line item{estimate.line_items.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 pt-2">
                      Created: {new Date(estimate.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Estimate Modal */}
      {showNewEstimateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-lg">
              <h2 className="text-xl font-bold text-white">Create New Estimate</h2>
            </div>

            <form onSubmit={handleCreateEstimate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client *
                </label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Water Damage Restoration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Brief description of the work..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, tax_rate: parseFloat(e.target.value) || 0 }))}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowNewEstimateModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Create Estimate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
