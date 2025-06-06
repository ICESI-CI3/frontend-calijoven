import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAdminPQRSDetail } from '../useAdminPQRSDetail';
import { PQRSService } from '../../services/pqrs.service';

jest.mock('../../services/pqrs.service');

const pqrsId = 'pqrs-1';
const mockPQRS = {
  id: pqrsId,
  status: { name: 'open', description: 'Abierta' },
  adminComment: 'Comentario',
};
const mockStatuses = [{ name: 'open', description: 'Abierta' }];
const mockTypes = [{ id: 'type1', name: 'Petición' }];

(PQRSService.getPQRSById as jest.Mock).mockResolvedValue(mockPQRS);
(PQRSService.getStatusTypes as jest.Mock).mockResolvedValue(mockStatuses);
(PQRSService.getPQRSTypes as jest.Mock).mockResolvedValue(mockTypes);
(PQRSService.updatePQRS as jest.Mock).mockResolvedValue({ ...mockPQRS, status: { name: 'closed', description: 'Cerrada' } });

// Crea un nuevo QueryClient para cada test y limpia la caché
function createWrapper() {
  const client = new QueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useAdminPQRSDetail', () => {

  it('should update formData on handleInputChange', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useAdminPQRSDetail(pqrsId), { wrapper });

    await waitFor(() => !result.current.isLoading);

    act(() => {
      result.current.handleInputChange('status', 'closed');
    });

    expect(result.current.formData.status).toBe('closed');
  });

  it('should call updatePQRS on handleSubmit', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useAdminPQRSDetail(pqrsId), { wrapper });

    await waitFor(() => !result.current.isLoading);

    act(() => {
      result.current.handleInputChange('status', 'closed');
      result.current.handleInputChange('adminComment', 'Nuevo comentario');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });

    expect(PQRSService.updatePQRS).toHaveBeenCalledWith(
      pqrsId,
      { status: 'closed', adminComment: 'Nuevo comentario' },
      true
    );
  });
});