/**
 * Client to make HTTP requests to the API
 */
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Configured axios instance to make requests to the API
 */
export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Function to clear the session when it expires
 */
const clearExpiredSession = async () => {
  try {
    await fetch('/api/auth/session', { method: 'DELETE' });

    localStorage.removeItem('auth-user-storage');

    window.location.reload();
  } catch (e) {
    console.error('Error al limpiar sesión expirada:', e);
  }
};

/**
 * Function to restore user from valid session
 */
const restoreUserFromValidSession = async () => {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.valid && data.user) {
        // Actualizar localStorage para que Zustand lo detecte
        const authStorage = {
          state: { user: data.user },
          version: 0,
        };
        localStorage.setItem('auth-user-storage', JSON.stringify(authStorage));
        
        // Disparar evento de storage para que otras pestañas se sincronicen
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'auth-user-storage',
          newValue: JSON.stringify(authStorage),
          oldValue: null,
        }));
      }
    }
  } catch (e) {
    console.error('Error al restaurar usuario desde sesión válida:', e);
  }
};

/**
 * Interceptor to handle API responses and errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      await clearExpiredSession();
    }
    return Promise.reject(error);
  }
);

/**
 * Interceptor to detect expired session headers from the middleware
 */
if (typeof window !== 'undefined') {
  // Interceptor for browser requests (fetch)
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    // Check if the middleware indicates that the session expired
    if (response.headers.get('X-Auth-Status') === 'expired') {
      await clearExpiredSession();
    }
    
    // Check if the middleware indicates that there's a valid session
    if (response.headers.get('X-Auth-Status') === 'valid') {
      await restoreUserFromValidSession();
    }

    return response;
  };
}

export default apiClient;
