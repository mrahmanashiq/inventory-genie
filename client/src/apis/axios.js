import axios from "axios";

export const API_CLIENT = axios.create({
  baseURL: process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

// Add authentication token to requests
API_CLIENT.interceptors.request.use(
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

// Handle token expiration
API_CLIENT.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);