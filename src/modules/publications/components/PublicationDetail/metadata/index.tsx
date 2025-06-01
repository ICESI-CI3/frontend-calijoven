import React from 'react';
import { Badge } from "@/components/Badge";
import { Tag } from "@/components/Tag";
import { EventInfo } from './EventInfo';
import { OfferInfo } from './OfferInfo';
import { OrganizersList } from './OrganizersList';
import { CitiesList } from './CitiesList';
import { PublishedByInfo } from './PublishedByInfo';
import type { PublicationMetadataProps } from './types';

export function PublicationMetadata({ 
  type, 
  tags, 
  event, 
  offer, 
  organizers, 
  cities, 
  publishedBy 
}: PublicationMetadataProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">{type.description}</Badge>
        {tags?.map((tag) => (
          <Tag key={tag.id}>{tag.name}</Tag>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2 text-base text-muted-foreground">
        <EventInfo event={event} />
        <OfferInfo offer={offer} />
        <OrganizersList organizers={organizers} />
        <CitiesList cities={cities} />
        <PublishedByInfo publishedBy={publishedBy} />
      </div>
    </div>
  );
}

// Exportar todos los componentes para uso individual si es necesario
export { EventInfo } from './EventInfo';
export { OfferInfo } from './OfferInfo';
export { OrganizersList } from './OrganizersList';
export { CitiesList } from './CitiesList';
export { PublishedByInfo } from './PublishedByInfo'; 