import axios from 'axios';

const resolveApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) {
    return configuredUrl;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalDevHost = hostname === 'localhost' || hostname === '127.0.0.1';

    if (isLocalDevHost) {
      return 'http://localhost:5000/api';
    }

    // For deployed builds without VITE_API_URL, use same-origin API routes.
    return '/api';
  }

  return '/api';
};

const api = axios.create({
  baseURL: resolveApiBaseUrl()
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
