'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { Textarea } from '@/components/Textarea';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeftIcon,
  CheckIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { useAdminPQRSDetail } from '@/modules/pqrs/hooks/useAdminPQRSDetail';

export default function PQRSDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pqrsId = params.id as string;

  const {
    pqrs,
    statuses,
    types,
    formData,
    isLoading,
    isError,
    error,
    isSaving,
    updateError,
    updateSuccess,
    handleInputChange,
    handleSubmit,
    refetch,
  } = useAdminPQRSDetail(pqrsId);

  // Mostrar mensaje de éxito temporalmente
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        // El éxito se resetea automáticamente con React Query
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (isError && !pqrs) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="py-12 text-center">
          <Alert
            type="error"
            message={error instanceof Error ? error.message : 'Error al cargar la PQRS'}
          />
          <div className="mt-4 flex justify-center gap-2">
            <Button onClick={() => refetch()}>Reintentar</Button>
            <Button variant="outline" onClick={() => router.back()}>
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!pqrs) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="py-12 text-center">
          <p className="mb-4 text-red-600">PQRS no encontrada</p>
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  // Encontrar el estado actual para mostrar su descripción
  const currentStatus = statuses.find((s) => s.name === pqrs.status.name);
  const currentType = types.find((t) => t.id === pqrs.type?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Volver a la lista
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Badge>{currentStatus?.description || pqrs.status.name}</Badge>
              <span className="text-sm text-gray-500">
                {currentType?.name || pqrs.type?.name || 'Sin tipo'}
              </span>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{pqrs.title}</h1>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>Creada: {formatDate(pqrs.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>Actualizada: {formatDate(pqrs.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Contenido Principal */}
        <div className="space-y-8 lg:col-span-2">
          {/* Información del Usuario */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <UserIcon className="h-5 w-5" />
              Usuario
            </h2>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  <UserIcon className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {pqrs.user?.name || 'Usuario desconocido'}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    ID: {pqrs.user?.id || 'No disponible'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <DocumentTextIcon className="h-5 w-5" />
              Descripción de la PQRS
            </h2>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="whitespace-pre-wrap text-gray-700">{pqrs.description}</p>
            </div>
          </div>

          {/* Respuesta/Comentario Actual */}
          {pqrs.adminComment && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Respuesta Administrativa Actual
              </h2>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="whitespace-pre-wrap text-gray-700">{pqrs.adminComment}</p>
              </div>
            </div>
          )}
        </div>

        {/* Panel de Gestión */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Gestión Administrativa</h2>

            {updateError && (
              <div className="mb-4">
                <Alert
                  type="error"
                  message={
                    updateError instanceof Error
                      ? updateError.message
                      : 'Error al actualizar la PQRS'
                  }
                />
              </div>
            )}

            {updateSuccess && (
              <div className="mb-4">
                <Alert type="success" message="PQRS actualizada exitosamente" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Select
                  label="Estado de la PQRS"
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                  options={statuses.map((status) => ({
                    value: status.name,
                    label: status.description,
                  }))}
                  helperText="Cambia el estado según el progreso de la gestión"
                />
              </div>

              <div>
                <Textarea
                  label="Respuesta/Comentario"
                  value={formData.adminComment}
                  onChange={(value) => handleInputChange('adminComment', value)}
                  placeholder="Escribe una respuesta para el usuario..."
                  rows={6}
                  helperText="Esta respuesta será visible para el usuario"
                />
              </div>

              <Button
                type="submit"
                disabled={isSaving}
                isLoading={isSaving}
                className="flex w-full items-center justify-center gap-2"
              >
                <CheckIcon className="h-4 w-4" />
                {isSaving ? 'Actualizando...' : 'Actualizar PQRS'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
