'use client';

import { ReactNode } from 'react';
import { useAuth, useHydration } from '@/lib/hooks/useAuth';
import type { Permission } from '@/lib/constants/permissions';
import { hasAnyPermission, hasAllPermissions } from '@/lib/helpers/permissionUtils';
import { Spinner } from '@/components/Spinner';

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
  const isHydrated = useHydration();

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

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
