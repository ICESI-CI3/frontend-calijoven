import React from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Tag } from '@/components/Tag';
import { SearchableSelect } from '@/components/SearchableSelect';
import type { CreatePublicationDto } from '@/types/publication';
import type { BaseCity } from '@/types/city';
import { governanceService } from '@/lib/api/governance.service';
import { publicationService } from '@/modules/publications/services/publication.service';
import { Info } from '@/components/Info';

interface LocationTagsSectionProps {
  formData: CreatePublicationDto;
  selectedCities: BaseCity[];
  selectedExistingTags: { id: string; name: string; description?: string }[];
  newTagName: string;
  newTagDescription: string;
  error: string | null;
  onCitySelect: (cityItem: { id: string; name: string; description?: string }) => void;
  onCityRemove: (cityId: string) => void;
  onExistingTagSelect: (tagItem: { id: string; name: string; description?: string }) => void;
  onExistingTagRemove: (tagId: string) => void;
  onNewTagNameChange: (value: string) => void;
  onNewTagDescriptionChange: (value: string) => void;
  onCreateNewTag: () => void;
  onRemoveNewTag: (index: number) => void;
  setError: (error: string | null) => void;
}

export function LocationTagsSection({
  formData,
  selectedCities,
  selectedExistingTags,
  newTagName,
  newTagDescription,
  onCitySelect,
  onCityRemove,
  onExistingTagSelect,
  onExistingTagRemove,
  onNewTagNameChange,
  onNewTagDescriptionChange,
  onCreateNewTag,
  onRemoveNewTag,
  setError,
}: LocationTagsSectionProps) {
  const handleCreateNewTag = () => {
    if (newTagName.trim() && newTagDescription.trim()) {
      // Check if we're trying to create a duplicate new tag
      const duplicateNewTag = formData.tags?.find(
        (tag) => tag.name.toLowerCase() === newTagName.trim().toLowerCase()
      );

      if (duplicateNewTag) {
        setError(`Ya has creado una etiqueta con el nombre "${newTagName.trim()}".`);
        return;
      }

      // Check if tag name already exists in selected existing tags
      const existingTag = selectedExistingTags.find(
        (tag) => tag.name.toLowerCase() === newTagName.trim().toLowerCase()
      );

      if (existingTag) {
        setError(
          `La etiqueta "${newTagName.trim()}" ya existe y está seleccionada. No puedes crear una duplicada.`
        );
        return;
      }

      onCreateNewTag();
      setError(null);
    }
  };

  return (
    <div className="space-y-8">
      <Info
        title="Ubicación y Etiquetas"
        description="Define dónde es relevante tu publicación y agrégale etiquetas para facilitar su búsqueda y categorización."
      />

      {/* Cities Section */}
      <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300">
        <h3 className="mb-2 text-lg font-medium text-gray-800">Ciudades *</h3>
        <p className="mb-4 text-sm text-gray-600">
          Selecciona las ciudades donde esta publicación es relevante o aplicable.
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {selectedCities.map((city) => (
            <div
              key={city.id}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1"
            >
              <span>{city.name}</span>
              <button
                type="button"
                onClick={() => onCityRemove(city.id)}
                className="text-gray-500 transition-colors hover:text-red-500"
              >
                &times;
              </button>
            </div>
          ))}

          {selectedCities.length === 0 && (
            <p className="text-sm italic text-gray-500">No hay ciudades seleccionadas</p>
          )}
        </div>

        <SearchableSelect
          label="Buscar y agregar ciudad"
          placeholder="Escribe el nombre de la ciudad..."
          searchFunction={governanceService.searchCities}
          onSelect={onCitySelect}
          selectedItems={selectedCities.map((city) => city.id)}
        />
      </div>

      {/* Tags Section */}
      <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300">
        <h3 className="mb-2 text-lg font-medium text-gray-800">Etiquetas</h3>
        <p className="mb-6 text-sm text-gray-600">
          Las etiquetas ayudan a categorizar y hacer más fácil de encontrar tu publicación. Puedes
          usar etiquetas existentes o crear nuevas.
        </p>

        {/* Selected Tags Display */}
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-medium text-gray-700">Etiquetas seleccionadas:</h4>
          <div className="flex min-h-[2.5rem] flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
            {/* Existing tags from database */}
            {selectedExistingTags.map((tag) => (
              <Tag
                key={tag.id}
                onRemove={() => onExistingTagRemove(tag.id)}
                className="cursor-pointer border-blue-200 bg-blue-100 text-blue-800"
              >
                {tag.name}
              </Tag>
            ))}

            {/* New tags created by user */}
            {formData.tags?.map((tag, index) => (
              <Tag
                key={`new-${index}`}
                onRemove={() => onRemoveNewTag(index)}
                className="cursor-pointer border-green-200 bg-green-100 text-green-800"
              >
                {tag.name} ✨
              </Tag>
            ))}

            {selectedExistingTags.length === 0 && formData.tags?.length === 0 && (
              <p className="text-sm italic text-gray-500">No hay etiquetas seleccionadas</p>
            )}
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded border border-blue-200 bg-blue-100"></div>
              <span>Etiquetas existentes</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded border border-green-200 bg-green-100"></div>
              <span>Etiquetas nuevas</span>
            </div>
          </div>
        </div>

        {/* Two separate sections for adding tags */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Existing Tags Section */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <h4 className="mb-2 flex items-center text-sm font-semibold text-primary">
              🏷️ Usar etiquetas existentes
            </h4>
            <p className="mb-3 text-xs text-primary">
              Busca y selecciona de las etiquetas que ya están en el sistema.
            </p>

            <SearchableSelect
              label=""
              placeholder="Buscar etiquetas existentes..."
              searchFunction={publicationService.searchTags}
              onSelect={onExistingTagSelect}
              selectedItems={selectedExistingTags.map((tag) => tag.id)}
              maxHeight="150px"
            />
          </div>

          {/* New Tags Section */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <h4 className="mb-2 flex items-center text-sm font-semibold text-primary">
              ✨ Crear nueva etiqueta
            </h4>
            <p className="mb-3 text-xs text-primary">
              Crea una etiqueta completamente nueva que se guardará en el sistema.
            </p>

            <div className="space-y-3">
              <Input
                label="Nombre de la nueva etiqueta *"
                value={newTagName}
                onChange={(e) => onNewTagNameChange(e.target.value)}
                placeholder="Nombre de la etiqueta"
              />

              <Input
                label="Descripción *"
                value={newTagDescription}
                onChange={(e) => onNewTagDescriptionChange(e.target.value)}
                placeholder="Describe para qué sirve esta etiqueta"
              />

              <Button
                type="button"
                variant="secondary"
                onClick={handleCreateNewTag}
                disabled={!newTagName.trim() || !newTagDescription.trim()}
                className="w-full"
              >
                Crear Etiqueta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
