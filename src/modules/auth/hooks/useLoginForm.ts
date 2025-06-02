/**
 * Hook personalizado que maneja la lógica del formulario de inicio de sesión
 */
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/hooks/useAuth';
import { AuthService } from '@/modules/auth/services/auth.service';
import { ROUTES } from '@/lib/constants/routes';
import { loginSchema, LoginFormData } from '@/types/auth';

/**
 * Hook que encapsula la lógica del formulario de inicio de sesión
 *
 * @returns {Object} Objeto con propiedades y métodos para controlar el formulario de login
 */
export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Maneja el envío del formulario de inicio de sesión
   *
   * @param {LoginFormData} formData - Datos del formulario de login (email y password)
   */
  const onSubmit = async (formData: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const authData = await AuthService.login(formData);

      if (!authData.token) {
        throw new Error('No se recibió token de autenticación');
      }

      auth.login(authData.user, authData.token);
      setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');

      // Get callback URL from query params or default to home
      const callbackUrl = searchParams.get('callbackUrl') || ROUTES.HOME.PATH;

      // Wait 1.5 seconds to show success message before redirecting
      setTimeout(() => {
        router.push(callbackUrl);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register: form.register,
    errors: form.formState.errors,
    isLoading,
    error,
    success,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
