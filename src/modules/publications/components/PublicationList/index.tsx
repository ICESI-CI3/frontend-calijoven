'use client';

import { Spinner } from '@/components/Spinner';
import type { Publication, PublicationFilters } from '@/types/publication';
import PublicationPreview from '../PublicationPreview';

interface PublicationListProps {
  publications: Publication[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}


export function PublicationList({
  publications,
  isLoading,
  isError,
  error,
}: PublicationListProps) {
  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-destructive">{error?.message || 'Error al cargar las publicaciones'}</div>;
  }

  if (publications.length === 0) {
    return <div className="text-center text-muted-foreground">No hay publicaciones disponibles</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {publications.map((publication) => (
        <PublicationPreview key={publication.id} publication={publication} />
      ))}
    </div>
  );
}
