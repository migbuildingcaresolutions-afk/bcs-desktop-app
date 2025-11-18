import React, { useState, useEffect } from 'react';
import { lineItemsAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Card, Textarea } from '../components';

export const LineItemsView = () => {
  const { items: lineItems, loading, error, fetchAll, create, update, remove } = useCRUD(lineItemsAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLineItem, setEditingLineItem] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    quantity: '1',
    unit_price: '',
    total: '',
    category: '',
    taxable: 1,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    };

    // Auto-calculate total when quantity or unit_price changes
    if (name === 'quantity' || name === 'unit_price') {
      const qty = parseFloat(newFormData.quantity) || 0;
      const price = parseFloat(newFormData.unit_price) || 0;
      newFormData.total = (qty * price).toFixed(2);
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const lineItemData = {
        ...formData,
        quantity: formData.quantity ? parseFloat(formData.quantity) : 1,
        unit_price: formData.unit_price ? parseFloat(formData.unit_price) : 0,
        total: formData.total ? parseFloat(formData.total) : 0,
        taxable: parseInt(formData.taxable),
      };

      if (editingLineItem) {
        await update(editingLineItem.id, lineItemData);
      } else {
        await create(lineItemData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving line item:', err);
    }
  };

  const handleEdit = (lineItem) => {
    setEditingLineItem(lineItem);
    setFormData({
      description: lineItem.description || '',
      quantity: lineItem.quantity || '1',
      unit_price: lineItem.unit_price || '',
      total: lineItem.total || '',
      category: lineItem.category || '',
      taxable: lineItem.taxable || 1,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this line item?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting line item:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      quantity: '1',
      unit_price: '',
      total: '',
      category: '',
      taxable: 1,
    });
    setEditingLineItem(null);
  };

  const columns = [
    { header: 'Description', accessor: 'description' },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Quantity',
      render: (row) => parseFloat(row.quantity || 0).toFixed(2)
    },
    {
      header: 'Unit Price',
      render: (row) => `$${parseFloat(row.unit_price || 0).toFixed(2)}`
    },
    {
      header: 'Total',
      render: (row) => `$${parseFloat(row.total || 0).toFixed(2)}`
    },
    {
      header: 'Taxable',
      render: (row) => row.taxable ? 'Yes' : 'No',
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 md:p-10 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">Line Items Management</h1>
            <p className="text-blue-100 text-lg font-medium leading-relaxed">Building Care Solutions - {lineItems.length} Line Items</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all shadow-lg"
          >
            Add Line Item
          </button>
        </div>
      </div>

      <Card title="" subtitle="" actions={null}>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        <Table
          columns={columns}
          data={lineItems}
          loading={loading}
          emptyMessage="No line items found. Add your first line item to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingLineItem ? 'Edit Line Item' : 'Add New Line Item'}
      >
        <form onSubmit={handleSubmit}>
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Describe the line item"
            rows={3}
          />

          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="e.g., Labor, Materials, Equipment"
          />

          <Input
            label="Quantity"
            name="quantity"
            type="number"
            step="0.01"
            value={formData.quantity}
            onChange={handleInputChange}
            required
            placeholder="1.00"
          />

          <Input
            label="Unit Price ($)"
            name="unit_price"
            type="number"
            step="0.01"
            value={formData.unit_price}
            onChange={handleInputChange}
            required
            placeholder="0.00"
          />

          <Input
            label="Total ($)"
            name="total"
            type="number"
            step="0.01"
            value={formData.total}
            onChange={handleInputChange}
            readOnly
            placeholder="Auto-calculated"
          />

          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="taxable"
                checked={formData.taxable === 1}
                onChange={handleInputChange}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Taxable</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingLineItem ? 'Update' : 'Create'} Line Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LineItemsView;
