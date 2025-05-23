'use client';

import Link from 'next/link';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { ROUTES } from '@/lib/constants/routes';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Link href={ROUTES.REGISTER} className="font-medium text-primary hover:text-primary/90">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
