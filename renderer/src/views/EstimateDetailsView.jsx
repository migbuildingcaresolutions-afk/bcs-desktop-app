import React, { useState, useEffect } from 'react';
import { estimatesAPI } from '../api-client';
import LineItemEditor from '../components/LineItemEditor';
import PriceListSearchModal from '../components/PriceListSearchModal';

export default function EstimateDetailsView({ estimateId, onBack }) {
  const [estimate, setEstimate] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showItemEditor, setShowItemEditor] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [taxRate, setTaxRate] = useState(0);
  const [showPriceListSearch, setShowPriceListSearch] = useState(false);
  const [priceListItem, setPriceListItem] = useState(null);

  useEffect(() => {
    if (estimateId) {
      loadEstimate();
    }
  }, [estimateId]);

  const loadEstimate = async () => {
    try {
      setLoading(true);
      const data = await estimatesAPI.getById(estimateId);
      setEstimate(data);
      setLineItems(data.line_items || []);
      setTaxRate(data.tax_rate || 0);
    } catch (error) {
      console.error('Error loading estimate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLineItem = () => {
    setEditingItem(null);
    setPriceListItem(null);
    setShowItemEditor(true);
  };

  const handleSearchPriceList = () => {
    setShowPriceListSearch(true);
  };

  const handleSelectPriceListItem = (selectedItem) => {
    // Auto-open the line item editor with pre-filled data from price list
    setPriceListItem(selectedItem);
    setEditingItem(null);
    setShowItemEditor(true);
  };

  const handleEditLineItem = (item) => {
    setEditingItem(item);
    setShowItemEditor(true);
  };

  const handleSaveLineItem = async (itemData) => {
    try {
      if (editingItem) {
        // Update existing
        await fetch(`http://localhost:3000/api/estimates/${estimateId}/line-items/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData)
        });
      } else {
        // Add new
        await fetch(`http://localhost:3000/api/estimates/${estimateId}/line-items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData)
        });
      }

      setShowItemEditor(false);
      setEditingItem(null);
      await loadEstimate();
    } catch (error) {
      console.error('Error saving line item:', error);
      alert('Failed to save line item');
    }
  };

  const handleDeleteLineItem = async (itemId) => {
    if (!confirm('Delete this line item?')) return;

    try {
      await fetch(`http://localhost:3000/api/estimates/${estimateId}/line-items/${itemId}`, {
        method: 'DELETE'
      });
      await loadEstimate();
    } catch (error) {
      console.error('Error deleting line item:', error);
      alert('Failed to delete line item');
    }
  };

  const handleTaxRateChange = async (newRate) => {
    try {
      setTaxRate(newRate);
      await estimatesAPI.update(estimateId, { ...estimate, tax_rate: newRate });
      await fetch(`http://localhost:3000/api/estimates/${estimateId}/recalculate`, {
        method: 'POST'
      });
      await loadEstimate();
    } catch (error) {
      console.error('Error updating tax rate:', error);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      material: '📦',
      labor: '👷',
      equipment: '🔧',
      custom: '⭐'
    };
    return icons[category] || '📝';
  };

  const getCategoryColor = (category) => {
    const colors = {
      material: 'bg-blue-100 text-blue-800',
      labor: 'bg-green-100 text-green-800',
      equipment: 'bg-orange-100 text-orange-800',
      custom: 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Loading estimate...</p>
        </div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Estimate not found</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Back to Estimates
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {estimate.title || `Estimate #${estimate.estimate_number}`}
              </h1>
              <p className="text-sm text-gray-600">
                Status: <span className="font-semibold capitalize">{estimate.status}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Estimate Number</p>
            <p className="text-lg font-mono font-bold">{estimate.estimate_number}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Estimate Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Estimate Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Description</label>
                <p className="font-medium">{estimate.description || 'No description'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Valid Until</label>
                <p className="font-medium">{estimate.valid_until || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Line Items</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSearchPriceList}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <span>🔍</span> Search Price List
                  </button>
                  <button
                    onClick={handleAddLineItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <span>+</span> Add Line Item
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Qty</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Unit</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Total</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lineItems.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        No line items yet. Click "Add Line Item" to get started.
                      </td>
                    </tr>
                  ) : (
                    lineItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)} flex items-center gap-1 w-fit`}>
                            <span>{getCategoryIcon(item.category)}</span>
                            <span className="capitalize">{item.category}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-700">{item.code || '-'}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.description}</p>
                            {item.notes && (
                              <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-sm">{item.unit}</td>
                        <td className="px-6 py-4 text-right text-sm font-mono">${item.unit_price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right text-sm font-mono font-semibold">${item.total_price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleEditLineItem(item)}
                            className="text-blue-600 hover:text-blue-800 mx-1"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteLineItem(item.id)}
                            className="text-red-600 hover:text-red-800 mx-1"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="max-w-md ml-auto space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-mono font-semibold">${(estimate.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tax Rate:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => handleTaxRateChange(parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <span>%</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax Amount:</span>
                <span className="font-mono font-semibold">${(estimate.tax_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-300">
                <span>Total:</span>
                <span className="font-mono text-blue-600">${(estimate.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price List Search Modal */}
      {showPriceListSearch && (
        <PriceListSearchModal
          isOpen={showPriceListSearch}
          onClose={() => setShowPriceListSearch(false)}
          onSelectItem={handleSelectPriceListItem}
        />
      )}

      {/* Line Item Editor Modal */}
      {showItemEditor && (
        <LineItemEditor
          item={editingItem || priceListItem}
          onSave={handleSaveLineItem}
          onCancel={() => {
            setShowItemEditor(false);
            setEditingItem(null);
            setPriceListItem(null);
          }}
        />
      )}
    </div>
  );
}
