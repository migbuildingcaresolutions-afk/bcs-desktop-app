import React, { useState, useEffect } from 'react';
import { loggingUtilityAPI } from '../api-client';
import { useCRUD } from '../hooks/useAPI';
import { Table, Button, Modal, Input, Select, Card, Textarea } from '../components';

export const LoggingUtilityView = () => {
  const { items: logs, loading, error, fetchAll, create, update, remove } = useCRUD(loggingUtilityAPI);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [formData, setFormData] = useState({
    level: 'info',
    source: '',
    message: '',
    context: '',
    user_id: '',
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
      const logData = {
        ...formData,
        user_id: formData.user_id ? parseInt(formData.user_id) : null,
      };

      if (editingLog) {
        await update(editingLog.id, logData);
      } else {
        await create(logData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('Error saving log entry:', err);
    }
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setFormData({
      level: log.level || 'info',
      source: log.source || '',
      message: log.message || '',
      context: log.context || '',
      user_id: log.user_id || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this log entry?')) {
      try {
        await remove(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting log entry:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      level: 'info',
      source: '',
      message: '',
      context: '',
      user_id: '',
    });
    setEditingLog(null);
  };

  const getLevelBadge = (level) => {
    const colors = {
      debug: 'bg-gray-100 text-gray-800',
      info: 'bg-blue-100 text-blue-800',
      warn: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      fatal: 'bg-red-600 text-white',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level] || colors.info}`}>
        {level.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const columns = [
    {
      header: 'Timestamp',
      render: (row) => formatDate(row.created_at),
    },
    {
      header: 'Level',
      render: (row) => getLevelBadge(row.level),
    },
    { header: 'Source', accessor: 'source' },
    { header: 'Message', accessor: 'message' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>
            View
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const logLevelOptions = [
    { value: 'debug', label: 'Debug' },
    { value: 'info', label: 'Info' },
    { value: 'warn', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'fatal', label: 'Fatal' },
  ];

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `logs_export_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl shadow-xl p-8 md:p-10 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">Logging Utility</h1>
            <p className="text-gray-300 text-lg font-medium leading-relaxed">Building Care Solutions - {logs.length} Log Entries</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportLogs}
              className="px-6 py-3 bg-gray-600 text-white hover:bg-gray-500 rounded-lg font-semibold transition-all shadow-lg"
            >
              Export Logs
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-white text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-all shadow-lg"
            >
              Add Log Entry
            </button>
          </div>
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
          data={logs}
          loading={loading}
          emptyMessage="No log entries found. System logs will appear here."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingLog ? 'View Log Entry' : 'Add New Log Entry'}
      >
        <form onSubmit={handleSubmit}>
          <Select
            label="Log Level"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            required
            options={logLevelOptions}
          />

          <Input
            label="Source"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            placeholder="e.g., API, Database, Frontend"
          />

          <Textarea
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            placeholder="Log message"
            rows={3}
          />

          <Textarea
            label="Context (JSON)"
            name="context"
            value={formData.context}
            onChange={handleInputChange}
            placeholder='{"user": "john@example.com", "action": "login"}'
            rows={3}
          />

          <Input
            label="User ID"
            name="user_id"
            type="number"
            value={formData.user_id}
            onChange={handleInputChange}
            placeholder="Associated user ID"
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
              {editingLog ? 'Close' : 'Create'} Log Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LoggingUtilityView;
