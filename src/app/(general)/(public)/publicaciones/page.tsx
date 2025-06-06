'use client';

import { PublicationsHeader } from '@/modules/publications/components/PublicationsHeader';
import { PublicationsList } from '@/modules/publications/components/PublicationsList';
import { Publication } from '@/types/publication';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PublicationsPage() {
  const [activeTab, setActiveTab] = useState('');
  const router = useRouter();

  const handleEdit = (publication: Publication) => {
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
      <PublicationsHeader />
      
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
