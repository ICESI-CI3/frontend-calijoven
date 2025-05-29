"use client";

import { useState, useRef, useEffect } from "react";
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
    typeId: ''
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [types, setTypes] = useState<PQRSTypeEntity[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPQRSTypes();
  }, []);

  const loadPQRSTypes = async () => {
    try {
      setLoadingTypes(true);
      const typesData = await PQRSService.getPQRSTypes();
      setTypes(typesData);
      
      // Si hay tipos disponibles, establecer el primero como valor por defecto
      if (typesData.length > 0) {
        setFormData(prev => ({
          ...prev,
          typeId: typesData[0].id
        }));
      }
    } catch (error) {
      setError('No se pudieron cargar los tipos de PQRS');
      console.error('Error loading PQRS types:', error);
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleChange = (field: keyof CreatePQRSDto, value: string) => {
    console.log('Cambio en el formulario:', { field, value });
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
    setIsLoading(true);

    // Validación básica
    if (!formData.title.trim()) {
      setError('El título es requerido');
      setIsLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      setIsLoading(false);
      return;
    }

    if (!formData.typeId) {
      setError('El tipo de PQRS es requerido');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Datos del formulario antes de enviar:', formData);

      const dataToSend: CreatePQRSDto = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        attachments
      };

      console.log('Datos preparados para enviar:', dataToSend);

      const result = await PQRSService.createPQRS(dataToSend);
      console.log('PQRS creada exitosamente:', result);
      onSuccess();
    } catch (error: any) {
      console.error('Error detallado al crear PQRS:', {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        config: error?.config
      });
      
      let errorMessage = 'No se pudo crear la PQRS. ';
      
      if (error?.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error?.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Por favor, verifica tu conexión e intenta nuevamente.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingTypes) {
    return (
      <div className="flex justify-center items-center p-8">
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

        <div className="grid grid-cols-1 gap-4">
          <Select
            label="Tipo"
            options={types.map(type => ({
              value: type.id,
              label: type.name
            }))}
            value={formData.typeId}
            onChange={(value) => handleChange('typeId', value)}
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

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading || types.length === 0}
          >
            Crear PQRS
          </Button>
        </div>
      </form>
    </div>
  );
} 