import React, { useState, useEffect } from 'react';
import { jobTrackingAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Select, Card, Textarea } from '../components';

export const JobTrackingView = () => {
  const { items: jobTrackings, loading, error, fetchAll, create, update, remove } = useCRUD(jobTrackingAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTracking, setEditingTracking] = useState(null);
  const [formData, setFormData] = useState({
    work_order_id: '',
    job_name: '',
    status: 'pending',
    assigned_to: '',
    start_date: '',
    end_date: '',
    completion_percentage: '0',
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
      const trackingData = {
        ...formData,
        work_order_id: formData.work_order_id ? parseInt(formData.work_order_id) : null,
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
        completion_percentage: formData.completion_percentage ? parseInt(formData.completion_percentage) : 0,
      };

      if (editingTracking) {
        await update(editingTracking.id, trackingData);
      } else {
        await create(trackingData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving job tracking:', err);
    }
  };

  const handleEdit = (tracking) => {
    setEditingTracking(tracking);
    setFormData({
      work_order_id: tracking.work_order_id || '',
      job_name: tracking.job_name || '',
      status: tracking.status || 'pending',
      assigned_to: tracking.assigned_to || '',
      start_date: tracking.start_date || '',
      end_date: tracking.end_date || '',
      completion_percentage: tracking.completion_percentage || '0',
      notes: tracking.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job tracking entry?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting job tracking:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      work_order_id: '',
      job_name: '',
      status: 'pending',
      assigned_to: '',
      start_date: '',
      end_date: '',
      completion_percentage: '0',
      notes: '',
    });
    setEditingTracking(null);
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      on_hold: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    { header: 'Job Name', accessor: 'job_name' },
    { header: 'WO ID', accessor: 'work_order_id' },
    {
      header: 'Status',
      render: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Progress',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{width: `${row.completion_percentage || 0}%`}}
            ></div>
          </div>
          <span className="text-xs text-gray-600">{row.completion_percentage || 0}%</span>
        </div>
      )
    },
    {
      header: 'Start Date',
      render: (row) => formatDate(row.start_date),
    },
    {
      header: 'End Date',
      render: (row) => formatDate(row.end_date),
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
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 md:p-10 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">Job Tracking</h1>
            <p className="text-indigo-100 text-lg font-medium leading-relaxed">Building Care Solutions - {jobTrackings.length} Jobs Tracked</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold transition-all shadow-lg"
          >
            Add Tracking Entry
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
          data={jobTrackings}
          loading={loading}
          emptyMessage="No job tracking entries found. Add your first tracking entry to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingTracking ? 'Edit Job Tracking' : 'Add New Job Tracking'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Job Name"
            name="job_name"
            value={formData.job_name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Water Damage Restoration - Main St"
          />

          <Input
            label="Work Order ID"
            name="work_order_id"
            type="number"
            value={formData.work_order_id}
            onChange={handleInputChange}
            placeholder="Associated work order ID"
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
            label="Assigned To (Employee ID)"
            name="assigned_to"
            type="number"
            value={formData.assigned_to}
            onChange={handleInputChange}
            placeholder="Employee ID"
          />

          <Input
            label="Start Date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleInputChange}
          />

          <Input
            label="End Date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleInputChange}
          />

          <Input
            label="Completion Percentage"
            name="completion_percentage"
            type="number"
            min="0"
            max="100"
            value={formData.completion_percentage}
            onChange={handleInputChange}
            placeholder="0-100"
          />

          <Textarea
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Additional notes about the job"
            rows={3}
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
              {editingTracking ? 'Update' : 'Create'} Tracking Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default JobTrackingView;
