import React, { useState, useEffect } from 'react';
import { xactimateAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Card, Textarea } from '../components';

export const XactimateView = () => {
  const { items: xactimateEstimates, loading, error, fetchAll, create, update, remove } = useCRUD(xactimateAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState(null);
  const [formData, setFormData] = useState({
    estimate_id: '',
    claim_number: '',
    date_of_loss: '',
    policy_number: '',
    insurance_company: '',
    adjuster_name: '',
    adjuster_phone: '',
    rcv_total: '',
    acv_total: '',
    depreciation: '',
    deductible: '',
    tax: '',
    overhead_profit: '',
    net_claim: '',
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
      const estimateData = {
        ...formData,
        estimate_id: formData.estimate_id ? parseInt(formData.estimate_id) : null,
        rcv_total: formData.rcv_total ? parseFloat(formData.rcv_total) : 0,
        acv_total: formData.acv_total ? parseFloat(formData.acv_total) : 0,
        depreciation: formData.depreciation ? parseFloat(formData.depreciation) : 0,
        deductible: formData.deductible ? parseFloat(formData.deductible) : 0,
        tax: formData.tax ? parseFloat(formData.tax) : 0,
        overhead_profit: formData.overhead_profit ? parseFloat(formData.overhead_profit) : 0,
        net_claim: formData.net_claim ? parseFloat(formData.net_claim) : 0,
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
      console.error('Error saving Xactimate estimate:', err);
    }
  };

  const handleEdit = (estimate) => {
    setEditingEstimate(estimate);
    setFormData({
      estimate_id: estimate.estimate_id || '',
      claim_number: estimate.claim_number || '',
      date_of_loss: estimate.date_of_loss || '',
      policy_number: estimate.policy_number || '',
      insurance_company: estimate.insurance_company || '',
      adjuster_name: estimate.adjuster_name || '',
      adjuster_phone: estimate.adjuster_phone || '',
      rcv_total: estimate.rcv_total || '',
      acv_total: estimate.acv_total || '',
      depreciation: estimate.depreciation || '',
      deductible: estimate.deductible || '',
      tax: estimate.tax || '',
      overhead_profit: estimate.overhead_profit || '',
      net_claim: estimate.net_claim || '',
      notes: estimate.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Xactimate estimate?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting Xactimate estimate:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      estimate_id: '',
      claim_number: '',
      date_of_loss: '',
      policy_number: '',
      insurance_company: '',
      adjuster_name: '',
      adjuster_phone: '',
      rcv_total: '',
      acv_total: '',
      depreciation: '',
      deductible: '',
      tax: '',
      overhead_profit: '',
      net_claim: '',
      notes: '',
    });
    setEditingEstimate(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    { header: 'Claim #', accessor: 'claim_number' },
    { header: 'Insurance Co.', accessor: 'insurance_company' },
    {
      header: 'Date of Loss',
      render: (row) => formatDate(row.date_of_loss),
    },
    {
      header: 'RCV Total',
      render: (row) => `$${parseFloat(row.rcv_total || 0).toFixed(2)}`
    },
    {
      header: 'Net Claim',
      render: (row) => `$${parseFloat(row.net_claim || 0).toFixed(2)}`
    },
    { header: 'Adjuster', accessor: 'adjuster_name' },
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 md:p-10 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">Xactimate Estimates</h1>
            <p className="text-purple-100 text-lg font-medium leading-relaxed">Building Care Solutions - {xactimateEstimates.length} Estimates</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white text-purple-600 hover:bg-purple-50 rounded-lg font-semibold transition-all shadow-lg"
          >
            Add Xactimate Estimate
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
          data={xactimateEstimates}
          loading={loading}
          emptyMessage="No Xactimate estimates found. Add your first estimate to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingEstimate ? 'Edit Xactimate Estimate' : 'Add New Xactimate Estimate'}
      >
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <Input
              label="Claim Number"
              name="claim_number"
              value={formData.claim_number}
              onChange={handleInputChange}
              required
              placeholder="CLM-2024-001"
            />

            <Input
              label="Policy Number"
              name="policy_number"
              value={formData.policy_number}
              onChange={handleInputChange}
              placeholder="POL-123456"
            />

            <Input
              label="Insurance Company"
              name="insurance_company"
              value={formData.insurance_company}
              onChange={handleInputChange}
              placeholder="e.g., State Farm"
            />

            <Input
              label="Date of Loss"
              name="date_of_loss"
              type="date"
              value={formData.date_of_loss}
              onChange={handleInputChange}
            />

            <Input
              label="Adjuster Name"
              name="adjuster_name"
              value={formData.adjuster_name}
              onChange={handleInputChange}
              placeholder="John Smith"
            />

            <Input
              label="Adjuster Phone"
              name="adjuster_phone"
              type="tel"
              value={formData.adjuster_phone}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
            />

            <Input
              label="RCV Total ($)"
              name="rcv_total"
              type="number"
              step="0.01"
              value={formData.rcv_total}
              onChange={handleInputChange}
              placeholder="0.00"
            />

            <Input
              label="ACV Total ($)"
              name="acv_total"
              type="number"
              step="0.01"
              value={formData.acv_total}
              onChange={handleInputChange}
              placeholder="0.00"
            />

            <Input
              label="Depreciation ($)"
              name="depreciation"
              type="number"
              step="0.01"
              value={formData.depreciation}
              onChange={handleInputChange}
              placeholder="0.00"
            />

            <Input
              label="Deductible ($)"
              name="deductible"
              type="number"
              step="0.01"
              value={formData.deductible}
              onChange={handleInputChange}
              placeholder="0.00"
            />

            <Input
              label="Tax ($)"
              name="tax"
              type="number"
              step="0.01"
              value={formData.tax}
              onChange={handleInputChange}
              placeholder="0.00"
            />

            <Input
              label="Overhead & Profit ($)"
              name="overhead_profit"
              type="number"
              step="0.01"
              value={formData.overhead_profit}
              onChange={handleInputChange}
              placeholder="0.00"
            />

            <Input
              label="Net Claim ($)"
              name="net_claim"
              type="number"
              step="0.01"
              value={formData.net_claim}
              onChange={handleInputChange}
              placeholder="0.00"
            />

            <Textarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes"
              rows={3}
            />
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
              {editingEstimate ? 'Update' : 'Create'} Estimate
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default XactimateView;
