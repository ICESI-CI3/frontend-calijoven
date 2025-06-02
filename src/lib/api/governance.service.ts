import { apiClient } from './client';
import { API_ROUTES } from '../constants/api';
import { BaseCity, City } from '@/types/city';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Servicio para gestionar datos de gobernanza (ciudades, departamentos, comunas)
 */
export const governanceService = {
  /**
   * Obtiene el listado de ciudades
   */
  async getCities(): Promise<BaseCity[]> {
    try {
      const { data } = await apiClient.get(API_ROUTES.GOVERNANCE.CITIES.BASE);
      return data;
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      throw new Error('No se pudieron obtener las ciudades');
    }
  },

  /**
   * Búsqueda paginada de ciudades
   */
  async searchCities(search: string, page: number = 1, limit: number = 50): Promise<PaginatedResponse<BaseCity>> {
    try {
      const { data } = await apiClient.get(API_ROUTES.GOVERNANCE.CITIES.BASE, {
        params: {
          search,
          page,
          limit,
        },
      });
      return data;
    } catch (error) {
      console.error('Failed to search cities:', error);
      throw new Error('No se pudieron buscar las ciudades');
    }
  },

  /**
   * Obtiene el listado de ciudades por departamento
   */
  async getCitiesByDepartment(departmentId: number): Promise<City[]> {
    try {
      const { data } = await apiClient.get(API_ROUTES.GOVERNANCE.CITIES.BY_DEPARTMENT(departmentId));
      return data;
    } catch (error) {
      console.error('Failed to fetch cities by department:', error);
      throw new Error('No se pudieron obtener las ciudades del departamento');
    }
  },

  /**
   * Obtiene el listado de departamentos
   */
  async getDepartments() {
    try {
      const { data } = await apiClient.get(API_ROUTES.GOVERNANCE.DEPARTMENTS.BASE);
      return data;
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw new Error('No se pudieron obtener los departamentos');
    }
  },
}; 