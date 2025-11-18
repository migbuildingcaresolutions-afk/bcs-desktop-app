import React, { useState, useEffect } from 'react';
import { changeOrdersAPI, workOrdersAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Select, Textarea, Card } from '../components';

export const ChangeOrdersView = () => {
  const { items: changeOrders, loading, error, fetchAll, create, update, remove } = useCRUD(changeOrdersAPI);
  const [workOrders, setWorkOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChangeOrder, setEditingChangeOrder] = useState(null);
  const [formData, setFormData] = useState({
    work_order_id: '',
    change_order_number: '',
    description: '',
    reason: '',
    cost_impact: '',
    time_impact_days: '0',
    status: 'pending',
    requested_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchAll();
    loadWorkOrders();
  }, []);

  const loadWorkOrders = async () => {
    try {
      const data = await workOrdersAPI.getAll();
      setWorkOrders(data);
    } catch (err) {
      console.error('Error loading work orders:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const changeOrderData = {
        ...formData,
        cost_impact: parseFloat(formData.cost_impact),
        time_impact_days: parseInt(formData.time_impact_days),
      };

      if (editingChangeOrder) {
        await update(editingChangeOrder.id, changeOrderData);
      } else {
        await create(changeOrderData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving change order:', err);
    }
  };

  const handleEdit = (changeOrder) => {
    setEditingChangeOrder(changeOrder);
    setFormData({
      work_order_id: changeOrder.work_order_id || '',
      change_order_number: changeOrder.change_order_number || '',
      description: changeOrder.description || '',
      reason: changeOrder.reason || '',
      cost_impact: changeOrder.cost_impact || '',
      time_impact_days: changeOrder.time_impact_days || '0',
      status: changeOrder.status || 'pending',
      requested_date: changeOrder.requested_date || new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this change order?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting change order:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      work_order_id: '',
      change_order_number: '',
      description: '',
      reason: '',
      cost_impact: '',
      time_impact_days: '0',
      status: 'pending',
      requested_date: new Date().toISOString().split('T')[0],
    });
    setEditingChangeOrder(null);
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      implemented: 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
        {status}
      </span>
    );
  };

  const columns = [
    { header: 'CO #', accessor: 'change_order_number' },
    { header: 'Work Order', accessor: 'work_order_number' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Cost Impact',
      render: (row) => {
        const cost = parseFloat(row.cost_impact || 0);
        const color = cost >= 0 ? 'text-green-600' : 'text-red-600';
        return <span className={color}>{cost >= 0 ? '+' : ''}${cost.toFixed(2)}</span>;
      },
    },
    {
      header: 'Time Impact',
      render: (row) => `${row.time_impact_days || 0} days`,
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
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'implemented', label: 'Implemented' },
  ];

  return (
    <div className="p-6">
      <Card
        title="Change Orders"
        subtitle={`${changeOrders.length} total change orders`}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Create Change Order
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
          data={changeOrders}
          loading={loading}
          emptyMessage="No change orders found. Create your first change order to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingChangeOrder ? 'Edit Change Order' : 'Create New Change Order'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Change Order Number"
            name="change_order_number"
            value={formData.change_order_number}
            onChange={handleInputChange}
            required
            placeholder="CO-001"
          />

          <Select
            label="Work Order"
            name="work_order_id"
            value={formData.work_order_id}
            onChange={handleInputChange}
            required
            options={workOrders.map((wo) => ({
              value: wo.id,
              label: `${wo.work_order_number} - ${wo.title}`,
            }))}
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            placeholder="Describe the changes being requested"
          />

          <Textarea
            label="Reason for Change"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            rows={2}
            placeholder="Why is this change needed?"
          />

          <Input
            label="Cost Impact"
            name="cost_impact"
            type="number"
            step="0.01"
            value={formData.cost_impact}
            onChange={handleInputChange}
            required
            placeholder="0.00 (use negative for cost reduction)"
          />

          <Input
            label="Time Impact (Days)"
            name="time_impact_days"
            type="number"
            value={formData.time_impact_days}
            onChange={handleInputChange}
            required
            placeholder="0"
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
            label="Requested Date"
            name="requested_date"
            type="date"
            value={formData.requested_date}
            onChange={handleInputChange}
            required
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
              {editingChangeOrder ? 'Update' : 'Create'} Change Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ChangeOrdersView;
