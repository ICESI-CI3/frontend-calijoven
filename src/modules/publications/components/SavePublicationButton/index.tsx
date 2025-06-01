import React from 'react';
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useSavedPublications } from '../../hooks/useSavedPublications';
import { IconButton } from '@/components/IconButton';
import RequireAuth from '@/modules/auth/components/RequireAuth';

interface SavePublicationButtonProps {
  publicationId: string;
  className?: string;
}

export function SavePublicationButton({ publicationId, className }: SavePublicationButtonProps) {
  const { savePublication, unsavePublication, useIsPublicationSaved } = useSavedPublications();
  const { data: isSaved, isLoading } = useIsPublicationSaved(publicationId);

  const handleToggleSave = () => {
    if (isSaved) {
      unsavePublication(publicationId);
    } else {
      savePublication(publicationId);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <RequireAuth>
      <IconButton
        onClick={handleToggleSave}
        className={className}
        title={isSaved ? 'Quitar de guardados' : 'Guardar publicación'}
      >
        {isSaved ? (
          <BookmarkSolidIcon className="h-5 w-5" />
        ) : (
          <BookmarkOutlineIcon className="h-5 w-5" />
        )}
      </IconButton>
    </RequireAuth>
  );
}
