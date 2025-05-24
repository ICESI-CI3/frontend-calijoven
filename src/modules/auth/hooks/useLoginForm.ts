/**
 * Hook personalizado que maneja la lógica del formulario de inicio de sesión
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/hooks/useAuth';
import { AuthService } from '@/services/auth.service';
import { ROUTES } from '@/lib/constants/routes';
import { loginSchema, LoginFormData } from '@/types/auth';

/**
 * Hook que encapsula la lógica del formulario de inicio de sesión
 *
 * @returns {Object} Objeto con propiedades y métodos para controlar el formulario de login
 */
export function useLoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

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
      const authData = await AuthService.login(formData, rememberMe);

      if (!authData.token) {
        throw new Error('No se recibió token de autenticación');
      }

      await auth.login(authData.user, authData.token, rememberMe);
      setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');

      // Esperar 1.5 segundos para mostrar el mensaje de éxito antes de redirigir
      setTimeout(() => {
        router.push(ROUTES.DASHBOARD);
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
    rememberMe,
    setRememberMe,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
