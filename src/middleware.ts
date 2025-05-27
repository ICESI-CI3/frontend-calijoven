import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPublicRoutes, hasPermissionForRoute } from '@/lib/constants/routes';
import { AUTH_COOKIE_NAME } from '@/modules/auth/utils/cookieService';
import { extractTokenPayload } from '@/modules/auth/utils/tokenService';

// Rutas públicas a las que se puede acceder sin autenticación
const publicRoutes = getPublicRoutes();

// Rutas que deben ignorarse para la verificación de autenticación
const ignoredRoutes = ['/_next', '/favicon.ico', '/api'];

const isPublicRoute = (path: string) => {
  return publicRoutes.some((route) => path === route || path.startsWith(`${route}/`));
};

const isIgnoredRoute = (path: string) => {
  // Ignora rutas especiales y archivos con extensión
  return (
    ignoredRoutes.some((route) => path.startsWith(route)) || !!path.match(/\.[^/]+$/) // Si tiene extensión de archivo
  );
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Ignorar rutas excluidas (estáticas, API, archivos con extensión, etc.)
  if (isIgnoredRoute(path)) {
    return NextResponse.next();
  }

  // Verificar autenticación
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthPage = ['/login', '/registro'].includes(path);

  // Redirigir a dashboard si está autenticado y visita páginas de login/registro
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/mi-espacio', request.url));
  }

  // Permitir rutas públicas
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // Redirigir a login si accede a ruta protegida sin token
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar permisos para rutas protegidas
  const payload = extractTokenPayload(token);
  const userPermissions = payload?.authorities || [];

  if (!hasPermissionForRoute(path, userPermissions)) {
    // Redirigir a página de acceso denegado
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|jpg|jpeg|png|gif|webp|ico|txt|json)).*)',
  ],
};
