const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    };
    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },
  get: (endpoint) => apiClient.request(endpoint),
  post: (endpoint, data) => apiClient.request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => apiClient.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => apiClient.request(endpoint, { method: 'DELETE' }),
};

const createCRUDAPI = (resource) => ({
  getAll: () => apiClient.get(`/${resource}`),
  getById: (id) => apiClient.get(`/${resource}/${id}`),
  create: (data) => apiClient.post(`/${resource}`, data),
  update: (id, data) => apiClient.put(`/${resource}/${id}`, data),
  delete: (id) => apiClient.delete(`/${resource}/${id}`),
});

export const clientsAPI = createCRUDAPI('clients');
export const workOrdersAPI = createCRUDAPI('work-orders');
export const invoicesAPI = createCRUDAPI('invoices');
export const employeesAPI = createCRUDAPI('employees');
export const equipmentAPI = createCRUDAPI('equipment');
export const materialsAPI = createCRUDAPI('materials');
export const vendorsAPI = createCRUDAPI('vendors');
export const estimatesAPI = createCRUDAPI('estimates');
export const changeOrdersAPI = createCRUDAPI('change-orders');
export const notesAPI = createCRUDAPI('notes');
export const servicesAPI = createCRUDAPI('services');
export const pricingAPI = createCRUDAPI('pricing');
export const resourcesAPI = createCRUDAPI('resources');
export const lineItemsAPI = createCRUDAPI('line-items');
export const xactimateAPI = createCRUDAPI('xactimate');
export const dryOutJobsAPI = createCRUDAPI('dry-out-jobs');
export const remediationDryoutAPI = createCRUDAPI('remediation-dryout');
export const remediationReconstructionAPI = createCRUDAPI('remediation-reconstruction');
export const jobTrackingAPI = createCRUDAPI('job-tracking');
export const reportsAPI = createCRUDAPI('reports');
export const loggingUtilityAPI = createCRUDAPI('logging-utility');

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: (token) => apiClient.post('/auth/logout', { token }),
  verify: () => apiClient.get('/auth/verify'),
  me: () => apiClient.get('/auth/me'),
  changePassword: (data) => apiClient.post('/auth/change-password', data),
  register: (userData) => apiClient.post('/auth/register', userData),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getRecentTransactions: () => apiClient.get('/dashboard/recent-transactions'),
  getRecentActivity: () => apiClient.get('/dashboard/recent-activity'),
  getRevenueOverview: () => apiClient.get('/dashboard/revenue-overview'),
  getUpcomingInvoices: () => apiClient.get('/dashboard/upcoming-invoices'),
  getRecentPayments: () => apiClient.get('/dashboard/recent-payments'),
  getPastDueInvoices: () => apiClient.get('/dashboard/past-due-invoices'),
};

// Email API
export const emailAPI = {
  getInbox: (limit = 10) => apiClient.get(`/email/inbox?limit=${limit}`),
  sendEmail: (data) => apiClient.post('/email/send', data),
  sendInvoiceEmail: (data) => apiClient.post('/email/send-invoice', data),
  sendPastDueReminder: (data) => apiClient.post('/email/send-past-due-reminder', data),
};

// Messaging API (Bulk SMS and Email)
export const messagingAPI = {
  sendBulkEmail: (data) => apiClient.post('/messaging/bulk-email', data),
  sendBulkSMS: (data) => apiClient.post('/messaging/bulk-sms', data),
  sendBulkMessage: (data) => apiClient.post('/messaging/bulk-message', data),
  getTemplates: () => apiClient.get('/messaging/templates'),
};

// Payments API
export const paymentsAPI = {
  getAll: () => apiClient.get('/payments'),
  getById: (id) => apiClient.get(`/payments/${id}`),
  getByInvoice: (invoiceId) => apiClient.get(`/payments/invoice/${invoiceId}`),
  create: (data) => apiClient.post('/payments', data),
  update: (id, data) => apiClient.put(`/payments/${id}`, data),
  delete: (id) => apiClient.delete(`/payments/${id}`),
};

// Price List API (additional methods beyond CRUD)
export const priceListAPI = {
  ...createCRUDAPI('price-list'),
  search: (query) => apiClient.get(`/price-list/search?q=${encodeURIComponent(query)}`),
};

// Quotes API
export const quotesAPI = createCRUDAPI('quotes');

// Company Settings API
export const companySettingsAPI = {
  get: () => apiClient.get('/company-settings'),
  update: (data) => apiClient.put('/company-settings', data),
};

// Media API
export const mediaAPI = {
  getAll: () => apiClient.get('/media'),
  getById: (id) => apiClient.get(`/media/${id}`),
  upload: async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    const response = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });
    if (!response.ok) throw new Error(`Upload Error: ${response.statusText}`);
    return response.json();
  },
  delete: (id) => apiClient.delete(`/media/${id}`),
};

