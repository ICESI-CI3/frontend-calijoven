import { Permission } from '@/lib/constants/permissions';
import { BaseCity } from './city';
import { BaseCommittee } from './committee';
import { BaseOrganization } from './organization';

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
  organizations: BaseOrganization[];
};

export type UserUpdateRequest = {
  name?: string;
  email?: string;
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
