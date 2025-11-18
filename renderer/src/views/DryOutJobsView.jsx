import React, { useState, useEffect } from 'react';
import { dryOutJobsAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Card, Textarea } from '../components';

export const DryOutJobsView = () => {
  const { items: dryOutJobs, loading, error, fetchAll, create, update, remove } = useCRUD(dryOutJobsAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    job_id: '',
    area_affected: '',
    moisture_reading: '',
    equipment_placed: '',
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
      const jobData = {
        ...formData,
        job_id: formData.job_id ? parseInt(formData.job_id) : null,
      };

      if (editingJob) {
        await update(editingJob.id, jobData);
      } else {
        await create(jobData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving dry-out job:', err);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      job_id: job.job_id || '',
      area_affected: job.area_affected || '',
      moisture_reading: job.moisture_reading || '',
      equipment_placed: job.equipment_placed || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this dry-out job?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting dry-out job:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      job_id: '',
      area_affected: '',
      moisture_reading: '',
      equipment_placed: '',
    });
    setEditingJob(null);
  };

  const columns = [
    { header: 'Job ID', accessor: 'job_id' },
    { header: 'Area Affected', accessor: 'area_affected' },
    { header: 'Moisture Reading', accessor: 'moisture_reading' },
    { header: 'Equipment Placed', accessor: 'equipment_placed' },
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
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-xl p-8 md:p-10 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">Dry-Out Jobs</h1>
            <p className="text-teal-100 text-lg font-medium leading-relaxed">Building Care Solutions - {dryOutJobs.length} Dry-Out Jobs</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white text-teal-600 hover:bg-teal-50 rounded-lg font-semibold transition-all shadow-lg"
          >
            Add Dry-Out Job
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
          data={dryOutJobs}
          loading={loading}
          emptyMessage="No dry-out jobs found. Add your first dry-out job to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingJob ? 'Edit Dry-Out Job' : 'Add New Dry-Out Job'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Job ID"
            name="job_id"
            type="number"
            value={formData.job_id}
            onChange={handleInputChange}
            placeholder="Associated job ID"
          />

          <Textarea
            label="Area Affected"
            name="area_affected"
            value={formData.area_affected}
            onChange={handleInputChange}
            placeholder="Describe the affected area (e.g., Living room, 200 sq ft)"
            rows={3}
          />

          <Input
            label="Moisture Reading"
            name="moisture_reading"
            value={formData.moisture_reading}
            onChange={handleInputChange}
            placeholder="e.g., 45% RH, 18% MC"
          />

          <Textarea
            label="Equipment Placed"
            name="equipment_placed"
            value={formData.equipment_placed}
            onChange={handleInputChange}
            placeholder="List equipment (e.g., 3x Air Movers, 2x Dehumidifiers)"
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
              {editingJob ? 'Update' : 'Create'} Dry-Out Job
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DryOutJobsView;
