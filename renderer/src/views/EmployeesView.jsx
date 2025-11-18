import React, { useState, useEffect } from 'react';
import { employeesAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Select, Card } from '../components';

export const EmployeesView = () => {
  const { items: employees, loading, error, fetchAll, create, update, remove } = useCRUD(employeesAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    hire_date: '',
    hourly_rate: '',
    status: 'active',
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
      const employeeData = {
        ...formData,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
      };

      if (editingEmployee) {
        await update(editingEmployee.id, employeeData);
      } else {
        await create(employeeData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving employee:', err);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      position: employee.position || '',
      hire_date: employee.hire_date || '',
      hourly_rate: employee.hourly_rate || '',
      status: employee.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting employee:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      hire_date: '',
      hourly_rate: '',
      status: 'active',
    });
    setEditingEmployee(null);
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      on_leave: 'bg-yellow-100 text-yellow-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.active}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Position', accessor: 'position' },
    {
      header: 'Hourly Rate',
      render: (row) => row.hourly_rate ? `$${parseFloat(row.hourly_rate).toFixed(2)}` : 'N/A',
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
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on_leave', label: 'On Leave' },
  ];

  return (
    <div className="p-6">
      <Card
        title="Employees"
        subtitle={`${employees.length} total employees`}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            Add Employee
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
          data={employees}
          loading={loading}
          emptyMessage="No employees found. Add your first employee to get started."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="John Smith"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="john@example.com"
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
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
            placeholder="Technician, Supervisor, etc."
          />

          <Input
            label="Hire Date"
            name="hire_date"
            type="date"
            value={formData.hire_date}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Hourly Rate"
            name="hourly_rate"
            type="number"
            step="0.01"
            value={formData.hourly_rate}
            onChange={handleInputChange}
            placeholder="25.00"
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            options={statusOptions}
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
              {editingEmployee ? 'Update' : 'Add'} Employee
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeesView;
