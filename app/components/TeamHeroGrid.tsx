'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getRoute } from '../utils/routes';
import { Home } from 'lucide-react';

export default function TeamHeroGrid() {
  return (
    <section className="relative h-screen min-h-screen w-full overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        <Image
          src="/images/Büro.png"
          alt="Büro Muckenfuss & Nagel"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-black/40" />
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
            {/* Headline */}
            <div className="mb-4 mt-8 sm:mt-0">
              <div className="inline-block rounded-lg bg-gray-800 bg-opacity-90 px-3 sm:px-4 md:px-6 py-2 sm:py-3 mb-2 max-w-full">
                <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wide break-words">
                  ÜBER MUCKENFUSS & NAGEL
                </h1>
              </div>
              <div className="inline-block rounded-lg bg-gray-800 bg-opacity-90 px-3 sm:px-4 md:px-6 py-2 sm:py-3 max-w-full">
                <h2 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold break-words">
                  10+ Jahre Erfahrung im Bauwesen
                </h2>
              </div>
            </div>

            {/* Description (orange Box) */}
            <div className="rounded-lg bg-[#cb530a] px-3 sm:px-4 md:px-6 py-3 sm:py-4 inline-block shadow-lg mb-6 max-w-full">
              <p className="text-white text-sm sm:text-base md:text-lg font-medium leading-relaxed break-words">
                Professionelle Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen – von Telefonservice über Social Media bis Webdesign. Unser Team und unsere Arbeitsumgebung – hier entstehen Ihre Bürolösungen.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={getRoute('Quiz')}
                className="inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-[#cb530a] text-white text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors whitespace-nowrap"
              >
                Jetzt Anfragen
              </Link>
              <Link
                href={getRoute('Dienstleistungen')}
                className="inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-lg transition-all whitespace-nowrap"
              >
                Mehr erfahren
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
