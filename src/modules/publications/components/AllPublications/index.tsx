import PublicationPreview from '@/modules/publications/components/PublicationPreview';
import { Spinner } from '@/components/Spinner';
import { Alert } from '@/components/Alert';
import { Publication } from '@/types/publication';

export default function PublicationsList({
  publications,
  isLoading,
  isError,
  error,
  onReadMore,
}: {
  publications: Publication[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onEdit: (publication: Publication) => void;
  onCreateNew: () => void;
  onReadMore?: (id: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12" role="status">
        <Spinner />
      </div>
    );
  }
  if (isError) {
    return <Alert type="error" message={error?.message || 'Error al cargar las publicaciones'} />;
  }
  if (publications.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No hay publicaciones disponibles
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {publications.map((publication) => (
        <PublicationPreview key={publication.id} publication={publication} onReadMore={onReadMore} />
      ))}
    </div>
  );
} 