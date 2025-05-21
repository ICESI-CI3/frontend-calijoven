import { User } from './user';
import { Organization } from './organization';
import { City } from './city';

export type PublicationType = 'offer' | 'event';

export interface Publication {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  author: User;
  organization: Organization;
  type: string;
  status: string;
  city: City;
  startDate?: string; // For events
  endDate?: string; // For events
  isSaved?: boolean;
  isRegistered?: boolean;
  createdAt: string;
  updatedAt: string;
}
