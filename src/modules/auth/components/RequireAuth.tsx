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
  loader?: ReactNode;
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
  loader = <Spinner />,
  children,
}: RequireAuthProps) {
  const isHydrated = useHydration();
  const user = useAuth((state) => state.user);
  const isAuthenticated = useAuth((state) => state.isAuthenticated());

  if (!isHydrated) {
    return loader;
  }

  if (!isAuthenticated) {
    return fallback;
  }

  if (permissions.length > 0 && user?.roles) {
    const hasPermission = requireAll
      ? hasAllPermissions(user.roles, permissions)
      : hasAnyPermission(user.roles, permissions);

    if (!hasPermission) {
      return fallback;
    }
  }

  return <>{children}</>;
}
