'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';

export default function RegisterPage() {
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
            <h1 className="text-3xl font-bold text-foreground">Únete a la Plataforma</h1>
            <p className="mt-2 max-w-xs text-base text-muted-foreground">
              Participa en el futuro de Cali
              Regístrate para acceder a eventos, oportunidades y espacios
              de participación juvenil en la ciudad.
            </p>
            <div className="mt-6 w-full text-left text-muted-foreground">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Al registrarte podrás:</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li className="flex items-start">
                        <span className="mr-2">•</span> Registrarte a eventos y talleres
                    </li>
                     <li className="flex items-start">
                        <span className="mr-2">•</span> Guardar publicaciones de interés
                    </li>
                     <li className="flex items-start">
                        <span className="mr-2">•</span> Crear y seguir PQRS
                    </li>
                </ul>
            </div>
          </div>
        </div>
        {/* Columna derecha: Formulario de Registro */}
        <div className="flex w-full flex-col justify-center p-8 md:w-1/2">
          <div className="mx-auto flex h-full min-h-[500px] w-full max-w-md flex-col justify-between">
            <div>
              <Link
                href="/"
                className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
              >
                <span className="text-lg">←</span> Volver al inicio
              </Link>
              <h2 className="mb-2 text-2xl font-bold text-foreground">Crear Cuenta</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Completa tus datos para unirte a la plataforma juvenil
              </p>
              <RegisterForm />
            </div>
            <p className="mt-10 text-center text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Link
                href={ROUTES.AUTH.LOGIN.PATH}
                className="font-medium text-primary hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 