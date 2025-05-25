'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import { Modal } from '@/components/Modal';
import type { Publication, PublicationFilters } from '@/types/publication';
import { publicationService } from '@/modules/publications/services/publication.service';

interface PublicationListProps {
  onEdit: (publication: Publication) => void;
  onCreateNew: () => void;
}

export function PublicationList({ onEdit, onCreateNew }: PublicationListProps) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PublicationFilters>({ unpublished: true });
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

  const loadPublications = async () => {
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
  };

  useEffect(() => {
    loadPublications();
  }, [filters, currentPage, itemsPerPage]);

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
    { value: 'news', label: 'Noticias' },
    { value: 'event', label: 'Eventos' },
    { value: 'offer', label: 'Ofertas' },
  ];

  const getStatusBadge = (publication: Publication) => {
    if (publication.published_at) {
      return (
        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
          Publicado
        </span>
      );
    } else {
      return (
        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
          Borrador
        </span>
      );
    }
  };

  const getTypeBadge = (type: { name: string; description: string }) => {
    const typeConfig = {
      news: { color: 'bg-blue-100 text-blue-800', label: 'Noticia' },
      event: { color: 'bg-purple-100 text-purple-800', label: 'Evento' },
      offer: { color: 'bg-orange-100 text-orange-800', label: 'Oferta' },
    };

    const config = typeConfig[type.name as keyof typeof typeConfig] || {
      color: 'bg-gray-100 text-gray-800',
      label: type.description,
    };

    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Publicaciones</h2>
        <Button onClick={onCreateNew}>Crear Nueva Publicación</Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Filtros */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-4 text-lg font-semibold">Filtros</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Input
            label="Buscar"
            placeholder="Título o descripción..."
            value={filters.search || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          />

          <Select
            label="Tipo"
            options={publicationTypes}
            value={filters.type || ''}
            onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
          />

          <div className="flex items-end">
            <Button variant="outline" onClick={() => setFilters({})} className="w-full">
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de publicaciones */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Publicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ciudades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {publications.map((publication) => (
                  <tr key={publication.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{publication.title}</div>
                        <div className="max-w-xs truncate text-sm text-gray-500">
                          {publication.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getTypeBadge(publication.type)}</td>
                    <td className="px-6 py-4">{getStatusBadge(publication)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {publication.cities.map((city) => (
                          <span
                            key={city.id}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
                          >
                            {city.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(publication.createdAt).toLocaleDateString()}
                    </td>
                    <td className="space-x-2 px-6 py-4 text-sm font-medium">
                      <Button size="sm" variant="outline" onClick={() => onEdit(publication)}>
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateReport(publication)}
                      >
                        Reporte
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeleteModal({ isOpen: true, publication })}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, publication: null })}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <p>
            ¿Estás seguro de que deseas eliminar la publicación "{deleteModal.publication?.title}"?
          </p>
          <p className="text-sm text-gray-600">Esta acción no se puede deshacer.</p>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, publication: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteModal.publication && handleDelete(deleteModal.publication)}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
