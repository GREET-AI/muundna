'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  children?: ReactNode;
}

export default function HeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  children,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage || "/images/Büro.png"}
          alt=""
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Home-Button oben links */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center justify-center w-12 h-12 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Zur Startseite"
      >
        <Home className="w-7 h-7" strokeWidth={2} />
      </Link>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            {subtitle && (
              <div className="mb-4">
                <span className="inline-block bg-gray-800/90 px-6 py-2 rounded text-white text-sm font-semibold uppercase tracking-wide">
                  {subtitle}
                </span>
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight break-words">
              {title}
            </h1>
            {description && (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl leading-relaxed break-words">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

