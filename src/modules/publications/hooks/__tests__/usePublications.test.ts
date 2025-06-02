import { renderHook, act } from '@testing-library/react';
import { usePublications } from '../usePublications';
import { useQuery } from '@tanstack/react-query';

const mockGetPublications = jest.fn();
const mockGetPublication = jest.fn();
const mockRefetch = jest.fn();

jest.mock('../../services/publication.service', () => ({
  PublicationService: {
    getPublications: (...args: any[]) => mockGetPublications(...args),
    getPublication: (...args: any[]) => mockGetPublication(...args),
  },
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

interface QueryKey {
  [0]: string;
  [key: number]: any;
}

describe('usePublications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches publications list', () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }: { queryKey: QueryKey }) => {
      if (queryKey[0] === 'publications') {
        return {
          data: { data: [{ id: '1', title: 'Pub 1' }], total: 1 },
          isLoading: false,
          isError: false,
          error: null,
          refetch: mockRefetch,
        };
      }
      return {};
    });
    const { result } = renderHook(() => usePublications());
    expect(result.current.publications).toEqual([{ id: '1', title: 'Pub 1' }]);
    expect(result.current.total).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.handleSearch).toBe('function');
    expect(typeof result.current.handleFilterChange).toBe('function');
    expect(typeof result.current.handlePageChange).toBe('function');
    expect(typeof result.current.refetch).toBe('function');
  });

  it('fetches single publication', () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }: { queryKey: QueryKey }) => {
      if (queryKey[0] === 'publication') {
        return {
          data: { id: '2', title: 'Single Pub' },
          isLoading: false,
          error: null,
          refetch: mockRefetch,
        };
      }
      return {};
    });
    const { result } = renderHook(() => usePublications({ singlePublicationId: '2' }));
    expect(result.current.publication).toEqual({ id: '2', title: 'Single Pub' });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.refetchPublication).toBe('function');
  });

  it('handles error state', () => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Error!'),
      refetch: mockRefetch,
    }));
    const { result } = renderHook(() => usePublications());
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe('Error!');
  });

  it('updates filters and page', () => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: { data: [], total: 0 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    }));
    const { result } = renderHook(() => usePublications());
    
    act(() => {
      if (result.current.handleSearch) {
        result.current.handleSearch('test');
      }
      if (result.current.handleFilterChange) {
        result.current.handleFilterChange({ type: 'news' });
      }
      if (result.current.handlePageChange) {
        result.current.handlePageChange(2);
      }
    });

    expect(result.current.filters?.search).toBe('test');
    expect(result.current.filters?.type).toBe('news');
    expect(result.current.page).toBe(2);
  });
}); 