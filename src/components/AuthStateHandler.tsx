'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useHydration } from '@/lib/hooks/useAuth';
import { ROUTES } from '@/lib/constants/routes';
import { Spinner } from '@/components/Spinner';

interface AuthStateHandlerProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
}

/**
 * Componente que maneja el estado de autenticación en páginas de auth
 * Restaura automáticamente el usuario si hay una sesión válida
 */
export function AuthStateHandler({ 
  children, 
  redirectIfAuthenticated = true,
  redirectTo = ROUTES.HOME.PATH 
}: AuthStateHandlerProps) {
  const { user } = useAuth();
  const isHydrated = useHydration();
  const router = useRouter();

  useEffect(() => {
    // Solo redirigir si está hidratado, hay usuario y se debe redirigir
    if (isHydrated && user && redirectIfAuthenticated) {
      router.push(redirectTo);
    }
  }, [isHydrated, user, redirectIfAuthenticated, redirectTo, router]);

  // Mostrar spinner mientras se hidrata o mientras se redirige
  if (!isHydrated || (user && redirectIfAuthenticated)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
} 