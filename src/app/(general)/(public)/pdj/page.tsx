'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import { organizationService } from '@/modules/organizations/services';
import { PDJService } from '@/modules/pdj/services/pdj.service';
import type { Organization, CommitteeDto } from '@/types/organization';

export default function PDJPage() {
  const [committees, setCommittees] = useState<CommitteeDto[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Primero buscamos la organización PDJ
        const orgsResponse = await organizationService.getOrganizations({
          search: 'PDJ',
          limit: 1
        });

        if (!orgsResponse.data.length) {
          throw new Error('No se encontró la organización PDJ');
        }

        const pdj = orgsResponse.data[0];
        setOrganization(pdj);

        // Luego cargamos los comités y documentos
        const [committeesData, documentsData] = await Promise.all([
          organizationService.getOrganization(pdj.id).then(org => org.committees || []),
          PDJService.getDocuments(pdj.id)
        ]);

        setCommittees(committeesData);
        setDocuments(documentsData);
      } catch (error: any) {
        console.error('Error loading PDJ data:', error);
        setError(error.message || 'Error al cargar la información');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">
            Plataforma Distrital de Juventudes
          </h1>
          <p className="text-xl opacity-90">
            Trabajando por y para los jóvenes de Santiago de Cali
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Sobre Nosotros */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Sobre Nosotros</h2>
          <Card title="¿Qué es la PDJ?">
            <div className="p-6 prose max-w-none">
              <p>
                La Plataforma Distrital de Juventudes (PDJ) de Santiago de Cali es un espacio de 
                participación, concertación e interlocución de las juventudes en relación con las 
                agendas territoriales y la política pública de juventud.
              </p>
              <p>
                Nuestra misión es articular los procesos juveniles del distrito, promoviendo 
                la participación activa de los jóvenes en la construcción de políticas públicas y 
                el desarrollo social de nuestro territorio.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2">Misión</h3>
                  <p className="text-gray-700">
                    Articular y fortalecer los procesos juveniles de Santiago de Cali, promoviendo 
                    la participación activa en la construcción de políticas públicas.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2">Visión</h3>
                  <p className="text-gray-700">
                    Ser referente distrital en la articulación de procesos juveniles y la 
                    implementación efectiva de políticas públicas de juventud.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2">Valores</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    <li>Participación</li>
                    <li>Inclusión</li>
                    <li>Transparencia</li>
                    <li>Compromiso</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Comités */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Nuestros Comités</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committees.map((committee) => (
              <Card key={committee.id} title={committee.name}>
                <div className="p-6">
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Miembros ({committee.members.length})
                    </h3>
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
                </div>
              </Card>
            ))}
          </div>
          {committees.length === 0 && (
            <p className="text-center text-gray-500">
              No hay comités disponibles en este momento.
            </p>
          )}
        </section>

        {/* Documentos */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Documentos</h2>
          <Card title="Documentos Importantes">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documents.map((doc) => (
                  <div key={doc.id} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-bold text-lg mb-2">{doc.title}</h3>
                    {doc.type?.description && (
                      <p className="text-gray-600 mb-2">{doc.type.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Descargar documento
                      </a>
                      <span className="text-sm text-gray-500">
                        {doc.date ? new Date(doc.date).toLocaleDateString() : 'Fecha no disponible'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {documents.length === 0 && (
                <p className="text-center text-gray-500">
                  No hay documentos disponibles en este momento.
                </p>
              )}
            </div>
          </Card>
        </section>

        {/* Contacto */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Contacto</h2>
          <Card title="Información de Contacto">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-xl mb-4">Ubicación</h3>
                  <p className="text-gray-700">
                    Edificio de la Gobernación del Valle del Cauca<br />
                    Carrera 6 entre Calles 9 y 10<br />
                    Cali, Valle del Cauca
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-4">Medios de Contacto</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>Email: pdj@valledelcauca.gov.co</li>
                    <li>Teléfono: (602) 123-4567</li>
                    <li>WhatsApp: +57 311 234 5678</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
} 