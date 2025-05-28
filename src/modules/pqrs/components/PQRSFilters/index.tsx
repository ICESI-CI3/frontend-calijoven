'use client';

import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import type { PQRSFilters, PQRSStatus, PQRSType, PQRSPriority } from '@/types/pqrs';

const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En Proceso' },
  { value: 'resolved', label: 'Resuelto' },
  { value: 'rejected', label: 'Rechazado' },
  { value: 'closed', label: 'Cerrado' }
];

const typeOptions = [
  { value: 'petition', label: 'Petición' },
  { value: 'complaint', label: 'Queja' },
  { value: 'claim', label: 'Reclamo' },
  { value: 'suggestion', label: 'Sugerencia' }
];

const priorityOptions = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' }
];

interface PQRSFiltersProps {
  filters: PQRSFilters;
  onFilterChange: (filterName: keyof PQRSFilters, value: string) => void;
}

export function PQRSFilters({ filters, onFilterChange }: PQRSFiltersProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 bg-white p-4 rounded-lg shadow sm:grid-cols-4">
      <Select
        label="Estado"
        options={statusOptions}
        value={filters.status || ''}
        onChange={(value) => onFilterChange('status', value as PQRSStatus)}
      />

      <Select
        label="Tipo"
        options={typeOptions}
        value={filters.type || ''}
        onChange={(value) => onFilterChange('type', value as PQRSType)}
      />

      <Select
        label="Prioridad"
        options={priorityOptions}
        value={filters.priority || ''}
        onChange={(value) => onFilterChange('priority', value as PQRSPriority)}
      />

      <Input
        label="Buscar"
        placeholder="Buscar por título..."
        value={filters.search || ''}
        onChange={(e) => onFilterChange('search', e.target.value)}
      />
    </div>
  );
} 