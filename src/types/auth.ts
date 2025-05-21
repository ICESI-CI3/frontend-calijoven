import { User } from './user';

export type LoginFormData = {
  email: string;
  password: string;
};

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
