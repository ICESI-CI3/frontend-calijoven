import apiClient from "@/lib/api/client";
import { API_ROUTES } from "@/lib/constants/api";
import { City } from "@/types/city";

export class CityError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CityError';
    }
}

type CityResposne = {
    data: City[],
    total: number,
    page: number,
    totalPages: number
}

export const CityService = {
    async getCities(): Promise<CityResposne> {
        try {
            const { data } = await apiClient.get(API_ROUTES.GOVERNANCE.CITIES.BASE)
            return data
        } catch (error) {
            console.error('Failed to fetch cities:', error);
            throw new CityError('No se pudieron obtener las ciudades.');
        }
    }
}
