import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/modules/auth/utils/cookieService';

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const backendResponse = await fetch(`${BACKEND_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!backendResponse.ok) {
      if (backendResponse.status === 401) {
        const response = NextResponse.json(
          { message: 'Token invalid or expired' },
          { status: 401 }
        );
        response.cookies.delete(AUTH_COOKIE_NAME);
        return response;
      }
      return NextResponse.json(
        { message: 'Failed to fetch user from backend' },
        { status: backendResponse.status || 500 }
      );
    }

    const userData = await backendResponse.json();
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error('Error calling backend /user/me:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
