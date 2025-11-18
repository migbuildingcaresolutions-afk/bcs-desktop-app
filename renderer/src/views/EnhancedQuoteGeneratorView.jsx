import React, { useState, useEffect } from 'react';
import { Plus, X, Save, Search, Calculator, DollarSign, FileText, Building2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Enhanced Xactimate-Style Quote Generator
 * Building Care Solutions - Miguel m19u3l@sd-bcs.com
 *
 * Features:
 * - Live line item builder with price list integration
 * - Automatic overhead (15%) and profit (20%) calculations
 * - Search and add from extensive price database
 * - Custom line items support
 * - Professional estimate formatting
 */
const EnhancedQuoteGeneratorView = () => {
  const [clients, setClients] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPriceListModal, setShowPriceListModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [estimateData, setEstimateData] = useState({
    client_id: '',
    title: '',
    description: '',
    status: 'draft',
    overheadRate: 15,
    profitRate: 20,
    taxRate: 0
  });

  const [totals, setTotals] = useState({
    subtotal: 0,
    overhead: 0,
    profit: 0,
    tax: 0,
    total: 0
  });

  useEffect(() => {
    loadClients();
    loadPriceList();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [lineItems, estimateData.overheadRate, estimateData.profitRate, estimateData.taxRate]);

  const loadClients = async () => {
    try {
      const response = await fetch(`${API_BASE}/clients`);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadPriceList = async () => {
    try {
      const response = await fetch(`${API_BASE}/price-list`);
      const data = await response.json();
      setPriceList(data);
    } catch (error) {
      console.error('Error loading price list:', error);
    }
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0));
    }, 0);

    const overhead = subtotal * (parseFloat(estimateData.overheadRate) / 100);
    const subtotalWithOverhead = subtotal + overhead;
    const profit = subtotalWithOverhead * (parseFloat(estimateData.profitRate) / 100);
    const subtotalWithOP = subtotalWithOverhead + profit;
    const tax = subtotalWithOP * (parseFloat(estimateData.taxRate) / 100);
    const total = subtotalWithOP + tax;

    setTotals({
      subtotal: subtotal.toFixed(2),
      overhead: overhead.toFixed(2),
      profit: profit.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    });
  };

  const addLineItem = (item) => {
    const newItem = {
      id: Date.now().toString(),
      xactimate_code: item?.xactimate_code || '',
      description: item?.item_name || '',
      quantity: 1,
      unit: item?.unit || 'EA',
      unit_price: item?.unit_price || 0,
      labor_hours: item?.labor_hours || 0,
      total: item?.unit_price || 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const addCustomLineItem = () => {
    const newItem = {
      id: Date.now().toString(),
      xactimate_code: '',
      description: '',
      quantity: 1,
      unit: 'SF',
      unit_price: 0,
      labor_hours: 0,
      total: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const addFromPriceList = (priceItem) => {
    addLineItem(priceItem);
    setShowPriceListModal(false);
    setSearchTerm('');
  };

  const updateLineItem = (id, field, value) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };

        // Recalculate total for this line
        if (field === 'quantity' || field === 'unit_price') {
          updated.total = (parseFloat(updated.quantity || 0) * parseFloat(updated.unit_price || 0)).toFixed(2);
        }

        return updated;
      }
      return item;
    }));
  };

  const removeLineItem = (id) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleEstimateDataChange = (e) => {
    const { name, value } = e.target;
    setEstimateData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEstimate = async () => {
    if (!estimateData.client_id) {
      alert('Please select a client');
      return;
    }
    if (!estimateData.title) {
      alert('Please enter an estimate title');
      return;
    }
    if (lineItems.length === 0) {
      alert('Please add at least one line item');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        client_id: estimateData.client_id,
        title: estimateData.title,
        description: estimateData.description,
        status: estimateData.status,
        subtotal: parseFloat(totals.subtotal),
        tax_rate: parseFloat(estimateData.taxRate),
        tax_amount: parseFloat(totals.tax),
        total_amount: parseFloat(totals.total),
        line_items: lineItems.map(item => ({
          item_name: item.description,
          description: item.xactimate_code ? `${item.xactimate_code} - ${item.description}` : item.description,
          quantity: parseFloat(item.quantity),
          unit_price: parseFloat(item.unit_price),
          total_price: parseFloat(item.total),
          category: item.xactimate_code ? 'Xactimate' : 'Custom'
        }))
      };

      const response = await fetch(`${API_BASE}/estimates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Estimate created successfully!\nEstimate #${result.estimate_number}\nTotal: $${totals.total}`);

        // Reset form
        setEstimateData({
          client_id: '',
          title: '',
          description: '',
          status: 'draft',
          overheadRate: 15,
          profitRate: 20,
          taxRate: 0
        });
        setLineItems([]);
      } else {
        const error = await response.json();
        alert('Error creating estimate: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving estimate:', error);
      alert('Error saving estimate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(priceList.map(p => p.category))].filter(Boolean);
  const filteredPriceList = priceList.filter(item => {
    const matchesSearch = !searchTerm ||
      item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.xactimate_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Branded Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 md:p-10 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              <Calculator className="inline mr-3 mb-1" size={36} />
              Xactimate Quote Generator
            </h1>
            <p className="text-green-100 text-lg font-medium leading-relaxed">
              Building Care Solutions - Professional Estimation System
            </p>
          </div>
        </div>
      </div>

      {/* Estimate Information Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FileText className="mr-2 text-green-600" size={24} />
          Estimate Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
            <select
              name="client_id"
              value={estimateData.client_id}
              onChange={handleEstimateDataChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company ? `(${client.company})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={estimateData.status}
              onChange={handleEstimateDataChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimate Title *</label>
            <input
              type="text"
              name="title"
              value={estimateData.title}
              onChange={handleEstimateDataChange}
              placeholder="e.g., Water Damage Restoration - Kitchen & Living Room"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={estimateData.description}
              onChange={handleEstimateDataChange}
              rows="2"
              placeholder="Additional project details..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Overhead %</label>
            <input
              type="number"
              name="overheadRate"
              value={estimateData.overheadRate}
              onChange={handleEstimateDataChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profit %</label>
            <input
              type="number"
              name="profitRate"
              value={estimateData.profitRate}
              onChange={handleEstimateDataChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Line Items Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <DollarSign className="mr-2 text-green-600" size={24} />
            Line Items ({lineItems.length})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPriceListModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search size={18} />
              <span>From Price List</span>
            </button>
            <button
              onClick={addCustomLineItem}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={18} />
              <span>Add Custom</span>
            </button>
          </div>
        </div>

        {lineItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calculator size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-2">No line items added yet</p>
            <p className="text-sm text-gray-500">Click "From Price List" to search the Xactimate database or "Add Custom" for manual entry</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lineItems.map((item, index) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Code</label>
                    <input
                      type="text"
                      value={item.xactimate_code}
                      onChange={(e) => updateLineItem(item.id, 'xactimate_code', e.target.value)}
                      placeholder="WTR-100"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="col-span-4 md:col-span-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Qty *</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                      step="0.01"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="col-span-4 md:col-span-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                    <select
                      value={item.unit}
                      onChange={(e) => updateLineItem(item.id, 'unit', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="SF">SF</option>
                      <option value="LF">LF</option>
                      <option value="EA">EA</option>
                      <option value="HR">HR</option>
                      <option value="DAY">DAY</option>
                      <option value="CY">CY</option>
                    </select>
                  </div>

                  <div className="col-span-5 md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price *</label>
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => updateLineItem(item.id, 'unit_price', e.target.value)}
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="col-span-5 md:col-span-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Total</label>
                    <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg">
                      ${parseFloat(item.total || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="col-span-2 md:col-span-1 flex items-end">
                    <button
                      onClick={() => removeLineItem(item.id)}
                      className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title="Remove item"
                    >
                      <X size={18} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals Card */}
      {lineItems.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border-2 border-green-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Estimate Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-base">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">${parseFloat(totals.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Overhead ({estimateData.overheadRate}%):</span>
              <span className="font-medium text-gray-800">${parseFloat(totals.overhead).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Profit ({estimateData.profitRate}%):</span>
              <span className="font-medium text-gray-800">${parseFloat(totals.profit).toLocaleString()}</span>
            </div>
            {parseFloat(estimateData.taxRate) > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tax ({estimateData.taxRate}%):</span>
                <span className="font-medium text-gray-800">${parseFloat(totals.tax).toLocaleString()}</span>
              </div>
            )}
            <div className="border-t-2 border-green-300 pt-3 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-green-600">${parseFloat(totals.total).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            if (confirm('Clear all line items and reset the estimate?')) {
              setLineItems([]);
              setEstimateData({
                client_id: '',
                title: '',
                description: '',
                status: 'draft',
                overheadRate: 15,
                profitRate: 20,
                taxRate: 0
              });
            }
          }}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Clear All
        </button>
        <button
          onClick={handleSaveEstimate}
          disabled={loading || lineItems.length === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          <span>{loading ? 'Saving...' : 'Save Estimate'}</span>
        </button>
      </div>

      {/* Price List Modal */}
      {showPriceListModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Xactimate Price List Database</h2>
                <button
                  onClick={() => {
                    setShowPriceListModal(false);
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by code, description, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="overflow-y-auto max-h-[60vh]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPriceList.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          No items found. Try adjusting your search.
                        </td>
                      </tr>
                    ) : (
                      filteredPriceList.map(item => (
                        <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.xactimate_code}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.item_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.unit}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">${parseFloat(item.unit_price || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => addFromPriceList(item)}
                              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              <Plus size={16} />
                              <span>Add</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedQuoteGeneratorView;
