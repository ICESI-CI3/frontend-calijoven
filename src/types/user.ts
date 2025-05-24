import { Permission } from '@/lib/constants/permissions';

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  banned: string;
  roles: Role[];
  city: string;
  leadingCommittees: string[];
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
