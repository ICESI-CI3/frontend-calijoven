'use client';

import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import type { PQRS, PQRSStatusEntity } from '@/types/pqrs';
import { useState } from 'react';
import { Modal } from '@/components/Modal';
import PQRSService from '@/modules/pqrs/services/pqrs.service';

interface AdminPQRSListProps {
  pqrs: PQRS[];
  statusTypes: PQRSStatusEntity[];
  onStatusChange: (pqrsId: string, newStatus: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete?: () => void;
}

export function AdminPQRSList({
  pqrs,
  statusTypes,
  onStatusChange,
  currentPage,
  totalPages,
  onPageChange,
  onDelete
}: AdminPQRSListProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPqrsId, setSelectedPqrsId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!selectedPqrsId) return;

    try {
      await PQRSService.deletePQRS(selectedPqrsId);
      setDeleteModalOpen(false);
      setSelectedPqrsId(null);
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting PQRS:', error);
      setError('No se pudo eliminar la PQRS');
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pqrs.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.user?.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {item.type?.name || 'No especificado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Select
                    value={item.status?.name || ''}
                    onChange={(value) => onStatusChange(item.id, value)}
                    options={statusTypes.map(status => ({
                      value: status.name,
                      label: status.description
                    }))}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPqrsId(item.id);
                      setDeleteModalOpen(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedPqrsId(null);
          setError(null);
        }}
        title="Eliminar PQRS"
      >
        <div className="p-6">
          <p className="text-sm text-gray-500">
            ¿Estás seguro de que deseas eliminar esta PQRS? Esta acción no se puede deshacer.
          </p>
          {error && (
            <div className="mt-4 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedPqrsId(null);
                setError(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 