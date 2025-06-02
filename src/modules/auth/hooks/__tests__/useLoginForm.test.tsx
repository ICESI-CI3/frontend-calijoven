import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { useLoginForm } from '../useLoginForm';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../../services/auth.service', () => ({
  AuthService: {
    login: jest.fn(),
  },
}));

const mockLogin = jest.fn();
jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: () => false,
    user: null,
  }),
}));

function TestComponent({ onSubmitData }: any) {
  const form = useLoginForm();
  React.useEffect(() => {
    if (onSubmitData) {
      form.onSubmit(onSubmitData);
    }
  }, [onSubmitData, form]);
  
  return (
    <div>
      <span data-testid="isLoading">{String(form.isLoading)}</span>
      <span data-testid="error">{form.error || ''}</span>
      <span data-testid="success">{form.success || ''}</span>
    </div>
  );
}

describe('useLoginForm', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mockSearchParams = { get: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, replace: mockReplace });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    mockSearchParams.get.mockReturnValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debe inicializar el formulario con valores por defecto', () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('isLoading').textContent).toBe('false');
    expect(getByTestId('error').textContent).toBe('');
    expect(getByTestId('success').textContent).toBe('');
  });
}); 