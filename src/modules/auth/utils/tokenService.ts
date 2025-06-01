import { Permission } from '../../../lib/constants/permissions';

/**
 * Interfaz para el payload decodificado de un token JWT
 * @interface DecodedToken
 * @property {string} [sub] - Sujeto del token
 * @property {string} [email] - Correo electrónico del usuario
 * @property {string} [id] - Identificador del usuario
 * @property {Permission[]} [authorities] - Lista de permisos asignados al usuario
 * @property {number} [exp] - Timestamp de expiración del token (en segundos)
 * @property {number} [iat] - Timestamp de emisión del token (en segundos)
 */
export interface DecodedToken {
  sub?: string;
  email?: string;
  id?: string;
  authorities?: Permission[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Extrae el payload de un token JWT sin verificar la firma.
 *
 * @param {string | undefined} token - Token JWT a decodificar
 * @returns {DecodedToken | null} - Payload decodificado o null si hay error
 */
export function extractTokenPayload(token: string | undefined): DecodedToken | null {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64Payload = parts[1];
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());

    return payload;
  } catch (error) {
    console.error('Error al extraer el payload del token:', error);
    return null;
  }
}

/**
 * Verifica si un token ha expirado basado en su payload.
 *
 * @param {DecodedToken | null} token - Payload del token a verificar
 * @returns {boolean} - Verdadero si el token ha expirado, falso en caso contrario
 */
export function isTokenExpired(token: DecodedToken | null): boolean {
  if (!token) return true;

  // Si tiene fecha de expiración, usarla
  if (token.exp) {
    return Math.floor(Date.now() / 1000) > token.exp;
  }

  // Si tiene fecha de emisión, asumir 24h de validez
  if (token.iat) {
    return Math.floor(Date.now() / 1000) - token.iat > 86400; // 24h
  }

  return process.env.NODE_ENV === 'production';
}

/**
 * Valida un token JWT verificando su estructura y expiración
 *
 * @param {string | undefined} token - Token JWT a validar
 * @returns {boolean} - Verdadero si el token es válido, falso en caso contrario
 */
export function validateToken(token: string | undefined): boolean {
  if (!token) return false;

  const payload = extractTokenPayload(token);

  if (!payload) return false;
  if (isTokenExpired(payload)) return false;

  return true;
}

/**
 * Obtiene los segundos restantes hasta la expiración de un token
 *
 * @param {string} token - Token JWT del cual calcular el tiempo restante
 * @returns {number} - Segundos restantes hasta la expiración del token
 */
export function getTokenExpirySeconds(token: string): number {
  const payload = extractTokenPayload(token);

  if (!payload || !payload.exp) return 3600; // 1 hora por defecto

  const now = Math.floor(Date.now() / 1000);
  return Math.max(payload.exp - now, 0);
}

/**
 * Verifica si un identificador de usuario existe en el token
 *
 * @param {DecodedToken | null} payload - Payload del token a verificar
 * @returns {boolean} - Verdadero si existe algún identificador de usuario, falso en caso contrario
 */
export function hasUserIdentifier(payload: DecodedToken | null): boolean {
  if (!payload) return false;
  return Boolean(payload.sub || payload.email || payload.id);
}

/**
 * Almacena el token JWT en localStorage
 * @param {string} token - Token JWT a almacenar
 */
export function setTokenInStorage(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth-token', token);
  }
}

/**
 * Obtiene el token JWT desde localStorage
 * @returns {string | null} Token JWT o null si no existe
 */
export function getTokenFromStorage(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth-token');
  }
  return null;
}

/**
 * Elimina el token JWT de localStorage
 */
export function removeTokenFromStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-token');
  }
}

/**
 * Verifica si existe un token válido en localStorage
 * @returns {boolean} True si existe un token válido, false en caso contrario
 */
export function hasValidTokenInStorage(): boolean {
  const token = getTokenFromStorage();
  return validateToken(token || undefined);
}
