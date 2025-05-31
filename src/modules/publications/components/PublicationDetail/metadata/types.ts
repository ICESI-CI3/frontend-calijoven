import type { Publication } from '@/types/publication';

export type PublicationMetadataProps = {
  type: Publication['type'];
  tags?: Publication['tags'];
  event?: Publication['event'];
  offer?: Publication['offer'];
  organizers?: Publication['organizers'];
  cities?: Publication['cities'];
  publishedBy?: Publication['published_by'];
};

export type EventInfoProps = {
  event?: Publication['event'];
};

export type OfferInfoProps = {
  offer?: Publication['offer'];
};

export type OrganizersListProps = {
  organizers?: Publication['organizers'];
};

export type CitiesListProps = {
  cities?: Publication['cities'];
};

export type PublishedByInfoProps = {
  publishedBy?: Publication['published_by'];
}; 