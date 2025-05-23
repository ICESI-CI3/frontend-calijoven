/**
 * Cliente para realizar peticiones HTTP a la API
 */
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Instancia configurada de axios para realizar peticiones a la API
 */
export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Interceptor para manejar respuestas y errores de la API
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      try {
        await fetch('/api/auth/session', { method: 'DELETE' });
        localStorage.removeItem('auth-user-storage');
        window.location.href = '/login';
      } catch (e) {
        console.error('Error al cerrar sesión:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
