/**
 * Constantes para gestionar los permisos de usuario en la aplicación.
 */

// Definición de permisos disponibles en la aplicación
export const PERMISSIONS = {
  ADMIN: 'ADMIN',
  MANAGE_PUBLICATION: 'MANAGE_PUBLICATION',
  MANAGE_PQRS: 'MANAGE_PQRS',
  MANAGE_ORGANIZATION: 'MANAGE_ORGANIZATION',
  MANAGE_BANNER: 'MANAGE_BANNER',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
