"use client"

import { useAdminOrganizations } from "@/modules/admin/hooks/useAdminOrganizations"
import OrganizationFilter from "../OrganizationFilter"
import OrganizationPreview from "../OrganizationPreview"


export default function OrganizationsList() {
  const {
    organizations,
    isLoading,
    isError,
    error,
    page,
    limit,
    setSearch,
    handleSearch,
    handleFilterChange,
    handlePageChange
  } = useAdminOrganizations();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    handleSearch(value);
  };

  return (
    <div className="grid gap-4">
      <OrganizationFilter
        onSearchChange={handleSearchChange}
      />
      {organizations.map((org) => (
          OrganizationPreview(org)
      ))}
    </div>
  )
}
