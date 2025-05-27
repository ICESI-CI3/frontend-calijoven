'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Modal } from '@/components/Modal';
import { Table, TableColumn } from '@/components/Table';
import { BadgeVariant } from '@/components/Badge';
import { IconBadge, StatusIcons, TypeIcons } from '@/components/IconBadge';
import { Pagination } from '@/components/Pagination';
import { FilterBar, FilterGroup } from '@/components/FilterBar';
import { Toggle } from '@/components/Toggle';
import type { Publication, PublicationFilters } from '@/types/publication';
import { publicationService } from '@/modules/publications/services/publication.service';
import {
  DocumentTextIcon,
  ExclamationCircleIcon,
  NewspaperIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface PublicationListProps {
  onEdit: (publication: Publication) => void;
  onCreateNew: () => void;
  organizationId?: string;
}

const defaultFilters: PublicationFilters = { unpublished: true };

export function PublicationList({
  onEdit,
  onCreateNew,
  organizationId = '',
}: PublicationListProps) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PublicationFilters>({
    ...defaultFilters,
    organization: organizationId,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    publication: Publication | null;
  }>({
    isOpen: false,
    publication: null,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      organization: organizationId,
    }));
    setCurrentPage(1);
  }, [organizationId]);

  const loadPublications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await publicationService.getPublications(filters, currentPage, itemsPerPage);
      setPublications(response.data || []);
      setTotalItems(response.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las publicaciones');
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage, itemsPerPage]);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  const handleDelete = async (publication: Publication) => {
    try {
      await publicationService.deletePublication(publication.id);
      setDeleteModal({ isOpen: false, publication: null });
      loadPublications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la publicación');
    }
  };

  const handleGenerateReport = async (publication: Publication) => {
    try {
      const blob = await publicationService.generateSingleReport(
        publication.id,
        `Reporte - ${publication.title}`
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${publication.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el reporte');
    }
  };

  const publicationTypes = [
    { value: '', label: 'Todos los tipos' },
    { value: 'news', label: 'Noticias', icon: TypeIcons.news },
    { value: 'event', label: 'Eventos', icon: TypeIcons.event },
    { value: 'offer', label: 'Ofertas', icon: TypeIcons.offer },
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
    const label =
      {
        news: 'Noticia',
        event: 'Evento',
        offer: 'Oferta',
      }[type.name] || type.description;

    return (
      <IconBadge variant={variant} icon={icon}>
        {label}
      </IconBadge>
    );
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClearFilters = () => {
    setFilters({
      ...defaultFilters,
      organization: organizationId,
    });
  };

  const tableColumns: TableColumn<Publication>[] = [
    {
      key: 'title',
      header: 'Publicación',
      align: 'left',
      flex: 3,
      render: (publication) => (
        <div>
          <div className="text-xs sm:text-sm font-medium text-gray-900">{publication.title}</div>
          <div className="max-w-xs truncate text-xs text-gray-500">{publication.description}</div>
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
        <span className="text-xs sm:text-sm text-gray-500">
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
            onClick={() => setDeleteModal({ isOpen: true, publication })}
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
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <NewspaperIcon className="h-6 w-6 text-primary" />
          Gestión de Publicaciones
        </h2>
        <Button onClick={onCreateNew} className="flex items-center gap-1 text-xs sm:text-sm">
          <PlusIcon className="h-5 w-5" />
          Crear Nueva Publicación
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Filtros mejorados */}
      <FilterBar onClear={handleClearFilters}>
        <FilterGroup
          label="Tipo de Publicación"
          icon={<DocumentTextIcon className="h-6 w-6" />}
          options={publicationTypes}
          selectedValue={filters.type || ''}
          onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
          defaultExpanded={false}
        />

        <Toggle
          label="Ver solo publicados"
          checked={filters.unpublished === false}
          onChange={(checked) => {
            setFilters((prev) => ({ ...prev, unpublished: !checked }));
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
        onSearch={(value) => setFilters((prev) => ({ ...prev, search: value }))}
      />

      {/* Paginación mejorada */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, publication: null })}
        title="Confirmar Eliminación"
      >
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
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, publication: null })}
            >
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
