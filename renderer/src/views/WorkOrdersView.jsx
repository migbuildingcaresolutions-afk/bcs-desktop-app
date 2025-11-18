import React, { useState, useEffect } from 'react';
import { workOrdersAPI, clientsAPI, employeesAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Select, Textarea, Card } from '../components';
import { generatePrintDocument, printDocument, LEGAL_DISCLAIMERS } from '../utils/printTemplates';

export const WorkOrdersView = () => {
  const { items: workOrders, loading, error, fetchAll, create, update, remove } = useCRUD(workOrdersAPI);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingWorkOrder, setViewingWorkOrder] = useState(null);
  const [editingWorkOrder, setEditingWorkOrder] = useState(null);
  const [formData, setFormData] = useState({
    client_id: '',
    employee_id: '',
    work_order_number: '',
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    scheduled_date: '',
    estimated_cost: '',
    location: '',
  });

  useEffect(() => {
    fetchAll();
    loadClients();
    loadEmployees();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data);
    } catch (err) {
      console.error('Error loading clients:', err);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await employeesAPI.getAll();
      setEmployees(data);
    } catch (err) {
      console.error('Error loading employees:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const workOrderData = {
        ...formData,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
      };

      if (editingWorkOrder) {
        await update(editingWorkOrder.id, workOrderData);
      } else {
        await create(workOrderData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving work order:', err);
    }
  };

  const handleView = (workOrder) => {
    setViewingWorkOrder(workOrder);
    setIsViewModalOpen(true);
  };

  const handleEdit = (workOrder) => {
    setEditingWorkOrder(workOrder);
    setFormData({
      client_id: workOrder.client_id || '',
      employee_id: workOrder.employee_id || '',
      work_order_number: workOrder.work_order_number || '',
      title: workOrder.title || '',
      description: workOrder.description || '',
      status: workOrder.status || 'pending',
      priority: workOrder.priority || 'medium',
      scheduled_date: workOrder.scheduled_date || '',
      estimated_cost: workOrder.estimated_cost || '',
      location: workOrder.location || '',
    });
    setIsModalOpen(true);
  };

  const handleEditFromView = () => {
    setIsViewModalOpen(false);
    handleEdit(viewingWorkOrder);
  };

  const handlePrint = () => {
    const client = clients.find(c => c.id === viewingWorkOrder.client_id);
    const employee = employees.find(e => e.id === viewingWorkOrder.employee_id);

    const statusClass = viewingWorkOrder.status === 'completed' ? 'badge-completed' :
                       viewingWorkOrder.status === 'in_progress' ? 'badge-in-progress' : 'badge-pending';
    const priorityClass = viewingWorkOrder.priority === 'high' || viewingWorkOrder.priority === 'urgent' ? 'badge-high' :
                         viewingWorkOrder.priority === 'medium' ? 'badge-medium' : 'badge-low';

    const content = `
      <div class="document-info">
        <div class="info-box">
          <h3>Client Information</h3>
          <p><strong>${client?.name || 'N/A'}</strong></p>
          ${client?.company ? `<p>${client.company}</p>` : ''}
          ${client?.email ? `<p>📧 ${client.email}</p>` : ''}
          ${client?.phone ? `<p>📞 ${client.phone}</p>` : ''}
          ${client?.address ? `<p>📍 ${client.address}</p>` : ''}
        </div>

        <div class="info-box">
          <h3>Work Order Details</h3>
          <p><span class="info-label">Created:</span> ${new Date(viewingWorkOrder.created_at || Date.now()).toLocaleDateString()}</p>
          <p><span class="info-label">Scheduled:</span> ${viewingWorkOrder.scheduled_date || 'TBD'}</p>
          <p><span class="info-label">Assigned To:</span> ${employee?.name || 'Unassigned'}</p>
          <p><span class="info-label">Status:</span> <span class="badge ${statusClass}">${viewingWorkOrder.status.replace('_', ' ').toUpperCase()}</span></p>
          <p><span class="info-label">Priority:</span> <span class="badge ${priorityClass}">${viewingWorkOrder.priority.toUpperCase()}</span></p>
        </div>
      </div>

      <div class="details-section">
        <h3>Work Order Title</h3>
        <div class="details-content"><strong>${viewingWorkOrder.title}</strong></div>
      </div>

      ${viewingWorkOrder.location ? `
      <div class="details-section">
        <h3>📍 Service Location</h3>
        <div class="details-content">${viewingWorkOrder.location}</div>
      </div>
      ` : ''}

      ${viewingWorkOrder.description ? `
      <div class="details-section">
        <h3>Scope of Work</h3>
        <div class="details-content">${viewingWorkOrder.description}</div>
      </div>
      ` : ''}

      <div class="total-section">
        <div class="total-box">
          <div class="total-label">Estimated Cost</div>
          <div class="total-amount">$${parseFloat(viewingWorkOrder.estimated_cost || 0).toFixed(2)}</div>
        </div>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <p><strong>Technician Signature</strong></p>
          <p>${employee?.name || 'Unassigned'}</p>
          <p>Date: _________________</p>
        </div>
        <div class="signature-box">
          <p><strong>Client Approval</strong></p>
          <p>${client?.name || ''}</p>
          <p>Date: _________________</p>
        </div>
      </div>
    `;

    const html = generatePrintDocument('workorder', {
      documentTitle: 'WORK ORDER',
      documentNumber: viewingWorkOrder.work_order_number,
      date: new Date(viewingWorkOrder.created_at || Date.now()).toLocaleDateString(),
      content: content,
      disclaimer: LEGAL_DISCLAIMERS.workOrder
    });

    printDocument(html);
  };

  const handleEmail = () => {
    const client = clients.find(c => c.id === viewingWorkOrder.client_id);
    const employee = employees.find(e => e.id === viewingWorkOrder.employee_id);

    if (!client?.email) {
      alert('No email found for this client');
      return;
    }

    const subject = encodeURIComponent(`Work Order ${viewingWorkOrder.work_order_number} - Building Care Solutions`);
    const body = encodeURIComponent(`Work Order Details

WO #: ${viewingWorkOrder.work_order_number}
Title: ${viewingWorkOrder.title}

Client: ${client?.name || 'N/A'}
Assigned To: ${employee?.name || 'Unassigned'}

Status: ${viewingWorkOrder.status}
Priority: ${viewingWorkOrder.priority}
Scheduled: ${viewingWorkOrder.scheduled_date || 'Not scheduled'}
Location: ${viewingWorkOrder.location || 'N/A'}
Estimated Cost: $${parseFloat(viewingWorkOrder.estimated_cost || 0).toFixed(2)}

Description:
${viewingWorkOrder.description || 'N/A'}

Thank you for your business!

---
Building Care Solutions
8889 Caminito Plaza Centro, San Diego, CA 92122
858-573-7849 | m19u3l@sd-bcs.com
    `);

    window.location.href = `mailto:${client.email}?subject=${subject}&body=${body}`;
  };

  const handleSMS = async () => {
    const client = clients.find(c => c.id === viewingWorkOrder.client_id);

    if (!client?.phone) {
      alert('No phone number found for this client');
      return;
    }

    const message = `Work Order ${viewingWorkOrder.work_order_number}: ${viewingWorkOrder.title}. Status: ${viewingWorkOrder.status}. Scheduled: ${viewingWorkOrder.scheduled_date || 'TBD'}`;

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const response = await fetch(`${API_BASE}/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: client.phone,
          message: message
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      if (result.success) {
        alert('✅ SMS sent successfully to ' + client.phone);
      } else {
        alert('❌ Failed to send SMS: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('SMS Error:', error);
      alert('❌ Error sending SMS: ' + error.message + '\n\nMake sure the backend server is running and Twilio is configured.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this work order?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting work order:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      employee_id: '',
      work_order_number: '',
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      scheduled_date: '',
      estimated_cost: '',
      location: '',
    });
    setEditingWorkOrder(null);
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800',
      on_hold: 'bg-orange-100 text-orange-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
      urgent: 'bg-red-200 text-red-900',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority] || colors.medium}`}>
        {priority}
      </span>
    );
  };

  const columns = [
    { header: 'WO #', accessor: 'work_order_number' },
    { header: 'Title', accessor: 'title' },
    { header: 'Client', accessor: 'client_name' },
    { header: 'Assigned To', accessor: 'employee_name' },
    {
      header: 'Priority',
      render: (row) => getPriorityBadge(row.priority),
    },
    {
      header: 'Status',
      render: (row) => getStatusBadge(row.status),
    },
    { header: 'Scheduled', accessor: 'scheduled_date' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="primary" onClick={() => handleView(row)}>
            👁️ View
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>
            ✏️ Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
            🗑️
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

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  return (
    <div className="p-6">
      <Card
        title="Work Orders"
        subtitle={`${workOrders.length} total work orders`}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Create Work Order
          </Button>
        }
      >
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          💡 Tip: Double-click any work order to view details
        </div>
        <Table
          columns={columns}
          data={workOrders}
          loading={loading}
          emptyMessage="No work orders found. Create your first work order to get started."
          onRowDoubleClick={handleView}
        />
      </Card>

      {/* View Modal */}
      {isViewModalOpen && viewingWorkOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setIsViewModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">📋 Work Order Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  WO #{viewingWorkOrder.work_order_number}
                </h3>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">{viewingWorkOrder.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">👤 Client</label>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {clients.find(c => c.id === viewingWorkOrder.client_id)?.name || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">👷 Assigned To</label>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {employees.find(e => e.id === viewingWorkOrder.employee_id)?.name || 'Unassigned'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">📊 Status</label>
                  <div>{getStatusBadge(viewingWorkOrder.status)}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">⚠️ Priority</label>
                  <div>{getPriorityBadge(viewingWorkOrder.priority)}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">📅 Scheduled</label>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {viewingWorkOrder.scheduled_date || 'Not scheduled'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">💰 Estimated Cost</label>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    ${parseFloat(viewingWorkOrder.estimated_cost || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {viewingWorkOrder.location && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">📍 Location</label>
                  <p className="text-gray-900 dark:text-gray-100">{viewingWorkOrder.location}</p>
                </div>
              )}

              {viewingWorkOrder.description && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">📝 Description</label>
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{viewingWorkOrder.description}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
              <button onClick={handlePrint} className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
                🖨️ Print
              </button>
              <button onClick={handleEmail} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                📧 Email
              </button>
              <button onClick={handleSMS} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                💬 SMS
              </button>
              <button onClick={handleEditFromView} className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
                ✏️ Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingWorkOrder ? 'Edit Work Order' : 'Create New Work Order'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Work Order Number"
              name="work_order_number"
              value={formData.work_order_number}
              onChange={handleInputChange}
              required
              placeholder="WO-001"
            />

            <Select
              label="Client"
              name="client_id"
              value={formData.client_id}
              onChange={handleInputChange}
              required
              options={clients.map((c) => ({ value: c.id, label: c.name }))}
            />

            <Select
              label="Assign To"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleInputChange}
              options={employees.map((e) => ({ value: e.id, label: e.name }))}
            />

            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              required
              options={priorityOptions}
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
              label="Scheduled Date"
              name="scheduled_date"
              type="date"
              value={formData.scheduled_date}
              onChange={handleInputChange}
            />

            <Input
              label="Estimated Cost"
              name="estimated_cost"
              type="number"
              step="0.01"
              value={formData.estimated_cost}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>

          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Brief description of the work"
            className="mt-4"
          />

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Job site address or location"
            className="mt-4"
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Detailed description of work to be performed"
            className="mt-4"
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
              {editingWorkOrder ? 'Update' : 'Create'} Work Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WorkOrdersView;
