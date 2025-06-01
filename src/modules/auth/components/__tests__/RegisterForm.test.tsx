import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegisterForm } from '../RegisterForm';
import { useRouter } from 'next/navigation';
import AuthService from '@/modules/auth/services/auth.service';
import { ROUTES } from '@/lib/constants/routes';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock SearchableSelect y Alert
jest.mock('@/components/SearchableSelect', () => ({
  SearchableSelect: ({ onSelect }: any) => (
    <div data-testid="city-select">
      <button onClick={() => onSelect({ id: '1', name: 'Test City' })}>
        Select City
      </button>
    </div>
  ),
}));

jest.mock('@/components/Alert', () => ({
  Alert: ({ type, message }: any) => (
    <div data-testid={`alert-${type}`} role="alert" className="alert">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  ),
}));

// Mock services
jest.mock('@/lib/api/governance.service', () => ({
  governanceService: {
    searchCities: jest.fn(),
  },
}));

jest.mock('@/modules/auth/services/auth.service', () => ({
  __esModule: true,
  default: {
    register: jest.fn(),
  },
}));

describe('RegisterForm', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders all form fields correctly', () => {
    render(<RegisterForm />);
    expect(screen.getByTestId('input-nombres')).toBeInTheDocument();
    expect(screen.getByTestId('input-correo')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('city-select')).toBeInTheDocument();
    expect(screen.getByTestId('button-register')).toBeInTheDocument();
  });

  it('shows password validation errors for weak password', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByTestId('input-nombres'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('input-correo'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'weak' } });
    const citySelect = screen.getByTestId('city-select');
    fireEvent.click(citySelect.querySelector('button')!);
    const termsCheckbox = screen.getByLabelText(/Acepto los términos y condiciones/);
    fireEvent.click(termsCheckbox);
    const submitButton = screen.getByTestId('button-register');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const passwordError = screen.getByText(/La contraseña debe contener:/);
      expect(passwordError).toBeInTheDocument();
    });
  });

  it('handles successful form submission', async () => {
    const mockResponse = { token: 'fake-token', user: { id: '1', email: 'test@example.com' } };
    (AuthService.register as jest.Mock).mockResolvedValueOnce(mockResponse);
    render(<RegisterForm />);
    fireEvent.change(screen.getByTestId('input-nombres'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('input-correo'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'Test123!@#' } });
    const citySelect = screen.getByTestId('city-select');
    fireEvent.click(citySelect.querySelector('button')!);
    const termsCheckbox = screen.getByLabelText(/Acepto los términos y condiciones/);
    fireEvent.click(termsCheckbox);
    const submitButton = screen.getByTestId('button-register');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Test123!@#',
        city: '1',
      });
      expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.AUTH.LOGIN.PATH);
    });
  });

  it('handles registration error', async () => {
    const errorMessage = 'El correo ya está registrado';
    (AuthService.register as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });
    render(<RegisterForm />);
    fireEvent.change(screen.getByTestId('input-nombres'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('input-correo'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'Test123!@#' } });
    const citySelect = screen.getByTestId('city-select');
    fireEvent.click(citySelect.querySelector('button')!);
    const termsCheckbox = screen.getByLabelText(/Acepto los términos y condiciones/);
    fireEvent.click(termsCheckbox);
    const submitButton = screen.getByTestId('button-register');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const errorAlert = screen.getByTestId('alert-error');
      expect(errorAlert).toBeInTheDocument();
      expect(errorAlert).toHaveTextContent(errorMessage);
    });
  });
}); 