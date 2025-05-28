'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { PublicationsList } from '@/modules/publications/components/PublicationsList';
import { PublicationsHeader } from '@/modules/publications/components/PublicationsHeader';

export default function PublicationsPage() {
  const [activeTab, setActiveTab] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleEdit = (publication: any) => {
    router.push(`/publicaciones/${publication.id}/editar`);
  };

  const handleCreateNew = () => {
    router.push('/publicaciones/crear');
  };

  const handleReadMore = (id: string) => {
    router.push(`/publicaciones/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PublicationsHeader isAuthenticated={!!user} />
      
      <PublicationsList
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onEdit={handleEdit}
        onCreateNew={handleCreateNew}
        onReadMore={handleReadMore}
      />
    </div>
  );
}
