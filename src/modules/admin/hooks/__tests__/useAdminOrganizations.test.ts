import { useQuery } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { useAdminOrganizations } from '../useAdminOrganizations';

jest.mock('@/modules/organizations/services', () => ({
    organizationService: {
        getOrganizations: jest.fn(),
    },
}));

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

describe('useAdminOrganizations', () => {
    const mockOrganizations = [
        {
            id: '1',
            name: 'Organization 1',
            acronym: 'ORG1',
            public: true,
            members: [{ id: '1' }, { id: '2' }],
            documents: [{ id: '1' }],
            committees: [{ id: '1' }, { id: '2' }, { id: '3' }],
        },
        {
            id: '2',
            name: 'Organization 2',
            acronym: 'ORG2',
            public: false,
            members: [{ id: '3' }],
            documents: [{ id: '2' }, { id: '3' }],
            committees: [{ id: '4' }],
        },
    ];

    const mockQueryResult = {
        data: mockOrganizations,
        total: 2,
        page: 1,
        limit: 5,
    };

    const mockTransformedResult = {
        data: [
            {
                id: '1',
                name: 'Organization 1',
                acronym: 'ORG1',
                public: true,
                membersCount: 2,
                documentsCount: 1,
                committeesCount: 3,
            },
            {
                id: '2',
                name: 'Organization 2',
                acronym: 'ORG2',
                public: false,
                membersCount: 1,
                documentsCount: 2,
                committeesCount: 1,
            },
        ],
        total: 2,
        page: 1,
        limit: 5,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useQuery as jest.Mock).mockReturnValue({
            data: mockTransformedResult,
            isLoading: false,
            isError: false,
            error: null,
        });
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useAdminOrganizations());

        expect(result.current.organizations).toEqual(mockTransformedResult.data);
        expect(result.current.page).toBe(1);
        expect(result.current.limit).toBe(5);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should initialize with custom values', () => {
        const initialPage = 2;
        const initialLimit = 10;

        const { result } = renderHook(() =>
            useAdminOrganizations({ initialPage, initialLimit })
        );

        expect(result.current.page).toBe(initialPage);
        expect(result.current.limit).toBe(initialLimit);
    });

    it('should handle search', () => {
        const { result } = renderHook(() => useAdminOrganizations());

        act(() => {
            result.current.handleSearch('test search');
        });

        expect(result.current.page).toBe(1); // Should reset to page 1
    });

    it('should handle filter changes', () => {
        const { result } = renderHook(() => useAdminOrganizations());

        act(() => {
            result.current.handleFilterChange({ limit: 20 });
        });

        expect(result.current.limit).toBe(20);
        expect(result.current.page).toBe(1); // Should reset to page 1
    });

    it('should handle page change', () => {
        const { result } = renderHook(() => useAdminOrganizations());

        act(() => {
            result.current.handlePageChange(2);
        });

        expect(result.current.page).toBe(2);
    });

    it('should handle setSearch', () => {
        const { result } = renderHook(() => useAdminOrganizations());

        act(() => {
            result.current.setSearch('new search');
        });

        expect(result.current.page).toBe(1); // Should reset to page 1
    });

    it('should show loading state', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useAdminOrganizations());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.organizations).toEqual([]);
    });

    it('should handle error state', () => {
        const mockError = new Error('Failed to fetch organizations');
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: mockError,
        });

        const { result } = renderHook(() => useAdminOrganizations());

        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe(mockError);
        expect(result.current.organizations).toEqual([]);
    });

    it('should transform organization data correctly', () => {
        const { result } = renderHook(() => useAdminOrganizations());

        expect(result.current.organizations[0]).toEqual({
            id: '1',
            name: 'Organization 1',
            acronym: 'ORG1',
            public: true,
            membersCount: 2,
            documentsCount: 1,
            committeesCount: 3,
        });

        expect(result.current.organizations[1]).toEqual({
            id: '2',
            name: 'Organization 2',
            acronym: 'ORG2',
            public: false,
            membersCount: 1,
            documentsCount: 2,
            committeesCount: 1,
        });
    });

    it('should maintain filter state between renders', () => {
        const { result, rerender } = renderHook(() => useAdminOrganizations());

        act(() => {
            result.current.handleSearch('test');
            result.current.handleFilterChange({ limit: 20 });
        });

        rerender();

        expect(result.current.page).toBe(1);
        expect(result.current.limit).toBe(20);
    });
}); 