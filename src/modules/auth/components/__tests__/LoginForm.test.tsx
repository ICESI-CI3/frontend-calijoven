import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginForm } from '../LoginForm';
import { useLoginForm } from '../../hooks/useLoginForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import { AuthService } from '../../services/auth.service';
import * as useAuthModule from '@/lib/hooks/useAuth';
import React from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock auth hooks
jest.mock('../../hooks/useLoginForm', () => ({
  useLoginForm: jest.fn(),
}));

// Mock useAuth hook
const mockLogin = jest.fn();
jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: () => false,
    user: null,
  }),
}));

// Mock components
jest.mock('@/components/Button', () => ({
  Button: ({ children, type, disabled, isLoading, className, onClick }: any) => (
    <button
      type={type}
      disabled={disabled}
      className={className}
      onClick={onClick}
      data-testid="login-button"
      data-loading={isLoading}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/Input', () => ({
  Input: ({ id, type, label, placeholder, error, ...props }: any) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...props}
        data-testid={`input-${id}`}
        aria-invalid={!!error}
        aria-errormessage={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} role="alert" data-testid={`error-${id}`}>
          {error}
        </span>
      )}
    </div>
  ),
}));

jest.mock('@/components/Alert', () => ({
  Alert: ({ type, message }: any) => (
    <div role="alert" data-testid={`alert-${type}`}>
      {message}
    </div>
  ),
}));

jest.mock('../../services/auth.service');

describe('LoginForm', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    mockLogin.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders login form with all fields', () => {
    (useLoginForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      errors: {},
      isLoading: false,
      error: null,
      success: null,
      onSubmit: jest.fn(),
    });

    render(<LoginForm />);

    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
  });

  it('shows validation errors when form is submitted with invalid data', async () => {
    const mockErrors = {
      email: { message: 'El correo electrónico es requerido' },
      password: { message: 'La contraseña es requerida' },
    };

    (useLoginForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      errors: mockErrors,
      isLoading: false,
      error: null,
      success: null,
      onSubmit: jest.fn(),
    });

    render(<LoginForm />);

    expect(screen.getByTestId('error-email')).toHaveTextContent('El correo electrónico es requerido');
    expect(screen.getByTestId('error-password')).toHaveTextContent('La contraseña es requerida');
  });

  it('shows error message when login fails', () => {
    const errorMessage = 'Credenciales inválidas';
    (useLoginForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      errors: {},
      isLoading: false,
      error: errorMessage,
      success: null,
      onSubmit: jest.fn(),
    });

    render(<LoginForm />);

    expect(screen.getByTestId('alert-error')).toHaveTextContent(errorMessage);
  });

  it('disables submit button and shows loading state during submission', () => {
    (useLoginForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      errors: {},
      isLoading: true,
      error: null,
      success: null,
      onSubmit: jest.fn(),
    });

    render(<LoginForm />);

    const submitButton = screen.getByTestId('login-button');
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('data-loading', 'true');
  });

  it('handles form submission', async () => {
    const mockOnSubmit = jest.fn();
    const mockRegister = jest.fn((field: string) => ({
      onChange: (e: any) => {},
      value: '',
      name: field,
    }));

    (useLoginForm as jest.Mock).mockReturnValue({
      register: mockRegister,
      errors: {},
      isLoading: false,
      error: null,
      success: null,
      onSubmit: mockOnSubmit,
    });

    render(<LoginForm />);

    const form = screen.getByTestId('login-form');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
}); 