import PQRSService, { PQRSError } from '../pqrs.service';
import apiClient from '@/lib/api/client';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

jest.mock('@/lib/api/client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('PQRSService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPQRSTypes', () => {
    it('debe retornar los tipos de PQRS', async () => {
      const mockTypes = [{ id: '1', name: 'Petición' }];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTypes });

      const result = await PQRSService.getPQRSTypes();
      expect(result).toEqual(mockTypes);
      expect(apiClient.get).toHaveBeenCalledWith('pqrs/types');
    });

    it('debe lanzar un error si falla la petición', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(PQRSService.getPQRSTypes()).rejects.toThrow(PQRSError);
    });
  });

  describe('getPQRSTypeById', () => {
    it('debe retornar un tipo de PQRS por id', async () => {
      const mockType = { id: '1', name: 'Petición' };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockType });

      const result = await PQRSService.getPQRSTypeById('1');
      expect(result).toEqual(mockType);
      expect(apiClient.get).toHaveBeenCalledWith('pqrs/types/1');
    });

    it('debe lanzar un error si falla la petición', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(PQRSService.getPQRSTypeById('1')).rejects.toThrow(PQRSError);
    });
  });

  describe('getStatusTypes', () => {
    it('debe retornar los estados de PQRS', async () => {
      const mockStatus = [{ id: '1', name: 'Pendiente' }];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockStatus });

      const result = await PQRSService.getStatusTypes();
      expect(result).toEqual(mockStatus);
      expect(apiClient.get).toHaveBeenCalledWith('pqrs/status');
    });

    it('debe lanzar un error si falla la petición', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(PQRSService.getStatusTypes()).rejects.toThrow(PQRSError);
    });
  });

  describe('getStatusById', () => {
    it('debe retornar un estado de PQRS por nombre', async () => {
      const mockStatus = { id: '1', name: 'Pendiente' };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockStatus });

      const result = await PQRSService.getStatusById('Pendiente');
      expect(result).toEqual(mockStatus);
      expect(apiClient.get).toHaveBeenCalledWith('pqrs/status/Pendiente');
    });

    it('debe lanzar un error si falla la petición', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(PQRSService.getStatusById('Pendiente')).rejects.toThrow(PQRSError);
    });
  });

  describe('getPQRS', () => {
    it('debe retornar PQRS en formato array', async () => {
      const mockPQRS = [{ id: '1', typeId: '1' }];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPQRS });
      jest.spyOn(PQRSService, 'getPQRSTypeById').mockResolvedValue({ id: '1', name: 'Petición' } as any);

      const result = await PQRSService.getPQRS();
      expect(result.items.length).toBe(1);
      expect(apiClient.get).toHaveBeenCalled();
    });

    it('debe retornar PQRS en formato paginado', async () => {
      const mockPQRS = { items: [{ id: '1', typeId: '1' }], total: 1, page: 1, limit: 10, totalPages: 1 };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPQRS });
      jest.spyOn(PQRSService, 'getPQRSTypeById').mockResolvedValue({ id: '1', name: 'Petición' } as any);

      const result = await PQRSService.getPQRS();
      expect(result.items.length).toBe(1);
      expect(apiClient.get).toHaveBeenCalled();
    });

    it('debe lanzar un error si falla la petición', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue({ message: 'fail', response: { data: { message: 'error' } } });
      await expect(PQRSService.getPQRS()).rejects.toThrow(PQRSError);
    });

    it('debe usar filtros y endpoint de admin', async () => {
      const mockPQRS = { items: [], total: 0, page: 1, limit: 10, totalPages: 1 };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPQRS });

      const filters = { type: { id: '1' } } as any;
      await PQRSService.getPQRS(1, 10, filters, true);
      expect(apiClient.get).toHaveBeenCalled();
    });
  });

  describe('getPQRSById', () => {
    it('debe retornar una PQRS por id', async () => {
      const mockPQRS = { id: '1', title: 'Test' };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPQRS });

      const result = await PQRSService.getPQRSById('1');
      expect(result).toEqual(mockPQRS);
      expect(apiClient.get).toHaveBeenCalled();
    });

    it('debe lanzar un error si falla la petición', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(PQRSService.getPQRSById('1')).rejects.toThrow(PQRSError);
    });
  });

  describe('createPQRS', () => {
    it('debe crear una PQRS sin adjuntos', async () => {
      const pqrsData = { title: 'Test', description: 'Desc', typeId: '1', priority: 'ALTA' };
      const mockResponse = { id: '1', ...pqrsData, type: { id: '1', name: 'Petición' } };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await PQRSService.createPQRS(pqrsData as any);
      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalled();
    });

    it('debe crear una PQRS con adjuntos', async () => {
      const pqrsData = {
        title: 'Test',
        description: 'Desc',
        typeId: '1',
        priority: 'ALTA',
        attachments: [new File(['foo'], 'foo.txt', { type: 'text/plain' })]
      };
      const mockResponse = { id: '1', ...pqrsData, type: { id: '1', name: 'Petición' } };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await PQRSService.createPQRS(pqrsData as any);
      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalled();
    });

    it('debe lanzar un error si falla la creación', async () => {
      (apiClient.post as jest.Mock).mockRejectedValue({ message: 'fail', response: { data: { message: 'error' } } });
      await expect(PQRSService.createPQRS({} as any)).rejects.toThrow(PQRSError);
    });
  });

  describe('updatePQRS', () => {
    it('debe actualizar una PQRS', async () => {
      const mockResponse = { id: '1', title: 'Actualizado' };
      (apiClient.put as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await PQRSService.updatePQRS('1', { title: 'Actualizado' } as any);
      expect(result).toEqual(mockResponse);
      expect(apiClient.put).toHaveBeenCalled();
    });

    it('debe lanzar un error si falla la actualización', async () => {
      (apiClient.put as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(PQRSService.updatePQRS('1', {} as any)).rejects.toThrow(PQRSError);
    });
  });

  describe('deletePQRS', () => {
    it('debe eliminar una PQRS', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({});
      await expect(PQRSService.deletePQRS('1')).resolves.toBeUndefined();
      expect(apiClient.delete).toHaveBeenCalled();
    });

    it('debe lanzar un error si falla el borrado', async () => {
      (apiClient.delete as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(PQRSService.deletePQRS('1')).rejects.toThrow(PQRSError);
    });
  });
});