'use client';

import { useState, useEffect } from 'react';
import { PQRSService } from '@/modules/pqrs/services/pqrs.service';
import { AdminPQRSList } from '@/modules/pqrs/components/AdminPQRSList';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import type { PQRS, PQRSStatusEntity } from '@/types/pqrs';

export default function AdminPQRSPage() {
  const [pqrs, setPqrs] = useState<PQRS[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusTypes, setStatusTypes] = useState<PQRSStatusEntity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPQRS();
    loadStatusTypes();
  }, [currentPage]);

  const loadPQRS = async () => {
    try {
      setLoading(true);
      setError(null);
      setPqrs([]); // Limpiar los datos anteriores mientras carga
      
      console.log('Realizando petición getPQRS con parámetros:', {
        page: currentPage,
        limit: 10,
        filters: {},
        isAdmin: true
      });
      
      const response = await PQRSService.getPQRS(currentPage, 10, {}, true);
      
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
      if (currentPage > (response.totalPages || 1)) {
        setCurrentPage(1);
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
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  const loadStatusTypes = async () => {
    try {
      const types = await PQRSService.getStatusTypes();
      setStatusTypes(types);
    } catch (error) {
      console.error('Error loading status types:', error);
    }
  };

  const handleStatusChange = async (pqrsId: string, newStatus: string) => {
    try {
      // Obtener el estado completo antes de actualizar
      const statusType = statusTypes.find(status => status.name === newStatus);
      if (!statusType) {
        throw new Error('Estado no válido');
      }

      await PQRSService.updatePQRS(pqrsId, { status: statusType });
      // Recargar la lista después de actualizar
      loadPQRS();
    } catch (error) {
      console.error('Error updating PQRS status:', error);
      setError('No se pudo actualizar el estado de la PQRS');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Administración de PQRS</h1>
      <AdminPQRSList
        pqrs={pqrs}
        statusTypes={statusTypes}
        onStatusChange={handleStatusChange}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
} 