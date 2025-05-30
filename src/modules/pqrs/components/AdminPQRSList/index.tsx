'use client';

import React from 'react';
import { PQRS } from '@/types/pqrs';
import { Table, TableColumn } from '@/components/Table';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { Alert } from '@/components/Alert';
import { formatDate } from '@/lib/utils';
import { EyeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import { FilterBar, FilterGroup } from '@/components/FilterBar';
import { useAdminPQRS } from '@/modules/pqrs/hooks/useAdminPQRS';

export const AdminPQRSList = () => {
  const router = useRouter();
  const {
    pqrs,
    total,
    totalPages,
    statuses,
    types,
    isLoading,
    isError,
    error,
    filters,
    page,
    handleFilterChange,
    handlePageChange,
    clearFilters,
    refetch,
  } = useAdminPQRS();

  const columns: TableColumn<PQRS>[] = [
    {
      key: 'title',
      header: 'Título',
      align: 'left',
      flex: 3,
      render: (pqrs: PQRS) => (
        <div>
          <p className="font-medium text-gray-900">{pqrs.title}</p>
          <p className="text-sm text-gray-500 line-clamp-2">{pqrs.description}</p>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'Usuario',
      align: 'left',
      flex: 2,
      render: (pqrs: PQRS) => (
        <div>
          <p className="font-medium text-gray-900">{pqrs.user?.name || 'Usuario desconocido'}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      align: 'center',
      flex: 1,
      render: (pqrs: PQRS) => (
        <span className="text-sm text-gray-600">{pqrs.type?.name || 'Sin tipo'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      align: 'center',
      flex: 1,
      render: (pqrs: PQRS) => (
        <Badge>
          {pqrs.status.description}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha de creación',
      align: 'center',
      flex: 1,
      render: (pqrs: PQRS) => (
        <span className="text-sm text-gray-600">
          {formatDate(pqrs.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'center',
      flex: 1,
      render: (pqrs: PQRS) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(ROUTES.ADMIN.PQRS_DETAIL(pqrs.id).PATH)}
          >
            <EyeIcon className="w-4 h-4 mr-1" />
            Ver
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card title="Error">
        <div className="text-center py-12">
          <Alert 
            type="error" 
            message={error instanceof Error ? error.message : 'Error al cargar las PQRS'} 
          />
          <Button onClick={() => refetch()} className="mt-4">
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <FilterBar onClear={clearFilters}>
        <FilterGroup 
          label="Estado"
          options={[
            { label: 'Todos los estados', value: '' },
            ...statuses.map((status) => ({
              label: status.description,
              value: status.name,
            }))
          ]}
          selectedValue={filters.status || ''}
          onChange={(value) => handleFilterChange({ status: value || undefined })}
        />
        
        <FilterGroup 
          label="Tipo"
          options={[
            { label: 'Todos los tipos', value: '' },
            ...types.map((type) => ({
              label: type.name,
              value: type.name,
            }))
          ]}
          selectedValue={filters.type || ''}
          onChange={(value) => handleFilterChange({ type: value || undefined })}
        />
      </FilterBar>

      {/* Resultados */}
        {pqrs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {total === 0 ? 'No hay PQRS registradas' : 'No se encontraron PQRS con los filtros aplicados'}
            </p>
          </div>
        ) : (
          <Table
            data={pqrs}
            columns={columns}
            keyExtractor={(pqrs) => pqrs.id}
            className="w-full"
            pagination={{
              enabled: true,
              currentPage: page,
              totalPages: totalPages,
              onPageChange: handlePageChange
            }}
          />
        )}
    </div>
  );
};