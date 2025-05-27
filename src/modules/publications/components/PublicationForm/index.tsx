'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Textarea } from '@/components/Textarea';
import { Alert } from '@/components/Alert';
import type {
  CreatePublicationDto,
  Publication,
  CreateTagDto,
  EventDto,
} from '@/types/publication';
import { publicationService } from '@/modules/publications/services/publication.service';
import { BaseOrganization } from '@/types/organization';

interface PublicationFormProps {
  publication?: Publication;
  onSuccess: () => void;
  onCancel: () => void;
  defaultOrganizationId?: string;
  userOrganizations?: BaseOrganization[];
}

export function PublicationForm({
  publication,
  onSuccess,
  onCancel,
  defaultOrganizationId = '',
  userOrganizations = [],
}: PublicationFormProps) {
  const [formData, setFormData] = useState<CreatePublicationDto>({
    title: '',
    description: '',
    content: '',
    type: 'news',
    tags: [],
    cities: [],
    organizers: defaultOrganizationId ? [defaultOrganizationId] : [],
    published: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [tagDescriptionInput, setTagDescriptionInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (publication) {
      setFormData({
        title: publication.title,
        description: publication.description,
        content: publication.content,
        type: publication.type.name,
        cities: publication.cities.map((city) => city.id),
        tags: publication.tags.map((tag) => ({ name: tag.name, description: tag.description })),
        organizers: publication.organizers?.map((org) => org.id) || [],
        published: !!publication.published_at,
      });

      // Si la publicación es de tipo evento, configurar datos específicos
      if (publication.type.name === 'event') {
        // Aquí tendríamos que extraer datos específicos del evento si estuvieran disponibles
        // Por ejemplo, location y date de un objeto event anidado
        // Esto es un placeholder y debe ajustarse según la estructura real
        setFormData((prev) => ({
          ...prev,
          event: {
            location: '', // Placeholder
            date: '', // Placeholder
          },
        }));
      }
    }
  }, [publication]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const submissionData = {
        ...formData,
        attachments,
      };

      if (publication) {
        await publicationService.updatePublication(publication.id, submissionData);
        setSuccess('Publicación actualizada exitosamente');
      } else {
        await publicationService.createPublication(submissionData);
        setSuccess('Publicación creada exitosamente');
      }

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CreatePublicationDto, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEventDataChange = (field: keyof EventDto, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      event: {
        ...(prev.event || {}),
        [field]: value,
      },
    }));
  };

  const addTag = () => {
    if (tagsInput.trim()) {
      const newTag: CreateTagDto = {
        name: tagsInput.trim(),
        description: tagDescriptionInput.trim() || undefined,
      };

      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag],
      }));

      setTagsInput('');
      setTagDescriptionInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const publicationTypes = [
    { value: 'news', label: 'Noticia' },
    { value: 'event', label: 'Evento' },
    { value: 'offer', label: 'Oferta' },
  ];

  // Opciones para el selector de organizaciones
  const organizationOptions = userOrganizations.map((org) => ({
    value: org.id,
    label: org.name || org.acronym || org.id,
  }));

  const handleOrganizersChange = (value: string) => {
    // Agregar o quitar la organización de la lista de organizadores
    if (value) {
      setFormData((prev) => ({
        ...prev,
        organizers: [value], // Por ahora solo permitimos una organización
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        organizers: [],
      }));
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="mb-6 text-2xl font-bold">
        {publication ? 'Editar Publicación' : 'Crear Nueva Publicación'}
      </h2>

      {error && <Alert type="error" message={error} />}

      {success && <Alert type="success" message={success} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Título *"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Ingresa el título de la publicación"
          />

          <Select
            label="Tipo de Publicación *"
            options={publicationTypes}
            value={formData.type}
            onChange={(value) => handleChange('type', value)}
          />
        </div>

        {userOrganizations.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Select
              label="Organización *"
              options={organizationOptions}
              value={formData.organizers?.[0] || ''}
              onChange={handleOrganizersChange}
            />
          </div>
        )}

        <Textarea
          label="Descripción *"
          value={formData.description}
          onChange={(value) => handleChange('description', value)}
          placeholder="Breve descripción de la publicación"
          rows={3}
        />

        <Textarea
          label="Contenido *"
          value={formData.content}
          onChange={(value) => handleChange('content', value)}
          placeholder="Contenido completo de la publicación"
          rows={8}
        />

        {/* Campos específicos para eventos */}
        {formData.type === 'event' && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                label="Fecha del Evento"
                type="datetime-local"
                value={formData.event?.date || ''}
                onChange={(e) => handleEventDataChange('date', e.target.value)}
              />
            </div>

            <Input
              label="Ubicación"
              value={formData.event?.location || ''}
              onChange={(e) => handleEventDataChange('location', e.target.value)}
              placeholder="Dirección o lugar del evento"
            />
          </>
        )}

        {/* Sección de etiquetas */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-4 text-lg font-medium">Etiquetas</h3>

          <div className="mb-4 flex flex-wrap gap-2">
            {formData.tags?.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1"
              >
                <span>{tag.name}</span>
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Nombre de la etiqueta"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Añadir nueva etiqueta"
            />

            <Input
              label="Descripción (opcional)"
              value={tagDescriptionInput}
              onChange={(e) => setTagDescriptionInput(e.target.value)}
              placeholder="Descripción de la etiqueta"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addTag}
            disabled={!tagsInput.trim()}
            className="mt-4"
          >
            Añadir Etiqueta
          </Button>
        </div>

        {/* Sección de archivos adjuntos */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-4 text-lg font-medium">Archivos Adjuntos</h3>

          <div className="mb-4 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 rounded bg-gray-100 px-3 py-1">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2"
          >
            Subir Archivos
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => handleChange('published', e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">
            Publicar inmediatamente
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            {publication ? 'Actualizar' : 'Crear'} Publicación
          </Button>
        </div>
      </form>
    </div>
  );
}
