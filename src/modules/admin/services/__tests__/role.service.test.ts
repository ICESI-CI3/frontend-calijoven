import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import { PERMISSIONS } from '@/lib/constants/permissions';
import { Role } from '@/types/user';
import { RoleService } from '../role.service';

jest.mock('@/lib/api/client', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

describe('RoleService', () => {
    const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getRoles', () => {
        const mockRoles: Role[] = [
            {
                id: '1',
                name: 'Admin',
                description: 'Administrador del sistema',
                permissions: [PERMISSIONS.MANAGE_USER]
            },
            {
                id: '2',
                name: 'User',
                description: 'Usuario regular',
                permissions: [PERMISSIONS.READ_USER]
            }
        ];

        it('should fetch roles successfully', async () => {
            mockedApiClient.get.mockResolvedValueOnce({ data: mockRoles });

            const result = await RoleService.getRoles();

            expect(mockedApiClient.get).toHaveBeenCalledWith(API_ROUTES.ROLE.BASE);
            expect(result).toEqual(mockRoles);
        });

        it('should handle API error when fetching roles', async () => {
            const mockError = new Error('API Error');
            mockedApiClient.get.mockRejectedValueOnce(mockError);

            await expect(RoleService.getRoles()).rejects.toThrow('No se pudieron obtener los roles.');
            expect(mockedApiClient.get).toHaveBeenCalledWith(API_ROUTES.ROLE.BASE);
        });
    });
}); 