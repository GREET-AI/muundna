'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getRoute } from '../utils/routes';
import GridBackground from './ui/GridBackground';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'BÜRODIENSTLEISTUNGEN',
    subtitle: 'Für Handwerksbetriebe',
    description:
      'Professionelle Telefonservice, Kommunikation und Organisation für Ihr Bauunternehmen',
    image: '/images/herobackgeneral2.png'
  },
  {
    id: 2,
    title: 'SOCIAL MEDIA & GOOGLE',
    subtitle: 'Online-Präsenz optimieren',
    description: 'Steigern Sie Ihre Sichtbarkeit mit professioneller Social Media Betreuung und Google Bewertungen',
    image: '/images/herobackgeneral3.png'
  },
  {
    id: 3,
    title: 'TERMINORGANISATION',
    subtitle: 'Effiziente Kundenbetreuung',
    description:
      'Organisieren Sie Kundentermine professionell und sparen Sie wertvolle Zeit',
    image: '/images/herobackgeneral4.png'
  },
  {
    id: 4,
    title: '10+ JAHRE ERFAHRUNG',
    subtitle: 'Im Bauwesen',
    description: 'Hoch- und Tiefbau, Straßenbau, Brückenbau, Sanierung - wir verstehen Ihr Geschäft',
    image: '/images/herobackgeneral5.png'
  },
  {
    id: 5,
    title: 'DEUTSCHLAND, SCHWEIZ, ÖSTERREICH',
    subtitle: 'Überregionale Betreuung',
    description: 'Wir betreuen Handwerksbetriebe und Bauunternehmen in ganz DACH',
    image: '/images/herobackgeneral6.png'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Images with Animation */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlideData.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={currentSlideData.image}
              alt={currentSlideData.title}
              fill
              className="object-cover"
              priority={currentSlide === 0}
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
            <GridBackground />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            {/* Title Box */}
            <div className="mb-4">
              <div className="inline-block bg-gray-800 bg-opacity-90 px-6 py-3 mb-2">
                <h2 className="text-white text-3xl font-bold uppercase tracking-wide">
                  {currentSlideData.title}
                </h2>
              </div>
              {currentSlideData.subtitle && (
                <div className="inline-block bg-gray-800 bg-opacity-90 px-6 py-3">
                  <h3 className="text-white text-2xl font-semibold">
                    {currentSlideData.subtitle}
                  </h3>
                </div>
              )}
            </div>

            {/* Description Box */}
            <div className="bg-[#cb530a] px-6 py-4 inline-block shadow-lg mb-6">
              <p className="text-white text-lg font-medium leading-relaxed">
                {currentSlideData.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={getRoute('Kontakt')}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#cb530a] text-white font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors text-lg"
              >
                Jetzt Anfragen
              </Link>
              <Link
                href={getRoute('Dienstleistungen')}
                className="inline-flex items-center justify-center px-8 py-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 font-semibold rounded-lg shadow-lg transition-all"
              >
                Mehr erfahren
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 text-white transition-all backdrop-blur-sm"
        aria-label="Vorheriges Bild"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 text-white transition-all backdrop-blur-sm"
        aria-label="Nächstes Bild"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 transition-all ${
              index === currentSlide
                ? 'w-8 bg-white'
                : 'w-2 bg-gray-600 hover:bg-gray-400'
            } rounded-full`}
            aria-label={`Zu Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Pause Button */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="absolute bottom-8 right-4 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 rounded p-2 text-white transition-all backdrop-blur-sm"
        aria-label={isPaused ? 'Fortsetzen' : 'Pausieren'}
      >
        {isPaused ? (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        )}
      </button>
    </div>
  );
}
