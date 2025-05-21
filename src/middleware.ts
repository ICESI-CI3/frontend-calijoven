import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from '@/lib/constants/routes';

// Rutas públicas a las que se puede acceder sin autenticación
const publicRoutes = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.UI_COMPONENTS];

const isPublicRoute = (path: string) => {
  return publicRoutes.some((route) => path === route || path.startsWith(`${route}/`));
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-storage')?.value;
  const isAuthPage =
    request.nextUrl.pathname === ROUTES.LOGIN || request.nextUrl.pathname === ROUTES.REGISTER;
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isPublic = isPublicRoute(request.nextUrl.pathname);

  // Allow API routes to be handled by the API
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect to dashboard if accessing login/register while logged in
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  // Permitir acceso a rutas públicas sin redirección
  if (isPublic) {
    return NextResponse.next();
  }

  // Redirect to login if accessing protected page while logged out
  if (!isAuthPage && !token && !request.nextUrl.pathname.startsWith('/_next')) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Aquí se podría implementar verificación de permisos para rutas específicas
  // basado en los roles del usuario (requeriría decodificar el token)

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
