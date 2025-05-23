/**
 * Servicio para manejar cookies de autenticación
 */

export const AUTH_COOKIE_NAME = 'auth-token';

/**
 * Opciones de configuración para la cookie de autenticación
 * @interface CookieOptions
 * @property {boolean} rememberMe - Indica si la sesión debe recordarse por un periodo extendido
 */
interface CookieOptions {
  rememberMe?: boolean;
}

/**
 * Establece la cookie de autenticación enviando el token al endpoint de sesión
 *
 * @param {string} token - Token JWT de autenticación a guardar
 * @param {CookieOptions} [options] - Opciones adicionales para configurar la cookie
 * @returns {Promise<void>} - Promesa que se resuelve cuando la cookie ha sido establecida
 * @throws {Error} - Error si no se puede establecer la cookie
 */
export async function setAuthCookie(token: string, options?: CookieOptions): Promise<void> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        rememberMe: options?.rememberMe || false,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`Failed to set auth cookie: ${data.reason || response.statusText}`);
    }
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    throw error;
  }
}

/**
 * Elimina la cookie de autenticación realizando una solicitud al endpoint de sesión
 *
 * @returns {Promise<void>} - Promesa que se resuelve cuando la cookie ha sido eliminada
 * @throws {Error} - Error si no se puede eliminar la cookie
 */
export async function removeAuthCookie(): Promise<void> {
  try {
    const response = await fetch('/api/auth/session', { method: 'DELETE' });

    if (!response.ok) {
      throw new Error('Failed to remove auth cookie');
    }
  } catch (error) {
    console.error('Error removing auth cookie:', error);
    throw error;
  }
}
