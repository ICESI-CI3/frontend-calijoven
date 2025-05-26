import { Organization } from './organization';
import { City } from './city';

export type PublicationTypeEnum = 'event' | 'news' | 'offer';

export interface PublicationType {
  name: string;
  description: string;
}

export interface Attachment {
  id: string;
  name: string;
  format: string;
  url: string;
}

export interface Tag {
  id: string;
  name: string;
  description: string;
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  content: string;
  type: PublicationType;
  published_at: string | null;
  published_by?: {
    id: string;
    name: string;
    profilePicture: string;
    banned: boolean;
  };
  organizers?: Organization[];
  cities: City[];
  tags: Tag[];
  attachments?: Attachment[];
  createdAt: string;
}

export interface PublicationFilters {
  tag?: string;
  city?: string;
  type?: string;
  unpublished?: boolean;
  search?: string;
  organization?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateTagDto {
  name: string;
  description?: string;
}

export interface EventDto {
  location?: string;
  date?: string;
}

export interface NewsDto {
  author?: string;
}

export interface OfferDto {
  offerType?: string;
  external_link?: string;
  deadline?: string;
}

export interface CreatePublicationDto {
  title: string;
  description: string;
  content: string;
  type: string;
  organizers?: string[];
  tags?: CreateTagDto[];
  cities: string[];
  event?: EventDto;
  news?: NewsDto;
  offer?: OfferDto;
  published?: boolean;
  attachments?: File[];
}

export interface UpdatePublicationDto extends Partial<CreatePublicationDto> {
  attachmentsToDelete?: string[];
}

export interface FilterPublicationDto extends PublicationFilters {
  page?: number;
  limit?: number;
}

export interface ReportFilters {
  types?: string[];
  organizationIds?: string[];
  authorIds?: string[];
  cityIds?: string[];
  startDate?: string;
  endDate?: string;
}
