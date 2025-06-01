import { organizationService } from "@/modules/organizations/services";
import { OrganizationResponse } from "@/modules/organizations/services/organization.service";
import { OrganizationFilters, OrganizationPreviewDto, PaginatedResponse } from "@/types/organization";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type UseOrganizationsOptions = {
    initialPage?: number;
    initialLimit?: number;
};

type OrganizationsPreviewResponse = PaginatedResponse<OrganizationPreviewDto>;

export function useOrganizations({
    initialPage = 1,
    initialLimit = 5,   
}: UseOrganizationsOptions = {}) {
    const [filters, setFilters] = useState<OrganizationFilters>({
        search: '',
        page: initialPage,
        limit: initialLimit,
    });

    const setSearch = (search: string) => {
        setFilters((prev) => ({
            ...prev,
            search,
            page: 1, // opcional: reinicia la página al buscar
        }));
    };

    const organizationsQuery = useQuery<OrganizationResponse, Error, OrganizationsPreviewResponse>({
        queryKey: ['organizations', filters],
        queryFn: () => organizationService.getOrganizations(filters),
        select: (data) => ({
            ...data,
            data: data.data.map(org => ({
                id: org.id,
                name: org.name,
                acronym: org.acronym,
                public: org.public,
                membersCount: org.members.length,
                documentsCount: org.documents.length,
                committeesCount: org.committees.length,
            }))
        })
    });

    const handleSearch = (search: string) => {
        setFilters((prev) => ({ ...prev, search, page: 1 }));
    };

    const handleFilterChange = (newFilters: Partial<OrganizationFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    return {
        organizations: organizationsQuery.data?.data || [],
        isLoading: organizationsQuery.isLoading,
        isError: organizationsQuery.isError,
        error: organizationsQuery.error,
        page: filters.page,
        limit: filters.limit,
        handleSearch,
        handleFilterChange,
        setSearch,
        handlePageChange,
    };


}