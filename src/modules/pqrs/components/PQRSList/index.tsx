'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import type { PQRS, PQRSStatusEntity } from '@/types/pqrs';

interface PQRSListProps {
  pqrs: PQRS[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const statusOptions = [
  { value: 'OPEN', label: 'Abierto' },
  { value: 'IN_PROGRESS', label: 'En Proceso' },
  { value: 'RESOLVED', label: 'Resuelto' },
  { value: 'REJECTED', label: 'Rechazado' },
  { value: 'CLOSED', label: 'Cerrado' }
];

export function PQRSList({ pqrs, loading, error, totalPages, currentPage, onPageChange }: PQRSListProps) {
  console.log('PQRS items completos:', JSON.stringify(pqrs, null, 2));
  pqrs?.forEach((item, index) => {
    console.log(`PQRS ${index}:`, {
      id: item.id,
      title: item.title,
      status: item.status,
      type: item.type
    });
  });

  const getStatusLabel = (status: PQRSStatusEntity | undefined | null) => {
    if (!status) return 'Desconocido';
    return status.description;
  };

  const getStatusColor = (status: PQRSStatusEntity | undefined | null) => {
    if (!status) return 'bg-gray-100 text-gray-800 border border-gray-300';
    
    switch (status.name) {
      case 'OPEN':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  if (error) {
    return (
      <Alert
        type="error"
        message={error}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(!pqrs || pqrs.length === 0) ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">No hay PQRS registradas</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron PQRS con los filtros seleccionados. Puedes crear una nueva PQRS usando el botón "Crear Nueva PQRS".
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {pqrs.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Estado:</span>
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {item.adminComment && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Respuesta:</span> {item.adminComment}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="px-4 py-2 text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
} 