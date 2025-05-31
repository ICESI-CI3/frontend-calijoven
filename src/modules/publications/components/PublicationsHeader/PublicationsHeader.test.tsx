import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PublicationsHeader } from './index';
import { useRouter } from 'next/navigation';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock del hook de autenticación
jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Test User' },
    isAuthenticated: true
  }),
  useHydration: () => true
}));

describe('PublicationsHeader', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the description text', () => {
    render(<PublicationsHeader />);
    expect(screen.getByText('Descubre eventos, noticias y oportunidades para jóvenes')).toBeInTheDocument();
  });

  it('renders the dashboard button when user is authenticated', () => {
    render(<PublicationsHeader />);
    const button = screen.getByText('Ir al Dashboard');
    expect(button).toBeInTheDocument();
  });

  it('navigates to dashboard when button is clicked', () => {
    render(<PublicationsHeader />);
    const button = screen.getByText('Ir al Dashboard');
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
}); 