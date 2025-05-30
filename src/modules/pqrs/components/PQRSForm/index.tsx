"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { Alert } from "@/components/Alert";
import { Spinner } from "@/components/Spinner";
import type { CreatePQRSDto, PQRS, PQRSPriority, PQRSTypeEntity } from "@/types/pqrs";
import PQRSService from "@/modules/pqrs/services/pqrs.service";

const priorityOptions = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' }
];

interface PQRSFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PQRSForm({ onSuccess, onCancel }: PQRSFormProps) {
  const [formData, setFormData] = useState<CreatePQRSDto>({
    title: '',
    description: '',
    typeId: '',
    priority: 'medium'
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [types, setTypes] = useState<PQRSTypeEntity[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
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
        priority: formData.priority,
        attachments
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <Select
            label="Prioridad"
            options={priorityOptions}
            value={formData.priority || 'medium'}
            onChange={(value) => handleChange('priority', value as PQRSPriority)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Archivos Adjuntos
          </label>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {attachments.map((file, index) => (
              <div key={index} className="bg-gray-100 rounded px-3 py-1 flex items-center gap-2">
                <span className="text-sm">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Subir Archivos
          </Button>
        </div>

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
            {loading ? 'Creando...' : 'Crear PQRS'}
          </Button>
        </div>
      </form>
    </div>
  );
} 