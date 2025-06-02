import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import type { Publication } from '@/types/publication';

export class SavedPublicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SavedPublicationError';
  }
}

interface SavedPublication {
  id: string;
  publication: Publication;
  savedAt: string;
}

type SavedPublicationsResponse = {
  data: SavedPublication[];
  total: number;
};

/**
 * Servicio que encapsula la lógica de publicaciones guardadas
 */
export const SavedPublicationService = {
  /**
   * Guarda una publicación para el usuario actual
   */
  async savePublication(publicationId: string): Promise<void> {
    try {
      console.log('Intentando guardar publicación:', publicationId);
      await apiClient.post(`${API_ROUTES.SAVED_POSTS.BY_PUBLICATION(publicationId)}`);
      console.log('Publicación guardada exitosamente');
    } catch (error) {
      console.error('Failed to save publication:', error);
      throw new SavedPublicationError('No se pudo guardar la publicación.');
    }
  },

  /**
   * Elimina una publicación guardada del usuario actual
   */
  async unsavePublication(publicationId: string): Promise<void> {
    try {
      console.log('Intentando eliminar publicación guardada:', publicationId);
      await apiClient.delete(`${API_ROUTES.SAVED_POSTS.BY_PUBLICATION(publicationId)}`);
      console.log('Publicación eliminada exitosamente');
    } catch (error) {
      console.error('Failed to unsave publication:', error);
      throw new SavedPublicationError('No se pudo eliminar la publicación guardada.');
    }
  },

  /**
   * Obtiene todas las publicaciones guardadas del usuario actual
   */
  async getMySavedPublications(page = 1, limit = 10): Promise<SavedPublicationsResponse> {
    try {
      console.log('Obteniendo publicaciones guardadas - página:', page, 'límite:', limit);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const { data } = await apiClient.get(`${API_ROUTES.SAVED_POSTS.BASE}?${params}`);
      console.log('Publicaciones guardadas recibidas:', data);

      // Asegurarse de que los datos tengan el formato correcto
      if (Array.isArray(data)) {
        return {
          data,
          total: data.length
        };
      }

      // Si ya viene en el formato correcto
      if (data.data && typeof data.total === 'number') {
        return data;
      }

      // Si no hay datos o el formato es incorrecto
      return {
        data: [],
        total: 0
      };
    } catch (error) {
      console.error('Failed to fetch saved publications:', error);
      throw new SavedPublicationError('No se pudieron obtener las publicaciones guardadas.');
    }
  },

  /**
   * Verifica si una publicación está guardada por el usuario actual
   */
  async isPublicationSaved(publicationId: string): Promise<boolean> {
    try {
      console.log('Verificando si la publicación está guardada:', publicationId);
      // Obtener todas las publicaciones guardadas y verificar si existe la publicación
      const { data } = await this.getMySavedPublications();
      return data.some(saved => saved.publication.id === publicationId);
    } catch (error) {
      console.error('Failed to check if publication is saved:', error);
      throw new SavedPublicationError('No se pudo verificar si la publicación está guardada.');
    }
  }
};

export const savedPublicationService = SavedPublicationService; 