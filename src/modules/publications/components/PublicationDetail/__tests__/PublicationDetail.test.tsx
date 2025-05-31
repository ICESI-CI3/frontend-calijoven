import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PublicationDetail } from '../index';
import { mockPublication } from '@/modules/publications/mocks';

// Mock de los hooks
jest.mock('@/modules/publications', () => ({
  usePublications: jest.fn(),
}));

// Mock de useEventRegistration
const mockUseEventRegistration = {
  regLoading: false,
  regError: null,
  regSuccess: null,
  isRegistered: false,
  handleRegistration: jest.fn(),
};

jest.mock('@/modules/publications/hooks/useEventRegistration', () => ({
  useEventRegistration: () => mockUseEventRegistration,
}));

// Mock de autenticación
jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Test User' },
    isAuthenticated: true,
  }),
  useHydration: () => true,
}));

// Mock de usePublications
const mockUsePublications = jest.fn();
jest.mock('@/modules/publications/hooks/usePublications', () => ({
  usePublications: () => mockUsePublications(),
}));

describe('PublicationDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePublications.mockReturnValue({
      publication: mockPublication,
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUsePublications.mockReturnValue({
      publication: null,
      loading: true,
      error: null,
    });
    render(<PublicationDetail id="1" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUsePublications.mockReturnValue({
      publication: null,
      loading: false,
      error: 'Error al cargar la publicación',
    });
    render(<PublicationDetail id="1" />);
    expect(screen.getByText('Error al cargar la publicación')).toBeInTheDocument();
  });

  it('renders not found state', () => {
    mockUsePublications.mockReturnValue({
      publication: null,
      loading: false,
      error: null,
    });
    render(<PublicationDetail id="1" />);
    expect(screen.getByText('No se encontró la publicación')).toBeInTheDocument();
  });

  it('renders publication detail correctly', () => {
    mockUsePublications.mockReturnValue({
      publication: mockPublication,
      loading: false,
      error: null,
    });
    render(<PublicationDetail id="1" />);
    expect(screen.getByText(mockPublication.title)).toBeInTheDocument();
    expect(screen.getByText(mockPublication.description)).toBeInTheDocument();
  });

  it('renders event registration link for event type publications', () => {
    const eventPublication = {
      ...mockPublication,
      type: 'event',
      event: { ...mockPublication.event, registration_link: 'https://example.com/register' },
    };
    mockUsePublications.mockReturnValue({
      publication: eventPublication,
      loading: false,
      error: null,
    });
    render(<PublicationDetail id="1" />);
    expect(screen.getByRole('link', { name: /link de registro/i })).toBeInTheDocument();
  });

  it('handles event registration', async () => {
    const eventPublication = {
      ...mockPublication,
      type: { name: 'event', description: 'Evento' },
      event: { ...mockPublication.event, registration_link: 'https://example.com/register' },
    };
    mockUsePublications.mockReturnValue({
      publication: eventPublication,
      loading: false,
      error: null,
    });
    render(<PublicationDetail id="1" />);
    const registerButton = screen.getByRole('button', { name: /inscribirse al evento/i });
    fireEvent.click(registerButton);
    await waitFor(() => {
      expect(mockUseEventRegistration.handleRegistration).toHaveBeenCalledWith(false);
    });
  });

  it('handles event cancellation', async () => {
    const eventPublication = {
      ...mockPublication,
      type: { name: 'event', description: 'Evento' },
      event: { ...mockPublication.event, registration_link: 'https://example.com/register' },
      registrations: [{ id: '1', user_id: '1' }], // Simular que el usuario está registrado
    };
    mockUsePublications.mockReturnValue({
      publication: eventPublication,
      loading: false,
      error: null,
    });
    render(<PublicationDetail id="1" />);
    const cancelButton = screen.getByRole('button', { name: /cancelar inscripción/i });
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(mockUseEventRegistration.handleRegistration).toHaveBeenCalledWith(true);
    });
  });

  it('handles attachment preview', () => {
    const publicationWithAttachment = {
      ...mockPublication,
      attachments: [{ 
        id: '1',
        url: 'https://example.com/test.pdf', 
        name: 'test.pdf', 
        format: 'application/pdf' 
      }],
    };
    mockUsePublications.mockReturnValue({
      publication: publicationWithAttachment,
      loading: false,
      error: null,
    });
    render(<PublicationDetail id="1" />);
    const attachmentElement = screen.getAllByText('test.pdf')[0];
    fireEvent.click(attachmentElement);
    // Verificar que el iframe se muestra con la URL correcta
    const iframe = screen.getByTitle('test.pdf');
    expect(iframe).toHaveAttribute('src', 'https://example.com/test.pdf');
  });
}); 