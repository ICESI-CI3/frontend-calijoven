/**
 * Client to make HTTP requests to the API
 */
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://34.139.3.80:4000';

/**
 * Configured axios instance to make requests to the API
 */
export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add Authorization header with token from localStorage
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle API responses and errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);

    // Handle 401 errors (unauthorized/expired token)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      useAuth.getState().clearAuth();
      window.location.href = ROUTES.AUTH.LOGIN.PATH;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
