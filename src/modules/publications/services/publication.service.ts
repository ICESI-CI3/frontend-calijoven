import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import { publicationTypes } from '@/lib/constants/publicationTypes';
import type {
  Publication,
  CreatePublicationDto,
  UpdatePublicationDto,
  PublicationFilters,
  FilterPublicationDto,
  ReportFilters,
  Tag
} from '@/types/publication';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export class PublicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PublicationError';
  }
}

type PublicationResponse = {
  data: Publication[];
  total: number;
};

/**
 * Servicio que encapsula la lógica de publicaciones con el backend
 */
export const PublicationService = {
  /**
   * Obtiene un listado paginado de publicaciones
   */
  async getPublications(filters: PublicationFilters = {}, page = 1, limit = 10): Promise<PublicationResponse> {
    try {
      console.log('Getting publications with filters:', filters);
      const filterParams: FilterPublicationDto = {
        page,
        limit,
        tag: filters.tag,
        city: filters.city,
        ...(filters.type !== '' && { type: filters.type }),
        unpublished: filters.unpublished,
        organization: filters.organization,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      console.log('Filter params:', filterParams);

      const params = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filterParams)
            .filter(([_, v]) => v != null)
            .map(([k, v]) => [k, v.toString()])
        )
      );

      if (filters.search) {
        params.append('search', filters.search);
      }

      const url = `${API_ROUTES.PUBLICATIONS.BASE}?${params}`;
      console.log('Making request to:', url);

      const { data } = await apiClient.get(url);
      console.log('Publications response:', data);
      return data;
    } catch (error) {
      console.error('Failed to fetch publications:', error);
      throw new PublicationError('No se pudieron obtener las publicaciones.');
    }
  },

  /**
   * Obtiene una publicación por su ID
   */
  async getPublication(id: string): Promise<Publication> {
    try {
      const { data } = await apiClient.get(`${API_ROUTES.PUBLICATIONS.BASE}/${id}`);
      return data;
    } catch (error) {
      console.error('Failed to fetch publication:', error);
      throw new PublicationError('No se pudo obtener la publicación.');
    }
  },

  /**
   * Crea una nueva publicación
   */
  async createPublication(publicationData: CreatePublicationDto): Promise<Publication> {
    try { 
      const formData = new FormData();

      // Agregar datos básicos
      formData.append('title', publicationData.title);
      formData.append('description', publicationData.description);
      formData.append('content', publicationData.content);
      formData.append('type', publicationData.type);

      if (publicationData.published !== undefined) {
        formData.append('published', String(publicationData.published));
      }

      // Agregar ciudades
      if (publicationData.cities && publicationData.cities.length > 0) {
        publicationData.cities.forEach((cityId) => {
          formData.append('cities', cityId);
        });
      }

      // Agregar organizadores
      if (publicationData.organizers && publicationData.organizers.length > 0) {
        publicationData.organizers.forEach((organizerId) => {
          formData.append('organizers', organizerId);
        });
      }

      // Agregar tags
      if (publicationData.tags && publicationData.tags.length > 0) {
        formData.append('tags', JSON.stringify(publicationData.tags));
      }

      // Agregar datos específicos según el tipo
      if (publicationData.type === publicationTypes.event.value && publicationData.event) {
        formData.append(publicationTypes.event.value, JSON.stringify(publicationData.event));
      } else if (publicationData.type === publicationTypes.news.value && publicationData.news) {
        formData.append(publicationTypes.news.value, JSON.stringify(publicationData.news));
      } else if (publicationData.type === publicationTypes.offer.value && publicationData.offer) {
        formData.append(publicationTypes.offer.value, JSON.stringify(publicationData.offer));
      }

      // Agregar archivos adjuntos
      if (publicationData.attachments && publicationData.attachments.length > 0) {
        publicationData.attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }

      const { data } = await apiClient.post(API_ROUTES.PUBLICATIONS.BASE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data;
    } catch (error) {
      console.error('Failed to create publication:', error);
      throw new PublicationError('No se pudo crear la publicación.');
    }
  },

  /**
   * Actualiza una publicación existente
   */
  async updatePublication(id: string, publicationData: UpdatePublicationDto): Promise<Publication> {
    try {
      const formData = new FormData();

      // Agregar datos básicos si existen
      if (publicationData.title) formData.append('title', publicationData.title);
      if (publicationData.description) formData.append('description', publicationData.description);
      if (publicationData.content) formData.append('content', publicationData.content);
      if (publicationData.type) formData.append('type', publicationData.type);

      if (publicationData.published !== undefined) {
        formData.append('published', String(publicationData.published));
      }

      // Agregar ciudades
      if (publicationData.cities && publicationData.cities.length > 0) {
        publicationData.cities.forEach((cityId) => {
          formData.append('cities', cityId);
        });
      }

      // Agregar organizadores
      if (publicationData.organizers && publicationData.organizers.length > 0) {
        publicationData.organizers.forEach((organizerId) => {
          formData.append('organizers', organizerId);
        });
      }

      // Agregar tags
      if (publicationData.tags && publicationData.tags.length > 0) {
        formData.append('tags', JSON.stringify(publicationData.tags));
      }

      // Agregar datos específicos según el tipo
      if (publicationData.type === publicationTypes.event.value && publicationData.event) {
        formData.append(publicationTypes.event.value, JSON.stringify(publicationData.event));
      } else if (publicationData.type === publicationTypes.news.value && publicationData.news) {
        formData.append(publicationTypes.news.value, JSON.stringify(publicationData.news));
      } else if (publicationData.type === publicationTypes.offer.value && publicationData.offer) {
        formData.append(publicationTypes.offer.value, JSON.stringify(publicationData.offer));
      }

      // Agregar archivos adjuntos a eliminar
      if (publicationData.attachmentsToDelete && publicationData.attachmentsToDelete.length > 0) {
        formData.append('attachmentsToDelete', JSON.stringify(publicationData.attachmentsToDelete));
      }

      // Agregar archivos adjuntos nuevos
      if (publicationData.attachments && publicationData.attachments.length > 0) {
        publicationData.attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }

      const { data } = await apiClient.put(`${API_ROUTES.PUBLICATIONS.BASE}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data;
    } catch (error) {
      console.error('Failed to update publication:', error);
      throw new PublicationError('No se pudo actualizar la publicación.');
    }
  },

  /**
   * Elimina una publicación
   */
  async deletePublication(id: string): Promise<void> {
    try {
      await apiClient.delete(`${API_ROUTES.PUBLICATIONS.BASE}/${id}`);
    } catch (error) {
      console.error('Failed to delete publication:', error);
      throw new PublicationError('No se pudo eliminar la publicación.');
    }
  },

  /**
   * Genera un reporte general de publicaciones
   */
  async generateGeneralReport(name: string, filters: ReportFilters = {}): Promise<Blob> {
    try {
      const { data } = await apiClient.post(API_ROUTES.REPORTS.PUBLICATION.GENERAL, { name, filters }, {
        responseType: 'blob'
      });
      return data;
    } catch (error) {
      console.error('Failed to generate general report:', error);
      throw new PublicationError('No se pudo generar el reporte general.');
    }
  },

  /**
   * Genera un reporte de una publicación específica
   */
  async generateSingleReport(id: string, name: string): Promise<Blob> {
    try {
      const { data } = await apiClient.post(`${API_ROUTES.REPORTS.PUBLICATION.BY_ID(id)}`, { name }, {
        responseType: 'blob'
      });
      return data;
    } catch (error) {
      console.error('Failed to generate single report:', error);
      throw new PublicationError('No se pudo generar el reporte individual.');
    }
  },

  /**
   * Búsqueda paginada de tags
   */
  async searchTags(search: string, page: number = 1, limit: number = 50): Promise<PaginatedResponse<Tag>> {
    try {
      const { data } = await apiClient.get(`${API_ROUTES.PUBLICATIONS.BASE}/tags`, {
        params: {
          search,
          page,
          limit,
        },
      });
      return data;
    } catch (error) {
      console.error('Error searching tags:', error);
      throw new Error('No se pudieron buscar las etiquetas');
    }
  },
};

export const publicationService = PublicationService;
