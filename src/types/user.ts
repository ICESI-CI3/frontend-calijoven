import { Permission } from '@/lib/constants/permissions';
import { BaseCity } from './city';
import { BaseCommittee } from './committee';
import { OrganizationDto } from './organization';

export type User = {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  banned: boolean;
  isPublic: boolean;
  roles: Permission[];
  city: BaseCity;
  leadingCommittees: BaseCommittee[];
  committees: BaseCommittee[];
  organizations: OrganizationDto[];
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
};
  
// TODO: eliminar este tipo cuando descubra porque carajo renombrar el roles de arriba da error solo funcioan con roles
export type getUser = {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  banned: boolean;
  isPublic: boolean;
  roles: Role[];
  city: BaseCity;
  leadingCommittees: BaseCommittee[];
  committees: BaseCommittee[];
  organizations: OrganizationDto[];
};

export type UserUpdateRequest = {
  name?: string;
  email?: string;
  city?: string;
  addRoles?: Role[];
  removeRoles?: Role[];
  isPublic?: boolean;
  banned?: boolean;
};

export type UserUpdateDto = {
  name?: string;
  email?: string;
  city?: string;
}

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  city: string;
};

export type UserFilters = {
  name?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export type FilterUserDto = UserFilters & {
  page: number;
  limit: number;
};
export type NotificationPreferences = {
  events: boolean;
  news: boolean;
  offers: boolean;
  add_organizations?: string[];
  remove_organizations?: string[];
  add_cities?: string[];
  remove_cities?: string[];
};

export type ContactUpdateRequest = {
  email?: string;
  phone?: string;
  add_social_media?: string[];
  remove_social_media?: string[];
};
