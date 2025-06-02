import { Select } from '@/components/Select';
import { SearchInput } from '@/components/SearchInput';
import { Spinner } from '@/components/Spinner';

export default function PublicationsFilters({
  onSearchChange,
  organizationOptions,
  selectedOrganization,
  onOrganizationChange,
  isLoadingOrganizations = false,
}: {
  onSearchChange: (value: string) => void;
  organizationOptions: { value: string; label: string }[];
  selectedOrganization: string;
  onOrganizationChange: (value: string) => void;
  isLoadingOrganizations?: boolean;
}) {
  return (
    <div className="flex flex-col gap-y-2">
      {/* Barra de búsqueda arriba */}
      <div className="w-full">
        <SearchInput
          onSearch={onSearchChange}
          placeholder="Buscar publicaciones..."
          className="h-12"
        />
      </div>
      {/* Select de organizaciones debajo, con separación inferior */}
      <div className="w-full md:w-64 mb-6">
        {isLoadingOrganizations ? (
          <div className="flex h-12 items-center justify-center rounded-md border border-gray-200 bg-gray-50 w-full">
            <Spinner size="sm" />
          </div>
        ) : (
          <Select
            options={organizationOptions}
            value={selectedOrganization}
            onChange={onOrganizationChange}
          />
        )}
      </div>
    </div>
  );
} 