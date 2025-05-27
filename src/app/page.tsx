'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Carousel } from '@/components/Carousel';
import { slides } from '@/lib/constants/carousel-slides';
import PublicationPreview from '@/modules/publications/components/PublicationPreview';
import { PublicationService } from '@/modules/publications/services/publication.service';
import { Publication } from '@/types/publication';
import { useEffect, useState } from 'react';
import { getBanners, Banner as BannerType } from '@/modules/banners/services/banner.service';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ROUTES } from '@/lib/constants/routes';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background pt-16">
        <Carousel slides={slides} />

        {/* Últimas publicaciones en fila */}
        <section className="container mx-auto px-4 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-left text-xl font-bold text-foreground">
              Noticias, Eventos y Ofertas
            </h2>
            <Link href={ROUTES.PUBLICATIONS.LIST}>
              <Button variant="outline" size="sm">
                Ver todas las publicaciones
              </Button>
            </Link>
          </div>
          <LatestPublicationsRow />
        </section>

        {/* Banner */}
        <section className="container mx-auto flex justify-center px-4 py-8">
          <div className="w-full max-w-4xl">
            <BannerCarouselSection />
          </div>
        </section>
      </main>
    </>
  );
}

function LatestPublicationsRow() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const data = await PublicationService.getPublications({}, 1, 3);
        setPublications(data.data || []);
      } catch {
        setError('Error al cargar las publicaciones');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublications();
  }, []);

  if (isLoading) return <div className="text-center text-muted-foreground">Cargando...</div>;
  if (error) return <div className="text-center text-destructive">{error}</div>;
  if (publications.length === 0)
    return (
      <div className="text-center text-muted-foreground">No hay publicaciones disponibles</div>
    );
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {publications.map((publication) => (
        <PublicationPreview key={publication.id} publication={publication} />
      ))}
    </div>
  );
}

function BannerCarouselSection() {
  const [slides, setSlides] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        setSlides(data);
      } catch {
        setError('Error al cargar los banners');
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading)
    return (
      <div className="flex h-[400px] items-center justify-center bg-muted text-muted-foreground">
        Cargando...
      </div>
    );
  if (error)
    return (
      <div className="flex h-[400px] items-center justify-center bg-destructive/10 text-destructive">
        {error}
      </div>
    );
  if (slides.length === 0) return null;

  return (
    <Carousel
      slides={slides.map((b) => ({
        image: b.imageUrl,
        title: b.title,
        link: b.link,
      }))}
      showArrows
      showDots
      interval={6000}
      className="rounded-xl"
      renderContent={(slide) => (
        <a
          href={slide.link}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block h-full w-full"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full rounded-xl object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-1/2 items-end rounded-b-xl bg-gradient-to-t from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))]">
            <h2 className="p-6 pb-8 text-2xl font-bold text-[hsl(var(--text-white))] drop-shadow-lg">
              {slide.title}
            </h2>
          </div>
        </a>
      )}
    />
  );
}
