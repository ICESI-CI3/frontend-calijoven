import { render, screen, waitFor } from '@testing-library/react';
import { BannerSection } from '../index';
import { getBanners } from '@/modules/banners/services/banner.service';

// Mock the banner service
jest.mock('@/modules/banners/services/banner.service', () => ({
  getBanners: jest.fn(),
}));

describe('BannerSection', () => {
  const mockBanners = [
    {
      id: 1,
      title: 'Test Banner 1',
      imageUrl: '/test-image-1.jpg',
      link: 'https://test1.com',
    },
    {
      id: 2,
      title: 'Test Banner 2',
      imageUrl: '/test-image-2.jpg',
      link: 'https://test2.com',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (getBanners as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<BannerSection />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('shows error state when banner fetch fails', async () => {
    (getBanners as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    render(<BannerSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Error al cargar los banners')).toBeInTheDocument();
    });
  });

  it('renders banners correctly when data is loaded', async () => {
    (getBanners as jest.Mock).mockResolvedValue(mockBanners);
    render(<BannerSection />);

    await waitFor(() => {
      const firstBanner = screen.getByAltText(mockBanners[0].title);
      expect(firstBanner).toBeInTheDocument();
      expect(firstBanner).toHaveAttribute('src', mockBanners[0].imageUrl);
    });

    expect(screen.getByLabelText('Anterior')).toBeInTheDocument();
    expect(screen.getByLabelText('Siguiente')).toBeInTheDocument();
    expect(screen.getByLabelText('Ir al slide 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Ir al slide 2')).toBeInTheDocument();
  });

  it('renders nothing when no banners are available', async () => {
    (getBanners as jest.Mock).mockResolvedValue([]);
    const { container } = render(<BannerSection />);
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('renders banner with correct link', async () => {
    (getBanners as jest.Mock).mockResolvedValue([mockBanners[0]]);
    render(<BannerSection />);

    await waitFor(() => {
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', mockBanners[0].link);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
}); 