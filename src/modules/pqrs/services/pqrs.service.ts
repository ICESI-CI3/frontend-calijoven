import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import type {
  PQRS,
  CreatePQRSDto,
  UpdatePQRSDto,
  PQRSFilters,
  PaginatedPQRSResponse,
  PQRSStatusEntity,
  PQRSTypeEntity,
  AdminPQRSFilters,
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
      const { data } = await apiClient.get('pqrs/types');
      console.log('PQRS types response:', {
        data,
        count: Array.isArray(data) ? data.length : 0,
        firstType: Array.isArray(data) && data.length > 0 ? data[0] : null,
      });
      return data;
    } catch (error) {
      console.error('Error fetching PQRS types:', error);
      throw new PQRSError('No se pudieron obtener los tipos de PQRS');
    }
  },

  // Obtener un tipo específico de PQRS
  async getPQRSTypeById(id: string): Promise<PQRSTypeEntity> {
    try {
      console.log('Fetching PQRS type by ID:', id);
      const { data } = await apiClient.get(`pqrs/types/${id}`);
      console.log('PQRS type response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching PQRS type by ID:', error);
      throw new PQRSError('No se pudo obtener el tipo de PQRS');
    }
  },

  // Obtener estados de PQRS
  async getStatusTypes(): Promise<PQRSStatusEntity[]> {
    try {
      const { data } = await apiClient.get('pqrs/status');
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
      const { data } = await apiClient.get(`pqrs/status/${name}`);
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
        relations: 'type,status,user',
      });

      if (filters?.type?.id) {
        params.append('typeId', filters.type.id);
      }

      const endpoint = isAdmin ? API_ROUTES.PQRS.ADMIN.BASE : API_ROUTES.PQRS.BASE;
      console.log('Fetching PQRS with params:', {
        endpoint,
        url: `${endpoint}?${params}`,
        params: Object.fromEntries(params.entries()),
        filters,
      });

      const { data } = await apiClient.get(`${endpoint}?${params}`);

      // Si la respuesta es un array, la convertimos al formato paginado y aseguramos que tenga toda la información
      if (Array.isArray(data)) {
        console.log('PQRS response is array, first item:', data[0]);
        const items = await Promise.all(
          data.map(async (item: PQRS) => {
            if (!item.type && item.typeId) {
              try {
                console.log('Fetching missing type for PQRS:', {
                  pqrsId: item.id,
                  typeId: item.typeId,
                });
                const type = await PQRSService.getPQRSTypeById(item.typeId);
                console.log('Found type:', type);
                return { ...item, type };
              } catch (error) {
                console.error('Error fetching type for PQRS:', {
                  pqrsId: item.id,
                  typeId: item.typeId,
                  error,
                });
                return item;
              }
            }
            return item;
          })
        );

        return {
          items,
          total: items.length,
          page: 1,
          limit: items.length,
          totalPages: 1,
        };
      }

      // Si ya viene en formato paginado, aseguramos que tenga toda la información
      if (data.items) {
        console.log('PQRS response is paginated, first item:', data.items[0]);
        const items = await Promise.all(
          data.items.map(async (item: PQRS) => {
            if (!item.type && item.typeId) {
              try {
                console.log('Fetching missing type for PQRS:', {
                  pqrsId: item.id,
                  typeId: item.typeId,
                });
                const type = await PQRSService.getPQRSTypeById(item.typeId);
                console.log('Found type:', type);
                return { ...item, type };
              } catch (error) {
                console.error('Error fetching type for PQRS:', {
                  pqrsId: item.id,
                  typeId: item.typeId,
                  error,
                });
                return item;
              }
            }
            return item;
          })
        );

        return {
          ...data,
          items,
        };
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching PQRS:', {
        error,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new PQRSError(error.response?.data?.message || 'No se pudieron obtener las PQRS');
    }
  },

  // Add this method to the PQRSService in src/modules/pqrs/services/pqrs.service.ts

  // Obtener todas las PQRS para administradores con filtros avanzados
  async getAdminPQRS(filters: AdminPQRSFilters = {}): Promise<PaginatedPQRSResponse> {
    try {

      const params = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters)
            .filter(([_, v]) => v != null)
            .map(([k, v]) => [k, v.toString()])
        )
      );

      const { data: response } = await apiClient.get(`/admin/pqrs?${params}`);

      // Convertir la respuesta al formato esperado
      const items = response.data || [];
      const total = response.total || 0;
      const totalPages = Math.ceil(total / (filters.limit || 10));

      return {
        items,
        total,
        page: filters.page || 1,
        limit: filters.limit || 10,
        totalPages,
      };
    } catch {
      throw new PQRSError('No se pudieron obtener las PQRS para administración');
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

      // Si no hay archivos adjuntos, enviar como JSON
      if (!attachments || attachments.length === 0) {
        const requestData = {
          ...restData,
          priority: restData.priority?.toLowerCase(),
          status: 'pending',
          type: restData.typeId,
        };

        console.log('Enviando PQRS como JSON:', {
          requestData,
          url: API_ROUTES.PQRS.BASE,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const { data } = await apiClient.post(API_ROUTES.PQRS.BASE, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('PQRS creada (JSON):', {
          response: data,
          type: data.type,
          typeId: data.typeId || requestData.typeId,
        });

        // Si la respuesta no incluye el tipo completo pero tenemos el typeId, obtenerlo
        if (!data.type && (data.typeId || requestData.typeId)) {
          try {
            const typeId = data.typeId || requestData.typeId;
            console.log('Obteniendo tipo después de crear:', typeId);
            const type = await PQRSService.getPQRSTypeById(typeId);
            return { ...data, type, typeId };
          } catch (error) {
            console.error('Error fetching type after creation:', error);
            return data;
          }
        }

        return data;
      }

      // Si hay archivos adjuntos, usar FormData
      const formData = new FormData();

      // Agregar los campos como strings individuales
      formData.append('title', String(restData.title || '').trim());
      formData.append('description', String(restData.description || '').trim());
      formData.append('typeId', String(restData.typeId || ''));
      formData.append('type', String(restData.typeId || ''));

      if (restData.priority) {
        formData.append('priority', restData.priority.toLowerCase());
      }

      formData.append('status', 'pending');

      // Agregar los archivos
      if (attachments) {
        attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }

      console.log('Enviando PQRS como FormData:', {
        fields: {
          title: String(restData.title || '').trim(),
          description: String(restData.description || '').trim(),
          typeId: String(restData.typeId || ''),
          type: String(restData.typeId || ''),
          priority: restData.priority?.toLowerCase(),
          status: 'pending',
        },
        attachmentsCount: attachments?.length || 0,
        url: API_ROUTES.PQRS.BASE,
      });

      const { data } = await apiClient.post(API_ROUTES.PQRS.BASE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('PQRS creada (FormData):', {
        response: data,
        type: data.type,
        typeId: data.typeId || restData.typeId,
      });

      // Si la respuesta no incluye el tipo completo pero tenemos el typeId, obtenerlo
      if (!data.type && (data.typeId || restData.typeId)) {
        try {
          const typeId = data.typeId || restData.typeId;
          console.log('Obteniendo tipo después de crear:', typeId);
          const type = await PQRSService.getPQRSTypeById(typeId);
          return { ...data, type, typeId };
        } catch (error) {
          console.error('Error fetching type after creation:', error);
          return data;
        }
      }

      return data;
    } catch (error: any) {
      console.error('Error creating PQRS:', {
        error,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: pqrsData,
      });

      let errorMessage = 'No se pudo crear la PQRS: ';

      if (error.response?.data?.message) {
        const message = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(', ')
          : error.response.data.message;
        errorMessage += message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Error desconocido';
      }

      throw new PQRSError(errorMessage);
    }
  },

  // Actualizar una PQRS existente
  async updatePQRS(id: string, pqrsData: UpdatePQRSDto, isAdmin: boolean = false): Promise<PQRS> {
    try {
      console.log('Actualizando PQRS:', { id, data: pqrsData, isAdmin });
      const endpoint = isAdmin ? API_ROUTES.PQRS.ADMIN.BY_ID(id) : API_ROUTES.PQRS.BY_ID(id);
      const { data } = await apiClient.put(endpoint, pqrsData);
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
        withCredentials: true,
      });
    } catch (error) {
      console.error('Error deleting PQRS:', error);
      throw new PQRSError('No se pudo eliminar la PQRS');
    }
  },
};

export default PQRSService;
