'use client';

import { SavedPublicationsList } from '@/modules/publications/components/SavedPublicationsList';
import RequireAuth from '@/modules/auth/components/RequireAuth';

export default function SavedPublicationsPage() {
  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Mis Publicaciones Guardadas</h1>
        <SavedPublicationsList />
      </div>
    </RequireAuth>
  );
} 