'use client';

import { useId } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getRoute } from '../utils/routes';

const HERO_BACKGROUND = '/images/Handwerker%20(2).png';

export interface JetonStyleHeroSectionProps {
  headline?: string;
  /** Zweite Zeile der Überschrift (z. B. „Unsere Expertise.“) */
  headlineLine2?: string;
  /** Dritte Zeile (Parallax: „finanzielle Freiheit.“ – font-bold) */
  headlineLine3?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  backgroundImageUrl?: string;
  /** Site-Logo (optional); wenn leer, wird kein Logo angezeigt */
  logoUrl?: string;
  /** Overlay über dem Hintergrundbild (z. B. #cb530a oder rgba) */
  overlayColor?: string;
  /** Farbe Haupt-Button (Hintergrund + Rahmen) */
  buttonPrimaryColor?: string;
  /** Farbe Sekundär-Button (Rahmen + Text) */
  buttonSecondaryColor?: string;
  /** Farbe Überschrift */
  headlineColor?: string;
  /** Schriftgröße: small | medium | large (Legacy) */
  headlineFontSize?: string;
  /** Schriftgröße in px – responsive (Desktop, Tablet, Mobil) */
  headlineFontSizeDesktop?: number;
  headlineFontSizeTablet?: number;
  headlineFontSizeMobile?: number;
  /** Schriftart: default | serif | sans */
  headlineFontFamily?: string;
  /** Parallax/ImmoSparplan-Style: grüner Gradient, Go Expert schwarz mit Shimmer */
  variant?: 'default' | 'parallax';
}

const DEFAULT_HEADLINE_LINE1 = 'Deine Immobilien.';
const DEFAULT_HEADLINE_LINE2 = 'Unsere Expertise.';
const DEFAULT_CTA = 'Jetzt Anfragen';
const DEFAULT_SECONDARY_CTA = 'Mehr erfahren';

/**
 * Hero im Stil von jeton.com / immosparplan-experts, in Jahnbau CI:
 * – Statisches Hintergrundbild (Handwerker 2)
 * – Orange-Overlay und Orbs in unseren Orangetönen
 * – Headline links unten, CTA-Buttons
 */
const OVERLAY_DEFAULT = '#cb530a';
const BTN_PRIMARY_DEFAULT = '#cb530a';
const BTN_SECONDARY_DEFAULT = 'rgba(255,255,255,0.9)';
const HEADLINE_COLOR_DEFAULT = '#ffffff';

