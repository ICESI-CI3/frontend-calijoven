'use client';

import Image from 'next/image';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-xl bg-card shadow-lg">
        {/* Columna izquierda: Branding y descripción */}
        <div className="hidden w-1/2 flex-col items-center justify-center bg-card p-10 text-center md:flex">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="https://www.cali.gov.co/info/caligovco_se/media/bloque92622096.svg"
              alt="Logo Alcaldía de Cali"
              width={180}
              height={180}
              className="rounded bg-background p-2 shadow"
              priority
            />
            <h1 className="text-3xl font-bold text-foreground">Plataforma Juvenil</h1>
            <h2 className="text-lg font-semibold text-primary">Alcaldía de Santiago de Cali</h2>
            <p className="mt-2 max-w-xs text-base text-muted-foreground">
              Conectando a los jóvenes de Cali con oportunidades de participación ciudadana y
              desarrollo personal.
            </p>
            <div className="mt-6 flex w-full flex-col gap-4">
              <div className="flex flex-row justify-center gap-4">
                <div className="flex w-32 flex-col items-center rounded-lg bg-background p-4 shadow">
                  <Image src="/pdj.jpg" alt="PDJ" width={36} height={36} className="rounded-full" />
                  <span className="mt-2 font-semibold text-primary">PDJ</span>
                  <span className="text-xs text-muted-foreground">Plataforma Distrital</span>
                </div>
                <div className="flex w-32 flex-col items-center rounded-lg bg-background p-4 shadow">
                  <Image src="/cdj.jpg" alt="CDJ" width={36} height={36} className="rounded-full" />
                  <span className="mt-2 font-semibold text-primary">CDJ</span>
                  <span className="text-xs text-muted-foreground">Consejo Distrital</span>
                </div>
              </div>
            </div>
            <div className="mt-10 text-xs text-muted-foreground">
              © {new Date().getFullYear()} Alcaldía de Santiago de Cali. Todos los derechos
              reservados.
            </div>
          </div>
        </div>
        {/* Columna derecha: Login */}
        <div className="flex w-full flex-col justify-center p-8 md:w-1/2">
          <div className="mx-auto flex h-full min-h-[500px] w-full max-w-md flex-col justify-between">
            <div>
              <Link
                href="/"
                className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
              >
                <span className="text-lg">←</span> Volver al inicio
              </Link>
              <h2 className="mb-2 text-2xl font-bold text-foreground">Iniciar Sesión</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Accede a tu cuenta para participar en la plataforma juvenil
              </p>
              <LoginForm />
              <div className="mt-8 text-center text-base font-semibold text-primary">
                ¡Bienvenido de nuevo! Nos alegra verte participando en la plataforma juvenil.
              </div>
            </div>
            <p className="mt-10 text-center text-sm text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <Link href={ROUTES.REGISTER} className="font-medium text-primary hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
