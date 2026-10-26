import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// Request interceptor: attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('civic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear token
      const currentUrl = window.location.pathname;
      if (currentUrl !== '/login' && currentUrl !== '/register' && currentUrl !== '/') {
        localStorage.removeItem('civic_token');
        localStorage.removeItem('civic_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/profile', data),
};

export const issuesAPI = {
  getAll: (params) => api.get('/issues', { params }),
  getById: (id) => api.get(`/issues/${id}`),
  create: (formData) => api.post('/issues', formData),
  update: (id, formData) => api.patch(`/issues/${id}`, formData),
  delete: (id) => api.delete(`/issues/${id}`),
  support: (id) => api.post(`/issues/${id}/support`),
  removeSupport: (id) => api.delete(`/issues/${id}/support`),
  getMyIssues: (params) => api.get('/users/me/issues', { params }),
};

export const commentsAPI = {
  getByIssue: (issueId) => api.get(`/issues/${issueId}/comments`),
  create: (issueId, content) => api.post(`/issues/${issueId}/comments`, { content }),
  delete: (commentId) => api.delete(`/comments/${commentId}`),
};

export const departmentsAPI = {
  getAll: () => api.get('/departments'),
};

export const dashboardAPI = {
  getCitizenStats: () => api.get('/dashboard/citizen'),
  getAdminStats: () => api.get('/dashboard/admin'),
  getAdminAnalytics: () => api.get('/admin/analytics'),
};

export const adminAPI = {
  getIssues: (params) => api.get('/admin/issues', { params }),
  updateStatus: (id, data) => api.patch(`/admin/issues/${id}/status`, data),
  updateDepartment: (id, data) => api.patch(`/admin/issues/${id}/department`, data),
  createDepartment: (data) => api.post('/admin/departments', data),
  updateDepartmentInfo: (id, data) => api.patch(`/admin/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),
};

export default api;
