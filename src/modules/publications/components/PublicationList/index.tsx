'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Alert } from '@/components/Alert';
import { Modal } from '@/components/Modal';
import { Table, TableColumn } from '@/components/Table';
import { Badge, BadgeVariant } from '@/components/Badge';
import { IconBadge, StatusIcons, TypeIcons } from '@/components/IconBadge';
import { ActionMenu } from '@/components/ActionMenu';
import { Pagination } from '@/components/Pagination';
import { FilterBar, FilterGroup } from '@/components/FilterBar';
import { SearchInput } from '@/components/SearchInput';
import { Toggle } from '@/components/Toggle';
import type { Publication, PublicationFilters } from '@/types/publication';
import { publicationService } from '@/modules/publications/services/publication.service';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

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

  const publicationStatus = [
    { value: '', label: 'Todos los estados' },
    { value: 'published', label: 'Publicados', icon: StatusIcons.published },
    { value: 'draft', label: 'Borradores', icon: StatusIcons.draft },
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
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              ),
              onClick: () => onEdit(publication),
            },
            {
              label: 'Generar Reporte',
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"
                    clipRule="evenodd"
                  />
                </svg>
              ),
              onClick: () => handleGenerateReport(publication),
            },
            {
              label: 'Eliminar',
              icon: (
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
              ),
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
          Gestión de Publicaciones
        </h2>
        <Button onClick={onCreateNew} className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
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
