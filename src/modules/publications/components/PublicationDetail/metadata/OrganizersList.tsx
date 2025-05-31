import React from 'react';
import { Badge } from "@/components/Badge";
import type { OrganizersListProps } from './types';

export function OrganizersList({ organizers }: OrganizersListProps) {
  if (!organizers?.length) return null;
  
  return (
    <div>
      <span className="font-medium">Organizadores: </span>
      {organizers.map((org) => (
        <Badge key={org.id} variant="default" className="mr-2">
          {org.name}{org.acronym ? ` (${org.acronym})` : ''}
        </Badge>
      ))}
    </div>
  );
} 