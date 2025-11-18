import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Select, Card, Textarea } from '../components';

export const ServicesView = () => {
  const { items: services, loading, error, fetchAll, create, update, remove } = useCRUD(servicesAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit_price: '',
    unit_type: 'each',
    taxable: 1,
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
      const serviceData = {
        ...formData,
        unit_price: formData.unit_price ? parseFloat(formData.unit_price) : 0,
        taxable: parseInt(formData.taxable),
        active: parseInt(formData.active),
      };

      if (editingService) {
        await update(editingService.id, serviceData);
      } else {
        await create(serviceData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving service:', err);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      description: service.description || '',
      category: service.category || '',
      unit_price: service.unit_price || '',
      unit_type: service.unit_type || 'each',
      taxable: service.taxable || 1,
      active: service.active || 1,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting service:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      unit_price: '',
      unit_type: 'each',
      taxable: 1,
      active: 1,
    });
    setEditingService(null);
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

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Unit Price',
      render: (row) => `$${parseFloat(row.unit_price || 0).toFixed(2)}`
    },
    { header: 'Unit Type', accessor: 'unit_type' },
    {
      header: 'Taxable',
      render: (row) => row.taxable ? 'Yes' : 'No',
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

  const unitTypeOptions = [
    { value: 'each', label: 'Each' },
    { value: 'hour', label: 'Hour' },
    { value: 'day', label: 'Day' },
    { value: 'sqft', label: 'Square Foot' },
    { value: 'linear_ft', label: 'Linear Foot' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 md:p-10 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">Services Management</h1>
            <p className="text-blue-100 text-lg font-medium leading-relaxed">Building Care Solutions - {services.length} Services</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all shadow-lg"
          >
            Add New Service
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
          data={services}
          loading={loading}
          emptyMessage="No services found. Add your first service to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingService ? 'Edit Service' : 'Add New Service'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Service Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Water Damage Restoration"
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Service description"
            rows={3}
          />

          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="e.g., Remediation, Restoration"
          />

          <Input
            label="Unit Price"
            name="unit_price"
            type="number"
            step="0.01"
            value={formData.unit_price}
            onChange={handleInputChange}
            required
            placeholder="0.00"
          />

          <Select
            label="Unit Type"
            name="unit_type"
            value={formData.unit_type}
            onChange={handleInputChange}
            required
            options={unitTypeOptions}
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
              {editingService ? 'Update' : 'Create'} Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServicesView;
