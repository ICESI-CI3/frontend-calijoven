import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { useAdminCreateUser } from '../useAdminCreateUser';

// Mock de los servicios
jest.mock('../../services/cities.service', () => ({
    CityService: {
        getCities: jest.fn(),
    },
}));

jest.mock('../../services/user.service', () => ({
    UserService: {
        createUser: jest.fn(),
    },
}));

// Mock de react-query
jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: jest.fn(),
}));

describe('useAdminCreateUser', () => {
    const mockQueryClient = {
        invalidateQueries: jest.fn(),
    };

    const mockCities = [
        { id: '1', name: 'Ciudad 1' },
        { id: '2', name: 'Ciudad 2' },
    ];

    const mockUserData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        city: { id: '1', name: 'Ciudad 1' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
        (useQuery as jest.Mock).mockReturnValue({
            data: mockCities,
            isLoading: false,
            error: null,
        });
        (useMutation as jest.Mock).mockReturnValue({
            mutateAsync: jest.fn(),
            isPending: false,
            error: null,
            isSuccess: false,
        });
    });

    it('should initialize with empty form data', () => {
        const { result } = renderHook(() => useAdminCreateUser());

        expect(result.current.formData).toEqual({
            name: '',
            email: '',
            password: '',
            city: null,
        });
    });

    it('should handle input changes', () => {
        const { result } = renderHook(() => useAdminCreateUser());

        act(() => {
            result.current.handleInputChange('name', 'New Name');
            result.current.handleInputChange('email', 'new@example.com');
            result.current.handleInputChange('password', 'newpass123');
            result.current.handleInputChange('city', mockCities[0]);
        });

        expect(result.current.formData).toEqual({
            name: 'New Name',
            email: 'new@example.com',
            password: 'newpass123',
            city: mockCities[0],
        });
    });

    it('should handle form submission', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValue({ data: { id: '1', ...mockUserData } });
        let mutationOptions: any;

        (useMutation as jest.Mock).mockImplementation((options) => {
            mutationOptions = options;
            return {
                mutateAsync: async (data: any) => {
                    const result = await mockMutateAsync(data);
                    if (mutationOptions.onSuccess) {
                        mutationOptions.onSuccess(result);
                    }
                    return result;
                },
                isPending: false,
                error: null,
                isSuccess: true
            };
        });

        const { result } = renderHook(() => useAdminCreateUser());

        // Set form data
        act(() => {
            result.current.handleInputChange('name', mockUserData.name);
            result.current.handleInputChange('email', mockUserData.email);
            result.current.handleInputChange('password', mockUserData.password);
            result.current.handleInputChange('city', mockUserData.city);
        });

        // Submit form
        const mockEvent = { preventDefault: jest.fn() } as any;
        await act(async () => {
            await result.current.handleSubmit(mockEvent);
        });

        expect(mockMutateAsync).toHaveBeenCalledWith({
            name: mockUserData.name,
            email: mockUserData.email,
            password: mockUserData.password,
            city: mockUserData.city,
        });
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['users'] });
        expect(result.current.createSuccess).toBe(true);
    });

    it('should handle submission error', async () => {
        const mockError = new Error('Creation failed');
        const mockMutateAsync = jest.fn().mockRejectedValue(mockError);
        (useMutation as jest.Mock).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
            error: mockError,
            isSuccess: false,
        });

        const { result } = renderHook(() => useAdminCreateUser());

        const mockEvent = { preventDefault: jest.fn() } as any;
        await act(async () => {
            await expect(result.current.handleSubmit(mockEvent)).rejects.toThrow('Creation failed');
        });

        expect(result.current.createError).toBe(mockError);
        expect(result.current.createSuccess).toBe(false);
    });

    it('should show loading state during submission', () => {
        (useMutation as jest.Mock).mockReturnValue({
            mutateAsync: jest.fn(),
            isPending: true,
            error: null,
            isSuccess: false,
        });

        const { result } = renderHook(() => useAdminCreateUser());

        expect(result.current.isCreating).toBe(true);
    });
}); 