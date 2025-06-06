import React from 'react';
import { useAdminPQRS } from '../useAdminPQRS';
import { PQRSService } from '../../services/pqrs.service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act, waitFor } from '@testing-library/react';

jest.mock('../../services/pqrs.service');

const mockPQRS = {
  items: [{ id: '1', subject: 'Test PQRS' }],
  total: 1,
  totalPages: 1,
};
const mockStatuses = [{ id: 'status1', name: 'Open' }];
const mockTypes = [{ id: 'type1', name: 'Petición' }];

(PQRSService.getAdminPQRS as jest.Mock).mockResolvedValue(mockPQRS);
(PQRSService.getStatusTypes as jest.Mock).mockResolvedValue(mockStatuses);
(PQRSService.getPQRSTypes as jest.Mock).mockResolvedValue(mockTypes);

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useAdminPQRS', () => {
  it('should fetch pqrs, statuses and types', async () => {
    const { result } = renderHook(() => useAdminPQRS(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.pqrs).toEqual(mockPQRS.items);
    expect(result.current.statuses).toEqual(mockStatuses);
    expect(result.current.types).toEqual(mockTypes);
    expect(result.current.total).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.isError).toBe(false);
  });

  it('should update filters and reset page on handleFilterChange', async () => {
    const { result } = renderHook(() => useAdminPQRS(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    act(() => {
      result.current.handleFilterChange({ status: 'open' }); // Cambiado de subject a status
    });

    expect(result.current.filters.status).toBe('open'); // Cambiado de subject a status
    expect(result.current.page).toBe(1);
  });

  it('should update page on handlePageChange', async () => {
    const { result } = renderHook(() => useAdminPQRS(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    act(() => {
      result.current.handlePageChange(3);
    });

    expect(result.current.page).toBe(3);
  });

  it('should update sort and reset page on handleSortChange', async () => {
    const { result } = renderHook(() => useAdminPQRS(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    act(() => {
      result.current.handleSortChange('status', 'ASC'); // Cambiado de subject a status
    });

    expect(result.current.filters.sortBy).toBe('status'); // Cambiado de subject a status
    expect(result.current.filters.sortOrder).toBe('ASC');
    expect(result.current.page).toBe(1);
  });

  it('should clear filters and reset page', async () => {
    const { result } = renderHook(() => useAdminPQRS(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    act(() => {
      result.current.handleFilterChange({ status: 'open' }); // Cambiado de subject a status
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    });
    expect(result.current.page).toBe(1);
  });
});