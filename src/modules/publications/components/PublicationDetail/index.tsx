'use client';

import { useState } from 'react';
import { Spinner } from '@/components/Spinner';
import { Alert } from '@/components/Alert';
import { AttachmentPreviewModal } from '@/components/Attachment/AttachmentPreviewModal';
import { PublicationHeader } from './PublicationHeader';
import { PublicationMetadata } from './metadata';
import { PublicationAttachments } from './PublicationAttachments';
import { EventRegistration } from './EventRegistration';
import { usePublications } from '../../hooks/usePublications';
import { useEventRegistration } from '../../hooks/useEventRegistration';
import type { Attachment } from '@/types/publication';
import { SavePublicationButton } from '../SavePublicationButton';

export function PublicationDetail({ id }: { id: string }) {
  const { publication, loading, error, refetchPublication } = usePublications({
    singlePublicationId: id,
  });
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  const { regLoading, regError, regSuccess, handleRegistration } = useEventRegistration({
    publicationId: id,
    onSuccess: refetchPublication,
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12" role="status">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!publication) {
    return <Alert type="error" message="No se encontró la publicación" />;
  }

  const isRegistered = !!publication.registrations?.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="mb-2 text-3xl font-bold">{publication.title}</h1>
        <SavePublicationButton publicationId={publication.id} />
      </div>
      <PublicationHeader title={publication.title} description={publication.description} />

      <PublicationMetadata
        type={publication.type}
        tags={publication.tags}
        event={publication.event}
        offer={publication.offer}
        organizers={publication.organizers}
        cities={publication.cities}
        publishedBy={publication.published_by}
      />

      <div className="tiptap mb-8 max-w-none">
        <div dangerouslySetInnerHTML={{ __html: publication.content }} />
      </div>

      <PublicationAttachments 
        attachments={publication.attachments} 
        onPreview={setPreviewAttachment} 
      />

      {publication.type.name === 'event' && (
        <EventRegistration
          isRegistered={isRegistered}
          onRegister={() => handleRegistration(false)}
          onCancel={() => handleRegistration(true)}
          isLoading={regLoading}
          error={regError}
          success={regSuccess}
        />
      )}

      {previewAttachment && (
        <AttachmentPreviewModal
          attachment={previewAttachment}
          onClose={() => setPreviewAttachment(null)}
        />
      )}
    </div>
  );
}
