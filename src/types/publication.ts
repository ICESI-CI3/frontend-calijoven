import { Organization } from './organization';
import { City } from './city';

export type PublicationTypeEnum = 'event' | 'news' | 'offer';

export type PublicationType = {
  name: string;
  description: string;
}

export type Attachment = {
  id: string;
  name: string;
  format: string;
  url: string;
}

export type Tag = {
  id: string;
  name: string;
  description: string;
}

export type Publication = {
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

export type PublicationFilters = {
  tag?: string;
  city?: string;
  type?: string;
  unpublished?: boolean;
  search?: string;
  organization?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export type CreateTagDto = {
  name: string;
  description?: string;
}

export type EventDto = {
  location?: string;
  date?: string;
}

export type NewsDto = {
  author?: string;
}

export type OfferDto = {
  offerType?: string;
  external_link?: string;
  deadline?: string;
}

export type CreatePublicationDto = {
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

export type UpdatePublicationDto = Partial<CreatePublicationDto> & {
  attachmentsToDelete?: string[];
}

export type FilterPublicationDto = PublicationFilters & {
  page?: number;
  limit?: number;
}

export type ReportFilters = {
  types?: string[];
  organizationIds?: string[];
  authorIds?: string[];
  cityIds?: string[];
  startDate?: string;
  endDate?: string;
}
