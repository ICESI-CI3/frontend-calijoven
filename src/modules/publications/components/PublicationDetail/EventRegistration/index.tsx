import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from "@/components/Button";
import { Alert } from "@/components/Alert";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface EventRegistrationProps {
  isRegistered: boolean;
  onRegister: () => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

function RegisteredView({ onCancel, isLoading }: { onCancel: () => void; isLoading: boolean }) {
  return (
    <div className="flex items-center gap-2 text-green-600">
      <CheckCircleIcon className="h-5 w-5" />
      <span>Ya estás inscrito a este evento</span>
      <Button
        onClick={onCancel}
        disabled={isLoading}
        variant="outline"
        className="ml-4"
      >
        {isLoading ? 'Procesando...' : 'Cancelar inscripción'}
      </Button>
    </div>
  );
}

function UnregisteredView({ onRegister, isLoading }: { onRegister: () => void; isLoading: boolean }) {
  return (
    <Button
      onClick={onRegister}
      disabled={isLoading}
      className="w-full sm:w-auto"
    >
      {isLoading ? 'Inscribiendo...' : 'Inscribirse al evento'}
    </Button>
  );
}

export function EventRegistration({ 
  isRegistered, 
  onRegister, 
  onCancel, 
  isLoading, 
  error, 
  success 
}: EventRegistrationProps) {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <Button onClick={() => router.push('/login')} className="w-full sm:w-auto">
        Inicia sesión para inscribirte
      </Button>
    );
  }

  return (
    <div className="mt-8">
      {isRegistered ? (
        <RegisteredView onCancel={onCancel} isLoading={isLoading} />
      ) : (
        <UnregisteredView onRegister={onRegister} isLoading={isLoading} />
      )}
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
    </div>
  );
} 