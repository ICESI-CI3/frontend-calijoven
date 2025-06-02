import React from 'react';
import { useSavedPublications } from '../../hooks/useSavedPublications';
import PublicationPreview from '../PublicationPreview';
import { Pagination } from '@/components/Pagination';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import { Publication } from '@/types/publication';

interface SavedPublication {
  id: string;
  publication: Publication;
  savedAt: string;
}

interface SavedPublicationsListProps {
  className?: string;
}

export function SavedPublicationsList({ className }: SavedPublicationsListProps) {
  const {
    savedPublications,
    total,
    isLoading,
    error,
    page,
    limit,
    setPage,
  } = useSavedPublications();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert 
        type="error" 
        message="Ocurrió un error al cargar las publicaciones guardadas"
      />
    );
  }

  if (!Array.isArray(savedPublications)) {
    return (
      <Alert 
        type="error" 
        message="Error en el formato de datos"
      />
    );
  }

  if (savedPublications.length === 0) {
    return (
      <Alert 
        type="info" 
        message="No tienes publicaciones guardadas"
      />
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(savedPublications as SavedPublication[]).map((savedPub) => {
          if (!savedPub.publication) {
            console.error('Publication object is missing:', savedPub);
            return null;
          }
          return (
            <PublicationPreview
              key={savedPub.id}
              publication={savedPub.publication}
            />
          );
        })}
      </div>

      {total > limit && (
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / limit)}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
} 