'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/Button';
import { CommitteeService } from '@/modules/committee/services/committee.service';
import type { Committee } from '@/types/committee';
import { CONFIG } from '@/lib/constants/config';

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const organizationId = CONFIG.ORGANIZATION_ID;

  useEffect(() => {
    const loadCommittees = async () => {
      try {
        const data = await CommitteeService.getCommittees(organizationId);
        setCommittees(data);
      } catch (error: any) {
        setError(error.message || 'Error al cargar los comités');
      } finally {
        setLoading(false);
      }
    };

    loadCommittees();
  }, [organizationId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Comités de la Organización</h1>
        <Button
          as="a"
          href="/comites/nuevo"
        >
          Crear Nuevo Comité
        </Button>
      </div>
      
      <div className="prose max-w-none mb-8">
        <p className="text-lg text-gray-700">
          Los comités son grupos de trabajo especializados dentro de nuestra organización que se enfocan en áreas específicas 
          para mejorar y desarrollar diferentes aspectos de nuestra comunidad. Cada comité está compuesto por miembros 
          comprometidos que trabajan en conjunto para alcanzar objetivos específicos y contribuir al bienestar general 
          de la organización.
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {committees.map((committee) => (
          <Card key={committee.id} title={committee.name}>
            <div className="p-6">
              <p className="text-gray-600 mb-4">{committee.description}</p>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Miembros</h3>
                <ul className="space-y-1">
                  {committee.members.slice(0, 3).map((member) => (
                    <li key={member.id} className="text-sm text-gray-600">
                      {member.name}
                    </li>
                  ))}
                  {committee.members.length > 3 && (
                    <li className="text-sm text-gray-500">
                      Y {committee.members.length - 3} más...
                    </li>
                  )}
                </ul>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  as="a"
                  href={`/comites/${committee.id}`}
                  variant="outline"
                >
                  Ver más detalles
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {committees.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No hay comités disponibles en este momento.
          </p>
        </div>
      )}
    </div>
  );
} 