import { OrganizationService, OrganizationError } from '../organization.service';
import apiClient from '@/lib/api/client';
import { expect } from '@jest/globals';

jest.mock('@/lib/api/client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('OrganizationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrganizations', () => {
    it('debe retornar organizaciones paginadas', async () => {
      const mockData = { items: [{ id: '1', name: 'Org' }], total: 1, page: 1, limit: 10, totalPages: 1 };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await OrganizationService.getOrganizations();
      expect(result).toEqual(mockData);
      expect(apiClient.get).toHaveBeenCalled();
    });

    it('debe enviar filtros correctamente', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: { items: [], total: 0 } });
      await OrganizationService.getOrganizations({ search: 'test', public: true, page: 2, limit: 5, order: 'DESC' });
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('search=test'));
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('public=true'));
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('limit=5'));
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('order=DESC'));
    });

    it('debe lanzar error si la petición falla', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(OrganizationService.getOrganizations()).rejects.toThrow(OrganizationError);
    });
  });

  describe('getOrganization', () => {
    it('debe retornar una organización por id', async () => {
      const mockOrg = { id: '1', name: 'Org' };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockOrg });

      const result = await OrganizationService.getOrganization('1');
      expect(result).toEqual(mockOrg);
      expect(apiClient.get).toHaveBeenCalled();
    });

    it('debe lanzar error si la petición falla', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(OrganizationService.getOrganization('1')).rejects.toThrow(OrganizationError);
    });
  });

  describe('createOrganization', () => {
    it('debe crear una organización', async () => {
      const orgData = { name: 'Nueva Org' };
      const mockOrg = { id: '1', ...orgData };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockOrg });

      const result = await OrganizationService.createOrganization(orgData as any);
      expect(result).toEqual(mockOrg);
      expect(apiClient.post).toHaveBeenCalled();
    });

    it('debe lanzar error si la creación falla', async () => {
      (apiClient.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(OrganizationService.createOrganization({} as any)).rejects.toThrow(OrganizationError);
    });
  });

  describe('updateOrganization', () => {
    it('debe actualizar una organización', async () => {
      const orgData = { name: 'Org Actualizada' };
      const mockOrg = { id: '1', ...orgData };
      (apiClient.put as jest.Mock).mockResolvedValue({ data: mockOrg });

      const result = await OrganizationService.updateOrganization('1', orgData as any);
      expect(result).toEqual(mockOrg);
      expect(apiClient.put).toHaveBeenCalled();
    });

    it('debe lanzar error si la actualización falla', async () => {
      (apiClient.put as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(OrganizationService.updateOrganization('1', {} as any)).rejects.toThrow(OrganizationError);
    });
  });

  describe('addMember', () => {
    it('debe agregar un miembro a la organización', async () => {
      const mockOrg = { id: '1', name: 'Org' };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockOrg });

      const result = await OrganizationService.addMember('1', 'user1');
      expect(result).toEqual(mockOrg);
      expect(apiClient.post).toHaveBeenCalled();
    });

    it('debe lanzar error si falla la petición', async () => {
      (apiClient.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(OrganizationService.addMember('1', 'user1')).rejects.toThrow(OrganizationError);
    });
  });

  describe('removeMember', () => {
    it('debe eliminar un miembro de la organización', async () => {
      const mockOrg = { id: '1', name: 'Org' };
      (apiClient.delete as jest.Mock).mockResolvedValue({ data: mockOrg });

      const result = await OrganizationService.removeMember('1', 'user1');
      expect(result).toEqual(mockOrg);
      expect(apiClient.delete).toHaveBeenCalled();
    });

    it('debe lanzar error si falla la petición', async () => {
      (apiClient.delete as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(OrganizationService.removeMember('1', 'user1')).rejects.toThrow(OrganizationError);
    });
  });
});