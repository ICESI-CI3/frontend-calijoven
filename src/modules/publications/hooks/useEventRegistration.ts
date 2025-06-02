import { useState } from 'react';
import { registrationService } from '../services/registration.service';
import { PublicationService } from '../services/publication.service';
import type { Publication } from '@/types/publication';

interface UseEventRegistrationProps {
  publicationId: string;
  onSuccess?: (publication: Publication) => void;
}

export function useEventRegistration({ publicationId, onSuccess }: UseEventRegistrationProps) {
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const handleRegistration = async (isRegistered: boolean) => {
    setRegLoading(true);
    setRegError(null);
    setRegSuccess(null);

    try {
      if (isRegistered) {
        await registrationService.cancelRegistration(publicationId);
        setRegSuccess('Te has dado de baja exitosamente');
      } else {
        await registrationService.registerToPublication(publicationId);
        setRegSuccess('¡Te has inscrito exitosamente!');
      }
      
      // Si hay un callback de éxito, lo llamamos
      if (onSuccess) {
        const updatedPublication = await PublicationService.getPublication(publicationId);
        onSuccess(updatedPublication);
      }
    } catch (err: any) {
      // Manejo de error específico para inscripción duplicada
      let errorMsg = 'Error al procesar la inscripción';
      if (err?.response?.data?.message) {
        const backendMsg = err.response.data.message;
        if (
          backendMsg.toLowerCase().includes('ya inscrito') ||
          backendMsg.toLowerCase().includes('already registered')
        ) {
          errorMsg = 'Ya estás inscrito a este evento.';
        } else {
          errorMsg = backendMsg;
        }
      } else if (err instanceof Error && err.message) {
        errorMsg = err.message;
      }
      setRegError(errorMsg);
    } finally {
      setRegLoading(false);
    }
  };

  return {
    regLoading,
    regError,
    regSuccess,
    handleRegistration
  };
} 