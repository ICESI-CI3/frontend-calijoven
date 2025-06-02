'use client';

import { useEffect, useState } from 'react';
import { Publication } from '@/types/publication';
import { publicationService } from '@/modules/publications/services/publication.service';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import { Pagination } from '@/components/Pagination';
import PublicationPreview from '@/modules/publications/components/PublicationPreview';

interface OrganizationPublicationsProps {
  organizationId: string;
  className?: string;
}

export function OrganizationPublications({ organizationId, className = '' }: OrganizationPublicationsProps) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9; // Mostrar 9 publicaciones por página (grid 3x3)

  useEffect(() => {
    const loadPublications = async () => {
      try {
        console.log('Loading publications for organization:', organizationId);
        setIsLoading(true);
        const response = await publicationService.getPublications(
          { organization: organizationId, unpublished: false },
          page,
          limit
        );
        console.log('Publications response:', response);
        setPublications(response.data || []);
        setTotal(response.total || 0);
      } catch (err: any) {
        console.error('Error loading publications:', err);
        // Si es error de autenticación, mostrar mensaje más apropiado
        if (err.response?.status === 401) {
          setError('Esta sección está temporalmente no disponible. Por favor, intenta más tarde.');
        } else {
          setError(err instanceof Error ? err.message : 'Error al cargar las publicaciones');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPublications();
  }, [organizationId, page]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <Alert type="info" message={error} />;
  }

  if (publications.length === 0) {
    return (
      <Alert
        type="info"
        message="No hay publicaciones disponibles en este momento."
      />
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className={className}>
      {/* Grid de publicaciones */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {publications.map((publication) => (
          <PublicationPreview
            key={publication.id}
            publication={publication}
          />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
} 