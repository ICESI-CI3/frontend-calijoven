'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import { CommitteeService } from '@/modules/committee/services/committee.service';
import type { Committee } from '@/types/committee';

export default function CommitteeDetailPage() {
  const params = useParams();
  const [committee, setCommittee] = useState<Committee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Obtener el organizationId del contexto o configuración
  const organizationId = process.env.NEXT_PUBLIC_ORGANIZATION_ID || '';

  useEffect(() => {
    const loadCommittee = async () => {
      try {
        const data = await CommitteeService.getCommitteeById(organizationId, params.id as string);
        setCommittee(data);
      } catch (error: any) {
        setError(error.message || 'Error al cargar el comité');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadCommittee();
    }
  }, [organizationId, params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!committee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert
          type="error"
          message={error || 'No se encontró el comité'}
          onClose={() => setError(null)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <a
          href="/comites"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Volver a Comités
        </a>
      </div>

      <Card title={committee.name}>
        <div className="p-6">
          <div className="prose max-w-none">
            <h1 className="text-3xl font-bold mb-4">{committee.name}</h1>
            <p className="text-lg text-gray-700 mb-6">{committee.description}</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Información General</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fecha de creación</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(committee.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Última actualización</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(committee.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Miembros del Comité</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {committee.members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    {member.role && (
                      <p className="text-sm text-gray-600 mt-1">
                        Rol: {member.role}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {committee.members.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Este comité aún no tiene miembros asignados.
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 