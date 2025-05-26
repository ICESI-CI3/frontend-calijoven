'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Modal } from '@/components/Modal';
import { Table, TableColumn } from '@/components/Table';
import { BadgeVariant } from '@/components/Badge';
import { IconBadge, StatusIcons, TypeIcons } from '@/components/IconBadge';
import { ActionMenu } from '@/components/ActionMenu';
import { Pagination } from '@/components/Pagination';
import { FilterBar, FilterGroup } from '@/components/FilterBar';
import { Toggle } from '@/components/Toggle';
import type { Publication, PublicationFilters } from '@/types/publication';
import { publicationService } from '@/modules/publications/services/publication.service';
import { DocumentTextIcon, NewspaperIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

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
          <div className="text-sm font-medium text-gray-900">{publication.title}</div>
          <div className="max-w-xs truncate text-sm text-gray-500">{publication.description}</div>
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
        <span className="text-sm text-gray-500">
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
        <ActionMenu
          actions={[
            {
              label: 'Editar',
              icon: <PencilIcon className="h-4 w-4" />,
              onClick: () => onEdit(publication),
            },
            {
              label: 'Generar Reporte',
              icon: <DocumentTextIcon className="h-4 w-4" />,
              onClick: () => handleGenerateReport(publication),
            },
            {
              label: 'Eliminar',
              icon: <TrashIcon className="h-4 w-4" />,
              variant: 'danger',
              onClick: () => setDeleteModal({ isOpen: true, publication }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <NewspaperIcon className="h-6 w-6 text-primary" />
          Gestión de Publicaciones
        </h2>
        <Button onClick={onCreateNew} className="flex items-center gap-1">
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
            <svg
              className="h-6 w-6 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
