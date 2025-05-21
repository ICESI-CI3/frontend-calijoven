/**
 * Utilidades para gestionar los permisos de usuario en la aplicación.
 * Este archivo contiene funciones helper para verificar permisos basados en roles.
 */

import { ROLE_PERMISSIONS } from '@/lib/constants/permissions';
import type { Role, Permission } from '@/lib/constants/permissions';

/**
 * Verifica si un rol de usuario tiene un permiso específico
 * @param userRole - Rol del usuario
 * @param requiredPermission - Permiso requerido para realizar una acción
 * @returns boolean - Verdadero si tiene el permiso, falso si no
 */
export const hasPermission = (userRole: Role, requiredPermission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(requiredPermission) || false;
};

/**
 * Verifica si un rol de usuario tiene al menos uno de los permisos especificados
 * @param userRole - Rol del usuario
 * @param requiredPermissions - Lista de permisos requeridos (cualquiera de ellos)
 * @returns boolean - Verdadero si tiene al menos uno de los permisos, falso si no
 */
export const hasAnyPermission = (userRole: Role, requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.some((permission) => hasPermission(userRole, permission));
};

/**
 * Verifica si un rol de usuario tiene todos los permisos especificados
 * @param userRole - Rol del usuario
 * @param requiredPermissions - Lista de permisos requeridos (todos ellos)
 * @returns boolean - Verdadero si tiene todos los permisos, falso si no
 */
export const hasAllPermissions = (userRole: Role, requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.every((permission) => hasPermission(userRole, permission));
};
