import { getBanners, Banner, PageResponse } from '../banner.service';
import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';

// Mock the apiClient module
jest.mock('@/lib/api/client');

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('BannerService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getBanners', () => {
    const mockBanners: Banner[] = [
      {
        id: '1',
        title: 'Public Banner',
        imageUrl: 'url1',
        public: true,
        created_at: 'now',
        link: 'link1',
      },
      {
        id: '2',
        title: 'Private Banner',
        imageUrl: 'url2',
        public: false,
        created_at: 'later',
        link: 'link2',
      },
    ];

    const mockApiResponse: PageResponse<Banner> = {
      data: mockBanners,
      meta: {
        itemCount: 2,
        totalItems: 2,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
    };

    it('should call the API with public=true by default and return public banners', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: mockApiResponse });

      const result = await getBanners();

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        API_ROUTES.BANNERS.BASE,
        {
          params: {
            public: true,
            take: 10,
            order: 'DESC',
          },
        }
      );
      // Assuming the service filters public banners if necessary, or the API handles it.
      // Based on the service code, it seems the API handles the filtering via the 'public' param.
      // So we expect all banners from the successful API response.
      expect(result).toEqual(mockApiResponse.data);
    });

    it('should call the API with public=false when publicOnly is false and return all banners', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: mockApiResponse });

      const result = await getBanners(false);

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        API_ROUTES.BANNERS.BASE,
        {
          params: {
            public: false,
            take: 10,
            order: 'DESC',
          },
        }
      );
      expect(result).toEqual(mockApiResponse.data);
    });

    it('should throw an error if the API call fails', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.get.mockRejectedValueOnce(mockError);

      await expect(getBanners()).rejects.toThrow('API Error');
      expect(mockedApiClient.get).toHaveBeenCalledWith(
        API_ROUTES.BANNERS.BASE,
        {
          params: {
            public: true,
            take: 10,
            order: 'DESC',
          },
        }
      );
    });
  });
}); 