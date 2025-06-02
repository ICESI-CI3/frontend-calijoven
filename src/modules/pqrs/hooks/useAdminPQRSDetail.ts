import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PQRSService } from '../services/pqrs.service';
import type { PQRS, UpdatePQRSDto, PQRSStatusEntity, PQRSTypeEntity } from '@/types/pqrs';

export function useAdminPQRSDetail(pqrsId: string) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    status: '',
    adminComment: '',
  });

  // Query para obtener la PQRS específica
  const {
    data: pqrs,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PQRS>({
    queryKey: ['pqrs', pqrsId],
    queryFn: () => PQRSService.getPQRSById(pqrsId),
    enabled: !!pqrsId,
  });

  // Query para obtener los estados
  const { data: statuses = [] } = useQuery<PQRSStatusEntity[]>({
    queryKey: ['pqrs-statuses'],
    queryFn: () => PQRSService.getStatusTypes(),
  });

  // Query para obtener los tipos
  const { data: types = [] } = useQuery<PQRSTypeEntity[]>({
    queryKey: ['pqrs-types'],
    queryFn: () => PQRSService.getPQRSTypes(),
  });

  // Mutation para actualizar la PQRS
  const updateMutation = useMutation({
    mutationFn: (updateData: UpdatePQRSDto) => PQRSService.updatePQRS(pqrsId, updateData, true),
    onSuccess: () => {
      // Invalidar y refetch las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['pqrs', pqrsId] });
      queryClient.invalidateQueries({ queryKey: ['admin-pqrs'] });
    },
  });

  // Actualizar formData cuando se carga la PQRS
  useEffect(() => {
    if (pqrs) {
      setFormData({
        status: pqrs.status.name,
        adminComment: pqrs.adminComment || '',
      });
    }
  }, [pqrs]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pqrs) return;

    const updateData: UpdatePQRSDto = {
      status: formData.status,
      adminComment: formData.adminComment,
    };

    return updateMutation.mutateAsync(updateData);
  };

  return {
    // Data
    pqrs,
    statuses,
    types,
    formData,

    // State
    isLoading,
    isError,
    error,
    isSaving: updateMutation.isPending,
    updateError: updateMutation.error,
    updateSuccess: updateMutation.isSuccess,

    // Actions
    handleInputChange,
    handleSubmit,
    refetch,
  };
}
