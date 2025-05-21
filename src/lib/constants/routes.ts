/**
 * Rutas de navegación para la aplicación frontend.
 */
export const ROUTES = {
  // Rutas públicas
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/auth/register',
  UI_COMPONENTS: '/ui-components',

  // Rutas autenticadas
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  NOTIFICATIONS: '/notifications',

  PUBLICATIONS: {
    LIST: '/publications',
    DETAIL: (id: string) => `/publications/${id}`,
    CREATE: '/publications/create',
    EDIT: (id: string) => `/publications/${id}/edit`,
    SAVED: '/publications/saved',
    REGISTERED: '/publications/registered',
  },

  // PQRS
  PQRS: {
    LIST: '/pqrs',
    DETAIL: (id: string) => `/pqrs/${id}`,
    CREATE: '/pqrs/create',
    ADMIN_LIST: '/admin/pqrs',
    ADMIN_DETAIL: (id: string) => `/admin/pqrs/${id}`,
  },

  ORGANIZATIONS: {
    LIST: '/organizations',
    DETAIL: (id: string) => `/organizations/${id}`,
    CREATE: '/organizations/create',
    EDIT: (id: string) => `/organizations/${id}/edit`,
    COMMITTEES: {
      LIST: (orgId: string) => `/organizations/${orgId}/committees`,
      CREATE: (orgId: string) => `/organizations/${orgId}/committees/create`,
      EDIT: (orgId: string, id: string) => `/organizations/${orgId}/committees/${id}/edit`,
      DETAIL: (orgId: string, id: string) => `/organizations/${orgId}/committees/${id}`,
    },
    DOCUMENTS: {
      LIST: (orgId: string) => `/organizations/${orgId}/documents`,
      UPLOAD: (orgId: string) => `/organizations/${orgId}/documents/upload`,
    },
  },

  // Banners
  BANNERS: {
    LIST: '/banners',
    DETAIL: (id: string) => `/banners/${id}`,
    CREATE: '/banners/create',
    EDIT: (id: string) => `/banners/${id}/edit`,
  },

  // Reportes
  REPORTS: {
    PUBLICATIONS: '/reports/publications',
    USERS: '/reports/users',
    ORGANIZATIONS: '/reports/organizations',
  },

  // Administración
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    USER_DETAIL: (id: string) => `/admin/users/${id}`,
    SETTINGS: '/admin/settings',
  },
} as const;
