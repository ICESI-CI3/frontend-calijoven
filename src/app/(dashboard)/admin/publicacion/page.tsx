'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Publication } from '@/types/publication';
import RequireAuth from '@/modules/auth/components/RequireAuth';
import { PublicationList } from '@/modules/publications/components/PublicationList';
import { ReportsSection } from '@/modules/publications/components/ReportsSection';
import { useAuth } from '@/lib/hooks/useAuth';
import { Select } from '@/components/Select';

type ViewMode = 'list' | 'reports';

export default function PublicationsDashboard() {
  const [currentView, setCurrentView] = useState<ViewMode>('list');
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

  const renderNavigation = () => (
    <div className="mb-6 border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between py-4 md:flex-row">
          <nav className="mb-4 flex space-x-8 md:mb-0">
            <button
              onClick={() => setCurrentView('list')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                currentView === 'list'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Gestión de Publicaciones
            </button>
            <button
              onClick={() => setCurrentView('reports')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                currentView === 'reports'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Reportes
            </button>
          </nav>

          <div className="w-full md:w-64">
            <Select
              options={organizationOptions}
              value={selectedOrganization}
              onChange={handleOrganizationChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'list':
        return (
          <PublicationList
            onEdit={handleEdit}
            onCreateNew={handleCreateNew}
            organizationId={selectedOrganization}
          />
        );
      case 'reports':
        return <ReportsSection />;
      default:
        return null;
    }
  };

  return (
    <RequireAuth permissions={['MANAGE_PUBLICATION']} requireAll>
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

        {renderNavigation()}

        <div className="container mx-auto px-4 py-6">{renderContent()}</div>
      </div>
    </RequireAuth>
  );
}
