import React from 'react';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Textarea } from '@/components/Textarea';
import { Badge } from '@/components/Badge';
import type { CreatePublicationDto } from '@/types/publication';
import { Info } from '@/components/Info';
import { RichTextEditor } from '@/components/RichTextEditor';
import { publicationTypes } from '@/lib/constants/publicationTypes';

interface BasicInfoSectionProps {
  formData: CreatePublicationDto;
  isEditing: boolean;
  onChange: (field: keyof CreatePublicationDto, value: unknown) => void;
}

export function BasicInfoSection({ formData, isEditing, onChange }: BasicInfoSectionProps) {
  return (
    <div className="space-y-6">
      <Info
        title="Información básica"
        description="Define el título, tipo y descripción de tu publicación. Esta información será visible en todas las vistas."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Input
            label="Título *"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Ingresa el título de la publicación"
          />
          <p className="mt-1 text-xs text-gray-500">
            El título debe ser claro y descriptivo para captar la atención de los usuarios.
          </p>
        </div>

        <div>
          {isEditing ? (
            <div>
              <p className="mb-2 block text-sm font-medium text-foreground">
                Tipo de Publicación *
              </p>
              <div className="rounded-md border bg-gray-50 p-2">
                <Badge
                  variant={
                    formData.type === publicationTypes.event.value
                      ? 'primary'
                      : formData.type === publicationTypes.news.value
                        ? 'info'
                        : 'warning'
                  }
                >
                  {publicationTypes[formData.type as keyof typeof publicationTypes].label}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                El tipo de publicación no puede ser modificado una vez creada.
              </p>
            </div>
          ) : (
            <div>
              <Select
                label="Tipo de Publicación *"
                options={[
                  ...Object.values(publicationTypes).map((type) => ({
                    value: type.value,
                    label: type.label,
                  })),
                ]}
                value={formData.type}
                onChange={(value) => onChange('type', value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Selecciona el tipo de contenido que estás creando. Esto determinará los campos
                adicionales requeridos.
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <Textarea
          label="Descripción *"
          value={formData.description}
          onChange={(value) => onChange('description', value)}
          placeholder="Breve descripción de la publicación"
          rows={3}
        />
        <p className="mt-1 text-xs text-gray-500">
          Escribe un resumen conciso que aparecerá en las listas y vistas previas.
        </p>
      </div>

      <div>
        <p className="mb-2 block text-sm font-medium text-foreground">Contenido *</p>
        <RichTextEditor value={formData.content} onChange={(value) => onChange('content', value)} />
        <p className="mt-1 text-xs text-gray-500">
          Detalla toda la información importante. Puedes incluir enlaces y detalles específicos.
        </p>
      </div>
    </div>
  );
}
