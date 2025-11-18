import React, { useState, useEffect } from 'react';
import { resourcesAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Select, Card, Textarea } from '../components';

export const ResourcesView = () => {
  const { items: resources, loading, error, fetchAll, create, update, remove } = useCRUD(resourcesAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    location: '',
    quantity: '',
    unit: 'each',
    cost: '',
    available: 1,
    notes: '',
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
      const resourceData = {
        ...formData,
        quantity: formData.quantity ? parseInt(formData.quantity) : 0,
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        available: parseInt(formData.available),
      };

      if (editingResource) {
        await update(editingResource.id, resourceData);
      } else {
        await create(resourceData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving resource:', err);
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name || '',
      type: resource.type || '',
      description: resource.description || '',
      location: resource.location || '',
      quantity: resource.quantity || '',
      unit: resource.unit || 'each',
      cost: resource.cost || '',
      available: resource.available || 1,
      notes: resource.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting resource:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      description: '',
      location: '',
      quantity: '',
      unit: 'each',
      cost: '',
      available: 1,
      notes: '',
    });
    setEditingResource(null);
  };

  const getStatusBadge = (available) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {available ? 'Available' : 'Unavailable'}
      </span>
    );
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Type', accessor: 'type' },
    { header: 'Location', accessor: 'location' },
    {
      header: 'Quantity',
      render: (row) => `${row.quantity || 0} ${row.unit || ''}`
    },
    {
      header: 'Cost',
      render: (row) => `$${parseFloat(row.cost || 0).toFixed(2)}`
    },
    {
      header: 'Status',
      render: (row) => getStatusBadge(row.available),
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

  const unitOptions = [
    { value: 'each', label: 'Each' },
    { value: 'box', label: 'Box' },
    { value: 'case', label: 'Case' },
    { value: 'pallet', label: 'Pallet' },
    { value: 'set', label: 'Set' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 md:p-10 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">Resources Management</h1>
            <p className="text-blue-100 text-lg font-medium leading-relaxed">Building Care Solutions - {resources.length} Resources</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all shadow-lg"
          >
            Add New Resource
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
          data={resources}
          loading={loading}
          emptyMessage="No resources found. Add your first resource to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingResource ? 'Edit Resource' : 'Add New Resource'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Resource Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Air Scrubber, Dehumidifier"
          />

          <Input
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            placeholder="e.g., Equipment, Tool, Material"
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Resource description"
            rows={3}
          />

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Warehouse A, Truck 3"
          />

          <Input
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="0"
          />

          <Select
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            options={unitOptions}
          />

          <Input
            label="Cost Per Unit ($)"
            name="cost"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={handleInputChange}
            placeholder="0.00"
          />

          <Textarea
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Additional notes"
            rows={2}
          />

          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="available"
                checked={formData.available === 1}
                onChange={handleInputChange}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Available</span>
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
              {editingResource ? 'Update' : 'Create'} Resource
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ResourcesView;
