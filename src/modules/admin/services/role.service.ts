import apiClient from "@/lib/api/client";
import { API_ROUTES } from "@/lib/constants/api";
import { Role } from "@/types/user";

export class RoleError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'RoleError';
    }
}

export const RoleService = {
    async getRoles(): Promise<Role[]> {
        try {
            const { data } = await apiClient.get(API_ROUTES.ROLE.BASE);
            return data;
        } catch (error) {
            console.error('Failed to fetch roles:', error);
            throw new RoleError('No se pudieron obtener los roles.');
        }
    },
}