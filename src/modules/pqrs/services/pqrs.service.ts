import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import type {
  PQRS,
  CreatePQRSDto,
  UpdatePQRSDto,
  PQRSFilters,
  PaginatedPQRSResponse,
  PQRSTypeEntity
} from '@/types/pqrs';

export class PQRSError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PQRSError';
  }
}

export const PQRSService = {
  // Obtener tipos de PQRS
  async getPQRSTypes(): Promise<PQRSTypeEntity[]> {
    // Retornamos tipos que coinciden con la estructura del backend y frontend
    return [
      { id: '1', name: 'petition', label: 'Petición' },
      { id: '2', name: 'complaint', label: 'Queja' },
      { id: '3', name: 'claim', label: 'Reclamo' },
      { id: '4', name: 'suggestion', label: 'Sugerencia' }
    ];
  },

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
      });

      if (filters?.status?.name) {
        params.append('status', filters.status.name);
      }

      const { data } = await apiClient.get(`${API_ROUTES.PQRS.BASE}?${params}`);
      return data;
    } catch (error: any) {
      console.error('Error fetching PQRS:', error);
      throw new PQRSError(
        error.response?.data?.message || 
        'No se pudieron obtener las PQRS'
      );
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
      const { attachments, ...restData } = pqrsData;
      
      const requestData = {
        ...restData,
        priority: restData.priority?.toLowerCase()
      };

      console.log('Datos de PQRS a crear:', {
        originalPriority: pqrsData.priority,
        normalizedPriority: requestData.priority,
        fullData: requestData
      });

      if (!attachments || attachments.length === 0) {
        const { data } = await apiClient.post(API_ROUTES.PQRS.BASE, requestData);
        console.log('Respuesta de creación de PQRS:', data);
        return data;
      }

      const formData = new FormData();
      formData.append('data', JSON.stringify(requestData));
      
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      const { data } = await apiClient.post(API_ROUTES.PQRS.BASE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating PQRS:', {
        error: error,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestConfig: error.config
      });
      
      if (error.response) {
        const message = error.response.data?.message;
        if (Array.isArray(message)) {
          throw new PQRSError(message.join(', '));
        }
        throw new PQRSError(message || 'No se pudo crear la PQRS');
      } else if (error.request) {
        throw new PQRSError('No se recibió respuesta del servidor. Verifica tu conexión a internet.');
      } else {
        throw new PQRSError(`Error al crear la PQRS: ${error.message}`);
      }
    }
  },

  // Actualizar una PQRS existente
  async updatePQRS(id: string, pqrsData: UpdatePQRSDto): Promise<PQRS> {
    try {
      const { data } = await apiClient.put(
        API_ROUTES.PQRS.BY_ID(id),
        pqrsData,
        {
          withCredentials: true
        }
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
      await apiClient.delete(API_ROUTES.PQRS.BY_ID(id), {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error deleting PQRS:', error);
      throw new PQRSError('No se pudo eliminar la PQRS');
    }
  }
};

export default PQRSService; 