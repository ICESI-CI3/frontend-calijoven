import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import type {
  Committee,
  CreateCommitteeDto,
  UpdateCommitteeDto,
  AddMemberDto
} from '@/types/committee';

export class CommitteeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommitteeError';
  }
}

export const CommitteeService = {
  async getCommittees(organizationId: string): Promise<Committee[]> {
    try {
      console.log('Fetching committees for organization:', organizationId);
      const { data } = await apiClient.get(API_ROUTES.COMMITTEE.BASE(organizationId));
      return data;
    } catch (error) {
      console.error('Error fetching committees:', error);
      throw new CommitteeError('No se pudieron obtener los comités');
    }
  },

  async getCommitteeById(organizationId: string, id: string): Promise<Committee> {
    try {
      console.log('Fetching committee:', { organizationId, id });
      const { data } = await apiClient.get(API_ROUTES.COMMITTEE.BY_ID(organizationId, id));
      return data;
    } catch (error) {
      console.error('Error fetching committee:', error);
      throw new CommitteeError('No se pudo obtener el comité');
    }
  },

  async createCommittee(organizationId: string, committeeData: CreateCommitteeDto): Promise<Committee> {
    try {
      console.log('Creating committee:', { organizationId, data: committeeData });
      const { data } = await apiClient.post(API_ROUTES.COMMITTEE.BASE(organizationId), committeeData);
      return data;
    } catch (error) {
      console.error('Error creating committee:', error);
      throw new CommitteeError('No se pudo crear el comité');
    }
  },

  async updateCommittee(organizationId: string, id: string, updateData: UpdateCommitteeDto): Promise<Committee> {
    try {
      console.log('Updating committee:', { organizationId, id, data: updateData });
      const { data } = await apiClient.patch(API_ROUTES.COMMITTEE.BY_ID(organizationId, id), updateData);
      return data;
    } catch (error) {
      console.error('Error updating committee:', error);
      throw new CommitteeError('No se pudo actualizar el comité');
    }
  },

  async deleteCommittee(organizationId: string, id: string): Promise<void> {
    try {
      console.log('Deleting committee:', { organizationId, id });
      await apiClient.delete(API_ROUTES.COMMITTEE.BY_ID(organizationId, id));
    } catch (error) {
      console.error('Error deleting committee:', error);
      throw new CommitteeError('No se pudo eliminar el comité');
    }
  },

  async addMember(organizationId: string, committeeId: string, userId: string): Promise<Committee> {
    try {
      console.log('Adding member to committee:', { organizationId, committeeId, userId });
      const { data } = await apiClient.post(
        API_ROUTES.COMMITTEE.MEMBERS.ADD(organizationId, committeeId),
        { userId }
      );
      return data;
    } catch (error) {
      console.error('Error adding member to committee:', error);
      throw new CommitteeError('No se pudo agregar el miembro al comité');
    }
  },

  async removeMember(organizationId: string, committeeId: string, userId: string): Promise<Committee> {
    try {
      console.log('Removing member from committee:', { organizationId, committeeId, userId });
      const { data } = await apiClient.delete(
        API_ROUTES.COMMITTEE.MEMBERS.REMOVE(organizationId, committeeId, userId)
      );
      return data;
    } catch (error) {
      console.error('Error removing member from committee:', error);
      throw new CommitteeError('No se pudo eliminar el miembro del comité');
    }
  }
}; 