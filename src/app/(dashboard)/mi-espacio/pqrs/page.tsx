"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { PQRSList } from '@/modules/pqrs/components/PQRSList';
import { PQRSForm } from '@/modules/pqrs/components/PQRSForm';
import { PQRSFilters } from '@/modules/pqrs/components/PQRSFilters';
import PQRSService from '@/modules/pqrs/services/pqrs.service';
import type { PQRS, PQRSFilters as PQRSFiltersType } from '@/types/pqrs';

export default function PQRSPage() {
  const [pqrs, setPqrs] = useState<PQRS[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PQRSFiltersType>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadPQRS();
  }, [page, filters]);

  const loadPQRS = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PQRSService.getPQRS(page, 10, filters);
      setPqrs(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      setError('No se pudieron cargar las PQRS');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName: keyof PQRSFiltersType, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value || undefined
    }));
    setPage(1);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadPQRS();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis PQRS</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tus peticiones, quejas, reclamos y sugerencias
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          Crear Nueva PQRS
        </Button>
      </div>

      {/* Filtros */}
      <PQRSFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Lista de PQRS */}
      <PQRSList
        pqrs={pqrs}
        loading={loading}
        error={error}
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />

      {/* Modal de creación */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nueva PQRS"
      >
        <PQRSForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
} 