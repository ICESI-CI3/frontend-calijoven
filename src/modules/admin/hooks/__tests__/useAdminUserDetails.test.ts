import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { useUserManagement } from '../useAdminUserDetails';

jest.mock('../../services/user.service', () => ({
    UserService: {
        getUser: jest.fn(),
        updateUser: jest.fn(),
    },
}));

jest.mock('../../services/role.service', () => ({
    RoleService: {
        getRoles: jest.fn(),
    },
}));

jest.mock('../../services/cities.service', () => ({
    CityService: {
        getCities: jest.fn(),
    },
}));

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: jest.fn(),
}));

describe('useUserManagement', () => {
    const mockUserId = '1';
    const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        roles: [
            { id: 'role1', name: 'Role 1' },
            { id: 'role2', name: 'Role 2' },
        ],
        city: { id: 'city1', name: 'City 1' },
        isPublic: true,
        banned: false,
    };

    const mockRoles = [
        { id: 'role1', name: 'Role 1' },
        { id: 'role2', name: 'Role 2' },
        { id: 'role3', name: 'Role 3' },
    ];

    const mockCities = [
        { id: 'city1', name: 'City 1' },
        { id: 'city2', name: 'City 2' },
    ];

    const mockQueryClient = {
        invalidateQueries: jest.fn(),
    };

    const mockRefetch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
        (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
            if (queryKey[0] === 'user') {
                return {
                    data: mockUser,
                    isLoading: false,
                    isError: false,
                    error: null,
                    refetch: mockRefetch,
                };
            }
            if (queryKey[0] === 'roles') {
                return {
                    data: mockRoles,
                    isLoading: false,
                    isError: false,
                    error: null,
                };
            }
            if (queryKey[0] === 'cities') {
                return {
                    data: mockCities,
                    isLoading: false,
                    isError: false,
                    error: null,
                };
            }
            return {
                data: undefined,
                isLoading: false,
                isError: false,
                error: null,
            };
        });

        (useMutation as jest.Mock).mockReturnValue({
            mutateAsync: jest.fn().mockImplementation(async (data) => {
                const result = await Promise.resolve(data);
                if (typeof result === 'object' && result !== null) {
                    mockQueryClient.invalidateQueries({ queryKey: ['user', mockUserId] });
                }
                return result;
            }),
            isPending: false,
            error: null,
            isSuccess: false,
        });
    });

    it('should initialize with user data', () => {
        const { result } = renderHook(() => useUserManagement(mockUserId));

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.formData).toEqual({
            name: mockUser.name,
            email: mockUser.email,
            roles: mockUser.roles.map(role => role.id),
            city: mockUser.city,
            isPublic: mockUser.isPublic,
            banned: mockUser.banned,
        });
        expect(result.current.roles).toEqual(mockRoles);
        expect(result.current.cities).toEqual(mockCities);
    });

    it('should handle input changes', () => {
        const { result } = renderHook(() => useUserManagement(mockUserId));

        act(() => {
            result.current.handleInputChange('name', 'New Name');
            result.current.handleInputChange('email', 'new@example.com');
            result.current.handleInputChange('isPublic', false);
            result.current.handleInputChange('banned', true);
            result.current.handleInputChange('city', mockCities[1]);
        });

        expect(result.current.formData).toEqual({
            name: 'New Name',
            email: 'new@example.com',
            roles: mockUser.roles.map(role => role.id),
            city: mockCities[1],
            isPublic: false,
            banned: true
        });
    });

    it('should handle form submission with changes', async () => {
        const mockMutateAsync = jest.fn().mockImplementation(async (data) => {
            const result = await Promise.resolve(data);
            mockQueryClient.invalidateQueries({ queryKey: ['user', mockUserId] });
            return result;
        });

        (useMutation as jest.Mock).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
            error: null,
            isSuccess: true,
        });

        const { result } = renderHook(() => useUserManagement(mockUserId));

        act(() => {
            result.current.handleInputChange('name', 'New Name');
            result.current.handleInputChange('email', 'new@example.com');
        });

        const mockEvent = { preventDefault: jest.fn() } as any;
        await act(async () => {
            await result.current.handleSubmit(mockEvent);
        });

        expect(mockMutateAsync).toHaveBeenCalledWith({
            name: 'New Name',
            email: 'new@example.com',
        });
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['user', mockUserId] });
    });

    it('should handle add role', async () => {
        const { UserService } = require('../../services/user.service');
        UserService.updateUser.mockResolvedValueOnce({ data: mockUser });

        const { result } = renderHook(() => useUserManagement(mockUserId));

        await act(async () => {
            await result.current.handleAddRole('role3');
        });

        expect(result.current.formData.roles).toContain('role3');
        expect(UserService.updateUser).toHaveBeenCalledWith(mockUserId, {
            addRoles: [mockRoles[2]],
        });
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['user', mockUserId] });
    });

    it('should handle remove role', async () => {
        const { UserService } = require('../../services/user.service');
        UserService.updateUser.mockResolvedValueOnce({ data: mockUser });

        const { result } = renderHook(() => useUserManagement(mockUserId));

        await act(async () => {
            await result.current.handleRemoveRole('role1');
        });

        expect(result.current.formData.roles).not.toContain('role1');
        expect(UserService.updateUser).toHaveBeenCalledWith(mockUserId, {
            removeRoles: [mockRoles[0]],
        });
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['user', mockUserId] });
    });

    it('should not add role if already exists', async () => {
        const { UserService } = require('../../services/user.service');

        const { result } = renderHook(() => useUserManagement(mockUserId));

        await act(async () => {
            await result.current.handleAddRole('role1');
        });

        expect(UserService.updateUser).not.toHaveBeenCalled();
    });

    it('should handle loading state', () => {
        (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
            if (queryKey[0] === 'user') {
                return {
                    data: undefined,
                    isLoading: true,
                    isError: false,
                    error: null,
                    refetch: mockRefetch,
                };
            }
            return {
                data: undefined,
                isLoading: false,
                isError: false,
                error: null,
            };
        });

        const { result } = renderHook(() => useUserManagement(mockUserId));

        expect(result.current.isLoading).toBe(true);
        expect(result.current.user).toBeUndefined();
    });

    it('should handle error state', () => {
        const mockError = new Error('Failed to fetch user');
        (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
            if (queryKey[0] === 'user') {
                return {
                    data: undefined,
                    isLoading: false,
                    isError: true,
                    error: mockError,
                    refetch: mockRefetch,
                };
            }
            return {
                data: undefined,
                isLoading: false,
                isError: false,
                error: null,
            };
        });

        const { result } = renderHook(() => useUserManagement(mockUserId));

        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe(mockError);
    });

    it('should handle update mutation error', async () => {
        const mockError = new Error('Update failed');
        const mockMutateAsync = jest.fn().mockRejectedValue(mockError);
        (useMutation as jest.Mock).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
            error: mockError,
            isSuccess: false,
        });

        const { result } = renderHook(() => useUserManagement(mockUserId));

        const mockEvent = { preventDefault: jest.fn() } as any;
        await act(async () => {
            await expect(result.current.handleSubmit(mockEvent)).rejects.toThrow('Update failed');
        });

        expect(result.current.updateError).toBe(mockError);
        expect(result.current.updateSuccess).toBe(false);
    });

    it('should not submit if user is not loaded', async () => {
        (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
            if (queryKey[0] === 'user') {
                return {
                    data: undefined,
                    isLoading: false,
                    isError: false,
                    error: null,
                    refetch: mockRefetch,
                };
            }
            return {
                data: undefined,
                isLoading: false,
                isError: false,
                error: null,
            };
        });

        const { result } = renderHook(() => useUserManagement(mockUserId));

        const mockEvent = { preventDefault: jest.fn() } as any;
        await act(async () => {
            const submitResult = await result.current.handleSubmit(mockEvent);
            expect(submitResult).toBeUndefined();
        });
    });
}); 