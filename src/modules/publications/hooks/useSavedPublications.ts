import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savedPublicationService } from '../services/saved-publications.service';
import type { Publication } from '@/types/publication';

export type UseSavedPublicationsOptions = {
  initialPage?: number;
  initialLimit?: number;
};

interface SavedPublication {
  id: string;
  publication: Publication;
  savedAt: string;
}

type SavedPublicationsResponse = {
  data: SavedPublication[];
  total: number;
};

export function useSavedPublications(options: UseSavedPublicationsOptions = {}) {
  const { initialPage = 1, initialLimit = 10 } = options;
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const queryClient = useQueryClient();

  // Query para obtener las publicaciones guardadas
  const { data, isLoading, error } = useQuery<SavedPublicationsResponse>({
    queryKey: ['savedPublications', page, limit],
    queryFn: () => savedPublicationService.getMySavedPublications(page, limit),
    select: (response) => {
      console.log('Response from server:', response);
      return {
        data: response.data || [],
        total: response.total || 0
      };
    }
  });

  // Mutación para guardar una publicación
  const savePublication = useMutation({
    mutationFn: savedPublicationService.savePublication,
    onSuccess: () => {
      // Invalidar la caché de publicaciones guardadas para forzar una recarga
      queryClient.invalidateQueries({ queryKey: ['savedPublications'] });
    },
  });

  // Mutación para eliminar una publicación guardada
  const unsavePublication = useMutation({
    mutationFn: savedPublicationService.unsavePublication,
    onSuccess: () => {
      // Invalidar la caché de publicaciones guardadas para forzar una recarga
      queryClient.invalidateQueries({ queryKey: ['savedPublications'] });
    },
  });

  // Query para verificar si una publicación está guardada
  const useIsPublicationSaved = (publicationId: string) => {
    return useQuery({
      queryKey: ['savedPublication', publicationId],
      queryFn: () => savedPublicationService.isPublicationSaved(publicationId),
    });
  };

  return {
    savedPublications: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    savePublication: savePublication.mutate,
    unsavePublication: unsavePublication.mutate,
    useIsPublicationSaved,
  };
} 