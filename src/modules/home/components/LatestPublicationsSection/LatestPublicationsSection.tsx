'use client';

import { useEffect, useState } from 'react';
import { PublicationService } from '@/modules/publications/services/publication.service';
import { Publication } from '@/types/publication';
import PublicationPreview from '../../../publications/components/PublicationPreview';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ROUTES } from '@/lib/constants/routes';
import { Spinner } from '@/components/Spinner';

export function LatestPublicationsSection() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    PublicationService.getPublications({}, 1, 3)
      .then((data) => setPublications(data.data || []))
      .catch(() => setError('Error al cargar las publicaciones'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-left text-xl font-bold text-foreground">Noticias, Eventos y Ofertas</h2>
        <Link href={ROUTES.PUBLICATIONS.LIST}>
          <Button variant="outline" size="sm">
            Ver todas las publicaciones
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="text-center text-muted-foreground">
          <Spinner />.
        </div>
      ) : error ? (
        <div className="text-center text-destructive">{error}</div>
      ) : publications.length === 0 ? (
        <div className="text-center text-muted-foreground">No hay publicaciones disponibles</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {publications.map((publication) => (
            <PublicationPreview key={publication.id} publication={publication} />
          ))}
        </div>
      )}
    </section>
  );
}
