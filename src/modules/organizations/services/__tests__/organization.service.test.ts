import { OrganizationService, OrganizationError } from '../organization.service';
import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import { Organization, PaginatedResponse } from '@/types/organization';

// Mock the apiClient module
jest.mock('@/lib/api/client');

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('OrganizationService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getOrganizations', () => {
    const mockOrganizations: Organization[] = [
      {
        id: 'org1',
        name: 'Org One',
        public: true,
        members: [],
      },
      {
        id: 'org2',
        name: 'Org Two',
        public: false,
        members: [],
      },
    ];
    const mockPaginatedResponse: PaginatedResponse<Organization> = {
      data: mockOrganizations,
      meta: {
        itemCount: 2,
        totalItems: 2,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
    };

    it('should fetch organizations with default filters', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: mockPaginatedResponse });

      const result = await OrganizationService.getOrganizations();

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `${API_ROUTES.ORGANIZATIONS.BASE}?page=1&limit=10&order=ASC`
      );
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should fetch organizations with custom filters', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: mockPaginatedResponse });

      const filters = { page: 2, limit: 5, order: 'DESC' as 'DESC' | 'ASC', search: 'test', public: false };
      const result = await OrganizationService.getOrganizations(filters);

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `${API_ROUTES.ORGANIZATIONS.BASE}?page=2&limit=5&order=DESC&search=test&public=false`
      );
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should throw OrganizationError on fetch organizations failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.get.mockRejectedValueOnce(mockError);

      await expect(OrganizationService.getOrganizations()).rejects.toThrow(
        OrganizationError
      );
      await expect(OrganizationService.getOrganizations()).rejects.toThrow(
        'No se pudieron obtener las organizaciones.'
      );
    });
  });

  describe('getOrganization', () => {
    const mockOrganizationId = 'org1';
    const mockOrganization: Organization = {
      id: mockOrganizationId,
      name: 'Org One',
      public: true,
      members: [],
    };

    it('should fetch an organization by ID on success', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: mockOrganization });

      const result = await OrganizationService.getOrganization(mockOrganizationId);

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        API_ROUTES.ORGANIZATIONS.BY_ID(mockOrganizationId)
      );
      expect(result).toEqual(mockOrganization);
    });

    it('should throw OrganizationError on fetch organization by ID failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.get.mockRejectedValueOnce(mockError);

      await expect(OrganizationService.getOrganization(mockOrganizationId)).rejects.toThrow(
        OrganizationError
      );
      await expect(OrganizationService.getOrganization(mockOrganizationId)).rejects.toThrow(
        'No se pudo obtener la organización.'
      );
    });
  });

  describe('createOrganization', () => {
    const mockCreateData = { name: 'New Org', public: true, acronym: 'NO' };
    const mockCreatedOrganization: Organization = {
      id: 'new-org',
      ...mockCreateData,
      members: [],
    };

    it('should create an organization on success', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ data: mockCreatedOrganization });

      const result = await OrganizationService.createOrganization(mockCreateData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        API_ROUTES.ORGANIZATIONS.BASE,
        mockCreateData
      );
      expect(result).toEqual(mockCreatedOrganization);
    });

    it('should throw OrganizationError on create organization failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.post.mockRejectedValueOnce(mockError);

      await expect(OrganizationService.createOrganization(mockCreateData)).rejects.toThrow(
        OrganizationError
      );
      await expect(OrganizationService.createOrganization(mockCreateData)).rejects.toThrow(
        'No se pudo crear la organización.'
      );
    });
  });

  describe('updateOrganization', () => {
    const mockOrgId = 'org1';
    const mockUpdateData = { name: 'Updated Org', public: false };
    const mockUpdatedOrganization: Organization = {
      id: mockOrgId,
      name: 'Updated Org',
      public: false,
      members: [],
    };

    it('should update an organization on success', async () => {
      mockedApiClient.put.mockResolvedValueOnce({ data: mockUpdatedOrganization });

      const result = await OrganizationService.updateOrganization(mockOrgId, mockUpdateData);

      expect(mockedApiClient.put).toHaveBeenCalledWith(
        API_ROUTES.ORGANIZATIONS.BY_ID(mockOrgId),
        mockUpdateData
      );
      expect(result).toEqual(mockUpdatedOrganization);
    });

    it('should throw OrganizationError on update organization failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.put.mockRejectedValueOnce(mockError);

      await expect(OrganizationService.updateOrganization(mockOrgId, mockUpdateData)).rejects.toThrow(
        OrganizationError
      );
      await expect(OrganizationService.updateOrganization(mockOrgId, mockUpdateData)).rejects.toThrow(
        'No se pudo actualizar la organización.'
      );
    });
  });

  describe('addMember', () => {
    const mockOrgId = 'org1';
    const mockUserId = 'user1';
    const mockUpdatedOrganization: Organization = {
      id: mockOrgId,
      name: 'Org One',
      public: true,
      members: [{ id: mockUserId, name: 'User One', profilePicture: '', banned: false, city: 'Test City' }],
    };

    it('should add a member on success', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ data: mockUpdatedOrganization });

      const result = await OrganizationService.addMember(mockOrgId, mockUserId);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        API_ROUTES.ORGANIZATIONS.MEMBERS(mockOrgId),
        { userId: mockUserId }
      );
      expect(result).toEqual(mockUpdatedOrganization);
    });

    it('should throw OrganizationError on add member failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.post.mockRejectedValueOnce(mockError);

      await expect(OrganizationService.addMember(mockOrgId, mockUserId)).rejects.toThrow(
        OrganizationError
      );
      await expect(OrganizationService.addMember(mockOrgId, mockUserId)).rejects.toThrow(
        'No se pudo agregar el miembro a la organización.'
      );
    });
  });

  describe('removeMember', () => {
    const mockOrgId = 'org1';
    const mockUserId = 'user1';
    const mockUpdatedOrganization: Organization = {
      id: mockOrgId,
      name: 'Org One',
      public: true,
      members: [],
    };

    it('should remove a member on success', async () => {
      mockedApiClient.delete.mockResolvedValueOnce({ data: mockUpdatedOrganization });

      const result = await OrganizationService.removeMember(mockOrgId, mockUserId);

      expect(mockedApiClient.delete).toHaveBeenCalledWith(
        API_ROUTES.ORGANIZATIONS.MEMBER(mockOrgId, mockUserId)
      );
      expect(result).toEqual(mockUpdatedOrganization);
    });

    it('should throw OrganizationError on remove member failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.delete.mockRejectedValueOnce(mockError);

      await expect(OrganizationService.removeMember(mockOrgId, mockUserId)).rejects.toThrow(
        OrganizationError
      );
      await expect(OrganizationService.removeMember(mockOrgId, mockUserId)).rejects.toThrow(
        'No se pudo eliminar el miembro de la organización.'
      );
    });
  });
}); 