import { apiClient } from './client';
import { API_ROUTES } from '../constants/api';

export type OfferType = {
  id: string;
  name: string;
  description?: string;
};

/**
 * Servicio para gestionar tipos de ofertas
 */
export const offerTypesService = {
  /**
   * Obtiene el listado de tipos de ofertas
   */
  async getOfferTypes(): Promise<OfferType[]> {
    try {
      const { data } = await apiClient.get(API_ROUTES.OFFER_TYPES.BASE);
      return data;
    } catch (error) {
      console.error('Failed to fetch offer types:', error);
      throw new Error('No se pudieron obtener los tipos de ofertas');
    }
  },

  /**
   * Obtiene un tipo de oferta por su ID
   */
  async getOfferType(id: string): Promise<OfferType> {
    try {
      const { data } = await apiClient.get(API_ROUTES.OFFER_TYPES.BY_ID(id));
      return data;
    } catch (error) {
      console.error(`Failed to fetch offer type with ID ${id}:`, error);
      throw new Error('No se pudo obtener el tipo de oferta');
    }
  },
}; 