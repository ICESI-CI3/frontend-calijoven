import React from 'react';
import { Badge } from "@/components/Badge";
import type { CitiesListProps } from './types';

export function CitiesList({ cities }: CitiesListProps) {
  if (!cities?.length) return null;
  
  return (
    <div>
      <span className="font-medium">Ciudades: </span>
      {cities.map((city) => (
        <Badge key={city.id} variant="info" className="mr-2">
          {city.name}
        </Badge>
      ))}
    </div>
  );
} 