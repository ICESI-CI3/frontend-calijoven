"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { Alert } from "@/components/Alert";
import { Spinner } from "@/components/Spinner";
import type { CreatePQRSDto, PQRS, PQRSTypeEntity } from "@/types/pqrs";
import PQRSService from "@/modules/pqrs/services/pqrs.service";

interface PQRSFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PQRSForm({ onSuccess, onCancel }: PQRSFormProps) {
  const [formData, setFormData] = useState<CreatePQRSDto>({
    title: '',
    description: '',
    typeId: '',
    priority: 'medium' // Mantenemos el valor por defecto pero no lo mostramos en el formulario
  });

  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [types, setTypes] = useState<PQRSTypeEntity[]>([]);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        console.log('Loading PQRS types...');
        const types = await PQRSService.getPQRSTypes();
        console.log('PQRS types loaded:', {
          types,
          count: types.length,
          firstType: types[0]
        });
        setTypes(types);

        // Si no hay tipo seleccionado y hay tipos disponibles, seleccionar el primero
        if (!formData.typeId && types.length > 0) {
          setFormData(prev => ({
            ...prev,
            typeId: types[0].id
          }));
        }
      } catch (error) {
        console.error('Error loading PQRS types:', error);
        setError('No se pudieron cargar los tipos de PQRS');
      } finally {
        setLoadingTypes(false);
      }
    };

    loadTypes();
  }, []);

  const handleChange = (field: keyof CreatePQRSDto, value: string) => {
    console.log('Cambio en el formulario:', { field, value });
    if (field === 'typeId') {
      const selectedType = types.find(t => t.id === value);
      console.log('Tipo seleccionado:', selectedType);
    }
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
      if (!formData.title?.trim()) {
        throw new Error('El título es requerido');
      }

      if (!formData.description?.trim()) {
        throw new Error('La descripción es requerida');
      }

      if (!formData.typeId) {
        throw new Error('Debes seleccionar un tipo de PQRS');
      }

      // Verificar que el tipo seleccionado existe
      const selectedType = types.find(t => t.id === formData.typeId);
      if (!selectedType) {
        throw new Error('El tipo seleccionado no es válido');
      }

      const dataToSend: CreatePQRSDto = {
        title: String(formData.title).trim(),
        description: String(formData.description).trim(),
        typeId: formData.typeId,
        priority: formData.priority
      };

      console.log('Enviando PQRS:', {
        formData,
        selectedType,
        availableTypes: types.map(t => ({ id: t.id, name: t.name }))
      });
      
      const response = await PQRSService.createPQRS(dataToSend);
      console.log('PQRS creada:', response);
      onSuccess();
    } catch (error: any) {
      console.error('Error creating PQRS:', error);
      setError(error.message || 'No se pudo crear la PQRS');
    } finally {
      setLoading(false);
    }
  };

  if (loadingTypes) {
    return (
      <div className="flex justify-center items-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        <Input
          label="Título"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Escribe un título descriptivo"
        />

        <Textarea
          label="Descripción"
          value={formData.description}
          onChange={(value) => handleChange('description', value)}
          placeholder="Describe tu petición, queja, reclamo o sugerencia"
          rows={5}
        />

        <Select
          label="Tipo"
          options={types.map(type => ({
            value: type.id,
            label: type.name
          }))}
          value={formData.typeId}
          onChange={(value) => {
            console.log('Tipo seleccionado:', value);
            handleChange('typeId', value);
          }}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
          >
            Enviar PQRS
          </Button>
        </div>
      </form>
    </div>
  );
} 