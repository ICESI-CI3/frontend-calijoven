import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPublicRoutes, hasPermissionForRoute, ROUTES } from '@/lib/constants/routes';
import { AUTH_COOKIE_NAME } from '@/modules/auth/utils/cookieService';
import { extractTokenPayload, isTokenExpired } from '@/modules/auth/utils/tokenService';

// Public routes that can be accessed without authentication
const publicRoutes = getPublicRoutes();

// Routes that must be ignored for authentication verification
const ignoredRoutes = ['/_next', '/favicon.ico', '/api'];

const isPublicRoute = (path: string) => {
  return publicRoutes.some((route) => path === route || path.startsWith(`${route}/`));
};

const isIgnoredRoute = (path: string) => {
  return (
    ignoredRoutes.some((route) => path.startsWith(route)) || !!path.match(/\.[^/]+$/) // If it has a file extension
  );
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (isIgnoredRoute(path)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthPage = ['/login', '/registro'].includes(path);

  if (isAuthPage && token) {
    const payload = extractTokenPayload(token);
    if (payload && !isTokenExpired(payload)) {
      const referer = request.headers.get('referer');
      const isExternalNavigation = !referer || !referer.includes(request.nextUrl.origin);

      if (isExternalNavigation) {
        return NextResponse.redirect(new URL(ROUTES.HOME.PATH, request.url));
      } else {
        const response = NextResponse.next();
        response.headers.set('X-Auth-Status', 'valid');
        return response;
      }
    } else {
      const response = NextResponse.next();
      response.cookies.delete(AUTH_COOKIE_NAME);
      response.headers.set('X-Auth-Status', 'expired');
      return response;
    }
  }

  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL(ROUTES.AUTH.LOGIN.PATH, request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  const payload = extractTokenPayload(token);

  if (!payload || isTokenExpired(payload)) {
    const response = NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN.PATH, request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    response.headers.set('X-Auth-Status', 'expired');
    return response;
  }

  const userPermissions = payload?.authorities || [];

  if (!hasPermissionForRoute(path, userPermissions)) {
    return NextResponse.redirect(new URL(ROUTES.ERRORS.NOT_FOUND.PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|jpg|jpeg|png|gif|webp|ico|txt|json)).*)',
  ],
};
