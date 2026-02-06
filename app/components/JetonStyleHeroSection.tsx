'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getRoute } from '../utils/routes';

const HERO_BACKGROUND = '/images/Handwerker%20(2).png';

export interface JetonStyleHeroSectionProps {
  headline?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

const DEFAULT_HEADLINE_LINE1 = 'Ihr Büro. Ihr Geschäft.';
const DEFAULT_HEADLINE_LINE2 = 'Unsere Expertise.';
const DEFAULT_CTA = 'Jetzt Anfragen';
const DEFAULT_SECONDARY_CTA = 'Mehr erfahren';

/**
 * Hero im Stil von jeton.com / immosparplan-experts, in Jahnbau CI:
 * – Statisches Hintergrundbild (Handwerker 2)
 * – Orange-Overlay und Orbs in unseren Orangetönen
 * – Headline links unten, CTA-Buttons
 */
export function JetonStyleHeroSection({
  headline,
  ctaText,
  ctaHref = getRoute('Quiz'),
  secondaryCtaText,
  secondaryCtaHref = getRoute('Dienstleistungen'),
}: JetonStyleHeroSectionProps = {}) {
  const line1 = headline ?? DEFAULT_HEADLINE_LINE1;
  const line2 = DEFAULT_HEADLINE_LINE2;
  const cta = ctaText ?? DEFAULT_CTA;
  const secondaryCta = secondaryCtaText ?? DEFAULT_SECONDARY_CTA;

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
      {/* Ebene 1 (z-0): Statisches Hintergrundbild Handwerker (2) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_BACKGROUND}
          alt=""
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#cb530a]/50 via-[#a84308]/40 to-black/60" />
      </div>

      {/* Schwebende Orbs – dezenter, damit Bilder besser durchscheinen */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="absolute left-[15%] top-[20%] h-64 w-64 rounded-full bg-white/10 shadow-2xl blur-xl" />
        <div className="absolute right-[20%] top-[30%] h-48 w-48 rounded-full bg-[#cb530a]/15 shadow-xl blur-lg" />
        <div className="absolute bottom-[25%] left-[40%] h-56 w-56 rounded-full bg-white/8 shadow-2xl blur-xl" />
        <div className="absolute right-[10%] bottom-[20%] h-32 w-32 rounded-full bg-[#cb530a]/12 shadow-lg blur-md" />
      </div>

      {/* Top-Bar: Logo links, Buttons rechts – mobil schmaler, höher, kleinere Schrift */}
      <header className="relative z-20 flex w-full items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-5 md:px-12 md:gap-4 lg:px-16">
        <Link href="/" className="flex shrink-0 items-center min-w-0 cursor-pointer" aria-label="Muckenfuss & Nagel Startseite">
          <Image
            src="/logotransparent.png"
            alt="Muckenfuss & Nagel"
            width={200}
            height={64}
            className="h-12 w-auto max-w-[140px] object-contain object-left drop-shadow-md sm:h-16 sm:max-w-none md:h-20"
            priority
            unoptimized
          />
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Link
            href={secondaryCtaHref}
            className="rounded-lg border-2 border-white/80 bg-white/10 px-2 py-3 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/20 hover:border-white sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm md:px-5 md:py-3 md:text-base cursor-pointer transition-colors"
          >
            {secondaryCta}
          </Link>
          <Link
            href={ctaHref}
            className="rounded-lg border-2 border-[#cb530a] bg-[#cb530a] px-2 py-3 text-xs font-semibold text-white shadow-lg hover:bg-[#a84308] hover:border-[#a84308] sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm md:px-5 md:py-3 md:text-base cursor-pointer transition-colors"
          >
            {cta}
          </Link>
        </div>
      </header>

      {/* Hauptbereich: Headline + CTA-Buttons */}
      <div className="relative z-10 flex flex-1 flex-col items-start justify-end px-4 pb-20 pt-4 sm:px-6 sm:pb-24 md:px-12 md:pb-28 lg:px-16 lg:pb-32 -translate-y-[75px]">
        <div className="w-full max-w-full min-w-0">
          <h1 className="text-[2.7rem] leading-[1.2] sm:leading-none text-white sm:text-[3.6rem] md:text-[4.5rem] lg:text-[5.4rem] xl:text-[5.4rem] 2xl:text-[7.2rem] text-left font-bold drop-shadow-lg">
            {/* Mobile: Zeilenumbruch nach jedem Punkt */}
            <span className="block sm:hidden">Ihr Büro.</span>
            <span className="block sm:hidden">Ihr Geschäft.</span>
            <span className="block sm:hidden text-[0.9em] -mt-1">Unsere Expertise.</span>
            {/* Desktop: zwei Zeilen */}
            <span className="hidden sm:block">{line1}</span>
            <span className="hidden sm:block text-[1.26em] -mt-1">{line2}</span>
          </h1>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href={secondaryCtaHref}
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/80 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 hover:border-white sm:px-6 sm:py-3.5 sm:text-base md:px-8 md:py-4 transition-colors cursor-pointer"
            >
              {secondaryCta}
            </Link>
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-lg border-2 border-[#cb530a] bg-[#cb530a] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#a84308] hover:border-[#a84308] sm:px-6 sm:py-3.5 sm:text-base md:px-8 md:py-4 transition-colors cursor-pointer"
            >
              {cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
