import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import type {
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationFilters,
  MemberOrganizationDto,
  PaginatedResponse
} from '@/types/organization';

export class OrganizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrganizationError';
  }
}

export type OrganizationResponse = PaginatedResponse<Organization>;

/**
 * Servicio que encapsula la lógica de organizaciones con el backend
 */
export const OrganizationService = {
  /**
   * Obtiene un listado paginado de organizaciones
   */
  async getOrganizations(filters: OrganizationFilters = {}): Promise<OrganizationResponse> {
    try {
      const { page = 1, limit = 10, order = 'ASC', search, public: isPublic } = filters;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        order
      });

      if (search) params.append('search', search);
      if (typeof isPublic === 'boolean') params.append('public', isPublic.toString());

      const { data } = await apiClient.get(`${API_ROUTES.ORGANIZATIONS.BASE}?${params}`);
      return data;
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      throw new OrganizationError('No se pudieron obtener las organizaciones.');
    }
  },

  /**
   * Obtiene una organización por su ID
   */
  async getOrganization(id: string): Promise<Organization> {
    try {
      const { data } = await apiClient.get(API_ROUTES.ORGANIZATIONS.BY_ID(id));
      return data;
    } catch (error) {
      console.error('Failed to fetch organization:', error);
      throw new OrganizationError('No se pudo obtener la organización.');
    }
  },

  /**
   * Crea una nueva organización
   */
  async createOrganization(organizationData: CreateOrganizationDto): Promise<Organization> {
    try {
      const { data } = await apiClient.post(API_ROUTES.ORGANIZATIONS.BASE, organizationData);
      return data;
    } catch (error) {
      console.error('Failed to create organization:', error);
      throw new OrganizationError('No se pudo crear la organización.');
    }
  },

  /**
   * Actualiza una organización existente
   */
  async updateOrganization(id: string, organizationData: UpdateOrganizationDto): Promise<Organization> {
    try {
      const { data } = await apiClient.put(API_ROUTES.ORGANIZATIONS.BY_ID(id), organizationData);
      return data;
    } catch (error) {
      console.error('Failed to update organization:', error);
      throw new OrganizationError('No se pudo actualizar la organización.');
    }
  },

  /**
   * Agrega un usuario a una organización
   */
  async addMember(organizationId: string, userId: string): Promise<Organization> {
    try {
      const memberData: MemberOrganizationDto = { userId };
      const { data } = await apiClient.post(
        API_ROUTES.ORGANIZATIONS.MEMBERS(organizationId),
        memberData
      );
      return data;
    } catch (error) {
      console.error('Failed to add member to organization:', error);
      throw new OrganizationError('No se pudo agregar el miembro a la organización.');
    }
  },

  /**
   * Elimina un usuario de una organización
   */
  async removeMember(organizationId: string, userId: string): Promise<Organization> {
    try {
      const { data } = await apiClient.delete(
        API_ROUTES.ORGANIZATIONS.MEMBER(organizationId, userId)
      );
      return data;
    } catch (error) {
      console.error('Failed to remove member from organization:', error);
      throw new OrganizationError('No se pudo eliminar el miembro de la organización.');
    }
  }
};

export const organizationService = OrganizationService; 