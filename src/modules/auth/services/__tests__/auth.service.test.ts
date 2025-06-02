import { AuthService, AuthError } from '../auth.service';
import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';

// Mock the apiClient module
jest.mock('@/lib/api/client');

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('AuthService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockCredentials = { email: 'test@example.com', password: 'password123' };
    const mockAuthResponse = { token: 'fake-token', user: { id: '1', email: 'test@example.com' } };

    it('should call the login API and return auth data on success', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ data: mockAuthResponse });

      const result = await AuthService.login(mockCredentials);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        API_ROUTES.AUTH.LOGIN,
        mockCredentials
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw AuthError on login failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.post.mockRejectedValueOnce(mockError);

      await expect(AuthService.login(mockCredentials)).rejects.toThrow(
        AuthError
      );
      await expect(AuthService.login(mockCredentials)).rejects.toThrow(
        'No se pudo iniciar sesión. Verifica tus credenciales.'
      );
      expect(mockedApiClient.post).toHaveBeenCalledWith(
        API_ROUTES.AUTH.LOGIN,
        mockCredentials
      );
    });
  });

  describe('register', () => {
    const mockUserData = { name: 'Test User', email: 'test@example.com', password: 'password123', city: 'Test City' };
    const mockAuthResponse = { token: 'fake-token', user: { id: '1', email: 'test@example.com' } };

    it('should call the register API and return auth data on success', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ data: mockAuthResponse });

      const result = await AuthService.register(mockUserData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        API_ROUTES.AUTH.REGISTER,
        mockUserData
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw AuthError on registration failure', async () => {
      // Mock the API client to reject with an AuthError containing the specific backend message
      mockedApiClient.post.mockRejectedValueOnce(new AuthError('The provided email is already registered'));

      await expect(AuthService.register(mockUserData)).rejects.toThrow(
        'The provided email is already registered'
      );
      expect(mockedApiClient.post).toHaveBeenCalledWith(
        API_ROUTES.AUTH.REGISTER,
        mockUserData
      );
    });
  });
}); 