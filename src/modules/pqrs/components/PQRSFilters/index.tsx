'use client';

import { Select } from '@/components/Select';
import { useEffect, useState } from 'react';
import { PQRSService } from '../../services/pqrs.service';
import type { PQRSFilters, PQRSTypeEntity } from '@/types/pqrs';

interface PQRSFiltersProps {
  filters: PQRSFilters;
  onFilterChange: (key: keyof PQRSFilters, value: any) => void;
}

export function PQRSFilters({ filters, onFilterChange }: PQRSFiltersProps) {
  const [pqrsTypes, setPqrsTypes] = useState<PQRSTypeEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        setLoading(true);
        const types = await PQRSService.getPQRSTypes();
        setPqrsTypes(types);
      } catch (error) {
        console.error('Error loading PQRS types:', error);
        setError('No se pudieron cargar los tipos de PQRS');
      } finally {
        setLoading(false);
      }
    };

    loadTypes();
  }, []);

  const handleTypeChange = async (value: string) => {
    try {
      const type = await PQRSService.getPQRSTypeById(value);
      onFilterChange('type', type);
    } catch (error) {
      console.error('Error fetching type details:', error);
    }
  };

  if (loading) {
    return <div>Cargando tipos de PQRS...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="mb-6">
      <Select
        value={filters.type?.id || ''}
        onChange={handleTypeChange}
        label="Tipo de PQRS"
        options={pqrsTypes.map(type => ({
          value: type.id,
          label: type.name
        }))}
      />
    </div>
  );
} 