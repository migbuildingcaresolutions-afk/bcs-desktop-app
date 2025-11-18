import React, { useState, useEffect } from 'react';
import { materialsAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Select, Card } from '../components';

export const MaterialsView = () => {
  const { items: materials, loading, error, fetchAll, create, update, remove } = useCRUD(materialsAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: 'each',
    unit_price: '',
    quantity_on_hand: '0',
    reorder_level: '10',
    supplier: '',
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
      const materialData = {
        ...formData,
        unit_price: parseFloat(formData.unit_price),
        quantity_on_hand: parseInt(formData.quantity_on_hand),
        reorder_level: parseInt(formData.reorder_level),
      };

      if (editingMaterial) {
        await update(editingMaterial.id, materialData);
      } else {
        await create(materialData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving material:', err);
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name || '',
      description: material.description || '',
      unit: material.unit || 'each',
      unit_price: material.unit_price || '',
      quantity_on_hand: material.quantity_on_hand || '0',
      reorder_level: material.reorder_level || '10',
      supplier: material.supplier || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting material:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      unit: 'each',
      unit_price: '',
      quantity_on_hand: '0',
      reorder_level: '10',
      supplier: '',
    });
    setEditingMaterial(null);
  };

  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity === 0) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>;
    } else if (quantity <= reorderLevel) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Low Stock</span>;
    } else {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>;
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Unit Price',
      render: (row) => `$${parseFloat(row.unit_price || 0).toFixed(2)}`,
    },
    {
      header: 'Quantity',
      render: (row) => `${row.quantity_on_hand || 0} ${row.unit || 'each'}`,
    },
    {
      header: 'Status',
      render: (row) => getStockStatus(row.quantity_on_hand, row.reorder_level),
    },
    { header: 'Supplier', accessor: 'supplier' },
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

  const unitOptions = [
    { value: 'each', label: 'Each' },
    { value: 'box', label: 'Box' },
    { value: 'bag', label: 'Bag' },
    { value: 'gallon', label: 'Gallon' },
    { value: 'foot', label: 'Foot' },
    { value: 'sqft', label: 'Square Foot' },
    { value: 'pound', label: 'Pound' },
  ];

  return (
    <div className="p-6">
      <Card
        title="Materials"
        subtitle={`${materials.length} total materials`}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Add Material
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
          data={materials}
          loading={loading}
          emptyMessage="No materials found. Add your first material to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingMaterial ? 'Edit Material' : 'Add New Material'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Material Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Drywall, Paint, etc."
          />

          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Material description"
          />

          <Select
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            required
            options={unitOptions}
          />

          <Input
            label="Unit Price"
            name="unit_price"
            type="number"
            step="0.01"
            value={formData.unit_price}
            onChange={handleInputChange}
            required
            placeholder="0.00"
          />

          <Input
            label="Quantity on Hand"
            name="quantity_on_hand"
            type="number"
            value={formData.quantity_on_hand}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Reorder Level"
            name="reorder_level"
            type="number"
            value={formData.reorder_level}
            onChange={handleInputChange}
            required
            placeholder="Alert when quantity falls below this level"
          />

          <Input
            label="Supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleInputChange}
            placeholder="Supplier name"
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
              {editingMaterial ? 'Update' : 'Add'} Material
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MaterialsView;
