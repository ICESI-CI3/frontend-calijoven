import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Publication, PublicationFilters } from '@/types/publication';
import { publicationService } from '@/modules/publications/services/publication.service';
import { ROUTES } from '@/lib/constants/routes';

interface UsePublicationListOptions {
  organizationId?: string;
  initialFilters?: PublicationFilters;
  itemsPerPage?: number;
}

const defaultFilters: PublicationFilters = { unpublished: true };

export function useAdminPublicationList({
  organizationId = '',
  initialFilters = {},
  itemsPerPage = 10,
}: UsePublicationListOptions = {}) {
  const router = useRouter();

  // State
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PublicationFilters>({
    ...defaultFilters,
    ...initialFilters,
    organization: organizationId,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    publication: Publication | null;
  }>({
    isOpen: false,
    publication: null,
  });

  // Update filters when organizationId changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      organization: organizationId,
    }));
    setCurrentPage(1);
  }, [organizationId]);

  // Load publications
  const loadPublications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await publicationService.getPublications(filters, currentPage, itemsPerPage);
      setPublications(response.data || []);
      setTotalItems(response.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las publicaciones');
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage, itemsPerPage]);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<PublicationFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setFilters({
      ...defaultFilters,
      organization: organizationId,
    });
    setCurrentPage(1);
  };

  const handleDelete = async (publication: Publication) => {
    try {
      await publicationService.deletePublication(publication.id);
      setDeleteModal({ isOpen: false, publication: null });
      loadPublications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la publicación');
    }
  };

  const handleGenerateReport = async (publication: Publication) => {
    try {
      const blob = await publicationService.generateSingleReport(
        publication.id,
        `Reporte - ${publication.title}`
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${publication.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el reporte');
    }
  };

  const handleNavigateToDetail = (publicationId: string) => {
    router.push(ROUTES.PUBLICATIONS.DETAIL(publicationId).PATH);
  };

  const openDeleteModal = (publication: Publication) => {
    setDeleteModal({ isOpen: true, publication });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, publication: null });
  };

  const setErrorMessage = (message: string | null) => {
    setError(message);
  };

  // Computed values
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    // Data
    publications,
    totalItems,
    totalPages,

    // State
    isLoading,
    error,
    filters,
    currentPage,
    deleteModal,

    // Actions
    handleFilterChange,
    handlePageChange,
    handleClearFilters,
    handleDelete,
    handleGenerateReport,
    handleNavigateToDetail,
    openDeleteModal,
    closeDeleteModal,
    setErrorMessage,
    refetch: loadPublications,
  };
}
