import apiClient from "@/lib/api/client";
import { CommitteeCreateRequest, CommitteeUpdateRequest } from "@/types/committee";
import { CommitteeDto } from "@/types/organization";
import { CommitteeService } from "../committee.service";

jest.mock("@/lib/api/client", () => ({
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
}));

describe("CommitteeService", () => {
    const mockOrganizationId = "org-123";
    const mockCommitteeId = "committee-123";
    const mockUserId = "user-123";
    const mockEmail = "test@example.com";

    const mockCommittee: CommitteeDto = {
        id: mockCommitteeId,
        name: "Test Committee",
        members: [],
        leader: {
            id: "leader-123",
            name: "Test Leader",
            email: "leader@example.com",
            profilePicture: "",
            banned: false,
            city: "Test City"
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createCommittee", () => {
        const createData: CommitteeCreateRequest = {
            name: "New Committee",
            leaderEmail: "leader@example.com"
        };

        it("should create a committee successfully", async () => {
            (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: mockCommittee });

            const result = await CommitteeService.createCommittee(mockOrganizationId, createData);

            expect(apiClient.post).toHaveBeenCalledWith(
                `/organization/${mockOrganizationId}/committee`,
                createData
            );
            expect(result).toEqual(mockCommittee);
        });

        it("should handle errors when creating a committee", async () => {
            const error = new Error("Failed to create committee");
            (apiClient.post as jest.Mock).mockRejectedValueOnce(error);

            await expect(CommitteeService.createCommittee(mockOrganizationId, createData))
                .rejects.toThrow("Failed to create committee");
            expect(apiClient.post).toHaveBeenCalledWith(
                `/organization/${mockOrganizationId}/committee`,
                createData
            );
        });
    });

    describe("updateCommittee", () => {
        const updateData: CommitteeUpdateRequest = {
            name: "Updated Committee"
        };

        it("should update a committee successfully", async () => {
            const updatedCommittee = { ...mockCommittee, name: updateData.name };
            (apiClient.patch as jest.Mock).mockResolvedValueOnce({ data: updatedCommittee });

            const result = await CommitteeService.updateCommittee(
                mockOrganizationId,
                mockCommitteeId,
                updateData
            );

            expect(apiClient.patch).toHaveBeenCalledWith(
                `/organization/${mockOrganizationId}/committee/${mockCommitteeId}`,
                updateData
            );
            expect(result).toEqual(updatedCommittee);
        });

        it("should handle errors when updating a committee", async () => {
            const error = new Error("Failed to update committee");
            (apiClient.patch as jest.Mock).mockRejectedValueOnce(error);

            await expect(CommitteeService.updateCommittee(
                mockOrganizationId,
                mockCommitteeId,
                updateData
            )).rejects.toThrow("Failed to update committee");
            expect(apiClient.patch).toHaveBeenCalledWith(
                `/organization/${mockOrganizationId}/committee/${mockCommitteeId}`,
                updateData
            );
        });
    });

    describe("deleteCommittee", () => {
        it("should delete a committee successfully", async () => {
            (apiClient.delete as jest.Mock).mockResolvedValueOnce(undefined);

            await CommitteeService.deleteCommittee(mockOrganizationId, mockCommitteeId);

            expect(apiClient.delete).toHaveBeenCalledWith(
                `/organization/${mockOrganizationId}/committee/${mockCommitteeId}`
            );
        });

        it("should handle errors when deleting a committee", async () => {
            const error = new Error("Failed to delete committee");
            (apiClient.delete as jest.Mock).mockRejectedValueOnce(error);

            await expect(CommitteeService.deleteCommittee(mockOrganizationId, mockCommitteeId))
                .rejects.toThrow("Failed to delete committee");
            expect(apiClient.delete).toHaveBeenCalledWith(
                `/organization/${mockOrganizationId}/committee/${mockCommitteeId}`
            );
        });
    });

    describe("addMember", () => {
        it("should add a member to a committee successfully", async () => {
            const updatedCommittee = {
                ...mockCommittee,
                members: [{
                    id: mockUserId,
                    name: "New Member",
                    email: mockEmail,
                    profilePicture: "",
                    banned: false,
                    city: "Test City"
                }]
            };
            (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: updatedCommittee });

            const result = await CommitteeService.addMember(
                mockOrganizationId,
                mockCommitteeId,
                mockEmail
            );

            expect(apiClient.post).toHaveBeenCalledWith(
                `/organization/${mockOrganizationId}/committee/${mockCommitteeId}/members`,
                { email: mockEmail }
            );
            expect(result).toEqual(updatedCommittee);
        });

        it("should handle errors when adding a member to a committee", async () => {
            const error = new Error("Failed to add member");
            (apiClient.post as jest.Mock).mockRejectedValueOnce(error);

            await expect(CommitteeService.addMember(
                mockOrganizationId,
                mockCommitteeId,
                mockEmail
            )).rejects.toThrow("Failed to add member");
            expect(apiClient.post).toHaveBeenCalledWith(
                `/organization/${mockOrganizationId}/committee/${mockCommitteeId}/members`,
                { email: mockEmail }
            );
        });
    });

    describe("removeMember", () => {
        it("should remove a member from a committee successfully", async () => {
            const updatedCommittee = {
                ...mockCommittee,
                members: []
            };
            (apiClient.delete as jest.Mock).mockResolvedValueOnce({ data: updatedCommittee });

            const result = await CommitteeService.removeMember(
                mockOrganizationId,
                mockCommitteeId,
                mockUserId
            );

            expect(apiClient.delete).toHaveBeenCalledWith(
                `/organization/${mockOrganizationId}/committee/${mockCommitteeId}/members/${mockUserId}`
            );
            expect(result).toEqual(updatedCommittee);
        });

        it("should handle errors when removing a member from a committee", async () => {
            const error = new Error("Failed to remove member");
            (apiClient.delete as jest.Mock).mockRejectedValueOnce(error);

            await expect(CommitteeService.removeMember(
                mockOrganizationId,
                mockCommitteeId,
                mockUserId
            )).rejects.toThrow("Failed to remove member");
            expect(apiClient.delete).toHaveBeenCalledWith(
                `/organization/${mockOrganizationId}/committee/${mockCommitteeId}/members/${mockUserId}`
            );
        });
    });
}); 