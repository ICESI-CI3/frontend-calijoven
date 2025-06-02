import { CommitteeService } from "@/modules/organizations/services/committee.service";
import { OrganizationService } from "@/modules/organizations/services/organization.service";
import { CommitteeCreateRequest, CommitteeUpdateRequest } from "@/types/committee";
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

    // Mutación para crear un comité
    const createCommitteeMutation = useMutation({
        mutationFn: (data: CommitteeCreateRequest) => CommitteeService.createCommittee(organizationId, data),
        onSuccess: (updatedCommittee) => {
            // Actualizar el caché de la organización
            queryClient.setQueryData(['organization', organizationId], (old: Organization | undefined) => {
                if (!old) return old;
                return {
                    ...old,
                    committees: [...old.committees, updatedCommittee],
                };
            });
            // Actualizar el estado local
            setCommitteeTabData((prev) => ({
                committees: [...prev.committees, updatedCommittee],
            }));
        },
    });

    // Mutación para actualizar un comité
    const updateCommitteeMutation = useMutation({
        mutationFn: ({ committeeId, data }: { committeeId: string; data: CommitteeUpdateRequest }) =>
            CommitteeService.updateCommittee(organizationId, committeeId, data),
        onSuccess: (updatedCommittee) => {
            // Actualizar el caché de la organización
            queryClient.setQueryData(['organization', organizationId], (old: Organization | undefined) => {
                if (!old) return old;
                return {
                    ...old,
                    committees: old.committees.map((c) =>
                        c.id === updatedCommittee.id ? updatedCommittee : c
                    ),
                };
            });
            // Actualizar el estado local
            setCommitteeTabData((prev) => ({
                committees: prev.committees.map((c) =>
                    c.id === updatedCommittee.id ? updatedCommittee : c
                ),
            }));
        },
    });

    // Mutación para eliminar un comité
    const deleteCommitteeMutation = useMutation({
        mutationFn: (committeeId: string) => CommitteeService.deleteCommittee(organizationId, committeeId),
        onSuccess: (_, committeeId) => {
            // Actualizar el caché de la organización
            queryClient.setQueryData(['organization', organizationId], (old: Organization | undefined) => {
                if (!old) return old;
                return {
                    ...old,
                    committees: old.committees.filter((c) => c.id !== committeeId),
                };
            });
            // Actualizar el estado local
            setCommitteeTabData((prev) => ({
                committees: prev.committees.filter((c) => c.id !== committeeId),
            }));
        },
    });

    // Mutación para agregar un miembro a un comité
    const addCommitteeMemberMutation = useMutation({
        mutationFn: ({ committeeId, email }: { committeeId: string; email: string }) =>
            CommitteeService.addMember(organizationId, committeeId, email),
        onSuccess: (updatedCommittee) => {
            // Actualizar el caché de la organización
            queryClient.setQueryData(['organization', organizationId], (old: Organization | undefined) => {
                if (!old) return old;
                return {
                    ...old,
                    committees: old.committees.map((c) =>
                        c.id === updatedCommittee.id ? updatedCommittee : c
                    ),
                };
            });
            // Actualizar el estado local
            setCommitteeTabData((prev) => ({
                committees: prev.committees.map((c) =>
                    c.id === updatedCommittee.id ? updatedCommittee : c
                ),
            }));
        },
    });

    // Mutación para remover un miembro de un comité
    const removeCommitteeMemberMutation = useMutation({
        mutationFn: ({ committeeId, userId }: { committeeId: string; userId: string }) =>
            CommitteeService.removeMember(organizationId, committeeId, userId),
        onSuccess: (updatedCommittee) => {
            // Actualizar el caché de la organización
            queryClient.setQueryData(['organization', organizationId], (old: Organization | undefined) => {
                if (!old) return old;
                return {
                    ...old,
                    committees: old.committees.map((c) =>
                        c.id === updatedCommittee.id ? updatedCommittee : c
                    ),
                };
            });
            // Actualizar el estado local
            setCommitteeTabData((prev) => ({
                committees: prev.committees.map((c) =>
                    c.id === updatedCommittee.id ? updatedCommittee : c
                ),
            }));
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
        createCommittee: createCommitteeMutation.mutate,
        updateCommittee: updateCommitteeMutation.mutate,
        deleteCommittee: deleteCommitteeMutation.mutate,
        addCommitteeMember: addCommitteeMemberMutation.mutate,
        removeCommitteeMember: removeCommitteeMemberMutation.mutate,
        isCreatingCommittee: createCommitteeMutation.isPending,
        isUpdatingCommittee: updateCommitteeMutation.isPending,
        isDeletingCommittee: deleteCommitteeMutation.isPending,
        isAddingCommitteeMember: addCommitteeMemberMutation.isPending,
        isRemovingCommitteeMember: removeCommitteeMemberMutation.isPending,
        createCommitteeError: createCommitteeMutation.error,
        updateCommitteeError: updateCommitteeMutation.error,
        deleteCommitteeError: deleteCommitteeMutation.error,
        addCommitteeMemberError: addCommitteeMemberMutation.error,
        removeCommitteeMemberError: removeCommitteeMemberMutation.error,
    };
}   