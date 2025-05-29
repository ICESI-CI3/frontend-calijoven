'use client';

import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import type { PQRS, PQRSStatusEntity } from '@/types/pqrs';

interface AdminPQRSListProps {
  pqrs: PQRS[];
  statusTypes: PQRSStatusEntity[];
  onStatusChange: (pqrsId: string, newStatus: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AdminPQRSList({
  pqrs,
  statusTypes,
  onStatusChange,
  currentPage,
  totalPages,
  onPageChange
}: AdminPQRSListProps) {
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
                    {item.type === 'petition' && 'Petición'}
                    {item.type === 'complaint' && 'Queja'}
                    {item.type === 'claim' && 'Reclamo'}
                    {item.type === 'suggestion' && 'Sugerencia'}
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Aquí puedes agregar la lógica para ver detalles
                      console.log('Ver detalles de:', item.id);
                    }}
                  >
                    Ver detalles
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
    </div>
  );
} 