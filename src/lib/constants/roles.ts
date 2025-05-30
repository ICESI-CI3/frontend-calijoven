/**Constants para definir los roles que puede tener un usuario en la aplicación */

export const ROLES = {
  ADMIN: 'ADMIN',
  PDJ: 'MIEMBRO_PDJ',
  CDJ: 'MIEMBRO_CDJ',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
