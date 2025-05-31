import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GlobalAuthGuard } from '../GlobalAuthGuard';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, useHydration, useTokenValidator, useAuthSync } from '@/lib/hooks/useAuth';
import { ROUTES } from '@/lib/constants/routes';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock auth hooks
jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: jest.fn(),
  useHydration: jest.fn(),
  useTokenValidator: jest.fn(),
  useAuthSync: jest.fn(),
}));

// Mock Spinner component
jest.mock('@/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('GlobalAuthGuard', () => {
  const mockRouter = {
    replace: jest.fn(),
  };
  const mockPathname = '/test-path';
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    roles: ['USER'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue(mockPathname);
    (useTokenValidator as jest.Mock).mockImplementation(() => {});
    (useAuthSync as jest.Mock).mockImplementation(() => {});
  });

  it('renders children for public routes', () => {
    (useHydration as jest.Mock).mockReturnValue(true);
    (usePathname as jest.Mock).mockReturnValue(ROUTES.HOME.PATH);
    (useAuth as unknown as jest.Mock).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        if (selector.toString().includes('isAuthenticated')) return false;
        if (selector.toString().includes('user')) return null;
      }
      return null;
    });

    render(
      <GlobalAuthGuard>
        <div>Test Content</div>
      </GlobalAuthGuard>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows loading spinner when not hydrated', () => {
    (useHydration as jest.Mock).mockReturnValue(false);

    render(
      <GlobalAuthGuard>
        <div>Test Content</div>
      </GlobalAuthGuard>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('redirects to home when authenticated user visits auth route', () => {
    (useHydration as jest.Mock).mockReturnValue(true);
    (usePathname as jest.Mock).mockReturnValue(ROUTES.AUTH.LOGIN.PATH);
    (useAuth as unknown as jest.Mock).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        if (selector.toString().includes('isAuthenticated')) return true;
        if (selector.toString().includes('user')) return mockUser;
      }
      return null;
    });

    render(
      <GlobalAuthGuard>
        <div>Test Content</div>
      </GlobalAuthGuard>
    );

    expect(mockRouter.replace).toHaveBeenCalledWith(ROUTES.HOME.PATH);
  });

  it('redirects to login when unauthenticated user visits protected route', () => {
    (useHydration as jest.Mock).mockReturnValue(true);
    (useAuth as unknown as jest.Mock).mockImplementation((selector: any) => {
      if (typeof selector === 'function' && selector.toString().includes('isAuthenticated')) return false;
      return null;
    });

    render(
      <GlobalAuthGuard>
        <div>Test Content</div>
      </GlobalAuthGuard>
    );

    const expectedLoginUrl = `${ROUTES.AUTH.LOGIN.PATH}?callbackUrl=${encodeURIComponent(mockPathname)}`;
    expect(mockRouter.replace).toHaveBeenCalledWith(expectedLoginUrl);
  });

  it('redirects to home when user lacks required permissions', () => {
    (useHydration as jest.Mock).mockReturnValue(true);
    (usePathname as jest.Mock).mockReturnValue(ROUTES.ADMIN.USERS.PATH);
    (useAuth as unknown as jest.Mock).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        if (selector.toString().includes('isAuthenticated')) return true;
        if (selector.toString().includes('user')) return { ...mockUser, roles: ['INSUFFICIENT_ROLE'] };
      }
      return null;
    });

    render(
      <GlobalAuthGuard>
        <div>Test Content</div>
      </GlobalAuthGuard>
    );

    expect(mockRouter.replace).toHaveBeenCalledWith(ROUTES.HOME.PATH);
  });

  it('renders children when user has required permissions', () => {
    (useHydration as jest.Mock).mockReturnValue(true);
    (useAuth as unknown as jest.Mock).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        if (selector.toString().includes('isAuthenticated')) return true;
        if (selector.toString().includes('user')) return mockUser;
      }
      return null;
    });

    render(
      <GlobalAuthGuard>
        <div>Test Content</div>
      </GlobalAuthGuard>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
}); 