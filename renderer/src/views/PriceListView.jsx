import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Table, Input, Select } from "../components";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const PriceListView = () => {
  const [priceList, setPriceList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [formData, setFormData] = useState({
    xactimate_code: "",
    item_name: "",
    category: "",
    description: "",
    unit: "EA",
    unit_price: "",
    labor_hours: "",
    material_cost: "",
    equipment_cost: "",
    tax_rate: "",
    notes: "",
    is_active: 1,
  });

  // Load price list + categories
  useEffect(() => {
    fetchPriceList();
    fetchCategories();
  }, [searchTerm, selectedCategory]);

  const fetchPriceList = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/price-list?active=true`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;

      const response = await fetch(url);
      const data = await response.json();
      setPriceList(data);
    } catch (error) {
      console.error("Error fetching price list:", error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/price-list/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingItem
        ? `${API_BASE}/price-list/${editingItem.id}`
        : `${API_BASE}/price-list`;

      const response = await fetch(url, {
        method: editingItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // ← FIXES THE BROKEN “å”
      });

      if (response.ok) {
        fetchPriceList();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving price list item:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      xactimate_code: item.xactimate_code || "",
      item_name: item.item_name || "",
      category: item.category || "",
      description: item.description || "",
      unit: item.unit || "EA",
      unit_price: item.unit_price || "",
      labor_hours: item.labor_hours || "",
      material_cost: item.material_cost || "",
      equipment_cost: item.equipment_cost || "",
      tax_rate: item.tax_rate || "",
      notes: item.notes || "",
      is_active: item.is_active || 1,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`${API_BASE}/price-list/${id}`, {
        method: "DELETE",
      });

      if (response.ok) fetchPriceList();
    } catch (error) {
      console.error("Error deleting price list item:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      xactimate_code: "",
      item_name: "",
      category: "",
      description: "",
      unit: "EA",
      unit_price: "",
      labor_hours: "",
      material_cost: "",
      equipment_cost: "",
      tax_rate: "",
      notes: "",
      is_active: 1,
    });
    setEditingItem(null);
  };

  // 🟦 NEW: Columns matching your Table.jsx EXACTLY
  const columns = [
    {
      header: "Code",
      accessor: "xactimate_code",
    },
    {
      header: "Item Name",
      accessor: "item_name",
    },
    {
      header: "Category",
      accessor: "category",
    },
    {
      header: "Description",
      accessor: "description",
    },
    {
      header: "Unit",
      accessor: "unit",
    },
    {
      header: "Unit Price",
      accessor: "unit_price",
      render: (item) => `$${Number(item.unit_price).toFixed(2)}`,
    },
    {
      header: "Labor Hrs",
      accessor: "labor_hours",
      render: (item) => Number(item.labor_hours).toFixed(2),
    },
    {
      header: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Price Database"
        subtitle={`${priceList.length} items`}
        actions={
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Add Price Item
          </Button>
        }
      >
        {/* Search + Filter */}
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search by code, name, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-64"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>

        {/* TABLE */}
        <Table columns={columns} data={priceList} loading={loading} />
      </Card>

      {/* MODAL FORM */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingItem ? "Edit Price Item" : "Add Price Item"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Xactimate Code"
              value={formData.xactimate_code}
              onChange={(e) =>
                setFormData({ ...formData, xactimate_code: e.target.value })
              }
            />

            <Input
              label="Item Name"
              value={formData.item_name}
              onChange={(e) =>
                setFormData({ ...formData, item_name: e.target.value })
              }
              required
            />

            <Input
              label="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            />

            <Select
              label="Unit"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
            >
              <option value="EA">Each (EA)</option>
              <option value="SF">Square Foot (SF)</option>
              <option value="LF">Linear Foot (LF)</option>
              <option value="SQ">Square (100 SF)</option>
              <option value="CY">Cubic Yard (CY)</option>
              <option value="HR">Hour (HR)</option>
              <option value="DAY">Day</option>
            </Select>

            <Input
              label="Unit Price"
              type="number"
              step="0.01"
              value={formData.unit_price}
              onChange={(e) =>
                setFormData({ ...formData, unit_price: e.target.value })
              }
              required
            />

            <Input
              label="Labor Hours"
              type="number"
              step="0.01"
              value={formData.labor_hours}
              onChange={(e) =>
                setFormData({ ...formData, labor_hours: e.target.value })
              }
            />

            <Input
              label="Material Cost"
              type="number"
              step="0.01"
              value={formData.material_cost}
              onChange={(e) =>
                setFormData({ ...formData, material_cost: e.target.value })
              }
            />

            <Input
              label="Equipment Cost"
              type="number"
              step="0.01"
              value={formData.equipment_cost}
              onChange={(e) =>
                setFormData({ ...formData, equipment_cost: e.target.value })
              }
            />

            <div className="col-span-2">
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <Input
                label="Notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>

            <Button type="submit">
              {editingItem ? "Update" : "Create"} Price Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PriceListView;
