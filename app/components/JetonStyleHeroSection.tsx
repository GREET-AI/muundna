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
    <section className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden md:min-h-screen">
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

      {/* Top-Bar: Logo links, Buttons rechts – mobil/tablet kompakter, weniger gedrückt */}
      <header className="relative z-20 flex w-full items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-4 md:px-8 md:py-4 md:gap-4 lg:px-12 lg:py-5 xl:px-16">
        <Link href="/" className="flex shrink-0 items-center min-w-0 cursor-pointer" aria-label="Muckenfuss & Nagel Startseite">
          <Image
            src="/logotransparent.png"
            alt="Muckenfuss & Nagel"
            width={200}
            height={64}
            className="h-10 w-auto max-w-[120px] object-contain object-left drop-shadow-md sm:h-12 md:h-14 lg:h-16 xl:h-20"
            priority
            unoptimized
          />
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <Link
            href={secondaryCtaHref}
            className="rounded-lg border-2 border-white/80 bg-white/10 px-2.5 py-2 text-[11px] font-medium text-white backdrop-blur-sm hover:bg-white/20 hover:border-white sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs md:px-4 md:py-2.5 md:text-sm lg:px-5 lg:py-3 lg:text-base cursor-pointer transition-colors"
          >
            {secondaryCta}
          </Link>
          <Link
            href={ctaHref}
            className="rounded-lg border-2 border-[#cb530a] bg-[#cb530a] px-2.5 py-2 text-[11px] font-semibold text-white shadow-lg hover:bg-[#a84308] hover:border-[#a84308] sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs md:px-4 md:py-2.5 md:text-sm lg:px-5 lg:py-3 lg:text-base cursor-pointer transition-colors"
          >
            {cta}
          </Link>
        </div>
      </header>

      {/* Hauptbereich: Headline + CTA – Tablet/Querformat: kleinere Schrift & Buttons, weniger gedrückt */}
      <div className="relative z-10 flex flex-1 flex-col items-start justify-end px-4 pb-12 pt-2 sm:px-5 sm:pb-16 sm:pt-4 md:px-8 md:pb-20 md:-translate-y-8 lg:px-12 lg:pb-28 lg:-translate-y-12 xl:px-16 xl:pb-32 xl:-translate-y-[75px]">
        <div className="w-full max-w-full min-w-0">
          <h1 className="text-white text-left font-bold drop-shadow-lg leading-[1.15] sm:leading-[1.2] md:leading-tight">
            {/* Mobile: kompakt, Zeilenumbruch nach jedem Punkt */}
            <span className="block text-[1.75rem] sm:text-[2.25rem] sm:hidden">Ihr Büro.</span>
            <span className="block text-[1.75rem] sm:text-[2.25rem] sm:hidden">Ihr Geschäft.</span>
            <span className="block text-[1.4rem] -mt-0.5 sm:text-[1.8rem] sm:hidden">Unsere Expertise.</span>
            {/* Tablet (md) + Desktop: abgestufte Größen – Tablet nicht zu groß */}
            <span className="hidden sm:block text-[2.5rem] md:text-[3rem] lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5.5rem]">{line1}</span>
            <span className="hidden sm:block text-[1.2em] -mt-0.5 md:text-[3.25rem] lg:text-[4.25rem] xl:text-[4.75rem] 2xl:text-[5.75rem]">{line2}</span>
          </h1>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:gap-3 sm:mt-6 md:mt-6 md:gap-4">
            <Link
              href={secondaryCtaHref}
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/80 bg-white/10 py-2.5 px-3.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/20 hover:border-white sm:rounded-xl sm:py-3 sm:px-4 sm:text-sm md:py-3 md:px-5 md:text-sm lg:px-6 lg:py-3.5 lg:text-base transition-colors cursor-pointer"
            >
              {secondaryCta}
            </Link>
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-lg border-2 border-[#cb530a] bg-[#cb530a] py-2.5 px-3.5 text-xs font-semibold text-white shadow-lg hover:bg-[#a84308] hover:border-[#a84308] sm:rounded-xl sm:py-3 sm:px-4 sm:text-sm md:py-3 md:px-5 md:text-sm lg:px-6 lg:py-3.5 lg:text-base transition-colors cursor-pointer"
            >
              {cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
