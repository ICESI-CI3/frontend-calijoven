import { z } from 'zod';
import { User } from './user';

// Validación para el formulario de login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingrese un correo electrónico válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  city: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
