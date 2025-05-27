'use client';

import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import { Transition } from '@headlessui/react';

export type CarouselSlide = {
  image: string;
  title: string;
  text: string;
};

interface CarouselProps {
  slides: CarouselSlide[];
  interval?: number;
}

export function Carousel({ slides, interval = 6000 }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  // Auto-advance
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearTimeout(timer);
  }, [current, slides.length, interval]);

  return (
    <div className="relative flex min-h-[340px] w-full max-w-none items-stretch md:min-h-[420px] lg:min-h-[500px]">
      {slides.map((slide, idx) => (
        <Transition
          key={slide.image}
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
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="h-full w-full object-cover opacity-100"
              priority={idx === 0}
              sizes="100vw"
            />
            {/* Overlay oscuro para legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-start justify-center px-4 py-8 md:px-16 md:py-0">
              <h1 className="mb-4 flex items-center gap-2 text-3xl font-extrabold drop-shadow-xl md:text-5xl lg:text-6xl">
                <span className="block text-[hsl(var(--primary-foreground))] drop-shadow-xl">
                  Bienvenidos a
                </span>
                <span className="ml-2 block text-[hsl(var(--secondary))] drop-shadow-xl">
                  {slide.title}
                </span>
              </h1>
              <p className="mb-6 max-w-2xl text-base text-[hsl(var(--primary-foreground))] drop-shadow-xl md:text-xl">
                {slide.text}
              </p>
            </div>
          </div>
        </Transition>
      ))}
      {/* Dots */}
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
    </div>
  );
}
