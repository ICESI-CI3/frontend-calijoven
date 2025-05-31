import React from 'react';
import { LinkIcon } from "@heroicons/react/24/outline";
import type { OfferInfoProps } from './types';

export function OfferInfo({ offer }: OfferInfoProps) {
  if (!offer?.external_link) return null;
  
  return (
    <div className="flex items-center gap-2">
      <LinkIcon className="h-5 w-5" />
      <a
        href={offer.external_link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        Ver oferta
      </a>
    </div>
  );
} 