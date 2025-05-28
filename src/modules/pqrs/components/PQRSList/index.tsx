'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import type { PQRS, PQRSStatus, PQRSPriority } from '@/types/pqrs';

interface PQRSListProps {
  pqrs: PQRS[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En Proceso' },
  { value: 'resolved', label: 'Resuelto' },
  { value: 'rejected', label: 'Rechazado' },
  { value: 'closed', label: 'Cerrado' }
];

const priorityOptions = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' }
];

export function PQRSList({ pqrs, loading, error, totalPages, currentPage, onPageChange }: PQRSListProps) {
  const getStatusColor = (status: PQRSStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: PQRSPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      {pqrs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No se encontraron PQRS</p>
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
                    <div className="mt-2 flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                        {statusOptions.find(opt => opt.value === item.status)?.label}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(item.priority)}`}>
                        {priorityOptions.find(opt => opt.value === item.priority)?.label}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {item.response && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Respuesta:</span> {item.response}
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