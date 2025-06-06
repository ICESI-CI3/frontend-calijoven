import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import { Role } from '@/types/user';
import { UserService } from '../user.service';

// Mock del cliente API
jest.mock('@/lib/api/client', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

describe('UserService', () => {
    const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUsers', () => {
        const mockUsers = [
            { id: '1', name: 'Usuario 1', email: 'user1@example.com' },
            { id: '2', name: 'Usuario 2', email: 'user2@example.com' },
        ];

        it('should fetch users successfully', async () => {
            mockedApiClient.get.mockResolvedValueOnce({ data: { data: mockUsers, total: 2 } });

            const result = await UserService.getUsers();

            expect(mockedApiClient.get).toHaveBeenCalledWith('/user?page=1&limit=10');
            expect(result).toEqual({ data: mockUsers, total: 2 });
        });

        it('should handle API error when fetching users', async () => {
            const mockError = new Error('API Error');
            mockedApiClient.get.mockRejectedValueOnce(mockError);

            await expect(UserService.getUsers()).rejects.toThrow('No se pudieron obtener los usuarios.');
            expect(mockedApiClient.get).toHaveBeenCalledWith('/user?page=1&limit=10');
        });
    });

    describe('getUserById', () => {
        const mockUserId = '1';
        const mockUser = { id: mockUserId, name: 'Usuario 1', email: 'user1@example.com' };

        it('should fetch a single user successfully', async () => {
            mockedApiClient.get.mockResolvedValueOnce({ data: mockUser });

            const result = await UserService.getUser(mockUserId);

            expect(mockedApiClient.get).toHaveBeenCalledWith(`/user/${mockUserId}`);
            expect(result).toEqual(mockUser);
        });

        it('should handle API error when fetching a single user', async () => {
            const mockError = new Error('API Error');
            mockedApiClient.get.mockRejectedValueOnce(mockError);

            await expect(UserService.getUser(mockUserId)).rejects.toThrow('No se pudo obtener el usuario.');
            expect(mockedApiClient.get).toHaveBeenCalledWith(`/user/${mockUserId}`);
        });
    });

    describe('createUser', () => {
        const mockUserData = {
            name: 'Nuevo Usuario',
            email: 'new@example.com',
            password: 'password123',
            city: '1',
            userTypes: [],
        };

        const mockCreatedUser = {
            id: '3',
            ...mockUserData,
            password: undefined,
        };

        it('should create a user successfully', async () => {
            mockedApiClient.put.mockResolvedValueOnce({ data: mockCreatedUser });

            const result = await UserService.createUser(mockUserData);

            expect(mockedApiClient.put).toHaveBeenCalledWith('/user', mockUserData);
            expect(result).toEqual(mockCreatedUser);
        });

        it('should handle API error when creating a user', async () => {
            const mockError = new Error('API Error');
            mockedApiClient.put.mockRejectedValueOnce(mockError);

            await expect(UserService.createUser(mockUserData)).rejects.toThrow('No se pudo crear el usuario.');
            expect(mockedApiClient.put).toHaveBeenCalledWith('/user', mockUserData);
        });
    });

    describe('updateUser', () => {
        const mockUserId = '1';
        const mockRoles: Role[] = [
            { id: '1', name: 'Admin', description: 'Admin role', permissions: [] },
            { id: '2', name: 'User', description: 'User role', permissions: [] }
        ];
        const mockUpdateData = {
            name: 'Usuario Actualizado',
            email: 'updated@example.com',
            city: '2',
            addRoles: [mockRoles[0]],
            removeRoles: [mockRoles[1]],
            isPublic: true,
            banned: false
        };

        const mockUpdatedUser = {
            id: mockUserId,
            name: mockUpdateData.name,
            email: mockUpdateData.email,
            city: mockUpdateData.city,
            isPublic: true,
            banned: false
        };

        it('should update a user with all fields successfully', async () => {
            const formData = new FormData();
            formData.append('name', mockUpdateData.name);
            formData.append('email', mockUpdateData.email);
            formData.append('city', mockUpdateData.city);

            mockedApiClient.put
                .mockResolvedValueOnce({ data: { success: true } }) 
                .mockResolvedValueOnce({ data: { success: true } }) 
                .mockResolvedValueOnce({ data: { success: true } }) 
                .mockResolvedValueOnce({ data: { success: true } }) 
                .mockResolvedValueOnce({ data: mockUpdatedUser }); 

            const result = await UserService.updateUser(mockUserId, mockUpdateData);

            expect(mockedApiClient.put).toHaveBeenNthCalledWith(1, API_ROUTES.USER.ADD_ROLES, {
                user: mockUserId,
                roles: ['1']
            });
            expect(mockedApiClient.put).toHaveBeenNthCalledWith(2, API_ROUTES.USER.REMOVE_ROLES, {
                user: mockUserId,
                roles: ['2']
            });
            expect(mockedApiClient.put).toHaveBeenNthCalledWith(3, API_ROUTES.USER.PUBLIC(mockUserId));
            expect(mockedApiClient.put).toHaveBeenNthCalledWith(4, API_ROUTES.USER.BAN(mockUserId));
            expect(mockedApiClient.put).toHaveBeenNthCalledWith(5, API_ROUTES.USER.BY_ID(mockUserId), expect.any(FormData));
            expect(result).toEqual(mockUpdatedUser);
        });

        it('should handle API error when updating user roles', async () => {
            mockedApiClient.put.mockRejectedValueOnce(new Error('API Error'));

            await expect(UserService.updateUser(mockUserId, mockUpdateData)).rejects.toThrow('No se pudo actualizar el usuario.');
            expect(mockedApiClient.put).toHaveBeenCalledTimes(1);
            expect(mockedApiClient.put).toHaveBeenCalledWith(API_ROUTES.USER.ADD_ROLES, {
                user: mockUserId,
                roles: ['1']
            });
        });

        it('should handle API error when updating user visibility', async () => {
            mockedApiClient.put
                .mockResolvedValueOnce({ data: { success: true } }) // addRoles
                .mockResolvedValueOnce({ data: { success: true } }) // removeRoles
                .mockRejectedValueOnce(new Error('API Error')); // public

            await expect(UserService.updateUser(mockUserId, mockUpdateData)).rejects.toThrow('No se pudo actualizar el usuario.');
            expect(mockedApiClient.put).toHaveBeenCalledTimes(3);
        });
    });

    describe('banUser', () => {
        const mockUserId = '1';
        const mockBannedUser = { id: mockUserId, banned: true };

        it('should ban a user successfully', async () => {
            mockedApiClient.put.mockResolvedValueOnce({ data: mockBannedUser });

            const result = await UserService.banUser(mockUserId);

            expect(mockedApiClient.put).toHaveBeenCalledWith(API_ROUTES.USER.BAN(mockUserId));
            expect(result).toEqual(mockBannedUser);
        });

        it('should handle API error when banning a user', async () => {
            const mockError = new Error('API Error');
            mockedApiClient.put.mockRejectedValueOnce(mockError);

            await expect(UserService.banUser(mockUserId)).rejects.toThrow('No se pudo banear al usuario.');
        });
    });

    describe('publicUser', () => {
        const mockUserId = '1';
        const mockPublicUser = { id: mockUserId, isPublic: true };

        it('should make a user public successfully', async () => {
            mockedApiClient.put.mockResolvedValueOnce({ data: mockPublicUser });

            const result = await UserService.publicUser(mockUserId);

            expect(mockedApiClient.put).toHaveBeenCalledWith(API_ROUTES.USER.PUBLIC(mockUserId));
            expect(result).toEqual(mockPublicUser);
        });

        it('should handle API error when making a user public', async () => {
            const mockError = new Error('API Error');
            mockedApiClient.put.mockRejectedValueOnce(mockError);

            await expect(UserService.publicUser(mockUserId)).rejects.toThrow('No se pudo hacer público al usuario.');
        });
    });
}); 