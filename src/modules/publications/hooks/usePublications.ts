import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PublicationService } from '../services/publication.service';
import type { Publication, PublicationFilters } from '@/types/publication';

export type UsePublicationsOptions = {
  initialFilters?: PublicationFilters;
  initialPage?: number;
  initialLimit?: number;
};

type PublicationsQueryResult = {
  data: Publication[];
  total: number;
};

export function usePublications({
  initialFilters = {},
  initialPage = 1,
  initialLimit = 9,
}: UsePublicationsOptions = {}) {
  const [filters, setFilters] = useState<PublicationFilters>({
    search: '',
    ...initialFilters,
  });
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const queryKey = useMemo(() => ['publications', filters, page, limit], [filters, page, limit]);

  const { data, isLoading, isError, error, refetch } = useQuery<PublicationsQueryResult>({
    queryKey,
    queryFn: () => PublicationService.getPublications(filters, page, limit),
  });

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPage(1);
  };

  const handleFilterChange = (newFilters: Partial<PublicationFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    publications: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError,
    error,
    filters,
    page,
    limit,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    refetch,
  };
}
