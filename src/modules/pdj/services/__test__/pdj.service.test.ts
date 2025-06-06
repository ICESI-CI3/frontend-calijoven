import { PDJService, PDJError } from '../pdj.service';
import apiClient from '@/lib/api/client';

jest.mock('@/lib/api/client');

describe('PDJService', () => {
  const organizationId = 'org123';
  const mockDocuments = [{ id: 'doc1', name: 'Documento 1' }];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch documents successfully', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDocuments });

    const result = await PDJService.getDocuments(organizationId);

    expect(result).toEqual(mockDocuments);
    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining(organizationId)
    );
  });

  it('should throw PDJError on failure', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

    await expect(PDJService.getDocuments(organizationId)).rejects.toThrow(PDJError);
  });
});