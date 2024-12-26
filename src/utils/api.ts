// src/utils/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/auth/signin';
          break;
        case 403:
          // Forbidden - redirect to unauthorized page or show message
          console.error('Forbidden access:', error.response.data);
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signin: (data: { email: string; password: string }) =>
    apiClient.post('/auth/signin', data),
  
  signup: (data: { name: string; email: string; password: string }) =>
    apiClient.post('/auth/signup', data),
  
  getCurrentUser: () => 
    apiClient.get('/me'),
  
  updateProfile: (data: { name: string; profile_image_url: string }) =>
    apiClient.put('/users/profile', data),
  
  updatePassword: (data: { password: string; new_password: string }) =>
    apiClient.put('/users/password', data),
};

// Users API (Admin)
export const usersAPI = {
  getUsers: () => 
    apiClient.get('/users'),
  
  updateUserRole: (userId: string, role: string) =>
    apiClient.put(`/users/${userId}/role`, { role }),
  
  deleteUser: (userId: string) =>
    apiClient.delete(`/users/${userId}`),
  
  addUser: (data: { name: string; email: string; password: string; role?: string }) =>
    apiClient.post('/users', data),
};

export default apiClient;