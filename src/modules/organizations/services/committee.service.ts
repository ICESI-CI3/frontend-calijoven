import apiClient from "@/lib/api/client";
import { CommitteeCreateRequest, CommitteeUpdateRequest } from "@/types/committee";
import { CommitteeDto } from "@/types/organization";

export class CommitteeService {
    static async createCommittee(organizationId: string, data: CommitteeCreateRequest): Promise<CommitteeDto> {
        const response = await apiClient.post(`/organization/${organizationId}/committee`, data);
        return response.data;
    }

    static async updateCommittee(organizationId: string, committeeId: string, data: CommitteeUpdateRequest): Promise<CommitteeDto> {
        const response = await apiClient.patch(`/organization/${organizationId}/committee/${committeeId}`, data);
        return response.data;
    }

    static async deleteCommittee(organizationId: string, committeeId: string): Promise<void> {
        await apiClient.delete(`/organization/${organizationId}/committee/${committeeId}`);
    }

    static async addMember(organizationId: string, committeeId: string, email: string): Promise<CommitteeDto> {
        const response = await apiClient.post(`/organization/${organizationId}/committee/${committeeId}/members`, { email });
        return response.data;
    }

    static async removeMember(organizationId: string, committeeId: string, userId: string): Promise<CommitteeDto> {
        const response = await apiClient.delete(`/organization/${organizationId}/committee/${committeeId}/members/${userId}`);
        return response.data;
    }
} 