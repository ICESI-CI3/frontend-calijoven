import { validateRegisterFormData } from '../authValidation';
import type { BaseCity } from '@/types/city';

describe('validateRegisterFormData', () => {
  const mockCity: BaseCity = {
    id: '1',
    name: 'Test City'
  };

  it('should return no errors for valid form data', () => {
    const validFormData = {
      nombres: 'John Doe',
      correo: 'test@example.com',
      password: 'Test123!@#',
      acceptTerms: true
    };

    const result = validateRegisterFormData(validFormData, mockCity);

    expect(result.formError).toBeNull();
    expect(result.passwordError).toBeUndefined();
  });

  it('should return form error when required fields are missing', () => {
    const invalidFormData = {
      nombres: '',
      correo: '',
      password: '',
      acceptTerms: false
    };

    const result = validateRegisterFormData(invalidFormData, null);

    expect(result.formError).toBe('Por favor, completa todos los campos obligatorios y acepta los términos y condiciones.');
    expect(result.passwordError).toBeUndefined();
  });

  it('should return password error when password does not meet requirements', () => {
    const formData = {
      nombres: 'John Doe',
      correo: 'test@example.com',
      password: 'weak',
      acceptTerms: true
    };

    const result = validateRegisterFormData(formData, mockCity);

    expect(result.formError).toBeNull();
    expect(result.passwordError).toContain('La contraseña debe contener:');
    expect(result.passwordError).toContain('al menos 8 caracteres');
    expect(result.passwordError).toContain('al menos 1 símbolo');
    expect(result.passwordError).toContain('al menos 1 número');
    expect(result.passwordError).toContain('al menos 1 letra mayúscula');
  });

  it('should return form error when city is not selected', () => {
    const formData = {
      nombres: 'John Doe',
      correo: 'test@example.com',
      password: 'Test123!@#',
      acceptTerms: true
    };

    const result = validateRegisterFormData(formData, null);

    expect(result.formError).toBe('Por favor, completa todos los campos obligatorios y acepta los términos y condiciones.');
    expect(result.passwordError).toBeUndefined();
  });

  it('should return form error when terms are not accepted', () => {
    const formData = {
      nombres: 'John Doe',
      correo: 'test@example.com',
      password: 'Test123!@#',
      acceptTerms: false
    };

    const result = validateRegisterFormData(formData, mockCity);

    expect(result.formError).toBe('Por favor, completa todos los campos obligatorios y acepta los términos y condiciones.');
    expect(result.passwordError).toBeUndefined();
  });
}); 