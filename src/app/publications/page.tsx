'use client';

import { useMemo, useState } from 'react';
import { usePublications } from '@/modules/publications';
import PublicationsFilters from '@/modules/publications/components/PublicationsFilters';
import PublicationsTabs from '@/modules/publications/components/PublicationsTabs/PublicationsTabs';
import AllPublications from '@/modules/publications/components/AllPublications';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import { Button } from '@/components/Button';
import { publicationTypes } from '@/lib/constants/publicationTypes';
const TABS = [
  { value: '', label: 'Todas' },
  ...Object.values(publicationTypes).map((type) => ({
    value: type.value,
    label: type.label,
  })),
];

export default function PublicationsPage() {
  const [activeTab, setActiveTab] = useState('');
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { publications, isLoading, isError, error, handleFilterChange } = usePublications({
    initialFilters: { type: '' }
  });

  const organizationOptions = useMemo(
    () => [
      { value: '', label: 'Todas las organizaciones' },
    ],
    []
  );

  const onTabChange = (type: string) => {
    setActiveTab(type);
    handleFilterChange({ type });
  };

  const handleEdit = (publication: any) => {
    router.push(`/publications/${publication.id}/edit`);
  };

  const handleCreateNew = () => {
    router.push('/publications/create');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-base text-muted-foreground">
            Descubre eventos, noticias y oportunidades para jóvenes
          </p>
        </div>
        {isAuthenticated && (
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
            Ir al Dashboard
          </Button>
        )}
      </div>
      <PublicationsFilters
        searchValue=""
        onSearchChange={() => {}}
        organizationOptions={organizationOptions}
        selectedOrganization=""
        onOrganizationChange={() => {}}
        onFilter={() => {}}
      />
      <PublicationsTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <AllPublications
        publications={publications}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onEdit={handleEdit}
        onCreateNew={handleCreateNew}
      />
    </div>
  );
}
