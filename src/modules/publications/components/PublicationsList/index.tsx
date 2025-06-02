import { Alert } from '@/components/Alert';
import { Pagination } from '@/components/Pagination';
import { organizationService } from '@/modules/organizations/services';
import { usePublications } from '@/modules/publications';
import AllPublications from '@/modules/publications/components/AllPublications';
import PublicationsFilters from '@/modules/publications/components/PublicationsFilters';
import PublicationsTabs from '@/modules/publications/components/PublicationsTabs/PublicationsTabs';
import type { SimpleOrganizationDto } from '@/types/organization';
import type { Publication } from '@/types/publication';
import { useCallback, useEffect, useMemo, useState } from 'react';

const TABS = [
  { value: '', label: 'Todas' },
  { value: 'event', label: 'Eventos' },
  { value: 'news', label: 'Noticias' },
  { value: 'offer', label: 'Ofertas' },
];

interface PublicationsListProps {
  activeTab: string;
  onTabChange: (type: string) => void;
  onEdit: (publication: Publication) => void;
  onCreateNew: () => void;
  onReadMore: (id: string) => void;
}

export function PublicationsList({
  activeTab,
  onTabChange,
  onEdit,
  onCreateNew,
  onReadMore,
}: PublicationsListProps) {
  const [organizations, setOrganizations] = useState<SimpleOrganizationDto[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');

  const {
    publications = [],
    total = 0,
    isLoading = false,
    isError = false,
    error = null,
    page = 1,
    limit = 9,
    handleFilterChange,
    handlePageChange,
    handleSearch
  } = usePublications({
    initialFilters: { type: activeTab }
  });

  // Cargar organizaciones
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setIsLoadingOrgs(true);
        const response = await organizationService.getOrganizations({ limit: 100 });
        setOrganizations(response.data);
      } catch (err) {
        setOrgError('Error al cargar las organizaciones');
        console.error('Failed to load organizations:', err);
      } finally {
        setIsLoadingOrgs(false);
      }
    };

    loadOrganizations();
  }, []);

  useEffect(() => {
    if (handleFilterChange) {
      handleFilterChange({ type: activeTab });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Memoizar opciones y onChange para evitar ciclos
  const organizationOptions = useMemo(
    () => [
      { value: '', label: 'Todas las organizaciones' },
      ...organizations.map((org) => ({
        value: org.id,
        label: org.name || org.acronym,
      })),
    ],
    [organizations]
  );

  const handleOrganizationChange = useCallback((value: string) => {
    setSelectedOrganization(value);
    if (handleFilterChange) {
      handleFilterChange({ organization: value });
    }
  }, [handleFilterChange]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (handleSearch) {
      handleSearch(value);
    }
  };

  return (
    <>
      {orgError && <Alert type="error" message={orgError} onClose={() => setOrgError(null)} />}
      
      <PublicationsFilters
        onSearchChange={handleSearchChange}
        organizationOptions={organizationOptions}
        selectedOrganization={selectedOrganization}
        onOrganizationChange={handleOrganizationChange}
        isLoadingOrganizations={isLoadingOrgs}
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
        error={typeof error === 'string' ? new Error(error) : error}
        onEdit={onEdit}
        onCreateNew={onCreateNew}
        onReadMore={onReadMore}
      />
      
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / limit)}
          onPageChange={handlePageChange || (() => {})}
        />
      </div>
    </>
  );
} 