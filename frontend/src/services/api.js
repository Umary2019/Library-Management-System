import axios from 'axios';

const resolveApiConfig = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) {
    return { primary: configuredUrl, fallback: null };
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalDevHost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isVercelHost = hostname.endsWith('.vercel.app');

    if (isLocalDevHost) {
      return { primary: 'http://localhost:5000/api', fallback: null };
    }

    // Supports both monorepo route prefix and same-origin API rewrites.
    if (isVercelHost) {
      return { primary: '/_/backend/api', fallback: '/api' };
    }

    return { primary: '/api', fallback: null };
  }

  return { primary: '/api', fallback: null };
};

const { primary: primaryBaseURL, fallback: fallbackBaseURL } = resolveApiConfig();

const api = axios.create({
  baseURL: primaryBaseURL
});

// Expose chosen endpoints for easier debugging in browser console
try {
  // eslint-disable-next-line no-console
  console.info('[api] primaryBaseURL=', primaryBaseURL, 'fallbackBaseURL=', fallbackBaseURL);
} catch (e) {}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestConfig = error?.config;
    const shouldRetryWithFallback =
      fallbackBaseURL &&
      requestConfig &&
      !requestConfig.__retriedWithFallback &&
      requestConfig.baseURL === primaryBaseURL &&
      (
        !error.response ||
        error.response.status === 404 ||
        // Retry with fallback when the primary returns a server error.
        (error.response.status && error.response.status >= 500)
      );

    if (shouldRetryWithFallback) {
      requestConfig.__retriedWithFallback = true;
      requestConfig.baseURL = fallbackBaseURL;
      try {
        // eslint-disable-next-line no-console
        console.warn('[api] primary failed, retrying with fallback', { url: requestConfig.url, status: error?.response?.status });
      } catch (e) {}
      return api.request(requestConfig);
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;