import { useQuery } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { useUsersDashboard } from '../useUsersDashboard';

jest.mock('../../services/user.service', () => ({
    UserService: {
        getUsers: jest.fn(),
        banUser: jest.fn(),
        publicUser: jest.fn(),
    },
}));

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

describe('useUsersDashboard', () => {
    const mockUsers = [
        { id: '1', name: 'User 1', email: 'user1@example.com' },
        { id: '2', name: 'User 2', email: 'user2@example.com' },
    ];

    const mockQueryResult = {
        data: mockUsers,
        total: 2,
    };

    const mockRefetch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useQuery as jest.Mock).mockReturnValue({
            data: mockQueryResult,
            isLoading: false,
            isError: false,
            error: null,
            refetch: mockRefetch,
        });
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useUsersDashboard({}));

        expect(result.current.users).toEqual(mockUsers);
        expect(result.current.total).toBe(2);
        expect(result.current.page).toBe(1);
        expect(result.current.limit).toBe(5);
        expect(result.current.filters).toEqual({});
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.banningUserId).toBeNull();
        expect(result.current.hidingUserId).toBeNull();
    });

    it('should initialize with custom values', () => {
        const initialFilters = { name: 'test' };
        const initialPage = 2;
        const initialLimit = 10;

        const { result } = renderHook(() =>
            useUsersDashboard({ initialFilters, initialPage, initialLimit })
        );

        expect(result.current.page).toBe(initialPage);
        expect(result.current.limit).toBe(initialLimit);
        expect(result.current.filters).toEqual(initialFilters);
    });

    it('should handle search', () => {
        const { result } = renderHook(() => useUsersDashboard({}));

        act(() => {
            result.current.handleSearch('test search');
        });

        expect(result.current.filters).toEqual({ name: 'test search' });
        expect(result.current.page).toBe(1); // Should reset to page 1
    });

    it('should handle page change', () => {
        const { result } = renderHook(() => useUsersDashboard({}));

        act(() => {
            result.current.handlePageChange(2);
        });

        expect(result.current.page).toBe(2);
    });

    it('should handle ban user', async () => {
        const { result } = renderHook(() => useUsersDashboard({}));
        const userId = '1';

        await act(async () => {
            await result.current.handleBan(userId);
        });

        expect(result.current.banningUserId).toBeNull();
        expect(mockRefetch).toHaveBeenCalled();
    });

    it('should handle ban user error', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const { result } = renderHook(() => useUsersDashboard({}));
        const userId = '1';

        const { UserService } = require('../../services/user.service');
        UserService.banUser.mockRejectedValueOnce(new Error('Ban failed'));

        await act(async () => {
            await result.current.handleBan(userId);
        });

        expect(result.current.banningUserId).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith('Error al banear usuario:', expect.any(Error));
        consoleSpy.mockRestore();
    });

    it('should handle hide user', async () => {
        const { result } = renderHook(() => useUsersDashboard({}));
        const userId = '1';

        await act(async () => {
            await result.current.handleHide(userId);
        });

        expect(result.current.hidingUserId).toBeNull();
        expect(mockRefetch).toHaveBeenCalled();
    });

    it('should handle hide user error', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const { result } = renderHook(() => useUsersDashboard({}));
        const userId = '1';

        const { UserService } = require('../../services/user.service');
        UserService.publicUser.mockRejectedValueOnce(new Error('Hide failed'));

        await act(async () => {
            await result.current.handleHide(userId);
        });

        expect(result.current.hidingUserId).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith('Error al cambiar visibilidad del usuario:', expect.any(Error));
        consoleSpy.mockRestore();
    });

    it('should show loading state', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            error: null,
            refetch: mockRefetch,
        });

        const { result } = renderHook(() => useUsersDashboard({}));

        expect(result.current.isLoading).toBe(true);
        expect(result.current.users).toEqual([]);
    });

    it('should handle error state', () => {
        const mockError = new Error('Query failed');
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: mockError,
            refetch: mockRefetch,
        });

        const { result } = renderHook(() => useUsersDashboard({}));

        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe(mockError);
        expect(result.current.users).toEqual([]);
    });
}); 