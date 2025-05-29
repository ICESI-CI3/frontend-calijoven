import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import type {
  PQRS,
  CreatePQRSDto,
  UpdatePQRSDto,
  PQRSFilters,
  PaginatedPQRSResponse,
  PQRSStatusEntity,
  PQRSTypeEntity
} from '@/types/pqrs';

export class PQRSError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PQRSError';
  }
}

export const PQRSService = {
  // Obtener tipos de PQRS (petición, queja, etc.)
  async getPQRSTypes(): Promise<PQRSTypeEntity[]> {
    try {
      console.log('Fetching PQRS types...');
      const { data } = await apiClient.get('/typesPqrs');
      console.log('PQRS types response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching PQRS types:', error);
      throw new PQRSError('No se pudieron obtener los tipos de PQRS');
    }
  },

  // Obtener un tipo específico de PQRS
  async getPQRSTypeById(name: string): Promise<PQRSTypeEntity> {
    try {
      const { data } = await apiClient.get(`/typesPqrs/name/${name}`);
      return data;
    } catch (error) {
      console.error('Error fetching PQRS type by name:', error);
      throw new PQRSError('No se pudo obtener el tipo de PQRS');
    }
  },

  // Obtener estados de PQRS
  async getStatusTypes(): Promise<PQRSStatusEntity[]> {
    try {
      const { data } = await apiClient.get('/types');
      console.log('Estados de PQRS obtenidos:', data);
      return data;
    } catch (error) {
      console.error('Error fetching PQRS status types:', error);
      throw new PQRSError('No se pudieron obtener los estados de PQRS');
    }
  },

  // Obtener un estado específico de PQRS
  async getStatusById(name: string): Promise<PQRSStatusEntity> {
    try {
      const { data } = await apiClient.get(`/types/${name}`);
      console.log('Estado específico obtenido:', data);
      return data;
    } catch (error) {
      console.error('Error fetching PQRS status by name:', error);
      throw new PQRSError('No se pudo obtener el estado de PQRS');
    }
  },

  // Obtener PQRS con paginación y filtros
  async getPQRS(
    page = 1,
    limit = 10,
    filters?: PQRSFilters,
    isAdmin: boolean = false
  ): Promise<PaginatedPQRSResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.type?.name) {
        params.append('type', filters.type.name);
      }

      const endpoint = isAdmin ? API_ROUTES.PQRS.ADMIN.BASE : API_ROUTES.PQRS.BASE;
      const { data } = await apiClient.get(`${endpoint}?${params}`);
      
      // Si la respuesta es un array, la convertimos al formato paginado
      if (Array.isArray(data)) {
        return {
          items: data,
          total: data.length,
          page: 1,
          limit: data.length,
          totalPages: 1
        };
      }

      // Si ya viene en formato paginado, lo retornamos tal cual
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
        priority: restData.priority?.toLowerCase(),
        status: 'pending' // Establecer el estado pending directamente
      };

      console.log('Datos de PQRS a crear:', {
        originalPriority: pqrsData.priority,
        normalizedPriority: requestData.priority,
        status: requestData.status,
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
      console.log('Actualizando PQRS:', { id, data: pqrsData });
      const { data } = await apiClient.put(
        API_ROUTES.PQRS.BY_ID(id),
        pqrsData
      );
      console.log('PQRS actualizada:', data);
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