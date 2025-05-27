import React from 'react';
import { Button } from '@/components/Button';

interface AttachmentPreviewModalProps {
  attachment: {
    url: string;
    name: string;
    format: string;
  } | null;
  onClose: () => void;
}

export function AttachmentPreviewModal({ attachment, onClose }: AttachmentPreviewModalProps) {
  if (!attachment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-medium">{attachment.name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-auto p-4">
          {attachment.format.startsWith('image/') ? (
            <img
              src={attachment.url}
              alt={attachment.name}
              className="max-h-[70vh] max-w-full object-contain"
            />
          ) : attachment.format === 'application/pdf' ? (
            <iframe src={attachment.url} title={attachment.name} className="h-[70vh] w-full" />
          ) : (
            <div className="p-8 text-center">
              <div className="mb-4 text-6xl">📎</div>
              <p>Este tipo de archivo no se puede previsualizar directamente.</p>
              <a
                href={attachment.url}
                download={attachment.name}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Descargar archivo
              </a>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t p-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
