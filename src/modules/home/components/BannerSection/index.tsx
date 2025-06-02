'use client';

import { useEffect, useState } from 'react';
import { getBanners, Banner as BannerType } from '@/modules/banners/services/banner.service';
import { Carousel } from '@/components/Carousel';
import { Spinner } from '@/components/Spinner';

export function BannerSection() {
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
        <Spinner data-testid="spinner" />
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
    <section className="container mx-auto flex justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
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
      </div>
    </section>
  );
}
