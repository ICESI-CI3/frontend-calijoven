import { Select } from '@/components/Select';
import { SearchInput } from '@/components/SearchInput';
import { Button } from '@/components/Button';

export default function PublicationsFilters({
  searchValue,
  onSearchChange,
  organizationOptions,
  selectedOrganization,
  onOrganizationChange,
  onFilter,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  organizationOptions: { value: string; label: string }[];
  selectedOrganization: string;
  onOrganizationChange: (value: string) => void;
  onFilter: () => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-background p-4 shadow-sm">
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <div className="w-full flex-1">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Buscar publicaciones..."
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            options={organizationOptions}
            value={selectedOrganization}
            onChange={onOrganizationChange}
          />
        </div>
        <Button variant="outline" size="sm" onClick={onFilter}>
          Filtrar
        </Button>
      </div>
    </div>
  );
} 