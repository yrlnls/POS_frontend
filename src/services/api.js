import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5555';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
};

// Customers API
export const customersAPI = {
  getAll: (params = {}) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (customerData) => api.post('/customers', customerData),
  update: (id, customerData) => api.put(`/customers/${id}`, customerData),
  delete: (id) => api.delete(`/customers/${id}`),
  search: (query) => api.get(`/customers/search?q=${query}`),
  getServiceHistory: (id) => api.get(`/customers/${id}/services`),
  updateStatus: (id, status) => api.patch(`/customers/${id}/status`, { status }),
};

// Service Plans API
export const servicePlansAPI = {
  getAll: () => api.get('/service-plans'),
  getById: (id) => api.get(`/service-plans/${id}`),
  create: (planData) => api.post('/service-plans', planData),
  update: (id, planData) => api.put(`/service-plans/${id}`, planData),
  delete: (id) => api.delete(`/service-plans/${id}`),
};

// Transactions API
export const transactionsAPI = {
  getAll: (params = {}) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (transactionData) => api.post('/transactions', transactionData),
  update: (id, transactionData) => api.put(`/transactions/${id}`, transactionData),
  getByCustomer: (customerId) => api.get(`/transactions/customer/${customerId}`),
  processPayment: (paymentData) => api.post('/transactions/payment', paymentData),
};

// Tickets API
export const ticketsAPI = {
  getAll: (params = {}) => api.get('/tickets', { params }),
  getById: (id) => api.get(`/tickets/${id}`),
  create: (ticketData) => api.post('/tickets', ticketData),
  update: (id, ticketData) => api.put(`/tickets/${id}`, ticketData),
  delete: (id) => api.delete(`/tickets/${id}`),
  updateStatus: (id, status) => api.patch(`/tickets/${id}/status`, { status }),
  assignTechnician: (id, technicianId) => api.patch(`/tickets/${id}/assign`, { technicianId }),
  getByCustomer: (customerId) => api.get(`/tickets/customer/${customerId}`),
};

// Equipment API
export const equipmentAPI = {
  getAll: (params = {}) => api.get('/equipment', { params }),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (equipmentData) => api.post('/equipment', equipmentData),
  update: (id, equipmentData) => api.put(`/equipment/${id}`, equipmentData),
  delete: (id) => api.delete(`/equipment/${id}`),
  updateStock: (id, quantity) => api.patch(`/equipment/${id}/stock`, { quantity }),
};

// Dashboard/Analytics API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getSalesData: (period = '6months') => api.get(`/dashboard/sales?period=${period}`),
  getRevenueData: (period = '6months') => api.get(`/dashboard/revenue?period=${period}`),
  getCustomerGrowth: (period = '6months') => api.get(`/dashboard/customer-growth?period=${period}`),
  getTicketStats: () => api.get('/dashboard/tickets'),
  getNetworkStatus: () => api.get('/dashboard/network-status'),
};

// Reports API
export const reportsAPI = {
  getSalesReport: (params) => api.get('/reports/sales', { params }),
  getCustomerReport: (params) => api.get('/reports/customers', { params }),
  getRevenueReport: (params) => api.get('/reports/revenue', { params }),
  getTicketReport: (params) => api.get('/reports/tickets', { params }),
  exportReport: (type, params) => api.get(`/reports/export/${type}`, { params, responseType: 'blob' }),
};

export default api;