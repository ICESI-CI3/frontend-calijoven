'use client';

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, useHydration, useTokenValidator, useAuthSync } from '@/lib/hooks/useAuth';
import { hasPermissionForRoute, isAuthRoute, isPublicRoute, ROUTES } from '@/lib/constants/routes';
import { Spinner } from '@/components/Spinner';

interface GlobalAuthGuardProps {
  children: ReactNode;
}

export function GlobalAuthGuard({ children }: GlobalAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHydrated = useHydration();
  const user = useAuth((state) => state.user);
  const isAuthenticated = useAuth((state) => state.isAuthenticated());

  useAuthSync();
  useTokenValidator();

  const isPublic = isPublicRoute(pathname);
  const isAuth = isAuthRoute(pathname);

  if (isPublic && !isAuth) {
    return <>{children}</>;
  }

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="page-loading">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuth) {
    if (isAuthenticated) {
      router.replace(ROUTES.HOME.PATH);
      return null;
    }

    return <>{children}</>;
  }

  if (!isAuthenticated) {
    const loginUrl = `${ROUTES.AUTH.LOGIN.PATH}?callbackUrl=${encodeURIComponent(pathname)}`;
    router.replace(loginUrl);
    return null;
  }

  const userPermissions = user?.roles || [];
  if (!hasPermissionForRoute(pathname, userPermissions)) {
    router.replace(ROUTES.HOME.PATH);
    return null;
  }

  return <>{children}</>;
}
