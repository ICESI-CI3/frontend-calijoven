/**
 * Rutas de navegación para la aplicación frontend.
 */
export const ROUTES = {
  // Rutas públicas
  LOGIN: '/login',
  REGISTER: '/registro',
  UI_COMPONENTS: '/ui-components', // TODO: Eliminar

  HOME: '/',
  PUBLICATIONS: {
    LIST: '/publicacion',
    DETAIL: (id: string) => `/publicacion/${id}`,
  },
  CDJ: '/cdj',
  PDJ: '/pdj',
  ORGANIZATIONS: '/organizaciones-aliadas',
  TRANSPARENCY: '/transparencia',

  // Rutas autenticadas
  MY_SPACE: {
    HOME: '/mi-espacio',
    PUBLICATIONS: '/mi-espacio/publicacion',
    PQRS: '/mi-espacio/pqrs',
    CONFIGURATION: '/mi-espacio/configuracion',
  },

  // Administración
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/usuario',
    USER_DETAIL: (id: string) => `/admin/usuario/${id}`,
    ORGANIZATIONS: '/admin/organizacion',
    ORGANIZATION_DETAIL: (id: string) => `/admin/organizacion/${id}`,
    PUBLICATIONS: '/admin/publicacion',
    PUBLICATION_DETAIL: (id: string) => `/admin/publicacion/${id}`,
    BANNERS: '/admin/banner',
    BANNER_DETAIL: (id: string) => `/admin/banner/${id}`,
    PQRS: '/admin/pqrs',
    PQRS_DETAIL: (id: string) => `/admin/pqrs/${id}`,
  },
} as const;
