import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PublicationList } from '../index';
import { mockPublications, mockPublicationService } from '@/modules/publications/mocks';

// Declarar el tipo para globalThis.__mockService
declare global {
  // eslint-disable-next-line no-var
  var __mockService: typeof import('@/modules/publications/mocks').mockPublicationService;
}

// Mock del servicio de publicaciones
jest.mock('@/modules/publications/services/publication.service', () => {
  const { mockPublications, mockPublicationService } = require('@/modules/publications/mocks');
  globalThis.__mockService = {
    getPublications: jest.fn().mockResolvedValue({
      data: mockPublications,
      total: mockPublications.length,
    }),
    deletePublication: jest.fn().mockResolvedValue(undefined),
    generateSingleReport: jest.fn().mockResolvedValue(undefined),
    createPublication: jest.fn().mockResolvedValue(undefined),
    updatePublication: jest.fn().mockResolvedValue(undefined),
    getPublication: jest.fn().mockResolvedValue(undefined),
  };
  return { publicationService: globalThis.__mockService };
});

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock de autenticación
jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Test User' },
    isAuthenticated: true,
  }),
  useHydration: () => true,
}));

// Mock de los componentes de UI
jest.mock('@/components/Button', () => ({
  Button: ({ children, onClick, variant, className }: any) => (
    <button onClick={onClick} className={className} data-variant={variant}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/Alert', () => ({
  Alert: ({ type, message }: any) => (
    <div data-testid={`alert-${type}`} role="alert">
      {message}
    </div>
  ),
}));

jest.mock('@/components/Modal', () => ({
  Modal: ({ isOpen, onClose, children, title, onConfirm }: any) =>
    isOpen ? (
      <div data-testid="modal" role="dialog">
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Cerrar</button>
        <button onClick={onConfirm}>Confirmar</button>
      </div>
    ) : null,
}));

jest.mock('@/components/Table', () => ({
  Table: ({ data, columns }: any) => (
    <table>
      <thead>
        <tr>
          {columns.map((column: any) => (
            <th key={column.key}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item: any) => (
          <tr key={item.id}>
            {columns.map((column: any) => (
              <td key={column.key}>{column.render ? column.render(item) : item[column.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  TableColumn: jest.fn(),
}));

jest.mock('@/components/Pagination', () => ({
  Pagination: ({ currentPage, totalPages, onPageChange }: any) => (
    <div data-testid="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        data-testid="prev-page"
      >
        Anterior
      </button>
      <span data-testid="current-page">{currentPage}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        data-testid="next-page"
      >
        Siguiente
      </button>
    </div>
  ),
}));

jest.mock('@/components/FilterBar', () => ({
  FilterBar: ({ children, onClear, onTypeChange }: any) => (
    <div data-testid="filter-bar">
      <label htmlFor="type-filter">Tipo de Publicación</label>
      <select
        id="type-filter"
        name="type-filter"
        aria-label="Tipo de Publicación"
        role="combobox"
        onChange={e => onTypeChange && onTypeChange(e.target.value)}
      >
        <option value="">Todos</option>
        <option value="event">Evento</option>
        <option value="news">Noticia</option>
      </select>
      {children}
      <button onClick={onClear} data-testid="clear-filters">
        Limpiar filtros
      </button>
    </div>
  ),
  FilterGroup: ({ label, children }: any) => (
    <div data-testid="filter-group">
      <label>{label}</label>
      {children}
    </div>
  ),
}));

describe('PublicationList', () => {
  const mockOnEdit = jest.fn();
  const mockOnCreateNew = jest.fn();
  const defaultProps = {
    initialPage: 1,
    initialLimit: 10,
    onEdit: mockOnEdit,
    onCreateNew: mockOnCreateNew,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.__mockService.getPublications.mockResolvedValue({
      data: mockPublications,
      total: mockPublications.length,
    });
  });

  it('renders publication list correctly', async () => {
    render(<PublicationList {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Test Publication')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Publication 2')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Evento' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Noticia' })).toBeInTheDocument();
  });

  it('displays error message when loading fails', async () => {
    const errorMessage = 'Error al cargar las publicaciones';
    globalThis.__mockService.getPublications.mockRejectedValue(new Error(errorMessage));

    render(<PublicationList {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('alert-error')).toHaveTextContent(errorMessage);
    });
  });
}); 