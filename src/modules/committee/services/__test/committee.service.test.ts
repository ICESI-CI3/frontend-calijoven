import { CommitteeService, CommitteeError } from '../committee.service';
import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';

jest.mock('@/lib/api/client');

describe('CommitteeService', () => {
  const organizationId = 'org123';
  const committeeId = 'committee123';
  const userId = 'user123';
  const committeeData = { name: 'Comité Nuevo', description: 'Desc' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getCommittees - éxito', async () => {
    const mockData = [{ id: 'c1', name: 'Comité 1' }];
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await CommitteeService.getCommittees(organizationId);
    expect(result).toEqual(mockData);
    expect(apiClient.get).toHaveBeenCalledWith(API_ROUTES.ORGANIZATIONS.COMMITTEES.BASE(organizationId));
  });

  it('getCommittees - error', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('Network Error'));
    await expect(CommitteeService.getCommittees(organizationId)).rejects.toThrow(CommitteeError);
  });

  it('getCommitteeById - éxito', async () => {
    const mockData = { id: committeeId, name: 'Comité 1' };
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await CommitteeService.getCommitteeById(organizationId, committeeId);
    expect(result).toEqual(mockData);
    expect(apiClient.get).toHaveBeenCalledWith(API_ROUTES.ORGANIZATIONS.COMMITTEES.BY_ID(organizationId, committeeId));
  });

  it('getCommitteeById - error', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('Network Error'));
    await expect(CommitteeService.getCommitteeById(organizationId, committeeId)).rejects.toThrow(CommitteeError);
  });

  it('createCommittee - éxito', async () => {
    const mockData = { id: committeeId, name: 'Comité Nuevo' };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await CommitteeService.createCommittee(organizationId, committeeData);
    expect(result).toEqual(mockData);
    expect(apiClient.post).toHaveBeenCalledWith(API_ROUTES.ORGANIZATIONS.COMMITTEES.BASE(organizationId), committeeData);
  });

  it('createCommittee - error', async () => {
    (apiClient.post as jest.Mock).mockRejectedValue(new Error('Network Error'));
    await expect(CommitteeService.createCommittee(organizationId, committeeData)).rejects.toThrow(CommitteeError);
  });

  it('updateCommittee - éxito', async () => {
    const mockData = { id: committeeId, name: 'Comité Actualizado' };
    (apiClient.patch as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await CommitteeService.updateCommittee(organizationId, committeeId, committeeData);
    expect(result).toEqual(mockData);
    expect(apiClient.patch).toHaveBeenCalledWith(API_ROUTES.ORGANIZATIONS.COMMITTEES.BY_ID(organizationId, committeeId), committeeData);
  });

  it('updateCommittee - error', async () => {
    (apiClient.patch as jest.Mock).mockRejectedValue(new Error('Network Error'));
    await expect(CommitteeService.updateCommittee(organizationId, committeeId, committeeData)).rejects.toThrow(CommitteeError);
  });

  it('deleteCommittee - éxito', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({});
    await CommitteeService.deleteCommittee(organizationId, committeeId);
    expect(apiClient.delete).toHaveBeenCalledWith(API_ROUTES.ORGANIZATIONS.COMMITTEES.BY_ID(organizationId, committeeId));
  });

  it('deleteCommittee - error', async () => {
    (apiClient.delete as jest.Mock).mockRejectedValue(new Error('Network Error'));
    await expect(CommitteeService.deleteCommittee(organizationId, committeeId)).rejects.toThrow(CommitteeError);
  });

  it('addMember - éxito', async () => {
    const mockData = { id: committeeId, members: [userId] };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await CommitteeService.addMember(organizationId, committeeId, userId);
    expect(result).toEqual(mockData);
    expect(apiClient.post).toHaveBeenCalledWith(
      API_ROUTES.ORGANIZATIONS.COMMITTEES.MEMBERS.ADD(organizationId, committeeId),
      { userId }
    );
  });

  it('addMember - error', async () => {
    (apiClient.post as jest.Mock).mockRejectedValue(new Error('Network Error'));
    await expect(CommitteeService.addMember(organizationId, committeeId, userId)).rejects.toThrow(CommitteeError);
  });

  it('removeMember - éxito', async () => {
    const mockData = { id: committeeId, members: [] };
    (apiClient.delete as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await CommitteeService.removeMember(organizationId, committeeId, userId);
    expect(result).toEqual(mockData);
    expect(apiClient.delete).toHaveBeenCalledWith(
      API_ROUTES.ORGANIZATIONS.COMMITTEES.MEMBERS.REMOVE(organizationId, committeeId, userId)
    );
  });

  it('removeMember - error', async () => {
    (apiClient.delete as jest.Mock).mockRejectedValue(new Error('Network Error'));
    await expect(CommitteeService.removeMember(organizationId, committeeId, userId)).rejects.toThrow(CommitteeError);
  });
});