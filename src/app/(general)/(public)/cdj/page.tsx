'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import { PDJService } from '@/modules/pdj/services/pdj.service';
import { organizationService } from '@/modules/organizations/services';
import type { Organization } from '@/types/organization';
import { OrganizationPublications } from '@/modules/publications/components/OrganizationPublications';
import { useRouter } from 'next/navigation';

export default function CDJPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Primero buscamos la organización CDJ
        const orgsResponse = await organizationService.getOrganizations({
          search: 'CDJ',
          limit: 1
        });

        if (!orgsResponse.data.length) {
          throw new Error('No se encontró la organización CDJ');
        }

        const cdj = orgsResponse.data[0];
        setOrganization(cdj);

        // Luego cargamos los documentos
        const documentsData = await PDJService.getDocuments(cdj.id);
        setDocuments(documentsData);
      } catch (error: any) {
        console.error('Error loading CDJ data:', error);
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

  if (error || !organization) {
    return <Alert type="error" message={error || 'No se pudo cargar la información del CDJ'} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">
            Consejo Distrital de Juventud
          </h1>
          <p className="text-xl opacity-90">
            Representando y defendiendo los intereses de los jóvenes de Santiago de Cali
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
          <Card title="¿Qué es el CDJ?">
            <div className="p-6 prose max-w-none">
              <p>
                El Consejo Distrital de Juventud (CDJ) de Santiago de Cali es el máximo órgano 
                de representación juvenil del distrito, encargado de velar por los derechos e 
                intereses de los jóvenes caleños.
              </p>
              <p>
                Como mecanismo autónomo de participación, concertación, vigilancia y control 
                de la gestión pública, trabajamos para asegurar que las voces de los jóvenes 
                sean escuchadas en la toma de decisiones que afectan sus vidas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2">Misión</h3>
                  <p className="text-gray-700">
                    Representar efectivamente los intereses y necesidades de la juventud caleña, 
                    promoviendo políticas públicas que garanticen sus derechos y oportunidades.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2">Visión</h3>
                  <p className="text-gray-700">
                    Consolidarnos como un órgano líder en la representación juvenil, 
                    impulsando transformaciones positivas en la calidad de vida de los 
                    jóvenes de Santiago de Cali.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2">Funciones</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    <li>Representación juvenil</li>
                    <li>Control social</li>
                    <li>Concertación de políticas</li>
                    <li>Veeduría ciudadana</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
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

        {/* Publicaciones */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Publicaciones</h2>
          <Card title="Publicaciones del CDJ">
            <div className="p-6">
              <OrganizationPublications organizationId={organization.id} />
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
                    Centro Administrativo Municipal CAM<br />
                    Avenida 2N entre Calles 10 y 11<br />
                    Santiago de Cali
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-4">Medios de Contacto</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>Email: cdj@cali.gov.co</li>
                    <li>Teléfono: (602) 885-6000</li>
                    <li>WhatsApp: +57 316 123 4567</li>
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