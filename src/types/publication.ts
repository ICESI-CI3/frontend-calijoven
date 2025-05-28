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

/**{
            "id": "e415f9d3-49fd-488e-a443-17eb889c49c4",
            "title": "Taller de Programación",
            "description": "Taller introductorio de programación para jóvenes",
            "published_at": null,
            "type": {
                "name": "event",
                "description": "Eventos"
            },
            "attachments": [],
            "organizers": [],
            "content": "Contenido detallado del taller de programación...",
            "cities": [],
            "tags": [],
            "createdAt": "2025-05-27T18:21:29.993Z",
            "event": {
                "id": "e415f9d3-49fd-488e-a443-17eb889c49c4",
                "date": "2025-06-02T21:11:15.121Z",
                "location": "Cali, Colombia",
                "registrationLink": "https://example.com/register"
            },
            "news": null,
            "offer": null
        }, */
export type Registration = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  publication: {
    id: string;
    title: string;
    description: string;
    type: PublicationType;
    date?: string;
    location?: string;
  };
  registeredAt: string;
};

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
  event?: EventDto;
  news?: NewsDto;
  offer?: OfferDto;
  registrations?: Registration[];
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