// Equipment Logs API
export const equipmentLogsAPI = {
  ...createCRUDAPI('equipment-logs'),
  getByWorkOrder: (workOrderId) => apiClient.get(`/equipment-logs/work-order/${workOrderId}`),
  getByEquipment: (equipmentId) => apiClient.get(`/equipment-logs/equipment/${equipmentId}`),
};

// Moisture Logs API
export const moistureLogsAPI = {
  ...createCRUDAPI('moisture-logs'),
  getByJob: (jobId) => apiClient.get(`/moisture-logs/job/${jobId}`),
  getByWorkOrder: (workOrderId) => apiClient.get(`/moisture-logs/work-order/${workOrderId}`),
};

// Stored Items API
export const storedItemsAPI = {
  ...createCRUDAPI('stored-items'),
  getByJob: (jobId) => apiClient.get(`/stored-items/job/${jobId}`),
  getByClient: (clientId) => apiClient.get(`/stored-items/client/${clientId}`),
  getByStatus: (status) => apiClient.get(`/stored-items/status/${status}`),
};

// Certificates API
export const certificatesAPI = {
  ...createCRUDAPI('certificates'),
  getByNumber: (certificateNumber) => apiClient.get(`/certificates/number/${certificateNumber}`),
  getByClient: (clientId) => apiClient.get(`/certificates/client/${clientId}`),
  getByWorkOrder: (workOrderId) => apiClient.get(`/certificates/work-order/${workOrderId}`),
};

// Calendar Events API
export const calendarEventsAPI = {
  ...createCRUDAPI('calendar-events'),
  getByRange: (startDate, endDate) => apiClient.get(`/calendar-events/range/${startDate}/${endDate}`),
  getByClient: (clientId) => apiClient.get(`/calendar-events/client/${clientId}`),
  getByWorkOrder: (workOrderId) => apiClient.get(`/calendar-events/work-order/${workOrderId}`),
  getByAssignee: (employeeId) => apiClient.get(`/calendar-events/assigned/${employeeId}`),
  getUpcoming: () => apiClient.get('/calendar-events/upcoming/all'),
};

// Expenses API
export const expensesAPI = {
  ...createCRUDAPI('expenses'),
  getByNumber: (expenseNumber) => apiClient.get(`/expenses/number/${expenseNumber}`),
  getByWorkOrder: (workOrderId) => apiClient.get(`/expenses/work-order/${workOrderId}`),
  getByVendor: (vendorId) => apiClient.get(`/expenses/vendor/${vendorId}`),
  getByCategory: (category) => apiClient.get(`/expenses/category/${category}`),
  getBillable: () => apiClient.get('/expenses/filter/billable'),
  getReimbursable: () => apiClient.get('/expenses/filter/reimbursable'),
  getUnapproved: () => apiClient.get('/expenses/filter/unapproved'),
};

// Document Templates API
export const documentTemplatesAPI = {
  ...createCRUDAPI('document-templates'),
  getByType: (templateType) => apiClient.get(`/document-templates/type/${templateType}`),
  getDefault: (templateType) => apiClient.get(`/document-templates/default/${templateType}`),
  setDefault: (id) => apiClient.request(`/document-templates/${id}/set-default`, { method: 'PATCH' }),
};

// Uploads API
export const uploadsAPI = {
  getAll: () => apiClient.get('/uploads'),
  getByFilename: (filename) => apiClient.get(`/uploads/${filename}`),
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${API_BASE}/uploads`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
    return response.json();
  },
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const url = `${API_BASE}/uploads/multiple`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
    return response.json();
  },
  delete: (filename) => apiClient.delete(`/uploads/${filename}`),
};

// Print API
export const printAPI = {
  invoice: (invoiceId) => apiClient.post(`/print/invoice/${invoiceId}`),
  estimate: (estimateId) => apiClient.post(`/print/estimate/${estimateId}`),
  download: (filename) => `${API_BASE}/print/download/${filename}`,
};

// Storage & Backup API
export const storageAPI = {
  createBackup: (includeFiles = true) => apiClient.post('/storage/backup', { includeFiles }),
  listBackups: () => apiClient.get('/storage/backups'),
  deleteBackup: (filename) => apiClient.delete(`/storage/backup/${filename}`),
  cleanupBackups: (keepCount = 10) => apiClient.post('/storage/cleanup', { keepCount }),
  getStats: () => apiClient.get('/storage/stats'),
  scheduleBackups: (cronSchedule = '0 2 * * *') => apiClient.post('/storage/schedule-backups', { cronSchedule }),
  exportTable: (tableName) => apiClient.post(`/storage/export/${tableName}`),
  downloadBackup: (filename) => `${API_BASE}/storage/download-backup/${filename}`,
};

export default apiClient;
