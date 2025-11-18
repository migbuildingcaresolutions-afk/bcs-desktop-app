import React, { useState, useEffect } from 'react';
import { invoicesAPI, clientsAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Select, Card } from '../components';
import { generatePrintDocument, printDocument, LEGAL_DISCLAIMERS } from '../utils/printTemplates';

export const InvoicesView = () => {
  const { items: invoices, loading, error, fetchAll, create, update, remove } = useCRUD(invoicesAPI);
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [formData, setFormData] = useState({
    client_id: '',
    invoice_number: '',
    amount: '',
    status: 'pending',
    due_date: '',
    description: '',
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

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
      const invoiceData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      if (editingInvoice) {
        await update(editingInvoice.id, invoiceData);
      } else {
        await create(invoiceData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving invoice:', err);
    }
  };

  const handleView = (invoice) => {
    setViewingInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      client_id: invoice.client_id || '',
      invoice_number: invoice.invoice_number || '',
      amount: invoice.amount || '',
      status: invoice.status || 'pending',
      due_date: invoice.due_date?.split('T')[0] || '',
      description: invoice.description || '',
    });
    setIsModalOpen(true);
  };

  const handleEditFromView = () => {
    setIsViewModalOpen(false);
    handleEdit(viewingInvoice);
  };

  const handlePrint = () => {
    const client = clients.find(c => c.id === viewingInvoice.client_id);
    const statusClass = viewingInvoice.status === 'paid' ? 'badge-paid' :
                       viewingInvoice.status === 'overdue' ? 'badge-overdue' : 'badge-pending';

    const content = `
      <div class="document-info">
        <div class="info-box">
          <h3>Bill To</h3>
          <p><strong>${client?.name || 'N/A'}</strong></p>
          ${client?.company ? `<p>${client.company}</p>` : ''}
          ${client?.email ? `<p>📧 ${client.email}</p>` : ''}
          ${client?.phone ? `<p>📞 ${client.phone}</p>` : ''}
          ${client?.address ? `<p>📍 ${client.address}</p>` : ''}
        </div>

        <div class="info-box">
          <h3>Invoice Details</h3>
          <p><span class="info-label">Invoice Date:</span> ${new Date(viewingInvoice.created_at || Date.now()).toLocaleDateString()}</p>
          <p><span class="info-label">Due Date:</span> ${new Date(viewingInvoice.due_date).toLocaleDateString()}</p>
          <p><span class="info-label">Status:</span> <span class="badge ${statusClass}">${viewingInvoice.status.toUpperCase()}</span></p>
        </div>
      </div>

      ${viewingInvoice.description ? `
      <div class="details-section">
        <h3>Description of Services</h3>
        <div class="details-content">${viewingInvoice.description}</div>
      </div>
      ` : ''}

      <div class="total-section">
        <div class="total-box">
          <div class="total-label">Total Amount Due</div>
          <div class="total-amount">$${parseFloat(viewingInvoice.amount).toFixed(2)}</div>
        </div>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <p><strong>Authorized Signature</strong></p>
          <p>Building Care Solutions</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="signature-box">
          <p><strong>Client Acknowledgment</strong></p>
          <p>${client?.name || ''}</p>
          <p>Date: _________________</p>
        </div>
      </div>
    `;

    const html = generatePrintDocument('invoice', {
      documentTitle: 'INVOICE',
      documentNumber: viewingInvoice.invoice_number,
      date: new Date(viewingInvoice.created_at || Date.now()).toLocaleDateString(),
      content: content,
      disclaimer: LEGAL_DISCLAIMERS.invoice
    });

    printDocument(html);
  };

  const handleEmail = () => {
    const client = clients.find(c => c.id === viewingInvoice.client_id);
    if (!client?.email) {
      alert('No email found for this client');
      return;
    }
    const subject = encodeURIComponent(`Invoice ${viewingInvoice.invoice_number} - Building Care Solutions`);
    const body = encodeURIComponent(`Dear ${client.name},

Your invoice is ready for review.

Invoice #: ${viewingInvoice.invoice_number}
Amount: $${parseFloat(viewingInvoice.amount).toFixed(2)}
Due Date: ${new Date(viewingInvoice.due_date).toLocaleDateString()}

${viewingInvoice.description || ''}

Thank you for your business!

Building Care Solutions
8889 Caminito Plaza Centro, San Diego, CA 92122
858-573-7849 | m19u3l@sd-bcs.com
    `);
    window.location.href = `mailto:${client.email}?subject=${subject}&body=${body}`;
  };

  const handleSMS = async () => {
    const client = clients.find(c => c.id === viewingInvoice.client_id);
    if (!client?.phone) {
      alert('No phone number found for this client');
      return;
    }
    
    const message = `Invoice ${viewingInvoice.invoice_number} is ready. Amount: $${parseFloat(viewingInvoice.amount).toFixed(2)}. Due: ${new Date(viewingInvoice.due_date).toLocaleDateString()}`;
    
    try {
      const response = await fetch('http://localhost:3000/api/sms/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientPhone: client.phone,
          invoiceNumber: viewingInvoice.invoice_number,
          amount: parseFloat(viewingInvoice.amount).toFixed(2)
        })
      });
      const result = await response.json();
      if (result.success) {
        alert('SMS sent successfully!');
      } else {
        alert('Failed to send SMS: ' + result.error);
      }
    } catch (error) {
      alert('Error sending SMS: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting invoice:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      invoice_number: '',
      amount: '',
      status: 'pending',
      due_date: '',
      description: '',
    });
    setEditingInvoice(null);
  };

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : 'Unknown';
  };

  const columns = [
    { header: 'Invoice #', accessor: 'invoice_number' },
    { 
      header: 'Client', 
      render: (row) => getClientName(row.client_id)
    },
    { 
      header: 'Amount', 
      render: (row) => `$${parseFloat(row.amount).toFixed(2)}`
    },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          row.status === 'paid' ? 'bg-green-100 text-green-700' :
          row.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          row.status === 'overdue' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="primary" onClick={() => handleView(row)}>👁️ View</Button>
          <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>✏️ Edit</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>🗑️</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 md:space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 md:p-10 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">💰 Invoices</h1>
            <p className="text-blue-100 text-lg font-medium">Building Care Solutions - {invoices.length} Total Invoices</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all shadow-lg"
          >
            ➕ Create Invoice
          </button>
        </div>
      </div>

      <Card title="" subtitle="" actions={null}>
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
            Error: {error}
          </div>
        )}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          💡 Tip: Double-click any invoice to view details
        </div>
        <Table
          columns={columns}
          data={invoices}
          loading={loading}
          emptyMessage="No invoices found. Create your first invoice to get started."
          onRowDoubleClick={handleView}
        />
      </Card>

      {/* View Modal */}
      {isViewModalOpen && viewingInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setIsViewModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">💰 Invoice Details</h2>
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
                  Invoice #{viewingInvoice.invoice_number}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{getClientName(viewingInvoice.client_id)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">💵 Amount</label>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${parseFloat(viewingInvoice.amount).toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">📊 Status</label>
                  <p className="text-xl font-bold capitalize">{viewingInvoice.status}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">📅 Due Date</label>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(viewingInvoice.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">📆 Created</label>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(viewingInvoice.created_at || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {viewingInvoice.description && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">📝 Description</label>
                  <p className="text-gray-900 dark:text-gray-100">{viewingInvoice.description}</p>
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
        title={editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
      >
        <form onSubmit={handleSubmit}>
          <Select
            label="Client"
            name="client_id"
            value={formData.client_id}
            onChange={handleInputChange}
            required
            options={clients.map((c) => ({ value: c.id, label: c.name }))}
          />
          <Input
            label="Invoice Number"
            name="invoice_number"
            value={formData.invoice_number}
            onChange={handleInputChange}
            required
            placeholder="INV-001"
          />
          <Input
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
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
            label="Due Date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Invoice description or notes"
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
              {editingInvoice ? 'Update' : 'Create'} Invoice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InvoicesView;
