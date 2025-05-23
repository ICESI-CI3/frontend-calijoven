import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from '@/lib/constants/routes';
import { AUTH_COOKIE_NAME } from '@/lib/auth/cookieService';

// Rutas públicas a las que se puede acceder sin autenticación
const publicRoutes = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.UI_COMPONENTS];

// Rutas que deben ignorarse para la verificación de autenticación
const ignoredRoutes = ['/_next', '/favicon.ico', '/api'];

const isPublicRoute = (path: string) => {
  return publicRoutes.some((route) => path === route || path.startsWith(`${route}/`));
};

const isIgnoredRoute = (path: string) => {
  return ignoredRoutes.some((route) => path.startsWith(route));
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Ignorar rutas excluidas (estáticas, API, etc.)
  if (isIgnoredRoute(path)) {
    return NextResponse.next();
  }

  // Verificar autenticación
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthPage = ([ROUTES.LOGIN, ROUTES.REGISTER] as string[]).includes(path);

  // Redirigir a dashboard si está autenticado y visita páginas de login/registro
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  // Permitir rutas públicas
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // Redirigir a login si accede a ruta protegida sin token
  if (!token) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
