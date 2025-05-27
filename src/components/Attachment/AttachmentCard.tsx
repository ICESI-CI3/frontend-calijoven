import React from 'react';
import { Badge } from '@/components/Badge';

interface AttachmentCardProps {
  file?: File;
  attachment?: {
    id: string;
    name: string;
    format: string;
    url: string;
  };
  onRemove: () => void;
  onPreview: () => void;
}

export function AttachmentCard({ file, attachment, onRemove, onPreview }: AttachmentCardProps) {
  const isFile = !!file;
  const name = file?.name || attachment?.name || '';
  const format = file?.type || attachment?.format || '';

  const getFileIcon = (format: string) => {
    if (format.includes('pdf')) return '📄';
    if (format.includes('word')) return '📝';
    if (format.includes('excel')) return '📊';
    return '📎';
  };

  const renderPreview = () => {
    if (format.startsWith('image/')) {
      const src = file ? URL.createObjectURL(file) : attachment?.url;
      return (
        <img
          src={src}
          alt={name}
          className="h-full object-contain"
        />
      );
    }
    
    return (
      <div className="text-3xl">
        {getFileIcon(format)}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border bg-gray-50 transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col p-2">
        <div className="absolute right-2 top-2">
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full bg-white p-1 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            &times;
          </button>
        </div>

        <div className="mb-2 flex h-24 items-center justify-center rounded border bg-white">
          {renderPreview()}
        </div>

        <p
          className="truncate text-xs font-medium text-gray-700"
          title={name}
        >
          {name}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <Badge variant="default" size="sm" className="capitalize">
            {format.split('/')[1]}
          </Badge>

          <button
            type="button"
            onClick={onPreview}
            className="text-xs text-blue-600 transition-colors hover:text-blue-800"
          >
            Vista previa
          </button>
        </div>
      </div>
    </div>
  );
} 