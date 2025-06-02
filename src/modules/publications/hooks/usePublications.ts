import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PublicationService } from '../services/publication.service';
import type { Publication, PublicationFilters } from '@/types/publication';

export type UsePublicationsOptions = {
  initialFilters?: PublicationFilters;
  initialPage?: number;
  initialLimit?: number;
  singlePublicationId?: string;
};

type PublicationsQueryResult = {
  data: Publication[];
  total: number;
};

export function usePublications({
  initialFilters = {},
  initialPage = 1,
  initialLimit = 9,
  singlePublicationId,
}: UsePublicationsOptions = {}) {
  const [filters, setFilters] = useState<PublicationFilters>({
    search: '',
    ...initialFilters,
  });
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const publicationsQuery = useQuery<PublicationsQueryResult>({
    queryKey: ['publications', filters, page, limit],
    queryFn: () => PublicationService.getPublications(filters, page, limit),
    enabled: !singlePublicationId,
  });

  const singlePublicationQuery = useQuery<Publication>({
    queryKey: ['publication', singlePublicationId],
    queryFn: () => PublicationService.getPublication(singlePublicationId!),
    enabled: !!singlePublicationId,
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

  if (singlePublicationId) {
    return {
      publication: singlePublicationQuery.data || null,
      loading: singlePublicationQuery.isLoading,
      error: singlePublicationQuery.error instanceof Error 
        ? singlePublicationQuery.error.message 
        : singlePublicationQuery.error 
          ? String(singlePublicationQuery.error)
          : null,
      refetchPublication: () => singlePublicationQuery.refetch(),
    };
  }

  return {
    publications: publicationsQuery.data?.data || [],
    total: publicationsQuery.data?.total || 0,
    isLoading: publicationsQuery.isLoading,
    isError: publicationsQuery.isError,
    error: publicationsQuery.error instanceof Error 
      ? publicationsQuery.error.message 
      : publicationsQuery.error 
        ? String(publicationsQuery.error)
        : null,
    filters,
    page,
    limit,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    refetch: () => publicationsQuery.refetch(),
  };
}
