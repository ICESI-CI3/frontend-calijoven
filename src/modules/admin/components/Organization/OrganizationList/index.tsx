"use client"

import { Avatar } from "@/components/Avatar"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Cog6ToothIcon, DocumentTextIcon, EyeIcon, MagnifyingGlassIcon, PlusIcon, UsersIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import OrganizationPreview from "../OrganizationPreview"
import { OrganizationPreviewDto } from "@/types/organization"
import { useOrganizations } from "@/modules/publications/hooks/useOrganizations"
import OrganizationFilter from "../OrganizationFilter"


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
  } = useOrganizations();

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
