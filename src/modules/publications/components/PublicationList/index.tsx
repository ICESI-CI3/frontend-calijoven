'use client';

import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Modal } from '@/components/Modal';
import { Table, TableColumn } from '@/components/Table';
import { BadgeVariant } from '@/components/Badge';
import { IconBadge, StatusIcons, TypeIcons } from '@/components/IconBadge';
import { Pagination } from '@/components/Pagination';
import { FilterBar, FilterGroup } from '@/components/FilterBar';
import { Toggle } from '@/components/Toggle';
import type { Publication } from '@/types/publication';
import {
  DocumentTextIcon,
  ExclamationCircleIcon,
  NewspaperIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { publicationTypes } from '@/lib/constants/publicationTypes';
import { useAdminPublicationList } from '@/modules/publications/hooks/useAdminPublicationList';

interface PublicationListProps {
  onEdit: (publication: Publication) => void;
  onCreateNew: () => void;
  organizationId?: string;
}

export function PublicationList({
  onEdit,
  onCreateNew,
  organizationId = '',
}: PublicationListProps) {
  const {
    // Data
    publications,
    totalItems,
    totalPages,

    // State
    isLoading,
    error,
    filters,
    currentPage,
    deleteModal,

    // Actions
    handleFilterChange,
    handlePageChange,
    handleClearFilters,
    handleDelete,
    handleGenerateReport,
    handleNavigateToDetail,
    openDeleteModal,
    closeDeleteModal,
    setErrorMessage,
  } = useAdminPublicationList({ organizationId });

  const publicationTypeOptions = [
    { value: '', label: 'Todos los tipos' },
    ...Object.values(publicationTypes).map((type) => ({
      value: type.value,
      label: type.label,
    })),
  ];

  const getStatusBadge = (publication: Publication) => {
    if (publication.published_at) {
      return (
        <IconBadge variant="success" icon={StatusIcons.published}>
          Publicado
        </IconBadge>
      );
    } else {
      return (
        <IconBadge variant="warning" icon={StatusIcons.draft}>
          Borrador
        </IconBadge>
      );
    }
  };

  const getTypeBadge = (type: { name: string; description: string }) => {
    const typeVariantMap: Record<string, BadgeVariant> = {
      news: 'primary',
      event: 'info',
      offer: 'warning',
    };

    const typeIconMap: Record<string, React.ReactNode> = {
      news: TypeIcons.news,
      event: TypeIcons.event,
      offer: TypeIcons.offer,
    };

    const variant = typeVariantMap[type.name] || 'default';
    const icon = typeIconMap[type.name];

    return (
      <IconBadge variant={variant} icon={icon}>
        {type.description}
      </IconBadge>
    );
  };

  const tableColumns: TableColumn<Publication>[] = [
    {
      key: 'title',
      header: 'Publicación',
      align: 'left',
      flex: 3,
      render: (publication) => (
        <div
          className="group cursor-pointer"
          onClick={() => handleNavigateToDetail(publication.id)}
        >
          <div className="text-xs font-medium text-gray-900 group-hover:text-primary group-hover:underline group-hover:underline-offset-2 sm:text-sm">
            {publication.title}
          </div>
          <div className="max-w-xs truncate text-xs text-gray-500 group-hover:text-primary group-hover:underline group-hover:underline-offset-2">
            {publication.description}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      flex: 1,
      render: (publication) => getTypeBadge(publication.type),
    },
    {
      key: 'status',
      header: 'Estado',
      flex: 1,
      render: (publication) => getStatusBadge(publication),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      flex: 1,
      render: (publication) => (
        <span className="text-xs text-gray-500 sm:text-sm">
          {new Date(publication.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'center',
      flex: 1,
      render: (publication) => (
        <div className="z-10 flex justify-center space-x-2">
          <button
            className="inline-flex items-center justify-center rounded-md bg-gray-50 p-2 text-gray-700 hover:bg-gray-100"
            onClick={() => onEdit(publication)}
            title="Editar"
          >
            <PencilIcon className="h-4 w-4" />
          </button>

          <button
            className="inline-flex items-center justify-center rounded-md bg-gray-50 p-2 text-gray-700 hover:bg-gray-100"
            onClick={() => handleGenerateReport(publication)}
            title="Generar Reporte"
          >
            <DocumentTextIcon className="h-4 w-4" />
          </button>

          <button
            className="inline-flex items-center justify-center rounded-md bg-gray-50 p-2 text-red-600 hover:bg-red-50"
            onClick={() => openDeleteModal(publication)}
            title="Eliminar"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <NewspaperIcon className="h-6 w-6 text-primary" />
          Gestión de Publicaciones
        </h2>
        <Button onClick={onCreateNew} className="flex items-center gap-1 text-xs sm:text-sm">
          <PlusIcon className="h-5 w-5" />
          Crear Nueva Publicación
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setErrorMessage(null)} />}

      {/* Filtros mejorados */}
      <FilterBar onClear={handleClearFilters}>
        <FilterGroup
          label="Tipo de Publicación"
          icon={<DocumentTextIcon className="h-6 w-6" />}
          options={publicationTypeOptions}
          selectedValue={filters.type || ''}
          onChange={(value) => handleFilterChange({ type: value })}
          defaultExpanded={false}
        />

        <Toggle
          label="Ver solo publicados"
          checked={filters.unpublished === false}
          onChange={(checked) => {
            handleFilterChange({ unpublished: !checked });
          }}
          size="md"
        />
      </FilterBar>

      {/* Tabla de publicaciones */}
      <Table
        columns={tableColumns}
        data={publications}
        keyExtractor={(publication) => publication.id}
        isLoading={isLoading}
        emptyMessage="No se encontraron publicaciones con los filtros seleccionados."
        search={true}
        onSearch={(value) => handleFilterChange({ search: value })}
      />

      {/* Paginación mejorada */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={deleteModal.isOpen} onClose={closeDeleteModal} title="Confirmar Eliminación">
        <div className="space-y-4">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0">
            <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              ¿Estás seguro de que deseas eliminar la publicación?
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Se eliminará permanentemente la publicación "{deleteModal.publication?.title}". Esta
                acción no se puede deshacer.
              </p>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3 sm:mt-4">
            <Button variant="outline" onClick={closeDeleteModal}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteModal.publication && handleDelete(deleteModal.publication)}
              className="flex items-center gap-1"
            >
              <TrashIcon className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
