import React from 'react';
import { CalendarIcon, LinkIcon, MapPinIcon } from "@heroicons/react/24/outline";
import type { EventInfoProps } from './types';

export function EventInfo({ event }: EventInfoProps) {
  if (!event) return null;
  
  return (
    <>
      {event.date && (
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
      )}
      {event.location && (
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5" />
          <span>{event.location}</span>
        </div>
      )}
      {event.registrationLink && (
        <div className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Link de registro
          </a>
        </div>
      )}
    </>
  );
} 