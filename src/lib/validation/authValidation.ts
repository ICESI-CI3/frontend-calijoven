import type { BaseCity } from '@/types/city';

interface RegisterFormErrors {
  formError: string | null;
  passwordError: string | undefined;
}

export function validateRegisterFormData(
  formData: { nombres: string; correo: string; password: string; acceptTerms: boolean },
  selectedCity: BaseCity | null
): RegisterFormErrors {
  const errors: RegisterFormErrors = {
    formError: null,
    passwordError: undefined,
  };

  // Validar campos obligatorios
  if (!formData.nombres || !formData.correo || !formData.password || selectedCity === null || !formData.acceptTerms) {
    errors.formError = 'Por favor, completa todos los campos obligatorios y acepta los términos y condiciones.';
  }

  // Validar contraseña (solo si no hay error de campos obligatorios para no duplicar mensajes principales)
  if (formData.password) { // Solo validamos si hay password para evitar mensaje de password vacio si el error principal ya existe
      const password = formData.password;
      const passwordErrors = [];

      if (password.length < 8) {
          passwordErrors.push('al menos 8 caracteres');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/g.test(password)) {
          passwordErrors.push('al menos 1 símbolo');
      }
      if (!/[0-9]/g.test(password)) {
          passwordErrors.push('al menos 1 número');
      }
      if (!/[a-z]/g.test(password)) {
          passwordErrors.push('al menos 1 letra minúscula');
      }
      if (!/[A-Z]/g.test(password)) {
          passwordErrors.push('al menos 1 letra mayúscula');
      }

      if (passwordErrors.length > 0) {
          errors.passwordError = 'La contraseña debe contener: ' + passwordErrors.join(', ') + '.';
      }
  }


  return errors;
} 