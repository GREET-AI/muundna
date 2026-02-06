'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getRoute } from '../../utils/routes';
import { Home } from 'lucide-react';

export interface HeroSlide {
  headline: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
  linkText?: string;
  secondaryHref?: string;
  secondaryText?: string;
}

interface PageHeroSliderProps {
  slides: HeroSlide[];
}

export default function PageHeroSlider({ slides }: PageHeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <section
      className="relative h-screen min-h-screen w-full overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.headline}
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Home-Button oben links */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center justify-center w-12 h-12 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Zur Startseite"
      >
        <Home className="w-7 h-7" strokeWidth={2} />
      </Link>

      {/* Content Overlay – gleicher Stil wie Main-Page Hero */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">
          <div className="max-w-2xl w-full pb-24 sm:pb-8">
            {/* Headline + Sub-Headline (Sub-Headline immer unter der Headline) */}
            <div className="mb-4 mt-8 sm:mt-0 flex flex-col gap-2 max-w-full">
              <div className="inline-block w-fit rounded-lg bg-gray-800 bg-opacity-90 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wide break-words">
                  {slide.headline}
                </h1>
              </div>
              <div className="inline-block w-fit rounded-lg bg-gray-800 bg-opacity-90 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                <h2 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold break-words">
                  {slide.subtitle}
                </h2>
              </div>
            </div>

            {/* Description (orange Box) */}
            <div className="rounded-lg bg-[#cb530a] px-3 sm:px-4 md:px-6 py-3 sm:py-4 inline-block shadow-lg mb-6 max-w-full">
              <p className="text-white text-sm sm:text-base md:text-lg font-medium leading-relaxed break-words">
                {slide.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={slide.href}
                className="inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-[#cb530a] text-white text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors whitespace-nowrap"
              >
                {slide.linkText ?? 'Mehr erfahren'}
              </Link>
              <Link
                href={slide.secondaryHref ?? getRoute('Quiz')}
                className="inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-lg transition-all whitespace-nowrap"
              >
                {slide.secondaryText ?? 'Jetzt Anfragen'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
        aria-label="Vorheriges Bild"
      >
        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
        aria-label="Nächstes Bild"
      >
        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? 'w-8 bg-[#cb530a]' : 'w-2 bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Zu Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
