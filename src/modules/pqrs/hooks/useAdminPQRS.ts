import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PQRSService } from '../services/pqrs.service';
import type {
  AdminPQRSFilters,
  PaginatedPQRSResponse,
  PQRSStatusEntity,
  PQRSTypeEntity,
} from '@/types/pqrs';

export type UsePQRSOptions = {
  initialFilters?: AdminPQRSFilters;
  initialPage?: number;
  initialLimit?: number;
};

export function useAdminPQRS({
  initialFilters = {},
  initialPage = 1,
  initialLimit = 10,
}: UsePQRSOptions = {}) {
  const [filters, setFilters] = useState<AdminPQRSFilters>({
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    ...initialFilters,
  });
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const queryKey = useMemo(() => ['admin-pqrs', filters, page, limit], [filters, page, limit]);

  // Query para obtener las PQRS
  const { data, isLoading, isError, error, refetch } = useQuery<PaginatedPQRSResponse>({
    queryKey,
    queryFn: () => PQRSService.getAdminPQRS({ ...filters, page, limit }),
  });

  // Query para obtener los estados
  const { data: statuses = [] } = useQuery<PQRSStatusEntity[]>({
    queryKey: ['pqrs-statuses'],
    queryFn: () => PQRSService.getStatusTypes(),
  });

  // Query para obtener los tipos
  const { data: types = [] } = useQuery<PQRSTypeEntity[]>({
    queryKey: ['pqrs-types'],
    queryFn: () => PQRSService.getPQRSTypes(),
  });

  const handleFilterChange = (newFilters: Partial<AdminPQRSFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSortChange = (sortBy: string, sortOrder: 'ASC' | 'DESC' = 'DESC') => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    });
    setPage(1);
  };

  return {
    // Data
    pqrs: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    statuses,
    types,

    // State
    isLoading,
    isError,
    error,
    filters,
    page,
    limit,

    // Actions
    handleFilterChange,
    handlePageChange,
    handleSortChange,
    clearFilters,
    refetch,
  };
}
