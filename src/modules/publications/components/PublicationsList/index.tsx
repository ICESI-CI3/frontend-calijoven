import { useMemo, useEffect } from 'react';
import { usePublications } from '@/modules/publications';
import PublicationsFilters from '@/modules/publications/components/PublicationsFilters';
import PublicationsTabs from '@/modules/publications/components/PublicationsTabs/PublicationsTabs';
import AllPublications from '@/modules/publications/components/AllPublications';
import { Pagination } from '@/components/Pagination';

const TABS = [
  { value: '', label: 'Todas' },
  { value: 'event', label: 'Eventos' },
  { value: 'news', label: 'Noticias' },
  { value: 'offer', label: 'Ofertas' },
];

interface PublicationsListProps {
  activeTab: string;
  onTabChange: (type: string) => void;
  onEdit: (publication: any) => void;
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
  const {
    publications,
    total,
    isLoading,
    isError,
    error,
    page,
    limit,
    handleFilterChange,
    handlePageChange
  } = usePublications({
    initialFilters: { type: activeTab }
  });

  useEffect(() => {
    handleFilterChange({ type: activeTab });
  }, [activeTab]);

  const organizationOptions = useMemo(
    () => [
      { value: '', label: 'Todas las organizaciones' },
    ],
    []
  );

  return (
    <>
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
        onEdit={onEdit}
        onCreateNew={onCreateNew}
        onReadMore={onReadMore}
      />
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / limit)}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
} 