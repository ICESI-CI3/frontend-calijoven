import apiClient from '@/lib/api/client';
import { CityService } from '../cities.service';

// Mock del cliente API
jest.mock('@/lib/api/client', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

describe('CityService', () => {
    const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getCities', () => {
        const mockCities = [
            { id: '1', name: 'Ciudad 1' },
            { id: '2', name: 'Ciudad 2' },
        ];

        it('should fetch cities successfully', async () => {
            mockedApiClient.get.mockResolvedValueOnce({ data: mockCities });

            const result = await CityService.getCities();

            expect(mockedApiClient.get).toHaveBeenCalledWith('/governance/city');
            expect(result).toEqual(mockCities);
        });

        it('should handle API error when fetching cities', async () => {
            const mockError = new Error('API Error');
            mockedApiClient.get.mockRejectedValueOnce(mockError);

            await expect(CityService.getCities()).rejects.toThrow('No se pudieron obtener las ciudades.');
            expect(mockedApiClient.get).toHaveBeenCalledWith('/governance/city');
        });
    });
}); 