import React, { useState, useEffect } from 'react';
import { vendorsAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Textarea, Card } from '../components';

export const VendorsView = () => {
  const { items: vendors, loading, error, fetchAll, create, update, remove } = useCRUD(vendorsAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    services: '',
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
      if (editingVendor) {
        await update(editingVendor.id, formData);
      } else {
        await create(formData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving vendor:', err);
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name || '',
      contact_person: vendor.contact_person || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      address: vendor.address || '',
      services: vendor.services || '',
      notes: vendor.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting vendor:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      services: '',
      notes: '',
    });
    setEditingVendor(null);
  };

  const columns = [
    { header: 'Company Name', accessor: 'name' },
    { header: 'Contact Person', accessor: 'contact_person' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Services', accessor: 'services' },
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
    <div className="p-6">
      <Card
        title="Vendors"
        subtitle={`${vendors.length} total vendors`}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Add Vendor
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
          data={vendors}
          loading={loading}
          emptyMessage="No vendors found. Add your first vendor to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="ABC Supply Co."
          />

          <Input
            label="Contact Person"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleInputChange}
            placeholder="John Smith"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="contact@vendor.com"
          />

          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            required
            placeholder="(555) 123-4567"
          />

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="123 Industrial Blvd, City, State"
          />

          <Input
            label="Services Provided"
            name="services"
            value={formData.services}
            onChange={handleInputChange}
            placeholder="Plumbing, Electrical, etc."
          />

          <Textarea
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            placeholder="Additional notes about this vendor"
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
              {editingVendor ? 'Update' : 'Add'} Vendor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VendorsView;
