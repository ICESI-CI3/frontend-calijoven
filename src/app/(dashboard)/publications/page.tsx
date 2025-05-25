import { FC } from 'react';
import PublicationPreview from '@/modules/publications/components/PublicationPreview';
import { Publication } from '@/types/publication';
import { API_ROUTES } from '@/lib/constants/api';

type PublicationsPageProps = {
  publications: Publication[];
};

const PublicationsPage: FC<PublicationsPageProps> = ({ publications }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Publicaciones Recientes</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {publications.map((pub) => (
          <PublicationPreview key={pub.id} publication={pub} />
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}${API_ROUTES.PUBLICATIONS.BASE}`);

    if (!res.ok) {
      console.error(`Error fetching publications: ${res.status} ${res.statusText}`);
      return { props: { publications: [] } };
    }

    const publications: Publication[] = await res.json();

    return {
      props: {
        publications,
      },
    };
  } catch (error) {
    console.error('Failed to fetch publications:', error);
    return {
      props: {
        publications: [],
      },
    };
  }
}

export default PublicationsPage;
