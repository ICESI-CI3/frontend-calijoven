'use client';

import { FC } from 'react';
import { CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import { Publication, PublicationType } from '@/types/publication';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import { SavePublicationButton } from '../SavePublicationButton';

const typeMap: Record<string, { label: string; color: string }> = {
  event: { label: 'Evento', color: 'bg-green-500' },
  news: { label: 'Noticia', color: 'bg-blue-500' },
  offer: { label: 'Oferta', color: 'bg-yellow-500' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

interface PublicationPreviewProps {
  publication: Publication;
  onReadMore?: (id: string) => void;
}

const PublicationPreview: FC<PublicationPreviewProps> = ({ publication, onReadMore }) => {
  const router = useRouter();
  const imageUrl =
    (publication.attachments &&
      publication.attachments.length > 0 &&
      publication.attachments[0].url) ||
    'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

  // Validación y valor por defecto para el tipo
  const typeName = publication.type?.name || 'unknown';
  const typeInfo = typeMap[typeName] || {
    label: typeName,
    color: 'bg-gray-400',
  };

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md">
      {/* Imagen */}
      <div className="flex h-40 items-center justify-center bg-gray-100">
        <img src={imageUrl} alt={publication.title} className="h-full w-full object-cover" />
      </div>
      {/* Contenido */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${typeInfo.color}`}
            >
              {typeInfo.label}
            </span>
            <span className="flex items-center text-xs text-gray-500">
              <CalendarIcon className="mr-1 h-4 w-4" />
              {formatDate(publication.createdAt)}
            </span>
          </div>
          <SavePublicationButton publicationId={publication.id} />
        </div>
        <h2 className="mb-1 text-lg font-bold">{publication.title}</h2>
        <p className="mb-2 text-gray-700">{publication.description}</p>
        <div className="mb-2 text-xs text-gray-500">
          {publication.organizers && publication.organizers.length > 0 && (
            <span>Organiza: {publication.organizers.map((org) => org.name).join(', ')}</span>
          )}
          {publication.organizers &&
            publication.organizers.length > 0 &&
            publication.cities &&
            publication.cities.length > 0 && <span> &middot; </span>}
          {publication.cities && publication.cities.length > 0 && (
            <span>{publication.cities.map((city) => city.name).join(', ')}</span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReadMore ? onReadMore(publication.id) : router.push(ROUTES.PUBLICATIONS.DETAIL(publication.id).PATH)}
        >
          Leer más
        </Button>
      </div>
    </div>
  );
};

export default PublicationPreview;
