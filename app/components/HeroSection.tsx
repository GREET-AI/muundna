'use client';

import { ReactNode } from 'react';
import Image from 'next/image';

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
    <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage || "/images/herobackgeneral.png"}
          alt=""
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            {subtitle && (
              <div className="mb-4">
                <span className="inline-block bg-gray-800/90 dark:bg-gray-900/90 px-6 py-2 rounded text-white text-sm font-semibold uppercase tracking-wide">
                  {subtitle}
                </span>
              </div>
            )}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl leading-relaxed">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent" />
    </section>
  );
}

