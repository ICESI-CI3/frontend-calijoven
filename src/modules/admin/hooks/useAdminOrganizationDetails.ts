import { OrganizationService } from "@/modules/organizations/services/organization.service";
import { CommitteeDto, DocumentDto, Organization, PublicUserDto } from "@/types/organization";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface MembersTabData {
    members: PublicUserDto[];
}

interface CommitteeTabData {
    committees: CommitteeDto[];
}

interface DocumentTabData {
    documents: DocumentDto[];
}

interface FormData {
    name: string;
    acronym: string;
}

export function useAdminOrganizationDetails(organizationId: string) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        acronym: '',
    });
    const [membersTabData, setMembersTabData] = useState<MembersTabData>({
        members: []
    });
    const [committeeTabData, setCommitteeTabData] = useState<CommitteeTabData>({
        committees: []
    });
    const [documentTabData, setDocumentTabData] = useState<DocumentTabData>({
        documents: []
    });

    // Obtener la organización
    const {
        data: organization,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<Organization>({
        queryKey: ['organization', organizationId],
        queryFn: () => OrganizationService.getOrganization(organizationId),
        enabled: !!organizationId,
    });

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name,
                acronym: organization.acronym,
            });
            setMembersTabData({
                members: organization.members,
            });
            setCommitteeTabData({
                committees: organization.committees,
            });
            setDocumentTabData({
                documents: organization.documents,
            });
        }
    }, [organization]);

    // Mutación para agregar un miembro
    const addMemberMutation = useMutation({
        mutationFn: (email: string) => OrganizationService.addMember(organizationId, email),
        onSuccess: (updatedOrganization) => {
            // Actualizar el caché de la organización
            queryClient.setQueryData(['organization', organizationId], updatedOrganization);
            // Actualizar el estado local
            setMembersTabData({
                members: updatedOrganization.members,
            });
        },
    });

    // Mutación para remover un miembro
    const removeMemberMutation = useMutation({
        mutationFn: (userId: string) => OrganizationService.removeMember(organizationId, userId),
        onSuccess: (updatedOrganization) => {
            // Actualizar el caché de la organización
            queryClient.setQueryData(['organization', organizationId], updatedOrganization);
            // Actualizar el estado local
            setMembersTabData({
                members: updatedOrganization.members,
            });
        },
    });

    return {
        organization,
        refetch,
        error,
        isLoading,
        isError,
        formData,
        setFormData,
        membersTabData,
        setMembersTabData,
        committeeTabData,
        setCommitteeTabData,
        documentTabData,
        setDocumentTabData,
        
        addMember: addMemberMutation.mutate,
        removeMember: removeMemberMutation.mutate,
        isAddingMember: addMemberMutation.isPending,
        isRemovingMember: removeMemberMutation.isPending,
        addMemberError: addMemberMutation.error,
        removeMemberError: removeMemberMutation.error,
    };
}   