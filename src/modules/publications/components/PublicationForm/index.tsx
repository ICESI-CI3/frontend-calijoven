'use client';

import React from 'react';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs';
import {
  BasicInfoSection,
  TypeSpecificSection,
  OrganizationsSection,
  LocationTagsSection,
  AttachmentsSection,
} from './sections';
import { AttachmentPreviewModal } from '@/components/Attachment';
import { usePublicationForm } from './hooks/usePublicationForm';
import type { Publication } from '@/types/publication';
import { BaseOrganization } from '@/types/organization';
import { Toggle } from '@/components/Toggle';

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
  const {
    // State
    formData,
    isLoading,
    error,
    success,
    attachments,
    selectedCities,
    offerTypes,
    attachmentsToDelete,
    selectedExistingTags,
    previewAttachment,
    fileInputRef,
    newTagName,
    newTagDescription,

    // Setters
    setError,
    setNewTagName,
    setNewTagDescription,

    // Handlers
    handleSubmit,
    handleChange,
    handleEventDataChange,
    handleNewsDataChange,
    handleOfferDataChange,
    handleOrganizersChange,
    handleCitySelect,
    handleCityRemove,
    handleExistingTagSelect,
    handleExistingTagRemove,
    handleCreateNewTag,
    handleRemoveNewTag,
    handleFileChange,
    handleRemoveFile,
    handleRemoveExistingAttachment,
    handlePreviewFile,
    handlePreviewExistingFile,
    handleClosePreview,
  } = usePublicationForm({
    publication,
    defaultOrganizationId,
    userOrganizations,
    onSuccess,
  });

  return (
    <div className="mx-auto max-w-6xl rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">
          {publication ? 'Editar Publicación' : 'Crear Nueva Publicación'}
        </h2>
        <p className="text-gray-600">
          {publication
            ? 'Modifica los detalles de tu publicación existente'
            : 'Completa la información para crear una nueva publicación'}
        </p>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList>
            <TabsTrigger value="basic">
              📝 Básico
            </TabsTrigger>
            <TabsTrigger value="details">
              ⚙️ Detalles
            </TabsTrigger>
            <TabsTrigger value="organizations">
              🏢 Organizaciones
            </TabsTrigger>
            <TabsTrigger value="location">
              🌍 Ubicación
            </TabsTrigger>
            <TabsTrigger value="attachments">
              📎 Archivos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoSection
              formData={formData}
              isEditing={!!publication}
              onChange={handleChange}
            />
          </TabsContent>

          <TabsContent value="details">
            <TypeSpecificSection
              formData={formData}
              offerTypes={offerTypes}
              onEventChange={handleEventDataChange}
              onNewsChange={handleNewsDataChange}
              onOfferChange={handleOfferDataChange}
            />
          </TabsContent>

          <TabsContent value="organizations">
            <OrganizationsSection
              formData={formData}
              userOrganizations={userOrganizations}
              onOrganizersChange={handleOrganizersChange}
            />
          </TabsContent>

          <TabsContent value="location">
            <LocationTagsSection
              formData={formData}
              selectedCities={selectedCities}
              selectedExistingTags={selectedExistingTags}
              newTagName={newTagName}
              newTagDescription={newTagDescription}
              error={error}
              onCitySelect={handleCitySelect}
              onCityRemove={handleCityRemove}
              onExistingTagSelect={handleExistingTagSelect}
              onExistingTagRemove={handleExistingTagRemove}
              onNewTagNameChange={setNewTagName}
              onNewTagDescriptionChange={setNewTagDescription}
              onCreateNewTag={handleCreateNewTag}
              onRemoveNewTag={handleRemoveNewTag}
              setError={setError}
            />
          </TabsContent>

          <TabsContent value="attachments">
            <AttachmentsSection
              publication={publication}
              attachments={attachments}
              attachmentsToDelete={attachmentsToDelete}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
              onRemoveExistingAttachment={handleRemoveExistingAttachment}
              onPreviewFile={handlePreviewFile}
              onPreviewExistingFile={handlePreviewExistingFile}
            />
          </TabsContent>
        </Tabs>

        {/* Publication Settings */}
        <div className="rounded-lg border-t-4 border-blue-500 bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Configuración de Publicación</h3>
          <div className="flex items-center gap-3 flex-wrap">
            <Toggle
              label="Publicada"
              checked={formData.published || false}
              onChange={(value) => handleChange('published', value)}
            />
            <div>
              <p className="text-xs text-gray-500">
                Si no se marca, la publicación quedará guardada como borrador.
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-6 flex-wrap">
          <div className="text-sm text-gray-500">* Campos obligatorios</div>
          <div className="flex gap-4 flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6"
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading} className="px-8">
              {publication ? 'Actualizar' : 'Crear'} Publicación
            </Button>
          </div>
        </div>
      </form>

      {/* Attachment Preview Modal */}
      <AttachmentPreviewModal attachment={previewAttachment} onClose={handleClosePreview} />
    </div>
  );
}
