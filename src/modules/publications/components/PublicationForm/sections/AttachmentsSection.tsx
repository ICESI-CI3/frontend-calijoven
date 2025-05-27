import React from 'react';
import { Button } from '@/components/Button';
import { AttachmentCard } from '@/components/Attachment';
import type { Publication } from '@/types/publication';
import { Info } from '@/components/Info';

interface AttachmentsSectionProps {
  publication?: Publication;
  attachments: File[];
  attachmentsToDelete: string[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onRemoveExistingAttachment: (id: string) => void;
  onPreviewFile: (file: File) => void;
  onPreviewExistingFile: (attachment: {
    id: string;
    name: string;
    format: string;
    url: string;
  }) => void;
}

export function AttachmentsSection({
  publication,
  attachments,
  attachmentsToDelete,
  fileInputRef,
  onFileChange,
  onRemoveFile,
  onRemoveExistingAttachment,
  onPreviewFile,
  onPreviewExistingFile,
}: AttachmentsSectionProps) {
  return (
    <div className="space-y-6">
      <Info
        title="Archivos Adjuntos"
        description="Agrega documentos, imágenes u otros archivos relevantes para tu publicación."
      />

      {/* Existing attachments (when editing) */}
      {publication?.attachments && publication.attachments.length > 0 && (
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-medium">Archivos existentes:</h4>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {publication.attachments
              .filter((attachment) => !attachmentsToDelete.includes(attachment.id))
              .map((attachment) => (
                <AttachmentCard
                  key={attachment.id}
                  attachment={attachment}
                  onRemove={() => onRemoveExistingAttachment(attachment.id)}
                  onPreview={() => onPreviewExistingFile(attachment)}
                />
              ))}
          </div>
        </div>
      )}

      {/* New attachments */}
      {attachments.length > 0 && (
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-medium">Nuevos archivos:</h4>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {attachments.map((file, index) => (
              <AttachmentCard
                key={file.name}
                file={file}
                onRemove={() => onRemoveFile(index)}
                onPreview={() => onPreviewFile(file)}
              />
            ))}
          </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" multiple />

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="mt-2"
      >
        📎 Subir Archivos
      </Button>

      <p className="mt-2 text-xs text-gray-500">
        Puedes subir múltiples archivos. Formatos soportados: imágenes, PDF, documentos de Word,
        Excel, etc.
      </p>
    </div>
  );
}
