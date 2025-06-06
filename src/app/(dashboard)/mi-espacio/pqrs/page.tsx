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
    console.log('Iniciando carga de PQRS con:', {
      page,
      filters
    });
    loadPQRS();
  }, [page, filters]);

  const loadPQRS = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Cargando PQRS con filtros:', filters);
      const response = await PQRSService.getPQRS(page, 10, filters);
      console.log('Respuesta de PQRS:', response);
      setPqrs(response.items);
      setTotalPages(response.totalPages || 1);
    } catch (error: any) {
      console.error('Error loading PQRS:', error);
      setError('No se pudieron cargar las PQRS');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (filterName: keyof PQRSFiltersType, value: any) => {
    try {
      console.log('Cambiando filtro:', { filterName, value });
      
      if (filterName === 'type' && value) {
        const type = await PQRSService.getPQRSTypeById(value);
        setFilters(prev => ({
          ...prev,
          type: type
        }));
      } else {
        setFilters(prev => {
          const newFilters = { ...prev };
          if (!value) {
            delete newFilters[filterName];
          } else {
            newFilters[filterName] = value;
          }
          return newFilters;
        });
      }
      
      setPage(1); // Resetear a la primera página al cambiar filtros
    } catch (error) {
      console.error('Error al cambiar filtro:', error);
      setError('Error al aplicar el filtro');
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setPage(1); // Volver a la primera página
    loadPQRS(); // Recargar la lista
  };

  return (

    
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <div className="bg-white shadow">
        <div className="mb-4 flex justify-between items-center container mx-auto px-4 py-6">
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
      </div>

      <div className='container mx-auto px-4 space-y-6'>
        {/* Filtros */}
        <div className='bg-white shadow rounded-lg p-2'>
          <div className='mx-auto px-4 py-4'>
            <PQRSFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

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
    </div>
  );
} 