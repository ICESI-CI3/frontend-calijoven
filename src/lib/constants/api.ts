/**
 * Definición de endpoints de la API para comunicación con el backend.
 * NOTA: Los nombres de rutas aquí coinciden exactamente con los endpoints
 * definidos en el servidor de backend.
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/login', // POST
    REGISTER: '/auth/register', // POST
    ME: '/auth/me', // GET
    LOGOUT: '/auth/logout', // POST
  },

  USER: {
    BASE: '/user', // GET (todos los usuarios)
    ME: '/user/me', // GET, PUT (usuario autenticado)
    BY_ID: (id: string) => `/user/${id}`, // GET (usuario por ID)
    NOTIFICATION_PREFERENCES: '/user/me/notification-preferences', // PUT
    CONTACT: '/user/me/contact', // PUT
    ADMIN: {
      ADD_ROLES: '/user/admin/add-roles', // PUT
      REMOVE_ROLES: '/user/admin/remove-roles', // PUT
    },
  },

  PUBLICATIONS: {
    BASE: '/publication', // GET (lista), POST (crear)
    BY_ID: (id: string) => `/publication/${id}`, // GET, PUT, DELETE
  },

  REGISTRATIONS: {
    BASE: '/registration', // GET (todas)
    BY_PUBLICATION: (id: string) => `/registration/${id}`, // POST (registrarse), DELETE (cancelar)
    ME: '/registration/me', // GET (mis registros)
    USERS: (id: string) => `/registration/${id}/users`, // GET (usuarios registrados)
  },

  SAVED_POSTS: {
    BASE: '/savedPosts', // GET (listar guardados)
    BY_PUBLICATION: (id: string) => `/savedPosts/${id}`, // POST (guardar), DELETE (quitar)
  },

  PQRS: {
    BASE: '/pqrs', // GET (listar propios), POST (crear)
    BY_ID: (id: string) => `/pqrs/${id}`, // GET (detalle propio)
    ADMIN: {
      BASE: '/admin/pqrs', // GET (todos administrativos)
      BY_ID: (id: string) => `/admin/pqrs/${id}`, // GET, PUT (actualizar admin)
    },
  },

  ORGANIZATIONS: {
    BASE: '/organization', // GET (listar), POST (crear)
    BY_ID: (id: string) => `/organization/${id}`, // GET, PUT (actualizar)
    MEMBERS: {
      ADD: (id: string) => `/organization/${id}/members`, // POST (añadir miembro)
      REMOVE: (orgId: string, userId: string) => `/organization/${orgId}/members/${userId}`, // DELETE (eliminar miembro)
    },
    COMMITTEES: {
      BASE: (orgId: string) => `/organization/${orgId}/committee`, // GET (listar), POST (crear)
      BY_ID: (orgId: string, id: string) => `/organization/${orgId}/committee/${id}`, // GET, PATCH, DELETE
      MEMBERS: {
        ADD: (orgId: string, id: string) => `/organization/${orgId}/committee/${id}/members`, // POST
        REMOVE: (orgId: string, committeeId: string, userId: string) =>
          `/organization/${orgId}/committee/${committeeId}/members/${userId}`, // DELETE
      },
    },
  },

  DOCUMENTS: {
    BY_ORGANIZATION: (orgId: string) => `/document/organization/${orgId}`, // GET, POST
    DELETE: (orgId: string, docId: string) => `/document/organization/${orgId}/document/${docId}`, // DELETE
    TYPES: '/document/type', // GET (tipos de documentos)
  },

  BANNERS: {
    BASE: '/banners', // GET (listar), POST (crear)
    BY_ID: (id: string) => `/banners/${id}`, // GET, PUT, DELETE
  },

  GOVERNANCE: {
    CITIES: {
      BASE: '/governance/city', // GET (todas)
      BY_ID: (cityId: string) => `/governance/city/${cityId}`, // GET
      BY_DEPARTMENT: (deptId: number) => `/governance/city/department/${deptId}`, // GET
      BY_COMMUNE: (communeId: string) => `/governance/city/commune/${communeId}`, // GET
    },
    DEPARTMENTS: {
      BASE: '/governance/department', // GET (todos)
      BY_ID: (deptId: number) => `/governance/department/${deptId}`, // GET
    },
    COMMUNES: {
      BASE: '/governance/commune', // GET (todas)
      BY_ID: (communeId: string) => `/governance/commune/${communeId}`, // GET
    },
  },

  NOTIFICATIONS: {
    BASE: '/api/notifications', // GET (listar)
    BY_ID: (id: string) => `/api/notifications/${id}`, // GET, PUT (actualizar estado)
    MARK_ALL_READ: '/api/notifications/mark-all-as-read', // PUT
    UNREAD_COUNT: '/api/notifications/unread/count', // GET (contador no leídas)
  },

  REPORTS: {
    PUBLICATION: {
      GENERAL: '/report/publication', // POST (reporte general)
      BY_ID: (id: string) => `/report/publication/${id}`, // POST (reporte específico)
    },
  },

  OFFER_TYPES: {
    BASE: '/offer-types', // GET (listar)
    BY_ID: (id: string) => `/offer-types/${id}`, // GET
  },
} as const;
