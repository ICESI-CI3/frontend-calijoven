import { Permission, PERMISSIONS } from './permissions';

/**
 * Type for a route in the application
 */
export type Route = {
  PATH: string;
  PUBLIC?: boolean;
  PERMISSIONS?: Permission[];
  LABEL?: string;
  ICON?: string;
  CHILDREN?: Record<string, Route>;
};

/**
 * Type for the full routes object
 */
export type Routes = Record<string, Route | string>;

/**
 * Navigation routes for the frontend application.
 */
export const ROUTES = {
  // Public routes
  HOME: {
    PATH: '/',
    PUBLIC: true,
    LABEL: 'Inicio',
  },

  AUTH: {
    LOGIN: {
      PATH: '/login',
      PUBLIC: true,
      LABEL: 'Iniciar Sesión',
    },
    REGISTER: {
      PATH: '/registro',
      PUBLIC: true,
      LABEL: 'Registro',
    },
  },

  // Public content
  PUBLICATIONS: {
    LIST: {
      PATH: '/publicaciones',
      PUBLIC: true,
      LABEL: 'Publicaciones',
    },
    DETAIL: (id: string) => ({
      PATH: `/publicaciones/${id}`,
      PUBLIC: true,
    }),
  },

  CDJ: {
    PATH: '/cdj',
    PUBLIC: true,
    LABEL: 'Consejo Distrital de Juventud',
  },

  PDJ: {
    PATH: '/pdj',
    PUBLIC: true,
    LABEL: 'Plataforma Distrital de Juventud',
  },

  ORGANIZATIONS: {
    PATH: '/organizaciones-aliadas',
    PUBLIC: true,
    LABEL: 'Organizaciones Aliadas',
  },

  TRANSPARENCY: {
    PATH: '/transparencia',
    PUBLIC: true,
    LABEL: 'Transparencia',
  },

  UI_COMPONENTS: {
    PATH: '/ui-components',
    PUBLIC: true,
    LABEL: 'Componentes UI',
  },

  // Authenticated routes
  MY_SPACE: {
    HOME: {
      PATH: '/mi-espacio',
      PUBLIC: false,
      LABEL: 'Mi Espacio',
    },
    PUBLICATIONS: {
      PATH: '/mi-espacio/publicacion',
      PUBLIC: false,
      LABEL: 'Mis Publicaciones',
    },
    PQRS: {
      PATH: '/mi-espacio/pqrs',
      PUBLIC: false,
      LABEL: 'Mis PQRS',
    },
    CONFIGURATION: {
      PATH: '/mi-espacio/configuracion',
      PUBLIC: false,
      LABEL: 'Configuración',
    },
  },

  // Administración
  ADMIN: {
    DASHBOARD: {
      PATH: '/admin',
      PUBLIC: false,
      PERMISSIONS: [],
      LABEL: 'Panel de Administración',
    },
    USERS: {
      PATH: '/admin/usuario',
      PUBLIC: false,
      PERMISSIONS: [PERMISSIONS.MANAGE_USER, PERMISSIONS.READ_USER],
      LABEL: 'Usuarios',
    },
    USER_DETAIL: (id: string) => ({
      PATH: `/admin/usuario/${id}`,
      PUBLIC: false,
      PERMISSIONS: [PERMISSIONS.MANAGE_USER],
    }),
    ORGANIZATIONS: {
      PATH: '/admin/organizacion',
      PUBLIC: false,
      PERMISSIONS: [PERMISSIONS.MANAGE_ORGANIZATION],
      LABEL: 'Organizaciones',
    },
    ORGANIZATION_DETAIL: (id: string) => ({
      PATH: `/admin/organizacion/${id}`,
      PUBLIC: false,
      PERMISSIONS: [PERMISSIONS.MANAGE_ORGANIZATION],
    }),
    PUBLICATIONS: {
      PATH: '/admin/publicacion',
      PUBLIC: false,
      PERMISSIONS: [PERMISSIONS.MANAGE_PUBLICATION],
      LABEL: 'Publicaciones',
    },
    PUBLICATION_DETAIL: (id: string) => ({
      PATH: `/admin/publicacion/${id}`,
      PUBLIC: false,
      PERMISSIONS: [PERMISSIONS.MANAGE_PUBLICATION],
    }),
    BANNERS: {
      PATH: '/admin/banner',
      PUBLIC: false,
      PERMISSIONS: [PERMISSIONS.MANAGE_BANNER],
      LABEL: 'Banners',
    },
    BANNER_DETAIL: (id: string) => ({
      PATH: `/admin/banner/${id}`,
      PUBLIC: false,
      PERMISSIONS: [PERMISSIONS.MANAGE_BANNER],
    }),
    PQRS: {
      PATH: '/admin/pqrs',
      PUBLIC: false,
      PERMISSIONS: [PERMISSIONS.MANAGE_PQRS],
      LABEL: 'PQRS',
    },
    PQRS_DETAIL: (id: string) => ({
      PATH: `/admin/pqrs/${id}`,
      PUBLIC: false,
      PERMISSIONS: [PERMISSIONS.MANAGE_PQRS],
    }),
  },

  ERRORS: {
    NOT_FOUND: {
      PATH: '/not-found',
    },
  },
} as const;

