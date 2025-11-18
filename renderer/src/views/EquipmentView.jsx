import React, { useState, useEffect } from 'react';
import { equipmentAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Select, Card } from '../components';

export const EquipmentView = () => {
  const { items: equipment, loading, error, fetchAll, create, update, remove } = useCRUD(equipmentAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    serial_number: '',
    purchase_date: '',
    purchase_cost: '',
    status: 'available',
    notes: '',
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const equipmentData = {
        ...formData,
        purchase_cost: formData.purchase_cost ? parseFloat(formData.purchase_cost) : null,
      };

      if (editingItem) {
        await update(editingItem.id, equipmentData);
      } else {
        await create(equipmentData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving equipment:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      model: item.model || '',
      serial_number: item.serial_number || '',
      purchase_date: item.purchase_date || '',
      purchase_cost: item.purchase_cost || '',
      status: item.status || 'available',
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting equipment:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      model: '',
      serial_number: '',
      purchase_date: '',
      purchase_cost: '',
      status: 'available',
      notes: '',
    });
    setEditingItem(null);
  };

  const getStatusBadge = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      in_use: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      retired: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.available}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Model', accessor: 'model' },
    { header: 'Serial #', accessor: 'serial_number' },
    {
      header: 'Purchase Cost',
      render: (row) => row.purchase_cost ? `$${parseFloat(row.purchase_cost).toFixed(2)}` : 'N/A',
    },
    {
      header: 'Status',
      render: (row) => getStatusBadge(row.status),
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

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'in_use', label: 'In Use' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'retired', label: 'Retired' },
  ];

  return (
    <div className="p-6">
      <Card
        title="Equipment"
        subtitle={`${equipment.length} total items`}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Add Equipment
          </Button>
        }
      >
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        <Table
          columns={columns}
          data={equipment}
          loading={loading}
          emptyMessage="No equipment found. Add your first equipment to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingItem ? 'Edit Equipment' : 'Add New Equipment'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Equipment Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Air Mover, Dehumidifier, etc."
          />

          <Input
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            placeholder="Model number"
          />

          <Input
            label="Serial Number"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleInputChange}
            placeholder="Serial or asset number"
          />

          <Input
            label="Purchase Date"
            name="purchase_date"
            type="date"
            value={formData.purchase_date}
            onChange={handleInputChange}
          />

          <Input
            label="Purchase Cost"
            name="purchase_cost"
            type="number"
            step="0.01"
            value={formData.purchase_cost}
            onChange={handleInputChange}
            placeholder="0.00"
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            options={statusOptions}
          />

          <Input
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Additional notes or maintenance history"
          />

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
              {editingItem ? 'Update' : 'Add'} Equipment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EquipmentView;
