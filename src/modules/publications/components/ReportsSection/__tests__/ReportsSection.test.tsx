// Mock del servicio de publicaciones
jest.mock('@/modules/publications/services/publication.service', () => ({
  publicationService: {
    getPublications: jest.fn(),
    deletePublication: jest.fn(),
    generateSingleReport: jest.fn(),
    createPublication: jest.fn(),
    updatePublication: jest.fn(),
    getPublication: jest.fn(),
  },
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReportsSection } from '../index';

// Mock de los componentes de UI
jest.mock('@/components/Button', () => ({
  Button: ({ children, onClick, variant, size, isLoading, disabled }: any) => (
    <button onClick={onClick} data-variant={variant} data-size={size} data-loading={isLoading} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/Input', () => ({
  Input: ({ label, value, onChange, type, placeholder }: any) => (
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
  Alert: ({ message, type, onClose }: any) => (
    <div role="alert" data-type={type}>
      {message}
      <button onClick={onClose}>Cerrar</button>
    </div>
  ),
}));

describe('ReportsSection', () => {
  const mockPublicationService = require('@/modules/publications/services/publication.service').publicationService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPublicationService.generateGeneralReport = mockPublicationService.generateSingleReport;
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
    mockPublicationService.generateSingleReport.mockResolvedValueOnce(new Blob(['test'], { type: 'application/pdf' }));

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
      expect(mockPublicationService.generateSingleReport).toHaveBeenCalledWith('Test Report', {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });
    });
  });

  it('shows error message when report generation fails', async () => {
    const errorMessage = 'Error al generar el reporte';
    mockPublicationService.generateSingleReport.mockRejectedValueOnce(new Error(errorMessage));

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
    mockPublicationService.generateSingleReport.mockResolvedValueOnce(new Blob(['test'], { type: 'application/pdf' }));

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