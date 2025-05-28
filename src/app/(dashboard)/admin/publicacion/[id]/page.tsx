'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { PublicationForm } from '@/modules/publications/components/PublicationForm';
import { publicationService } from '@/modules/publications/services/publication.service';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/lib/hooks/useAuth';
import { Publication } from '@/types/publication';

type PublicationPageProps = {
  id: string;
};

export default function PublicationPage() {
  const { id }: PublicationPageProps = useParams();
  const searchParams = useSearchParams();
  const organizationId = searchParams.get('organizationId');

  const isNewPublication = id === 'nueva';
  const router = useRouter();
  const { user } = useAuth();
  const [publication, setPublication] = useState<Publication | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(!isNewPublication);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNewPublication) {
      const fetchPublication = async () => {
        try {
          const data = await publicationService.getPublication(id);
          setPublication(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error al cargar la publicación');
        } finally {
          setIsLoading(false);
        }
      };

      fetchPublication();
    } else {
      setPublication(undefined);
    }
  }, [id, isNewPublication]);

  const handleSuccess = () => {
    router.push('/admin/publicacion');
  };

  const handleCancel = () => {
    router.push('/admin/publicacion');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isNewPublication ? 'Crear Nueva Publicación' : 'Editar Publicación'}
              </h1>
              <p className="mt-2 text-gray-600">
                {isNewPublication
                  ? 'Crea una nueva publicación para la Plataforma Distrital de Juventudes'
                  : 'Actualiza la información de esta publicación'}
              </p>
            </div>
            <Button variant="outline" onClick={handleCancel}>
              Volver al listado
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {isLoading || publication === null ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <PublicationForm
            publication={publication}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            defaultOrganizationId={organizationId || ''}
            userOrganizations={user?.organizations || []}
          />
        )}
      </div>
    </div>
  );
}
