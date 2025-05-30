'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Alert } from '@/components/Alert';
import type { CreateCommitteeDto, UpdateCommitteeDto } from '@/types/committee';

interface CommitteeFormProps {
  initialData?: UpdateCommitteeDto;
  onSubmit: (data: CreateCommitteeDto | UpdateCommitteeDto) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export function CommitteeForm({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false
}: CommitteeFormProps) {
  const [formData, setFormData] = useState<CreateCommitteeDto>({
    name: initialData?.name || '',
    description: initialData?.description || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof CreateCommitteeDto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name?.trim()) {
        throw new Error('El nombre es requerido');
      }

      if (!formData.description?.trim()) {
        throw new Error('La descripción es requerida');
      }

      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim()
      });
    } catch (error: any) {
      setError(error.message || 'Error al procesar el formulario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <Input
        label="Nombre del Comité"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Ingrese el nombre del comité"
        required
      />

      <Textarea
        label="Descripción"
        value={formData.description}
        onChange={(value) => handleChange('description', value)}
        placeholder="Describa el propósito y funciones del comité"
        rows={5}
        required
      />

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
} 