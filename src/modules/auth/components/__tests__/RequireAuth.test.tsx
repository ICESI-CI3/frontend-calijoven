import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RequireAuth from '../RequireAuth';
import { useAuth, useHydration } from '@/lib/hooks/useAuth';
import { PERMISSIONS } from '@/lib/constants/permissions';

// Mock auth hooks
jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: jest.fn(),
  useHydration: jest.fn(),
}));

// Mock Spinner component
jest.mock('@/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('RequireAuth', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    roles: [PERMISSIONS.MANAGE_USER, PERMISSIONS.MANAGE_PUBLICATION],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loader when not hydrated', () => {
    (useHydration as jest.Mock).mockReturnValue(false);

    render(
      <RequireAuth>
        <div>Test Content</div>
      </RequireAuth>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('shows custom loader when provided and not hydrated', () => {
    (useHydration as jest.Mock).mockReturnValue(false);

    render(
      <RequireAuth loader={<div>Custom Loading...</div>}>
        <div>Test Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('shows fallback when user is not authenticated', () => {
    (useHydration as jest.Mock).mockReturnValue(true);
    (useAuth as unknown as jest.Mock).mockImplementation((selector: any) => {
      if (typeof selector === 'function' && selector.toString().includes('isAuthenticated')) return false;
      return null;
    });

    render(
      <RequireAuth fallback={<div>Access Denied</div>}>
        <div>Test Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated without permissions required', () => {
    (useHydration as jest.Mock).mockReturnValue(true);
    (useAuth as unknown as jest.Mock).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        if (selector.toString().includes('isAuthenticated')) return true;
        if (selector.toString().includes('user')) return mockUser;
      }
      return null;
    });

    render(
      <RequireAuth>
        <div>Test Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders children when user has any of the required permissions', () => {
    (useHydration as jest.Mock).mockReturnValue(true);
    (useAuth as unknown as jest.Mock).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        if (selector.toString().includes('isAuthenticated')) return true;
        if (selector.toString().includes('user')) return mockUser;
      }
      return null;
    });

    render(
      <RequireAuth permissions={[PERMISSIONS.MANAGE_USER, PERMISSIONS.MANAGE_BANNER]}>
        <div>Test Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows fallback when user does not have any of the required permissions', () => {
    (useHydration as jest.Mock).mockReturnValue(true);
    (useAuth as unknown as jest.Mock).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        if (selector.toString().includes('isAuthenticated')) return true;
        if (selector.toString().includes('user')) return { ...mockUser, roles: [PERMISSIONS.READ_USER] };
      }
      return null;
    });

    render(
      <RequireAuth permissions={[PERMISSIONS.MANAGE_USER, PERMISSIONS.MANAGE_BANNER]} fallback={<div>Access Denied</div>}>
        <div>Test Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('renders children when user has all required permissions', () => {
    (useHydration as jest.Mock).mockReturnValue(true);
    (useAuth as unknown as jest.Mock).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        if (selector.toString().includes('isAuthenticated')) return true;
        if (selector.toString().includes('user')) return mockUser;
      }
      return null;
    });

    render(
      <RequireAuth permissions={[PERMISSIONS.MANAGE_USER, PERMISSIONS.MANAGE_PUBLICATION]} requireAll>
        <div>Test Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows fallback when user does not have all required permissions', () => {
    (useHydration as jest.Mock).mockReturnValue(true);
    (useAuth as unknown as jest.Mock).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        if (selector.toString().includes('isAuthenticated')) return true;
        if (selector.toString().includes('user')) return { ...mockUser, roles: [PERMISSIONS.MANAGE_USER] };
      }
      return null;
    });

    render(
      <RequireAuth permissions={[PERMISSIONS.MANAGE_USER, PERMISSIONS.MANAGE_PUBLICATION]} requireAll fallback={<div>Access Denied</div>}>
        <div>Test Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });
}); 