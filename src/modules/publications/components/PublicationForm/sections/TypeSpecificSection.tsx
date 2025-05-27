import React from 'react';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { IconBadge } from '@/components/IconBadge';
import type { CreatePublicationDto, EventDto, NewsDto, OfferDto } from '@/types/publication';

interface TypeSpecificSectionProps {
  formData: CreatePublicationDto;
  offerTypes: { id: string; name: string }[];
  onEventChange: (field: keyof EventDto, value: unknown) => void;
  onNewsChange: (field: keyof NewsDto, value: string) => void;
  onOfferChange: (field: keyof OfferDto, value: string) => void;
}

export function TypeSpecificSection({
  formData,
  offerTypes,
  onEventChange,
  onNewsChange,
  onOfferChange,
}: TypeSpecificSectionProps) {
  const offerTypeOptions = offerTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  if (formData.type === 'event') {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <h3 className="mb-2 flex items-center text-lg font-medium text-primary">
            <IconBadge icon="📅" className="mr-2">
              Datos del Evento
            </IconBadge>
          </h3>
          <p className="mb-4 text-sm text-primary">
            Información específica sobre cuándo y dónde se realizará el evento.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Input
                label="Fecha del Evento *"
                type="datetime-local"
                value={formData.event?.date || ''}
                onChange={(e) => onEventChange('date', e.target.value)}
              />
              <p className="mt-1 text-xs text-primary">La fecha y hora de inicio del evento.</p>
            </div>
          </div>

          <div className="mt-4">
            <Input
              label="Ubicación *"
              value={formData.event?.location || ''}
              onChange={(e) => onEventChange('location', e.target.value)}
              placeholder="Dirección o lugar del evento"
            />
            <p className="mt-1 text-xs text-primary">
              Especifica la dirección física o virtual donde se realizará el evento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (formData.type === 'news') {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <h3 className="mb-2 flex items-center text-lg font-medium text-primary">
            <IconBadge icon="📰" className="mr-2">
              Datos de la Noticia
            </IconBadge>
          </h3>
          <p className="mb-4 text-sm text-primary">
            Información específica sobre la noticia y su origen.
          </p>

          <div>
            <Input
              label="Autor *"
              value={formData.news?.author || ''}
              onChange={(e) => onNewsChange('author', e.target.value)}
              placeholder="Autor de la noticia"
            />
            <p className="mt-1 text-xs text-primary">Nombre del autor o fuente de la noticia.</p>
          </div>
        </div>
      </div>
    );
  }

  if (formData.type === 'offer') {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <h3 className="mb-2 flex items-center text-lg font-medium text-primary">
            <IconBadge icon="🎯" className="mr-2">
              Datos de la Oferta
            </IconBadge>
          </h3>
          <p className="mb-4 text-sm text-primary">
            Información específica sobre la oferta, sus condiciones y plazos.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Select
                label="Tipo de Oferta *"
                options={offerTypeOptions}
                value={formData.offer?.offerType || ''}
                onChange={(value) => onOfferChange('offerType', value)}
              />
              <p className="mt-1 text-xs text-primary">
                Categoría específica de la oferta (ej. empleo, voluntariado, beca).
              </p>
            </div>

            <div>
              <Input
                label="Fecha Límite *"
                type="datetime-local"
                value={formData.offer?.deadline || ''}
                onChange={(e) => onOfferChange('deadline', e.target.value)}
              />
              <p className="mt-1 text-xs text-primary">
                Fecha límite para aplicar o participar en la oferta.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Input
              label="Enlace Externo *"
              value={formData.offer?.external_link || ''}
              onChange={(e) => onOfferChange('external_link', e.target.value)}
              placeholder="URL para más información o postulación"
            />
            <p className="mt-1 text-xs text-primary">
              URL donde los usuarios pueden obtener más información o aplicar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
        <p>Selecciona un tipo de publicación para ver los campos específicos.</p>
      </div>
    </div>
  );
}
