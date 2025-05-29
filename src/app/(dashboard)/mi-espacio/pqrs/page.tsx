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
      setPqrs([]); // Limpiar los datos anteriores mientras carga
      
      console.log('Realizando petición getPQRS con parámetros:', {
        page,
        limit: 10,
        filters
      });
      
      const response = await PQRSService.getPQRS(page, 10, filters);
      
      // Validar la respuesta
      if (!response || !Array.isArray(response.items)) {
        throw new Error('La respuesta del servidor no tiene el formato esperado');
      }
      
      console.log('Respuesta recibida:', {
        items: response.items.length,
        totalPages: response.totalPages,
        total: response.total,
        currentPage: response.page
      });
      
      setPqrs(response.items);
      setTotalPages(response.totalPages || 1);
      
      // Si la página actual es mayor que el total de páginas, volver a la primera
      if (page > (response.totalPages || 1)) {
        setPage(1);
      }
    } catch (error: any) {
      console.error('Error detallado al cargar PQRS:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'No se pudieron cargar las PQRS. ';
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
      setPqrs([]);
      setTotalPages(1);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName: keyof PQRSFiltersType, value: any) => {
    console.log('Cambiando filtro:', {
      filterName,
      value
    });
    
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (value === undefined || value === '') {
        delete newFilters[filterName];
      } else {
        newFilters[filterName] = value;
      }
      
      return newFilters;
    });
    
    setPage(1); // Resetear a la primera página al cambiar filtros
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setPage(1); // Volver a la primera página
    loadPQRS(); // Recargar la lista
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