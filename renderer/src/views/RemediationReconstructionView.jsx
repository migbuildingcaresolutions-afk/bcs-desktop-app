import React, { useState, useEffect } from 'react';
import { remediationReconstructionAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Card, Textarea } from '../components';

export const RemediationReconstructionView = () => {
  const { items: reconstructionJobs, loading, error, fetchAll, create, update, remove } = useCRUD(remediationReconstructionAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    job_id: '',
    work_description: '',
    materials_used: '',
    labor_hours: '',
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
        labor_hours: formData.labor_hours ? parseFloat(formData.labor_hours) : 0,
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
      console.error('Error saving remediation reconstruction job:', err);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      job_id: job.job_id || '',
      work_description: job.work_description || '',
      materials_used: job.materials_used || '',
      labor_hours: job.labor_hours || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this remediation reconstruction job?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting remediation reconstruction job:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      job_id: '',
      work_description: '',
      materials_used: '',
      labor_hours: '',
    });
    setEditingJob(null);
  };

  const columns = [
    { header: 'Job ID', accessor: 'job_id' },
    { header: 'Work Description', accessor: 'work_description' },
    { header: 'Materials Used', accessor: 'materials_used' },
    {
      header: 'Labor Hours',
      render: (row) => `${parseFloat(row.labor_hours || 0).toFixed(1)} hrs`
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
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-8 md:p-10 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">Remediation Reconstruction</h1>
            <p className="text-orange-100 text-lg font-medium leading-relaxed">Building Care Solutions - {reconstructionJobs.length} Reconstruction Jobs</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 rounded-lg font-semibold transition-all shadow-lg"
          >
            Add Reconstruction Record
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
          data={reconstructionJobs}
          loading={loading}
          emptyMessage="No remediation reconstruction jobs found. Add your first reconstruction job to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingJob ? 'Edit Remediation Reconstruction' : 'Add New Remediation Reconstruction'}
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
            label="Work Description"
            name="work_description"
            value={formData.work_description}
            onChange={handleInputChange}
            placeholder="Describe the reconstruction work (e.g., Drywall installation, painting, flooring)"
            rows={4}
          />

          <Textarea
            label="Materials Used"
            name="materials_used"
            value={formData.materials_used}
            onChange={handleInputChange}
            placeholder="List materials (e.g., 50 sheets drywall, 10 gallons paint, 500 sq ft flooring)"
            rows={3}
          />

          <Input
            label="Labor Hours"
            name="labor_hours"
            type="number"
            step="0.1"
            value={formData.labor_hours}
            onChange={handleInputChange}
            placeholder="0.0"
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
              {editingJob ? 'Update' : 'Create'} Reconstruction Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RemediationReconstructionView;
