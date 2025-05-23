/**
 * Utilidades para gestionar los permisos de usuario en la aplicación.
 */

import type { Permission } from '@/lib/constants/permissions';

/**
 * Verifica si un rol de usuario tiene un permiso específico
 * @param userRole - Rol del usuario
 * @param requiredPermission - Permiso requerido para realizar una acción
 * @returns boolean - Verdadero si tiene el permiso, falso si no
 */
export const hasPermission = (
  authorities: Permission[],
  requiredPermission: Permission
): boolean => {
  return authorities?.includes(requiredPermission) || false;
};

/**
 * Verifica si un rol de usuario tiene al menos uno de los permisos especificados
 * @param userRole - Rol del usuario
 * @param requiredPermissions - Lista de permisos requeridos (cualquiera de ellos)
 * @returns boolean - Verdadero si tiene al menos uno de los permisos, falso si no
 */
export const hasAnyPermission = (
  authorities: Permission[],
  requiredPermissions: Permission[]
): boolean => {
  return requiredPermissions.some((permission) => hasPermission(authorities, permission));
};

/**
 * Verifica si un rol de usuario tiene todos los permisos especificados
 * @param userRole - Rol del usuario
 * @param requiredPermissions - Lista de permisos requeridos (todos ellos)
 * @returns boolean - Verdadero si tiene todos los permisos, falso si no
 */
export const hasAllPermissions = (
  authorities: Permission[],
  requiredPermissions: Permission[]
): boolean => {
  return requiredPermissions.every((permission) => hasPermission(authorities, permission));
};
