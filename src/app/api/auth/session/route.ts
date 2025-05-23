import { NextRequest, NextResponse } from 'next/server';
import {
  extractTokenPayload,
  isTokenExpired,
  validateToken,
  getTokenExpirySeconds,
  hasUserIdentifier,
} from '@/lib/auth/tokenService';
import { AUTH_COOKIE_NAME } from '@/lib/auth/cookieService';

/**
 * Verifica el estado actual de la sesión del usuario
 * @param request - Solicitud entrante
 * @returns Respuesta con información del estado de la sesión
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ valid: false, reason: 'no-token' }, { status: 401 });
    }

    const payload = extractTokenPayload(token);

    if (!payload || isTokenExpired(payload)) {
      return NextResponse.json(
        {
          valid: false,
          reason: payload ? 'expired' : 'invalid-format',
          expiredAt: payload?.exp ? new Date(payload.exp * 1000).toISOString() : null,
        },
        { status: 401 }
      );
    }

    if (!hasUserIdentifier(payload)) {
      return NextResponse.json({ valid: false, reason: 'missing-identifier' }, { status: 401 });
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: payload.sub || payload.id,
        email: payload.email,
        authorities: payload.authorities || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        valid: false,
        reason: 'error',
        error: error instanceof Error ? error.message : 'unknown-error',
      },
      { status: 500 }
    );
  }
}

/**
 * Crea una nueva sesión estableciendo el token en una cookie
 * @param request - Solicitud con token y preferencias de sesión
 * @returns Respuesta con resultado de la creación de sesión
 */
export async function POST(request: NextRequest) {
  try {
    const { token, rememberMe = false } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, reason: 'missing-token' }, { status: 400 });
    }

    if (!validateToken(token)) {
      return NextResponse.json({ success: false, reason: 'invalid-token' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    const expiresInSeconds = getTokenExpirySeconds(token);
    const maxAge = rememberMe
      ? Math.max(expiresInSeconds, 60 * 60 * 24 * 30) // Mínimo 30 días si rememberMe
      : expiresInSeconds;

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: Math.max(maxAge, 3600), // Al menos 1 hora
    });

    return response;
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ success: false, reason: 'server-error' }, { status: 500 });
  }
}

/**
 * Elimina la sesión actual del usuario
 * @returns Respuesta confirmando eliminación de sesión
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  return response;
}
