'use client';

import { Select } from '@/components/Select';
import { useEffect, useState } from 'react';
import type { PQRSFilters, PQRSStatusEntity } from '@/types/pqrs';

interface PQRSFiltersProps {
  filters: PQRSFilters;
  onFilterChange: (key: keyof PQRSFilters, value: any) => void;
}

const statusOptions: PQRSStatusEntity[] = [
  { name: 'OPEN', description: 'Abierta' },
  { name: 'IN_PROGRESS', description: 'En Progreso' },
  { name: 'CLOSED', description: 'Cerrada' }
];

export function PQRSFilters({ filters, onFilterChange }: PQRSFiltersProps) {
  const handleStatusChange = (value: string) => {
    const status = statusOptions.find(s => s.name === value);
    onFilterChange('status', status);
  };

  return (
    <div className="mb-6">
      <Select
        value={filters.status?.name || ''}
        onChange={handleStatusChange}
        label="Estado"
        options={statusOptions.map(status => ({
          value: status.name,
          label: status.description
        }))}
      />
    </div>
  );
} 