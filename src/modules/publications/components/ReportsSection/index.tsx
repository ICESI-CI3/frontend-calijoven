'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Alert } from '@/components/Alert';
import type { ReportFilters } from '@/types/publication';
import { publicationService } from '@/modules/publications/services/publication.service';
import { publicationTypes } from '@/lib/constants/publicationTypes';

export function ReportsSection() {
  const [reportName, setReportName] = useState('');
  const [filters, setFilters] = useState<ReportFilters>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (!reportName.trim()) {
      setError('El nombre del reporte es requerido');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const blob = await publicationService.generateGeneralReport(reportName, filters);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess('Reporte generado exitosamente');
      setReportName('');
      setFilters({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el reporte');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-6 text-xl font-semibold">Generar Reporte General</h3>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <div className="space-y-6">
        <Input
          label="Nombre del Reporte *"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          placeholder="Ej: Reporte Mensual de Publicaciones"
        />

        <div className="border-t pt-6">
          <h4 className="mb-4 text-lg font-medium">Filtros del Reporte</h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tipos de Publicación
              </label>
              <div className="space-y-2">
                {Object.values(publicationTypes).map((type) => (
                  <label key={type.value} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={filters.types?.includes(type.value) || false}
                      onChange={(e) => {
                        const types = filters.types || [];
                        if (e.target.checked) {
                          setFilters((prev) => ({
                            ...prev,
                            types: [...types, type.value],
                          }));
                        } else {
                          setFilters((prev) => ({
                            ...prev,
                            types: types.filter((t) => t !== type.value),
                          }));
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Fecha de Inicio"
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
              />

              <Input
                label="Fecha de Fin"
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t pt-6">
          <Button
            variant="outline"
            onClick={() => {
              setReportName('');
              setFilters({});
            }}
          >
            Limpiar
          </Button>
          <Button
            onClick={handleGenerateReport}
            isLoading={isGenerating}
            disabled={isGenerating || !reportName.trim()}
          >
            Generar Reporte
          </Button>
        </div>
      </div>
    </div>
  );
}
