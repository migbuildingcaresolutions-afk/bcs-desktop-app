import React, { useState, useEffect } from 'react';
import { pricingAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Select, Card, Textarea } from '../components';

export const PricingView = () => {
  const { items: pricingRules, loading, error, fetchAll, create, update, remove } = useCRUD(pricingAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    markup_percentage: '',
    category: '',
    effective_date: '',
    expiration_date: '',
    active: 1,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const pricingData = {
        ...formData,
        base_price: formData.base_price ? parseFloat(formData.base_price) : 0,
        markup_percentage: formData.markup_percentage ? parseFloat(formData.markup_percentage) : 0,
        active: parseInt(formData.active),
      };

      if (editingPricing) {
        await update(editingPricing.id, pricingData);
      } else {
        await create(pricingData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving pricing rule:', err);
    }
  };

  const handleEdit = (pricing) => {
    setEditingPricing(pricing);
    setFormData({
      name: pricing.name || '',
      description: pricing.description || '',
      base_price: pricing.base_price || '',
      markup_percentage: pricing.markup_percentage || '',
      category: pricing.category || '',
      effective_date: pricing.effective_date || '',
      expiration_date: pricing.expiration_date || '',
      active: pricing.active || 1,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pricing rule?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting pricing rule:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      base_price: '',
      markup_percentage: '',
      category: '',
      effective_date: '',
      expiration_date: '',
      active: 1,
    });
    setEditingPricing(null);
  };

  const getStatusBadge = (active) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {active ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Base Price',
      render: (row) => `$${parseFloat(row.base_price || 0).toFixed(2)}`
    },
    {
      header: 'Markup',
      render: (row) => `${parseFloat(row.markup_percentage || 0).toFixed(1)}%`
    },
    {
      header: 'Effective Date',
      render: (row) => formatDate(row.effective_date),
    },
    {
      header: 'Status',
      render: (row) => getStatusBadge(row.active),
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
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">Pricing Management</h1>
            <p className="text-blue-100 text-lg font-medium leading-relaxed">Building Care Solutions - {pricingRules.length} Pricing Rules</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all shadow-lg"
          >
            Add Pricing Rule
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
          data={pricingRules}
          loading={loading}
          emptyMessage="No pricing rules found. Add your first pricing rule to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingPricing ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Rule Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Standard Labor Rate"
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Pricing rule description"
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
            label="Base Price ($)"
            name="base_price"
            type="number"
            step="0.01"
            value={formData.base_price}
            onChange={handleInputChange}
            required
            placeholder="0.00"
          />

          <Input
            label="Markup Percentage (%)"
            name="markup_percentage"
            type="number"
            step="0.1"
            value={formData.markup_percentage}
            onChange={handleInputChange}
            placeholder="0.0"
          />

          <Input
            label="Effective Date"
            name="effective_date"
            type="date"
            value={formData.effective_date}
            onChange={handleInputChange}
          />

          <Input
            label="Expiration Date"
            name="expiration_date"
            type="date"
            value={formData.expiration_date}
            onChange={handleInputChange}
          />

          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                checked={formData.active === 1}
                onChange={handleInputChange}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
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
              {editingPricing ? 'Update' : 'Create'} Pricing Rule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PricingView;
