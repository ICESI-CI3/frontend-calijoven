import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth/cookieService';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

  // 1. Eliminar la cookie de autenticación
  response.cookies.delete(AUTH_COOKIE_NAME);

  return response;
}
