// Mock del servicio de publicaciones
jest.mock('@/modules/publications/services/publication.service', () => ({
  publicationService: {
    getPublications: jest.fn(),
    deletePublication: jest.fn(),
    generateSingleReport: jest.fn(),
    generateGeneralReport: jest.fn(),
    createPublication: jest.fn(),
    updatePublication: jest.fn(),
    getPublication: jest.fn(),
  },
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReportsSection } from '../index';
import { publicationService } from '@/modules/publications/services/publication.service';

// Define types for the report filters
type ReportFilters = {
  startDate?: string;
  endDate?: string;
};

// Define the mock service type
type MockPublicationService = {
  generateSingleReport: jest.Mock<Promise<Blob>, [string, ReportFilters?]>;
  generateGeneralReport: jest.Mock<Promise<Blob>, [string, ReportFilters?]>;
  getPublications: jest.Mock;
  deletePublication: jest.Mock;
  createPublication: jest.Mock;
  updatePublication: jest.Mock;
  getPublication: jest.Mock;
};

// Define proper types for the mock components
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  size?: string;
  isLoading?: boolean;
  disabled?: boolean;
};

type InputProps = {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
};

type AlertProps = {
  message: string;
  type?: string;
  onClose?: () => void;
};

// Mock de los componentes de UI
jest.mock('@/components/Button', () => ({
  Button: ({ children, onClick, variant, size, isLoading, disabled }: ButtonProps) => (
    <button onClick={onClick} data-variant={variant} data-size={size} data-loading={isLoading} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/Input', () => ({
  Input: ({ label, value, onChange, type, placeholder }: InputProps) => (
    <div>
      <label>{label}</label>
      <input
        type={type || 'text'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        data-testid={label?.toLowerCase().replace(/\s+/g, '-')}
      />
    </div>
  ),
}));

jest.mock('@/components/Alert', () => ({
  Alert: ({ message, type, onClose }: AlertProps) => (
    <div role="alert" data-type={type}>
      {message}
      <button onClick={onClose}>Cerrar</button>
    </div>
  ),
}));

describe('ReportsSection', () => {
  const mockPublicationService = publicationService as unknown as MockPublicationService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure the mocks are properly typed
    (mockPublicationService.generateSingleReport as jest.Mock).mockReset();
    (mockPublicationService.generateGeneralReport as jest.Mock).mockReset();
    // Mock window.URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:url');
    // Mock window.URL.revokeObjectURL
    global.URL.revokeObjectURL = jest.fn();
  });

  it('renders report section correctly', () => {
    render(<ReportsSection />);

    expect(screen.getByText(/generar reporte general/i)).toBeInTheDocument();
    expect(screen.getByTestId('nombre-del-reporte-*')).toBeInTheDocument();
    expect(screen.getByTestId('fecha-de-inicio')).toBeInTheDocument();
    expect(screen.getByTestId('fecha-de-fin')).toBeInTheDocument();
  });

  it('handles report name input', () => {
    render(<ReportsSection />);

    const reportNameInput = screen.getByTestId('nombre-del-reporte-*');
    fireEvent.change(reportNameInput, { target: { value: 'Test Report' } });

    expect(reportNameInput).toHaveValue('Test Report');
  });

  it('handles date range selection', () => {
    render(<ReportsSection />);

    const startDateInput = screen.getByTestId('fecha-de-inicio');
    const endDateInput = screen.getByTestId('fecha-de-fin');

    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });

    expect(startDateInput).toHaveValue('2024-01-01');
    expect(endDateInput).toHaveValue('2024-01-31');
  });

  it('generates report with selected filters', async () => {
    mockPublicationService.generateGeneralReport.mockResolvedValueOnce(new Blob(['test'], { type: 'application/pdf' }));

    render(<ReportsSection />);

    const reportNameInput = screen.getByTestId('nombre-del-reporte-*');
    const startDateInput = screen.getByTestId('fecha-de-inicio');
    const endDateInput = screen.getByTestId('fecha-de-fin');
    const generateButton = screen.getByRole('button', { name: /generar reporte/i });

    fireEvent.change(reportNameInput, { target: { value: 'Test Report' } });
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockPublicationService.generateGeneralReport).toHaveBeenCalledWith('Test Report', {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });
    });
  });

  it('shows error message when report generation fails', async () => {
    const errorMessage = 'Error al generar el reporte';
    mockPublicationService.generateGeneralReport.mockRejectedValueOnce(new Error(errorMessage));

    render(<ReportsSection />);

    const reportNameInput = screen.getByTestId('nombre-del-reporte-*');
    const generateButton = screen.getByRole('button', { name: /generar reporte/i });

    fireEvent.change(reportNameInput, { target: { value: 'Test Report' } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('disables generate button when report name is empty', () => {
    render(<ReportsSection />);

    const generateButton = screen.getByRole('button', { name: /generar reporte/i });
    expect(generateButton).toBeDisabled();
  });

  it('shows success message after generating report', async () => {
    mockPublicationService.generateGeneralReport.mockResolvedValueOnce(new Blob(['test'], { type: 'application/pdf' }));

    render(<ReportsSection />);

    const reportNameInput = screen.getByTestId('nombre-del-reporte-*');
    const generateButton = screen.getByRole('button', { name: /generar reporte/i });

    fireEvent.change(reportNameInput, { target: { value: 'Test Report' } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Reporte generado exitosamente')).toBeInTheDocument();
    });
  });
}); 