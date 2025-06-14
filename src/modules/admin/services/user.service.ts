import apiClient from "@/lib/api/client";
import { API_ROUTES } from "@/lib/constants/api";
import { CreateUserDto, getUser, User, UserFilters, UserUpdateRequest } from "@/types/user";

export class UserError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'UserError';
    }
}

type UserResponse = {
    data: getUser[];
    total: number;
}

export const UserService = {
    async getUsers(
        filters: UserFilters = {},
        page: number = 1, 
        limit: number = 10
    ): Promise<UserResponse> {
        try {
            const params = new URLSearchParams();

            // Agregar parámetros de paginación
            params.append('page', page.toString());
            params.append('limit', limit.toString());

            // Agregar filtros si existen
            if (filters.name) {
                params.append('name', filters.name);
            }
        
            const { data } = await apiClient.get(`${API_ROUTES.USER.BASE}?${params}`);
            return data;
        } catch (error) {
            console.error('Failed to fetch users:', error);
            throw new UserError('No se pudieron obtener los usuarios.');
        }
    },

    async getUser(id: string): Promise<getUser> {
        try {
            const { data } = await apiClient.get(API_ROUTES.USER.BY_ID(id));
            return data;
        } catch (error) {
            console.error('Failed to fetch user:', error);
            throw new UserError('No se pudo obtener el usuario.');
        }
    },

    async createUser(userData: CreateUserDto): Promise<User> {
        try {
            const { data } = await apiClient.put(API_ROUTES.USER.BASE, userData);
            return data;
        } catch (error) {
            console.error('Failed to create user:', error);
            throw new UserError('No se pudo crear el usuario.');
        }
    },

    async banUser(id: string): Promise<User> {
        try {
            const { data } = await apiClient.put(API_ROUTES.USER.BAN(id));
            return data;
        } catch (error) {
            console.error('Failed to ban user:', error);
            throw new UserError('No se pudo banear al usuario.');
        }
    },

    async publicUser(id: string): Promise<User> {
        try {
            const { data } = await apiClient.put(API_ROUTES.USER.PUBLIC(id));
            return data;
        } catch (error) {
            console.error('Failed to public user:', error);
            throw new UserError('No se pudo hacer público al usuario.');
        }
    },

    async updateUser(id: string, userData: UserUpdateRequest): Promise<getUser> {
        try {
            const formData = new FormData();

            if (userData.name) formData.append('name', userData.name);
            if (userData.email) formData.append('email', userData.email);
            if (userData.city) formData.append('city', userData.city);
            if (userData.addRoles) {
                await apiClient.put(API_ROUTES.USER.ADD_ROLES, {
                    user: id,
                    roles: userData.addRoles.map(role => role.id)
                });
            }
            if (userData.removeRoles) {
                await apiClient.put(API_ROUTES.USER.REMOVE_ROLES, {
                    user: id,
                    roles: userData.removeRoles.map(role => role.id)
                });
            }

            if (userData.isPublic !== undefined) {
                await apiClient.put(API_ROUTES.USER.PUBLIC(id));
            }

            if (userData.banned !== undefined) {
                await apiClient.put(API_ROUTES.USER.BAN(id));
            } 
        
            const { data } = await apiClient.put(API_ROUTES.USER.BY_ID(id), formData);
            
            return data;
        } catch (error) {
            console.error('Failed to update user:', error);
            throw new UserError('No se pudo actualizar el usuario.');
        }
    },
}
