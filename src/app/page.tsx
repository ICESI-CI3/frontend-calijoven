import { Button } from '@/components/Button';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background pt-16">
        <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-8 text-center">
          <h1 className="mb-6 text-4xl font-bold text-foreground">Bienvenido a Cali Joven</h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            Plataforma oficial para jóvenes de la ciudad de Cali. Descubre oportunidades, recursos y
            programas diseñados especialmente para ti.
          </p>

          <div className="flex gap-4">
            <Link href="/ui-components">
              <Button>Ver Componentes UI</Button>
            </Link>

            <Link href="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
