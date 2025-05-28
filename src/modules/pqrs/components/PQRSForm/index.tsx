"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { Alert } from "@/components/Alert";
import type { CreatePQRSDto, PQRS, PQRSType, PQRSPriority } from "@/types/pqrs";
import PQRSService from "@/modules/pqrs/services/pqrs.service";

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

interface PQRSFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PQRSForm({ onSuccess, onCancel }: PQRSFormProps) {
  const [formData, setFormData] = useState<CreatePQRSDto>({
    title: '',
    description: '',
    type: 'petition',
    priority: 'medium'
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof CreatePQRSDto, value: string) => {
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

    try {
      const dataToSend: CreatePQRSDto = {
        ...formData,
        attachments
      };

      await PQRSService.createPQRS(dataToSend);
      onSuccess();
    } catch (error) {
      setError('No se pudo crear la PQRS. Por favor, intenta nuevamente.');
      console.error('Error creating PQRS:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
            options={typeOptions}
            value={formData.type}
            onChange={(value) => handleChange('type', value as PQRSType)}
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
            disabled={isLoading}
          >
            Crear PQRS
          </Button>
        </div>
      </form>
    </div>
  );
} 