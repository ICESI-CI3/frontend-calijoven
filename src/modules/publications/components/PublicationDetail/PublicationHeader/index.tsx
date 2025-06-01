import React from 'react';

interface PublicationHeaderProps {
  title: string;
  description: string;
}

export function PublicationHeader({ title, description }: PublicationHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold">{title}</h1>
      <p className="text-lg text-muted-foreground">{description}</p>
    </div>
  );
} 