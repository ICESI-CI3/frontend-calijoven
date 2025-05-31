'use client';

import type { Permission } from '@/lib/constants/permissions';
import { hasAllPermissions, hasAnyPermission } from '@/lib/helpers/permissionUtils';
import { useAuth } from '@/lib/hooks/useAuth';
import { ReactNode } from 'react';

interface RequireAuthProps {
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Verifica si el usuario tiene los permisos necesarios para ver su contenido.
 * Si no tiene los permisos, muestra un fallback o nada.
 */
export default function RequireAuth({
  permissions = [],
  requireAll = false,
  fallback = null,
  children,
}: RequireAuthProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  if (permissions.length === 0) {
    return <>{children}</>;
  }

  const userPermissions = user.roles || [];
  const hasRequiredPermissions = requireAll
    ? hasAllPermissions(userPermissions, permissions)
    : hasAnyPermission(userPermissions, permissions);

  return <>{hasRequiredPermissions ? children : fallback}</>;
}