export function JetonStyleHeroSection({
  headline,
  headlineLine2,
  headlineLine3,
  ctaText,
  ctaHref = getRoute('Quiz'),
  secondaryCtaText,
  secondaryCtaHref = getRoute('Dienstleistungen'),
  backgroundImageUrl,
  logoUrl,
  overlayColor,
  buttonPrimaryColor,
  buttonSecondaryColor,
  headlineColor,
  headlineFontSize,
  headlineFontSizeDesktop,
  headlineFontSizeTablet,
  headlineFontSizeMobile,
  headlineFontFamily,
  variant = 'default',
}: JetonStyleHeroSectionProps = {}) {
  const isParallax = variant === 'parallax';
  const line1 = headline ?? DEFAULT_HEADLINE_LINE1;
  const line2 = headlineLine2 ?? DEFAULT_HEADLINE_LINE2;
  const line3 = isParallax && headlineLine3 !== undefined && String(headlineLine3).trim() ? String(headlineLine3).trim() : null;
  const cta = ctaText ?? (isParallax ? 'Go Expert' : DEFAULT_CTA);
  const secondaryCta = secondaryCtaText ?? (isParallax ? 'Log in' : DEFAULT_SECONDARY_CTA);
  const bgSrc = (backgroundImageUrl && backgroundImageUrl.trim()) ? backgroundImageUrl.trim() : (isParallax ? '/images/slider2/1.png' : HERO_BACKGROUND);
  const overlay = (overlayColor && overlayColor.trim()) ? overlayColor.trim() : (isParallax ? '#60A917' : OVERLAY_DEFAULT);
  const btnPrimary = (buttonPrimaryColor && buttonPrimaryColor.trim()) ? buttonPrimaryColor.trim() : BTN_PRIMARY_DEFAULT;
  const btnSecondary = (buttonSecondaryColor && buttonSecondaryColor.trim()) ? buttonSecondaryColor.trim() : BTN_SECONDARY_DEFAULT;
  const titleColor = (headlineColor && headlineColor.trim()) ? headlineColor.trim() : (isParallax ? '#000000' : HEADLINE_COLOR_DEFAULT);
  const size = headlineFontSize === 'small' ? 'small' : headlineFontSize === 'large' ? 'large' : 'medium';
  const fontFamily = headlineFontFamily === 'serif' ? 'var(--font-serif, Georgia, serif)' : headlineFontFamily === 'sans' ? 'var(--font-sans, system-ui, sans-serif)' : 'inherit';
  const useResponsivePx = typeof headlineFontSizeDesktop === 'number' || typeof headlineFontSizeTablet === 'number' || typeof headlineFontSizeMobile === 'number';
  const desktopPx = typeof headlineFontSizeDesktop === 'number' ? headlineFontSizeDesktop : 48;
  const tabletPx = typeof headlineFontSizeTablet === 'number' ? headlineFontSizeTablet : 32;
  const mobilePx = typeof headlineFontSizeMobile === 'number' ? headlineFontSizeMobile : 20;

  const overlayStyle = isParallax
    ? { background: `linear-gradient(to bottom right, #C4D32A, #9BCB6B, #60A917)` }
    : { background: `linear-gradient(to bottom right, ${overlay}80, ${overlay}66, rgba(0,0,0,0.6))` };
  const titleSizeClass = size === 'small' ? 'text-[2rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem] 2xl:text-[4rem]' : size === 'large' ? 'text-[3rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] 2xl:text-[6.5rem]' : 'text-[2.5rem] md:text-[3rem] lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5.5rem]';
  const titleSizeClassLine2 = size === 'small' ? 'text-[1.1em] md:text-[2.5rem] lg:text-[3rem]' : size === 'large' ? 'text-[1.3em] md:text-[4rem] lg:text-[5rem]' : 'text-[1.2em] md:text-[3.25rem] lg:text-[4.25rem] xl:text-[4.75rem] 2xl:text-[5.75rem]';
  const headlineId = useId().replace(/:/g, '');

  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden md:min-h-screen">
      {useResponsivePx && (
        <style dangerouslySetInnerHTML={{ __html: `
          .hero-headline-${headlineId} { font-size: ${mobilePx}px !important; }
          @media (min-width: 768px) { .hero-headline-${headlineId} { font-size: ${tabletPx}px !important; } }
          @media (min-width: 1024px) { .hero-headline-${headlineId} { font-size: ${desktopPx}px !important; } }
          .hero-headline-line2-${headlineId} { font-size: ${Math.round(mobilePx * 0.85)}px !important; }
          @media (min-width: 768px) { .hero-headline-line2-${headlineId} { font-size: ${Math.round(tabletPx * 0.85)}px !important; } }
          @media (min-width: 1024px) { .hero-headline-line2-${headlineId} { font-size: ${Math.round(desktopPx * 0.85)}px !important; } }
        ` }} />
      )}
      <div className="absolute inset-0 z-0">
        {isParallax ? (
          <>
            <div className="absolute inset-0" style={overlayStyle} aria-hidden />
            <div className="absolute inset-0 opacity-10" aria-hidden>
              <Image src={bgSrc} alt="" fill className="object-cover object-center" priority unoptimized />
            </div>
          </>
        ) : (
          <>
            <Image src={bgSrc} alt="" fill className="object-cover object-center" priority unoptimized />
            <div className="absolute inset-0" style={overlayStyle} />
          </>
        )}
      </div>

      {/* Schwebende Orbs – dezenter, Theme-Farbe nutzen */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="absolute left-[15%] top-[20%] h-64 w-64 rounded-full bg-white/10 shadow-2xl blur-xl" />
        <div className="absolute right-[20%] top-[30%] h-48 w-48 rounded-full shadow-xl blur-lg" style={{ backgroundColor: `${overlay}26` }} />
        <div className="absolute bottom-[25%] left-[40%] h-56 w-56 rounded-full bg-white/8 shadow-2xl blur-xl" />
        <div className="absolute right-[10%] bottom-[20%] h-32 w-32 rounded-full shadow-lg blur-md" style={{ backgroundColor: `${overlay}1f` }} />
      </div>

      {/* Top-Bar: Logo links (nur wenn logoUrl gesetzt), Buttons rechts */}
      <header className="relative z-20 flex w-full items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-4 md:px-8 md:py-4 md:gap-4 lg:px-12 lg:py-5 xl:px-16">
        <div className="flex shrink-0 items-center min-w-0">
          {logoUrl?.trim() ? (
            <Link href="/" className="cursor-pointer" aria-label="Startseite">
              <Image
                src={logoUrl.trim()}
                alt="Logo"
                width={200}
                height={64}
                className="h-10 w-auto max-w-[120px] object-contain object-left drop-shadow-md sm:h-12 md:h-14 lg:h-16 xl:h-20"
                priority
                unoptimized
              />
            </Link>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <Link
            href={secondaryCtaHref || '#'}
            className="rounded-lg border-2 px-2.5 py-2 text-[11px] font-medium backdrop-blur-sm hover:bg-white/25 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs md:px-4 md:py-2.5 md:text-sm lg:px-5 lg:py-3 lg:text-base cursor-pointer transition-colors"
            style={isParallax ? { borderColor: 'rgba(0,0,0,0.5)', color: 'inherit', backgroundColor: 'rgba(255,255,255,0.15)' } : { borderColor: btnSecondary, color: btnSecondary, backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            {secondaryCta}
          </Link>
          <Link
            href={ctaHref}
            className={`rounded-lg border-2 px-2.5 py-2 text-[11px] font-semibold shadow-lg sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs md:px-4 md:py-2.5 md:text-sm lg:px-5 lg:py-3 lg:text-base cursor-pointer transition-colors ${isParallax ? 'group relative overflow-hidden border-black/50 bg-black hover:bg-gray-900' : 'hover:opacity-90'}`}
            style={isParallax ? { color: btnPrimary, borderColor: 'rgba(0,0,0,0.5)' } : { backgroundColor: btnPrimary, borderColor: btnPrimary, color: 'white' }}
          >
            {isParallax && <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" aria-hidden />}
            <span className="relative z-10">{cta}</span>
          </Link>
        </div>
      </header>

      {/* Hauptbereich: Headline + CTA – Parallax: 3 Zeilen, Zeile 1+2 font-medium, Zeile 3 font-bold */}
      <div className="relative z-10 flex flex-1 flex-col items-start justify-end px-4 pb-12 pt-2 sm:px-5 sm:pb-16 sm:pt-4 md:px-8 md:pb-20 md:-translate-y-8 lg:px-12 lg:pb-28 lg:-translate-y-12 xl:px-16 xl:pb-32 xl:-translate-y-[75px]">
        <div className="w-full max-w-full min-w-0">
          <h1
            className={`text-left drop-shadow-lg leading-[1.15] sm:leading-[1.2] md:leading-tight ${isParallax && line3 ? 'font-medium' : 'font-bold'} ${useResponsivePx ? `hero-headline-${headlineId}` : titleSizeClass}`}
            style={{ color: titleColor, fontFamily }}
          >
            {isParallax && line3 ? (
              <>
                <span className={`block font-medium sm:hidden ${useResponsivePx ? `hero-headline-${headlineId}` : ''}`} style={!useResponsivePx ? { fontSize: size === 'small' ? '1.5rem' : size === 'large' ? '2rem' : '1.75rem' } : undefined}>{line1}</span>
                <span className={`block font-medium -mt-0.5 sm:hidden ${useResponsivePx ? `hero-headline-line2-${headlineId}` : ''}`} style={!useResponsivePx ? { fontSize: size === 'small' ? '1.2rem' : size === 'large' ? '1.6rem' : '1.4rem' } : undefined}>{line2}</span>
                <span className={`block font-bold sm:hidden ${useResponsivePx ? `hero-headline-line2-${headlineId}` : ''}`} style={!useResponsivePx ? { fontSize: size === 'small' ? '1.2rem' : size === 'large' ? '1.6rem' : '1.4rem' } : undefined}>{line3}</span>
                <span className={`hidden sm:block font-medium ${useResponsivePx ? `hero-headline-${headlineId}` : titleSizeClass}`}>{line1}</span>
                <span className={`hidden sm:block font-medium -mt-0.5 ${useResponsivePx ? `hero-headline-line2-${headlineId}` : titleSizeClassLine2}`}>{line2}</span>
                <span className={`hidden sm:block font-bold -mt-0.5 ${useResponsivePx ? `hero-headline-line2-${headlineId}` : titleSizeClassLine2}`}>{line3}</span>
              </>
            ) : (
              <>
                <span className={`block sm:hidden ${useResponsivePx ? `hero-headline-${headlineId}` : ''}`} style={!useResponsivePx ? { fontSize: size === 'small' ? '1.5rem' : size === 'large' ? '2rem' : '1.75rem' } : undefined}>{line1}</span>
                <span className={`block -mt-0.5 sm:hidden ${useResponsivePx ? `hero-headline-line2-${headlineId}` : ''}`} style={!useResponsivePx ? { fontSize: size === 'small' ? '1.2rem' : size === 'large' ? '1.6rem' : '1.4rem' } : undefined}>{line2}</span>
                <span className={`hidden sm:block ${useResponsivePx ? `hero-headline-${headlineId}` : titleSizeClass}`}>{line1}</span>
                <span className={`hidden sm:block -mt-0.5 ${useResponsivePx ? `hero-headline-line2-${headlineId}` : titleSizeClassLine2}`}>{line2}</span>
              </>
            )}
          </h1>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:gap-3 sm:mt-6 md:mt-6 md:gap-4">
            <Link
              href={secondaryCtaHref || '#'}
              className="inline-flex items-center justify-center rounded-lg border-2 py-2.5 px-3.5 text-xs font-medium backdrop-blur-sm hover:bg-white/25 sm:rounded-xl sm:py-3 sm:px-4 sm:text-sm md:py-3 md:px-5 md:text-sm lg:px-6 lg:py-3.5 lg:text-base transition-colors cursor-pointer"
              style={isParallax ? { borderColor: 'rgba(0,0,0,0.5)', color: 'inherit', backgroundColor: 'rgba(255,255,255,0.1)' } : { borderColor: btnSecondary, color: btnSecondary, backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              {secondaryCta}
            </Link>
            <Link
              href={ctaHref}
              className={`inline-flex items-center justify-center rounded-lg border-2 py-2.5 px-3.5 text-xs font-semibold shadow-lg sm:rounded-xl sm:py-3 sm:px-4 sm:text-sm md:py-3 md:px-5 md:text-sm lg:px-6 lg:py-3.5 lg:text-base transition-colors cursor-pointer group ${isParallax ? 'relative overflow-hidden border-black/50 bg-black hover:bg-gray-900' : 'hover:opacity-90'}`}
              style={isParallax ? { color: btnPrimary, borderColor: 'rgba(0,0,0,0.5)' } : { backgroundColor: btnPrimary, borderColor: btnPrimary, color: 'white' }}
            >
              {isParallax && <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" aria-hidden />}
              <span className="relative z-10">{cta}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
