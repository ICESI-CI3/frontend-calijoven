/**
 * Servicio de autenticación
 */
import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import { AuthResponse, LoginFormData, RegisterFormData } from '@/types/auth';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Servicio que encapsula la lógica de autenticación con el backend
 */
export const AuthService = {
  /**
   * Inicia sesión de un usuario
   *
   * @param {LoginFormData} credentials - Credenciales del usuario (email y contraseña)
   * @returns {Promise<AuthResponse>} - Respuesta con datos de autenticación (token y usuario)
   * @throws {AuthError} - Error si la autenticación falla
   */
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🔐 Iniciando proceso de login para email: ${credentials.email}`);

    try {
      console.log(`[${timestamp}] 📡 Enviando petición de login a ${API_ROUTES.AUTH.LOGIN}`);
      const { data } = await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);

      console.log(`[${timestamp}] ✅ Login exitoso para usuario: ${data.user?.email || 'N/A'}`);
      console.log(`[${timestamp}] 🔑 Token recibido: ${data.token ? 'Sí' : 'No'}`);

      return data;
    } catch (error) {
      console.error('Login failed:', error);

      // Log adicional para seguimiento
      console.log(`[${new Date().toISOString()}] ❌ Intento de login fallido:`, {
        email: credentials.email,
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new AuthError('No se pudo iniciar sesión. Verifica tus credenciales.');
    }
  },

  /**
   * Registra un nuevo usuario
   *
   * @param {RegisterFormData} userData - Datos del usuario para registro
   * @returns {Promise<AuthResponse>} - Respuesta con datos de autenticación del usuario registrado
   * @throws {AuthError} - Error si el registro falla
   */
  async register(userData: RegisterFormData): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post(API_ROUTES.AUTH.REGISTER, userData);
      return data;
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Registration failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new AuthError(error.response.data.message);
      } else if (error.message) {
        throw new AuthError('Registration failed: ' + error.message);
      } else {
        throw new AuthError('No se pudo completar el registro. Intenta nuevamente.');
      }
    }
  },
};

export default AuthService;
