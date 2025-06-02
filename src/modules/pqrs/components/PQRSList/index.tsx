'use client';

import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import type { PQRS } from '@/types/pqrs';

interface PQRSListProps {
  pqrs: PQRS[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PQRSList({ pqrs, loading, error, totalPages, currentPage, onPageChange }: PQRSListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message={error}
      />
    );
  }

  if (!pqrs || pqrs.length === 0) {
    return (
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
              No se encontraron PQRS con los filtros seleccionados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
                    <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {item.status?.description || 'No especificado'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm font-medium text-gray-700">Tipo:</span>
                    <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {item.type?.name || 'No especificado'}
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
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
            >
              Anterior
            </Button>
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 