/**
 * Get the full route for a route with dynamic parameters
 * @param routeFactory Factory function that receives parameters
 * @param params Parameters for the route
 * @returns Full route object
 */
export function getRouteWithParams<T extends (...args: unknown[]) => Route>(
  routeFactory: T,
  ...params: Parameters<T>
): Route {
  return routeFactory(...params);
}

export function getPublicRoutes(): string[] {
  function extractPublicPaths(
    routes: Record<string, Route | ((...args: unknown[]) => Route)>,
    paths: string[] = []
  ): string[] {
    for (const key in routes) {
      const route = routes[key];

      if (typeof route === 'function') {
        const dynamicPath = route('[dummy-id]');
        if (dynamicPath.PUBLIC) {
          paths.push(dynamicPath.PATH);
        }
        continue;
      }

      if (route?.PATH && route?.PUBLIC === true) {
        paths.push(route.PATH);
      }

      if (route && typeof route === 'object' && !route.PATH) {
        extractPublicPaths(
          route as unknown as Record<string, Route | ((...args: unknown[]) => Route)>,
          paths
        );
      }
    }
    return paths;
  }

  return extractPublicPaths(
    ROUTES as unknown as Record<string, Route | ((...args: unknown[]) => Route)>
  );
}

export function matchesDynamicRoute(currentPath: string, routePattern: string): boolean {
  if (!routePattern.includes('[') && !routePattern.includes('dummy-id')) {
    return currentPath === routePattern;
  }

  const regexPattern = routePattern
    .replace(/dummy-id/g, '[^/]+')
    .replace(/\[id\]/g, '[^/]+')
    .replace(/\[slug\]/g, '[^/]+');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(currentPath);
}

/**
 * Get the protected routes with their permissions
 */
export function getPermissionProtectedRoutes(): Record<string, Permission[]> {
  const protectedRoutes: Record<string, Permission[]> = {};

  function extractProtectedPaths(
    routes: Record<string, Route | ((...args: unknown[]) => Route)>
  ): void {
    for (const key in routes) {
      const route = routes[key];

      if (typeof route === 'function') {
        const dynamicRoute = route('dummy-id');
        if (dynamicRoute.PERMISSIONS && dynamicRoute.PERMISSIONS.length > 0) {
          protectedRoutes[dynamicRoute.PATH] = dynamicRoute.PERMISSIONS;
        }
        continue;
      }

      if (route?.PATH && route?.PERMISSIONS && route.PERMISSIONS.length > 0) {
        protectedRoutes[route.PATH] = route.PERMISSIONS;
      }

      if (route && typeof route === 'object' && !route.PATH) {
        extractProtectedPaths(
          route as unknown as Record<string, Route | ((...args: unknown[]) => Route)>
        );
      }
    }
  }

  extractProtectedPaths(ROUTES as unknown as Record<string, Route | ((...args: unknown[]) => Route)>);
  return protectedRoutes;
}

/**
 * Check if the user has permission to access a specific route (including dynamic routes)
 */
export function hasPermissionForRoute(path: string, userPermissions: Permission[] = []): boolean {
  const protectedRoutes = getPermissionProtectedRoutes();

  if (protectedRoutes[path]) {
    return protectedRoutes[path].some((permission) => userPermissions.includes(permission));
  }

  for (const [routePattern, requiredPermissions] of Object.entries(protectedRoutes)) {
    if (matchesDynamicRoute(path, routePattern)) {
      return requiredPermissions.some((permission) => userPermissions.includes(permission));
    }
  }

  return true;
}

export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = getPublicRoutes();

  return publicRoutes.some((route) => {
    if (pathname === route) return true;

    if (pathname.startsWith(`${route}/`)) return true;

    if (matchesDynamicRoute(pathname, route)) return true;

    return false;
  });
}

export function isAuthRoute(pathname: string): boolean {
  return (
    pathname === ROUTES.AUTH.LOGIN.PATH ||
    pathname === ROUTES.AUTH.REGISTER.PATH ||
    pathname.startsWith(`${ROUTES.AUTH.LOGIN.PATH}/`) ||
    pathname.startsWith(`${ROUTES.AUTH.REGISTER.PATH}/`)
  );
}