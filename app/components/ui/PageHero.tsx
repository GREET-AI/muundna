'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Home } from 'lucide-react';

export interface PageHeroProps {
  image: string;
  imageAlt: string;
  headline: string;
  subtitle: string;
  description: string;
  primaryHref: string;
  primaryText: string;
  secondaryHref: string;
  secondaryText: string;
}

export default function PageHero({
  image,
  imageAlt,
  headline,
  subtitle,
  description,
  primaryHref,
  primaryText,
  secondaryHref,
  secondaryText,
}: PageHeroProps) {
  return (
    <section className="relative h-screen min-h-screen w-full overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={imageAlt}
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

      <div className="absolute inset-0 z-10 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">
          <div className="max-w-2xl w-full pb-24 sm:pb-8">
            {/* Headline + Sub-Headline (Sub-Headline immer unter der Headline) */}
            <div className="mb-4 mt-8 sm:mt-0 flex flex-col gap-2 max-w-full">
              <div className="inline-block w-fit rounded-lg bg-gray-800 bg-opacity-90 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wide break-words">
                  {headline}
                </h1>
              </div>
              <div className="inline-block w-fit rounded-lg bg-gray-800 bg-opacity-90 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                <h2 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold break-words">
                  {subtitle}
                </h2>
              </div>
            </div>

            <div className="rounded-lg bg-[#cb530a] px-3 sm:px-4 md:px-6 py-3 sm:py-4 inline-block shadow-lg mb-6 max-w-full">
              <p className="text-white text-sm sm:text-base md:text-lg font-medium leading-relaxed break-words">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={primaryHref}
                className="inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-[#cb530a] text-white text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors whitespace-nowrap"
              >
                {primaryText}
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-lg transition-all whitespace-nowrap"
              >
                {secondaryText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
