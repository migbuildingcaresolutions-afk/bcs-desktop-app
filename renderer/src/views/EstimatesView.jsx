import React, { useState, useEffect } from 'react';
import { estimatesAPI, clientsAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Select, Textarea, Card } from '../components';

export const EstimatesView = () => {
  const { items: estimates, loading, error, fetchAll, create, update, remove } = useCRUD(estimatesAPI);
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState(null);
  const [formData, setFormData] = useState({
    client_id: '',
    estimate_number: '',
    title: '',
    description: '',
    total_amount: '',
    status: 'draft',
    valid_until: '',
    notes: '',
  });

  useEffect(() => {
    fetchAll();
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data);
    } catch (err) {
      console.error('Error loading clients:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const estimateData = {
        ...formData,
        total_amount: parseFloat(formData.total_amount),
      };

      if (editingEstimate) {
        await update(editingEstimate.id, estimateData);
      } else {
        await create(estimateData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving estimate:', err);
    }
  };

  const handleEdit = (estimate) => {
    setEditingEstimate(estimate);
    setFormData({
      client_id: estimate.client_id || '',
      estimate_number: estimate.estimate_number || '',
      title: estimate.title || '',
      description: estimate.description || '',
      total_amount: estimate.total_amount || '',
      status: estimate.status || 'draft',
      valid_until: estimate.valid_until || '',
      notes: estimate.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this estimate?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting estimate:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      estimate_number: '',
      title: '',
      description: '',
      total_amount: '',
      status: 'draft',
      valid_until: '',
      notes: '',
    });
    setEditingEstimate(null);
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-yellow-100 text-yellow-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.draft}`}>
        {status}
      </span>
    );
  };

  const columns = [
    { header: 'Estimate #', accessor: 'estimate_number' },
    { header: 'Client', accessor: 'client_name' },
    { header: 'Title', accessor: 'title' },
    {
      header: 'Amount',
      render: (row) => `$${parseFloat(row.total_amount || 0).toFixed(2)}`,
    },
    {
      header: 'Status',
      render: (row) => getStatusBadge(row.status),
    },
    { header: 'Valid Until', accessor: 'valid_until' },
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
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'expired', label: 'Expired' },
  ];

  return (
    <div className="p-6">
      <Card
        title="Estimates"
        subtitle={`${estimates.length} total estimates`}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Create Estimate
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
          data={estimates}
          loading={loading}
          emptyMessage="No estimates found. Create your first estimate to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingEstimate ? 'Edit Estimate' : 'Create New Estimate'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Estimate Number"
            name="estimate_number"
            value={formData.estimate_number}
            onChange={handleInputChange}
            required
            placeholder="EST-001"
          />

          <Select
            label="Client"
            name="client_id"
            value={formData.client_id}
            onChange={handleInputChange}
            required
            options={clients.map((c) => ({ value: c.id, label: c.name }))}
          />

          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Brief description"
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            placeholder="Detailed estimate description"
          />

          <Input
            label="Total Amount"
            name="total_amount"
            type="number"
            step="0.01"
            value={formData.total_amount}
            onChange={handleInputChange}
            required
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
            label="Valid Until"
            name="valid_until"
            type="date"
            value={formData.valid_until}
            onChange={handleInputChange}
            required
          />

          <Textarea
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={2}
            placeholder="Additional notes"
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
              {editingEstimate ? 'Update' : 'Create'} Estimate
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EstimatesView;
