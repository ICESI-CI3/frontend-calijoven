import { registrationService, Registration, EventRegistration } from '../registration.service';
import apiClient from '@/lib/api/client';

// Mock the apiClient module
jest.mock('@/lib/api/client');

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('RegistrationService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('registerToPublication', () => {
    const mockPublicationId = 'pub1';
    const mockResponseData = { success: true }; // Assuming a simple success response

    it('should call the registration API with the publication ID on success', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ data: mockResponseData });

      const result = await registrationService.registerToPublication(mockPublicationId);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        `/registration/${mockPublicationId}`
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should throw an error if the API call fails', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.post.mockRejectedValueOnce(mockError);

      await expect(registrationService.registerToPublication(mockPublicationId)).rejects.toThrow('API Error');
    });
  });

  describe('cancelRegistration', () => {
    const mockPublicationId = 'pub1';
    const mockResponseData = { success: true }; // Assuming a simple success response

    it('should call the cancel registration API with the publication ID on success', async () => {
      mockedApiClient.delete.mockResolvedValueOnce({ data: mockResponseData });

      const result = await registrationService.cancelRegistration(mockPublicationId);

      expect(mockedApiClient.delete).toHaveBeenCalledWith(
        `/registration/${mockPublicationId}`
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should throw an error if the API call fails', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.delete.mockRejectedValueOnce(mockError);

      await expect(registrationService.cancelRegistration(mockPublicationId)).rejects.toThrow('API Error');
    });
  });

  describe('getMyRegistrations', () => {
    const mockRegistrations: Registration[] = [
      {
        id: 'reg1',
        user: { id: 'user1', name: 'User One', email: 'user1@example.com' },
        publication: { id: 'pub1', title: 'Pub One', description: '', type: { name: '', description: '' } },
        registeredAt: new Date(),
      },
    ];

    it('should call the API to get user registrations on success', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: mockRegistrations });

      const result = await registrationService.getMyRegistrations();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/registration/me');
      expect(result).toEqual(mockRegistrations);
    });

    it('should throw an error if the API call fails', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.get.mockRejectedValueOnce(mockError);

      await expect(registrationService.getMyRegistrations()).rejects.toThrow('API Error');
    });
  });

  describe('isRegisteredToEvent', () => {
    const mockPublicationId = 'pub1';
    const mockRegistrations: Registration[] = [
      {
        id: 'reg1',
        user: { id: 'user1', name: 'User One', email: 'user1@example.com' },
        publication: { id: 'pub1', title: 'Pub One', description: '', type: { name: '', description: '' } },
        registeredAt: new Date(),
      },
      {
        id: 'reg2',
        user: { id: 'user1', name: 'User One', email: 'user1@example.com' },
        publication: { id: 'pub2', title: 'Pub Two', description: '', type: { name: '', description: '' } },
        registeredAt: new Date(),
      },
    ];

    // Mock getMyRegistrations since isRegisteredToEvent depends on it
    // We need to mock the implementation, not just the return value, if we want to test the filtering logic
    // For a true unit test of isRegisteredToEvent, we would mock getMyRegistrations to return specific data
    // However, the current implementation of isRegisteredToEvent is very simple and directly calls getMyRegistrations.
    // Testing it this way also verifies the integration with getMyRegistrations.

    it('should return true if the user is registered to the event', async () => {
      // Mock getMyRegistrations to return a list that includes the target publication ID
      jest.spyOn(registrationService, 'getMyRegistrations').mockResolvedValue(mockRegistrations);

      const result = await registrationService.isRegisteredToEvent(mockPublicationId);

      expect(registrationService.getMyRegistrations).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if the user is not registered to the event', async () => {
      // Mock getMyRegistrations to return a list that does NOT include the target publication ID
      jest.spyOn(registrationService, 'getMyRegistrations').mockResolvedValue(
        mockRegistrations.filter(reg => reg.publication.id !== mockPublicationId)
      );

      const result = await registrationService.isRegisteredToEvent(mockPublicationId);

      expect(registrationService.getMyRegistrations).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false if getMyRegistrations throws an error', async () => {
      const mockError = new Error('API Error');
      jest.spyOn(registrationService, 'getMyRegistrations').mockRejectedValue(mockError);

      const result = await registrationService.isRegisteredToEvent(mockPublicationId);

      expect(registrationService.getMyRegistrations).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
}); 