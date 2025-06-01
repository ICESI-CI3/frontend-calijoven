import { render, screen, waitFor, act } from '@testing-library/react';
import { LatestPublicationsSection } from '../index';
import { PublicationService } from '@/modules/publications/services/publication.service';

// Mock the publication service
jest.mock('@/modules/publications/services/publication.service', () => ({
  PublicationService: {
    getPublications: jest.fn(),
  },
}));

describe('LatestPublicationsSection', () => {
  const mockPublications = [
    {
      id: 1,
      title: 'Test Publication 1',
      content: 'Content 1',
      imageUrl: '/test-image-1.jpg',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      type: 'NEWS',
    },
    {
      id: 2,
      title: 'Test Publication 2',
      content: 'Content 2',
      imageUrl: '/test-image-2.jpg',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
      type: 'EVENT',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', async () => {
    (PublicationService.getPublications as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    await act(async () => {
      render(<LatestPublicationsSection />);
    });
    
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('shows error state when publications fetch fails', async () => {
    (PublicationService.getPublications as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    
    await act(async () => {
      render(<LatestPublicationsSection />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Error al cargar las publicaciones')).toBeInTheDocument();
    });
  });

  it('shows empty state when no publications are available', async () => {
    (PublicationService.getPublications as jest.Mock).mockResolvedValue({ data: [] });
    
    await act(async () => {
      render(<LatestPublicationsSection />);
    });

    await waitFor(() => {
      expect(screen.getByText('No hay publicaciones disponibles')).toBeInTheDocument();
    });
  });

  it('renders publications correctly when data is loaded', async () => {
    (PublicationService.getPublications as jest.Mock).mockResolvedValue({ data: mockPublications });
    
    await act(async () => {
      render(<LatestPublicationsSection />);
    });

    await waitFor(() => {
      mockPublications.forEach((publication) => {
        expect(screen.getByText(publication.title)).toBeInTheDocument();
      });
    });
  });

  it('renders the section title and "Ver todas" button', async () => {
    (PublicationService.getPublications as jest.Mock).mockResolvedValue({ data: mockPublications });
    
    await act(async () => {
      render(<LatestPublicationsSection />);
    });

    expect(screen.getByText('Noticias, Eventos y Ofertas')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todas las publicaciones' })).toBeInTheDocument();
  });

  it('calls getPublications with correct parameters', async () => {
    (PublicationService.getPublications as jest.Mock).mockResolvedValue({ data: mockPublications });
    
    await act(async () => {
      render(<LatestPublicationsSection />);
    });

    await waitFor(() => {
      expect(PublicationService.getPublications).toHaveBeenCalledWith({}, 1, 3);
    });
  });
}); 