import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import RequireAuth from '@/modules/auth/components/RequireAuth';

export function PublicationsHeader() {
  const router = useRouter();

  return (
    <div role="link" className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-base text-muted-foreground">
          Descubre eventos, noticias y oportunidades para jóvenes
        </p>
      </div>
      <RequireAuth fallback={null}>
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
          Ir al Dashboard
        </Button>
      </RequireAuth>
    </div>
  );
} 