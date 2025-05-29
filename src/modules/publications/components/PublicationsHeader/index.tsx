import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';

interface PublicationsHeaderProps {
  isAuthenticated: boolean;
}

export function PublicationsHeader({ isAuthenticated }: PublicationsHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-base text-muted-foreground">
          Descubre eventos, noticias y oportunidades para jóvenes
        </p>
      </div>
      {isAuthenticated && (
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
          Ir al Dashboard
        </Button>
      )}
    </div>
  );
} 