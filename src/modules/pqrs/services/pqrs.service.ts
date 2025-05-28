import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import type {
  PQRS,
  CreatePQRSDto,
  UpdatePQRSDto,
  PQRSFilters,
  PaginatedPQRSResponse
} from '@/types/pqrs';

export class PQRSError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PQRSError';
  }
}

export const PQRSService = {
  // Obtener PQRS con paginación y filtros
  async getPQRS(
    page = 1,
    limit = 10,
    filters?: PQRSFilters
  ): Promise<PaginatedPQRSResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.priority && { priority: filters.priority }),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.startDate && { startDate: filters.startDate }),
        ...(filters?.endDate && { endDate: filters.endDate })
      });

      const { data } = await apiClient.get(`${API_ROUTES.PQRS.BASE}?${params}`);
      return data;
    } catch (error) {
      console.error('Error fetching PQRS:', error);
      throw new PQRSError('No se pudieron obtener las PQRS');
    }
  },

  // Obtener una PQRS específica
  async getPQRSById(id: string): Promise<PQRS> {
    try {
      const { data } = await apiClient.get(API_ROUTES.PQRS.BY_ID(id));
      return data;
    } catch (error) {
      console.error('Error fetching PQRS by ID:', error);
      throw new PQRSError('No se pudo obtener la PQRS');
    }
  },

  // Crear una nueva PQRS
  async createPQRS(pqrsData: CreatePQRSDto): Promise<PQRS> {
    try {
      const formData = new FormData();
      
      // Agregar datos básicos
      formData.append('title', pqrsData.title);
      formData.append('description', pqrsData.description);
      formData.append('type', pqrsData.type);
      
      if (pqrsData.category) {
        formData.append('category', pqrsData.category);
      }

      if (pqrsData.priority) {
        formData.append('priority', pqrsData.priority);
      }

      // Agregar archivos adjuntos si existen
      if (pqrsData.attachments && pqrsData.attachments.length > 0) {
        pqrsData.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      const { data } = await apiClient.post(API_ROUTES.PQRS.BASE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return data;
    } catch (error) {
      console.error('Error creating PQRS:', error);
      throw new PQRSError('No se pudo crear la PQRS');
    }
  },

  // Actualizar una PQRS existente
  async updatePQRS(id: string, pqrsData: UpdatePQRSDto): Promise<PQRS> {
    try {
      const { data } = await apiClient.put(
        API_ROUTES.PQRS.BY_ID(id),
        pqrsData
      );
      return data;
    } catch (error) {
      console.error('Error updating PQRS:', error);
      throw new PQRSError('No se pudo actualizar la PQRS');
    }
  },

  // Eliminar una PQRS
  async deletePQRS(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ROUTES.PQRS.BY_ID(id));
    } catch (error) {
      console.error('Error deleting PQRS:', error);
      throw new PQRSError('No se pudo eliminar la PQRS');
    }
  }
};

export default PQRSService; 