'use client';

import { SavedPublicationsList } from '@/modules/publications/components/SavedPublicationsList';
import RequireAuth from '@/modules/auth/components/RequireAuth';

export default function SavedPublicationsPage() {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Publicaciones Guardadas
            </h1>
            <p className="mt-2 text-gray-600">
              Aquí puedes ver y gestionar todas las publicaciones que has guardado, incluyendo eventos, noticias y ofertas de la plataforma.
            </p>
          </div>
        </div>
          
        <div className="container mx-aut py-4">
          <SavedPublicationsList />
        </div>
      </div>
      
    </RequireAuth>
  );
} 