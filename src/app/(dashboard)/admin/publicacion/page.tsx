'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Publication } from '@/types/publication';
import { PublicationList } from '@/modules/publications/components/PublicationList';
import { ReportsSection } from '@/modules/publications/components/ReportsSection';
import { useAuth } from '@/lib/hooks/useAuth';
import { Select } from '@/components/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs';

export default function PublicationsDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');

  const handleEdit = (publication: Publication) => {
    router.push(`/admin/publicacion/${publication.id}`);
  };

  const handleCreateNew = () => {
    const url = selectedOrganization
      ? `/admin/publicacion/nueva?organizationId=${selectedOrganization}`
      : `/admin/publicacion/nueva`;
    router.push(url);
  };

  const organizationOptions = user?.organizations
    ? [
        { value: '', label: 'Todas las organizaciones' },
        ...user.organizations.map((org) => ({
          value: org.id,
          label: org.name || org.acronym,
        })),
      ]
    : [{ value: '', label: 'Todas las organizaciones' }];

  const handleOrganizationChange = (value: string) => {
    setSelectedOrganization(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Administrativo - Publicaciones
          </h1>
          <p className="mt-2 text-gray-600">
            Gestiona eventos, noticias y ofertas de la plataforma
          </p>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between py-4 md:flex-row">
              <TabsList className="mb-4 md:mb-0">
                <TabsTrigger value="list">
                  Gestión de Publicaciones
                </TabsTrigger>
                <TabsTrigger value="reports">
                  Reportes
                </TabsTrigger>
              </TabsList>

              <div className="w-full md:w-64">
                <Select
                  options={organizationOptions}
                  value={selectedOrganization}
                  onChange={handleOrganizationChange}
                  role="organization-select"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <TabsContent value="list">
            <PublicationList
              onEdit={handleEdit}
              onCreateNew={handleCreateNew}
              organizationId={selectedOrganization}
            />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsSection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
