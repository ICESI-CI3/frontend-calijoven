import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';

export class PDJError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PDJError';
  }
}

export const PDJService = {
  async getDocuments(organizationId: string): Promise<any[]> {
    try {
      console.log('Fetching PDJ documents');
      const { data } = await apiClient.get(
        API_ROUTES.DOCUMENTS.BY_ORGANIZATION(organizationId)
      );
      return data;
    } catch (error) {
      console.error('Error fetching PDJ documents:', error);
      throw new PDJError('No se pudieron obtener los documentos');
    }
  }
}; 