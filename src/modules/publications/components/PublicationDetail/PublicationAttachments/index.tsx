import React from 'react';
import { PaperClipIcon } from "@heroicons/react/24/outline";
import type { Attachment } from '@/types/publication';

interface PublicationAttachmentsProps {
  attachments?: Attachment[];
  onPreview: (attachment: Attachment) => void;
}

function AttachmentItem({ 
  attachment, 
  onClick 
}: { 
  attachment: Attachment; 
  onClick: () => void;
}) {
  return (
    <div
      className="flex cursor-pointer items-center gap-2 rounded-lg border p-4 hover:bg-muted"
      onClick={onClick}
    >
      <PaperClipIcon className="h-5 w-5" />
      <span className="truncate">{attachment.name}</span>
    </div>
  );
}

export function PublicationAttachments({ attachments, onPreview }: PublicationAttachmentsProps) {
  if (!attachments?.length) return null;
  
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Archivos adjuntos</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {attachments.map((attachment) => (
          <AttachmentItem 
            key={attachment.id} 
            attachment={attachment} 
            onClick={() => onPreview(attachment)} 
          />
        ))}
      </div>
    </div>
  );
} 