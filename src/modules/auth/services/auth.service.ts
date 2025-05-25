/**
 * Servicio de autenticación
 */
import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import { AuthResponse, LoginFormData, RegisterFormData } from '@/types/auth';
import { User } from '@/types/user';

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
   * @param {boolean} rememberMe - Indica si se debe mantener la sesión por un periodo extendido
   * @returns {Promise<AuthResponse>} - Respuesta con datos de autenticación (token y usuario)
   * @throws {AuthError} - Error si la autenticación falla
   */
  async login(credentials: LoginFormData, rememberMe = false): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post(API_ROUTES.AUTH.LOGIN, {
        ...credentials,
        rememberMe,
      });
      return data;
    } catch (error) {
      console.error('Login failed:', error);
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
    } catch (error) {
      console.error('Registration failed:', error);
      throw new AuthError('No se pudo completar el registro. Intenta nuevamente.');
    }
  },

  /**
   * Cierra la sesión del usuario actual
   *
   * @returns {Promise<void>} - Promesa que se resuelve cuando el logout se completa
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  /**
   * Obtiene información del usuario actualmente autenticado
   *
   * @returns {Promise<User | null>} - Datos del usuario o null si no hay sesión
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data } = await apiClient.get(API_ROUTES.AUTH.ME);
      return data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
};

export default AuthService;
