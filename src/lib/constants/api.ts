/**
 * Definición de endpoints de la API para comunicación con el backend.
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },

  USER: {
    BASE: '/user',
    ME: '/user/me',
    BY_ID: (id: string) => `/user/${id}`,
    NOTIFICATION_PREFERENCES: '/user/me/notification-preferences',
    CONTACT: '/user/me/contact',
    BAN: (id: string) => `/user/${id}/ban`,
    PUBLIC: (id: string) => `/user/${id}/public`,
    ADD_ROLES: '/user/admin/add-roles',
    REMOVE_ROLES: '/user/admin/remove-roles'
  },

  ROLE: {
    BASE: '/role'
  },

  PUBLICATIONS: {
    BASE: '/publication',
    BY_ID: (id: string) => `/publication/${id}`,
  },

  REGISTRATIONS: {
    BASE: '/registration',
    BY_PUBLICATION: (id: string) => `/registration/${id}`,
    ME: '/registration/me',
    USERS: (id: string) => `/registration/${id}/users`,
  },

  SAVED_POSTS: {
    BASE: '/savedPosts',
    BY_PUBLICATION: (id: string) => `/savedPosts/${id}`,
  },

  PQRS: {
    BASE: '/pqrs',
    BY_ID: (id: string) => `/pqrs/${id}`,
    ADMIN: {
      BASE: '/admin/pqrs',
      BY_ID: (id: string) => `/admin/pqrs/${id}`,
    },
  },

  ORGANIZATIONS: {
    BASE: '/organization',
    BY_ID: (id: string) => `/organization/${id}`,
    MEMBERS: {
      ADD: (id: string) => `/organization/${id}/members`,
      REMOVE: (orgId: string, userId: string) => `/organization/${orgId}/members/${userId}`,
    },
    COMMITTEES: {
      BASE: (orgId: string) => `/organization/${orgId}/committee`,
      BY_ID: (orgId: string, id: string) => `/organization/${orgId}/committee/${id}`,
      MEMBERS: {
        ADD: (orgId: string, id: string) => `/organization/${orgId}/committee/${id}/members`,
        REMOVE: (orgId: string, committeeId: string, userId: string) =>
          `/organization/${orgId}/committee/${committeeId}/members/${userId}`,
      },
    },
  },

  DOCUMENTS: {
    BY_ORGANIZATION: (orgId: string) => `/document/organization/${orgId}`,
    DELETE: (orgId: string, docId: string) => `/document/organization/${orgId}/document/${docId}`,
    TYPES: '/document/type',
  },

  BANNERS: {
    BASE: '/banners',
    BY_ID: (id: string) => `/banners/${id}`,
  },

  GOVERNANCE: {
    CITIES: {
      BASE: '/governance/city',
      BY_ID: (cityId: string) => `/governance/city/${cityId}`,
      BY_DEPARTMENT: (deptId: number) => `/governance/city/department/${deptId}`,
      BY_COMMUNE: (communeId: string) => `/governance/city/commune/${communeId}`,
    },
    DEPARTMENTS: {
      BASE: '/governance/department',
      BY_ID: (deptId: number) => `/governance/department/${deptId}`,
    },
    COMMUNES: {
      BASE: '/governance/commune',
      BY_ID: (communeId: string) => `/governance/commune/${communeId}`,
    },
  },

  NOTIFICATIONS: {
    BASE: '/api/notifications',
    BY_ID: (id: string) => `/api/notifications/${id}`,
    MARK_ALL_READ: '/api/notifications/mark-all-as-read',
    UNREAD_COUNT: '/api/notifications/unread/count',
  },

  REPORTS: {
    PUBLICATION: {
      GENERAL: '/report/publication',
      BY_ID: (id: string) => `/report/publication/${id}`,
    },
  },

  OFFER_TYPES: {
    BASE: '/offer-types',
    BY_ID: (id: string) => `/offer-types/${id}`,
  },
} as const;
