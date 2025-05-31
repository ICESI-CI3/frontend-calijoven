import { Page, expect } from '@playwright/test';

export interface TestUser {
  id: string;
  name: string;
  profilePicture: string;
  banned: boolean;
  city: {
    id: string;
    name: string;
  };
  leadingCommittees: string[];
  organizations?: Array<{
    id: string;
    name: string;
    acronym: string;
    public: boolean;
  }>;
  committees: string[];
  roles: string[];
  email: string;
}

export const TEST_USERS = {
  ADMIN: {
    id: 'b3521e06-0953-45cf-9041-4ffe5c1d988d',
    name: 'Admin User',
    profilePicture: 'https://rb.gy/tnzdki',
    banned: false,
    city: {
      id: '613f3c36-7d47-414a-ba5f-8beb0c865199',
      name: 'Cali',
    },
    leadingCommittees: [],
    organizations: [
      {
        id: 'c093b65e-d765-4cdf-b89f-087929354612',
        name: 'Consejo Distrital de Juventud',
        acronym: 'CDJ',
        public: true,
      },
    ],
    committees: [],
    roles: [
      'ROLE_ADMIN',
      'MANAGE_USER',
      'READ_USER',
      'MANAGE_PUBLICATION',
      'MANAGE_ORGANIZATION',
      'MANAGE_PQRS',
      'MANAGE_BANNER',
    ],
    email: 'admin@test.com',
  },
  USER: {
    id: '987f2872-22a9-4005-ab0d-67051e41c5db',
    name: 'Normal User',
    profilePicture: 'https://rb.gy/9h67l2',
    banned: false,
    city: {
      id: '613f3c36-7d47-414a-ba5f-8beb0c865199',
      name: 'Cali',
    },
    leadingCommittees: [],
    organizations: [],
    committees: [],
    roles: [],
    email: 'user@test.com',
  },
};

/**
 * Genera un JWT mock para testing
 */
export function generateMockJWT(user: TestUser): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    sub: user.id,
    email: user.email,
    authorities: user.roles,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 horas
  };

  // Crear una firma más realista usando los datos del usuario
  const signature = btoa(`mock-signature`).replace(/[^a-zA-Z0-9]/g, '');

  // Codificar en base64 (simulado para testing)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Genera un storage-state.json completo para un usuario específico
 * @param user - Usuario para el cual generar el storage state
 * @param baseUrl - URL base de la aplicación (default: http://localhost:3000)
 * @returns Objeto JSON completo compatible con storage-state.json de Playwright
 */
export function generateStorageState(user: TestUser, baseUrl = 'http://localhost:3000') {
  const token = generateMockJWT(user);

  const authStorageValue = JSON.stringify({
    state: {
      user: {
        id: user.id,
        name: user.name,
        profilePicture: user.profilePicture,
        banned: user.banned,
        city: user.city,
        leadingCommittees: user.leadingCommittees,
        organizations: user.organizations || [],
        committees: user.committees,
        roles: user.roles,
      },
      token: token,
    },
    version: 0,
  });

  return {
    cookies: [],
    origins: [
      {
        origin: baseUrl,
        localStorage: [
          {
            name: 'auth-storage',
            value: authStorageValue,
          },
        ],
      },
    ],
  };
}

export function generateUnauthenticatedStorageState() {
  return {
    cookies: [],
    origins: [],
  };
}