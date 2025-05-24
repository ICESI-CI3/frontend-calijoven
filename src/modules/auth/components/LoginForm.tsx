'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Alert } from '@/components/Alert';
import { useLoginForm } from '../hooks/useLoginForm';

export function LoginForm() {
  const { register, errors, isLoading, error, success, onSubmit, rememberMe, setRememberMe } =
    useLoginForm();

  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <div className="space-y-4">
        <Input
          id="email"
          type="email"
          label="Correo electrónico"
          placeholder="correo@ejemplo.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          id="password"
          type="password"
          label="Contraseña"
          placeholder="Tu contraseña"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
            Recordarme
          </label>
        </div>

        <div className="text-sm">
          <Link href="#" className="font-medium text-primary hover:text-primary/90">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      <div>
        <Button type="submit" disabled={isLoading} isLoading={isLoading} className="w-full">
          Iniciar sesión
        </Button>
      </div>
    </form>
  );
}
