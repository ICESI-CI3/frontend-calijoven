/**
 * Constantes para gestionar los permisos de usuario en la aplicación.
 */

// Definición de permisos disponibles en la aplicación
export const PERMISSIONS = {
  MANAGE_PUBLICATION: 'MANAGE_PUBLICATION',
  MANAGE_PQRS: 'MANAGE_PQRS',
  MANAGE_ORGANIZATION: 'MANAGE_ORGANIZATION',
  MANAGE_BANNER: 'MANAGE_BANNER',
} as const;

// Definición de roles de usuario
export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  PDJ: 'PDJ', // Personero delegado para la juventud
  CDJ: 'CDJ', // Consejero de juventud
} as const;

// Define los tipos basados en los valores de las constantes
export type Role = (typeof ROLES)[keyof typeof ROLES];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Asignación de permisos a roles
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.USER]: [],
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_PUBLICATION,
    PERMISSIONS.MANAGE_PQRS,
    PERMISSIONS.MANAGE_ORGANIZATION,
    PERMISSIONS.MANAGE_BANNER,
  ],
  [ROLES.PDJ]: [PERMISSIONS.MANAGE_PUBLICATION, PERMISSIONS.MANAGE_PQRS],
  [ROLES.CDJ]: [PERMISSIONS.MANAGE_PUBLICATION, PERMISSIONS.MANAGE_ORGANIZATION],
};
