'use client';

import { Fragment, useEffect, useState, ReactNode } from 'react';
import Image from 'next/image';
import { Transition } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export type CarouselSlide = {
  image: string;
  title?: string;
  text?: string;
  link?: string;
  [key: string]: unknown;
};

export type CarouselProps = {
  slides: CarouselSlide[];
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  renderContent?: (slide: CarouselSlide) => ReactNode;
};

export function Carousel({
  slides,
  interval = 6000,
  showArrows = false,
  showDots = true,
  className = '',
  renderContent,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearTimeout(timer);
  }, [current, slides.length, interval]);

  const goToPrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  const goToNext = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className={`relative flex min-h-[340px] w-full max-w-none items-stretch md:min-h-[420px] lg:min-h-[500px] ${className}`}
    >
      {slides.map((slide, idx) => (
        <Transition
          key={slide.image + idx}
          as={Fragment}
          show={idx === current}
          enter="transition-opacity duration-600"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-600"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 h-full w-full">
            {renderContent ? (
              renderContent(slide)
            ) : (
              <>
                {slide.link ? (
                  <a
                    href={slide.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full w-full"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title || ''}
                      fill
                      className="h-full w-full rounded-xl object-cover opacity-100"
                      priority={idx === 0}
                      sizes="100vw"
                    />
                  </a>
                ) : (
                  <Image
                    src={slide.image}
                    alt={slide.title || ''}
                    fill
                    className="h-full w-full rounded-xl object-cover opacity-100"
                    priority={idx === 0}
                    sizes="100vw"
                  />
                )}
                {/* Overlay oscuro para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />
                {(slide.title || slide.text) && (
                  <div className="absolute inset-0 flex flex-col items-start justify-center px-4 py-8 md:px-16 md:py-0">
                    {slide.title && (
                      <h1 className="mb-4 flex items-center gap-2 text-3xl font-extrabold drop-shadow-xl md:text-5xl lg:text-6xl">
                        <span className="block text-[hsl(var(--primary-foreground))] drop-shadow-xl">
                          {slide.title}
                        </span>
                      </h1>
                    )}
                    {slide.text && (
                      <p className="mb-6 max-w-2xl text-base text-[hsl(var(--primary-foreground))] drop-shadow-xl md:text-xl">
                        {slide.text}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </Transition>
      ))}
      {/* Flechas de navegación */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white shadow hover:bg-black/80 focus:outline-none"
            aria-label="Anterior"
            type="button"
          >
            <ChevronLeftIcon className="h-7 w-7" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white shadow hover:bg-black/80 focus:outline-none"
            aria-label="Siguiente"
            type="button"
          >
            <ChevronRightIcon className="h-7 w-7" />
          </button>
        </>
      )}
      {/* Dots */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`h-3 w-3 rounded-full border border-border transition-all focus:outline-none ${idx === current ? 'bg-primary' : 'bg-muted'}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
