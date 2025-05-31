import { renderHook, act } from '@testing-library/react';
import { useEventRegistration } from '../useEventRegistration';

// Mocks
const mockRegister = jest.fn();
const mockCancel = jest.fn();
const mockGetPublication = jest.fn();

jest.mock('../../services/registration.service', () => ({
  registrationService: {
    registerToPublication: (...args: any[]) => mockRegister(...args),
    cancelRegistration: (...args: any[]) => mockCancel(...args),
  },
}));

jest.mock('../../services/publication.service', () => ({
  PublicationService: {
    getPublication: (...args: any[]) => mockGetPublication(...args),
  },
}));

describe('useEventRegistration', () => {
  const publicationId = 'pub-1';
  const publicationMock = { id: publicationId, title: 'Test' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers to publication successfully', async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    mockGetPublication.mockResolvedValueOnce(publicationMock);
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useEventRegistration({ publicationId, onSuccess }));

    await act(async () => {
      await result.current.handleRegistration(false);
    });

    expect(mockRegister).toHaveBeenCalledWith(publicationId);
    expect(result.current.regSuccess).toBe('¡Te has inscrito exitosamente!');
    expect(result.current.regError).toBeNull();
    expect(onSuccess).toHaveBeenCalledWith(publicationMock);
  });

  it('cancels registration successfully', async () => {
    mockCancel.mockResolvedValueOnce(undefined);
    mockGetPublication.mockResolvedValueOnce(publicationMock);
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useEventRegistration({ publicationId, onSuccess }));

    await act(async () => {
      await result.current.handleRegistration(true);
    });

    expect(mockCancel).toHaveBeenCalledWith(publicationId);
    expect(result.current.regSuccess).toBe('Te has dado de baja exitosamente');
    expect(result.current.regError).toBeNull();
    expect(onSuccess).toHaveBeenCalledWith(publicationMock);
  });

  it('handles registration error', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Error de registro'));
    const { result } = renderHook(() => useEventRegistration({ publicationId }));

    await act(async () => {
      await result.current.handleRegistration(false);
    });

    expect(result.current.regError).toBe('Error de registro');
    expect(result.current.regSuccess).toBeNull();
  });

  it('handles cancellation error', async () => {
    mockCancel.mockRejectedValueOnce(new Error('Error de baja'));
    const { result } = renderHook(() => useEventRegistration({ publicationId }));

    await act(async () => {
      await result.current.handleRegistration(true);
    });

    expect(result.current.regError).toBe('Error de baja');
    expect(result.current.regSuccess).toBeNull();
  });
}); 