import { SavedPublicationService, SavedPublicationError } from '../saved-publications.service';
import apiClient from '@/lib/api/client';

jest.mock('@/lib/api/client', () => ({
  post: jest.fn(),
  delete: jest.fn(),
  get: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('SavedPublicationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('savePublication', () => {
    it('debe guardar una publicación', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({});
      await expect(SavedPublicationService.savePublication('pub1')).resolves.toBeUndefined();
      expect(apiClient.post).toHaveBeenCalled();
    });

    it('debe lanzar error si falla el guardado', async () => {
      (apiClient.post as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(SavedPublicationService.savePublication('pub1')).rejects.toThrow(SavedPublicationError);
    });
  });

  describe('unsavePublication', () => {
    it('debe eliminar una publicación guardada', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({});
      await expect(SavedPublicationService.unsavePublication('pub1')).resolves.toBeUndefined();
      expect(apiClient.delete).toHaveBeenCalled();
    });

    it('debe lanzar error si falla la eliminación', async () => {
      (apiClient.delete as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(SavedPublicationService.unsavePublication('pub1')).rejects.toThrow(SavedPublicationError);
    });
  });

  describe('getMySavedPublications', () => {
    it('debe retornar publicaciones guardadas en formato array', async () => {
      const mockData = [{ id: '1', publication: { id: 'pub1' }, savedAt: '2024-01-01' }];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await SavedPublicationService.getMySavedPublications();
      expect(result).toEqual({ data: mockData, total: 1 });
      expect(apiClient.get).toHaveBeenCalled();
    });

    it('debe retornar publicaciones guardadas en formato paginado', async () => {
      const mockData = { data: [{ id: '1', publication: { id: 'pub1' }, savedAt: '2024-01-01' }], total: 1 };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await SavedPublicationService.getMySavedPublications();
      expect(result).toEqual(mockData);
      expect(apiClient.get).toHaveBeenCalled();
    });

    it('debe lanzar error si el formato es incorrecto', async () => {
  (apiClient.get as jest.Mock).mockResolvedValue({ data: null });
  await expect(SavedPublicationService.getMySavedPublications()).rejects.toThrow(SavedPublicationError);
    });

    it('debe lanzar error si falla la petición', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(SavedPublicationService.getMySavedPublications()).rejects.toThrow(SavedPublicationError);
    });
  });

  describe('isPublicationSaved', () => {
    it('debe retornar true si la publicación está guardada', async () => {
      const mockData = { data: [{ id: '1', publication: { id: 'pub1' }, savedAt: '2024-01-01' }], total: 1 };
      jest.spyOn(SavedPublicationService, 'getMySavedPublications').mockResolvedValue(mockData as any);

      const result = await SavedPublicationService.isPublicationSaved('pub1');
      expect(result).toBe(true);
    });

    it('debe retornar false si la publicación no está guardada', async () => {
      const mockData = { data: [{ id: '1', publication: { id: 'pub2' }, savedAt: '2024-01-01' }], total: 1 };
      jest.spyOn(SavedPublicationService, 'getMySavedPublications').mockResolvedValue(mockData as any);

      const result = await SavedPublicationService.isPublicationSaved('pub1');
      expect(result).toBe(false);
    });

    it('debe lanzar error si falla la petición', async () => {
      jest.spyOn(SavedPublicationService, 'getMySavedPublications').mockRejectedValue(new Error('fail'));
      await expect(SavedPublicationService.isPublicationSaved('pub1')).rejects.toThrow(SavedPublicationError);
    });
  });
});