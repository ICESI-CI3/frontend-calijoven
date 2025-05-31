import React from 'react';
import type { PublishedByInfoProps } from './types';

export function PublishedByInfo({ publishedBy }: PublishedByInfoProps) {
  if (!publishedBy) return null;
  
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">Publicado por:</span>
      <span>{publishedBy.name}</span>
    </div>
  );
} 