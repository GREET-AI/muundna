'use client';

import { useId, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getRoute } from '../utils/routes';

/** Pan-Distanz in px (100vw, 50vw, 0) für scroll-getriebenen Horizontal-Effekt. */
function useHorizontalPanPx() {
  const [panPx, setPanPx] = useState(0);
  useEffect(() => {
    const update = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      if (w >= 1024) setPanPx(w);
      else if (w >= 768) setPanPx(w * 0.5);
      else setPanPx(0);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return panPx;
}

/** Gleicher Default wie Parallax-Hero (slider2/1.png). */
const HERO_BACKGROUND = '/images/slider2/1.png';

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
  /** Parallax/ImmoSparplan-Style: grüner Gradient, Go Expert schwarz mit Shimmer */
  variant?: 'default' | 'parallax';
  /** Nur bei variant=parallax: Scroll nach unten bewegt den Hintergrund nach links (wirkt wie „nach rechts scrollen“). Desktop 100vw, Tablet 50vw, Mobile aus. */
  scrollDrivenHorizontalPan?: boolean;
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
  variant = 'default',
  scrollDrivenHorizontalPan = false,
}: JetonStyleHeroSectionProps = {}) {
  const isParallax = variant === 'parallax';
  const sectionRef = useRef<HTMLElement>(null);
  const panPx = useHorizontalPanPx();
  const useHorizontalPan = isParallax && scrollDrivenHorizontalPan && panPx > 0;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgX = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [0, 0, useHorizontalPan && panPx > 0 ? -panPx : 0, useHorizontalPan && panPx > 0 ? -panPx : 0]
  );
  const line1 = headline ?? DEFAULT_HEADLINE_LINE1;
  const line2 = headlineLine2 ?? DEFAULT_HEADLINE_LINE2;
  const line3 = isParallax && headlineLine3 !== undefined && String(headlineLine3).trim() ? String(headlineLine3).trim() : null;
  const cta = ctaText ?? (isParallax ? 'Go Expert' : DEFAULT_CTA);
  const secondaryCta = secondaryCtaText ?? (isParallax ? 'Log in' : DEFAULT_SECONDARY_CTA);
  const bgSrc = (backgroundImageUrl && backgroundImageUrl.trim()) ? backgroundImageUrl.trim() : (isParallax ? '/images/slider2/1.png' : HERO_BACKGROUND);
  const overlay = (overlayColor && overlayColor.trim()) ? overlayColor.trim() : (isParallax ? '#60A917' : OVERLAY_DEFAULT);
  const btnPrimary = (buttonPrimaryColor && buttonPrimaryColor.trim()) ? buttonPrimaryColor.trim() : BTN_PRIMARY_DEFAULT;
  const btnSecondary = (buttonSecondaryColor && buttonSecondaryColor.trim()) ? buttonSecondaryColor.trim() : BTN_SECONDARY_DEFAULT;

  const overlayStyle = isParallax
    ? { background: `linear-gradient(to bottom right, #C4D32A, #9BCB6B, #60A917)` }
    : { background: `linear-gradient(to bottom right, ${overlay}80, ${overlay}66, rgba(0,0,0,0.6))` };
  // Basic: Tablet/Desktop = Original-Größen; nur Mobile nutzt kleinere Werte (sm:hidden-Spans)
  const basicTitleSizeClass = 'text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3.25rem] xl:text-[4rem] 2xl:text-[5rem]';
  const basicTitleSizeClassLine2 = 'text-[1.4rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[2.75rem] xl:text-[3.25rem] 2xl:text-[4rem]';
  // Parallax: etwas größer, gleiche Logik
  const titleSizeClass = isParallax ? 'text-[2.5rem] md:text-[3rem] lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5.5rem]' : basicTitleSizeClass;
  const titleSizeClassLine2 = isParallax ? 'text-[1.2em] md:text-[3.25rem] lg:text-[4.25rem] xl:text-[4.75rem] 2xl:text-[5.75rem]' : basicTitleSizeClassLine2;

  const renderHeadlineHtml = (html: string) => {
    if (!html || !html.trim()) return null;
    if (/<[a-z][\s\S]*>/i.test(html)) {
      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    }
    return <>{html}</>;
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full flex-col overflow-hidden md:min-h-screen"
      style={{ minHeight: useHorizontalPan ? '250vh' : '100dvh' }}
    >
      {useHorizontalPan ? (
        <div className="sticky top-0 left-0 right-0 z-0 h-screen w-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full min-h-screen"
            style={{ width: '200vw', x: bgX }}
            aria-hidden
          >
            <div className="absolute inset-0 w-full h-full" style={{ width: '200vw' }}>
              <div className="absolute inset-0" style={overlayStyle} />
              <div
                className="absolute inset-0 opacity-10 bg-cover bg-left"
                style={{
                  backgroundImage: `url(${bgSrc})`,
                  backgroundSize: '200vw 100%',
                  backgroundPosition: '0 0',
                }}
              />
            </div>
          </motion.div>
        </div>
      ) : (
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
      )}

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
              className={`inline-flex items-center justify-center rounded-lg border-2 py-2 px-2.5 text-[10px] font-semibold shadow-lg sm:rounded-xl sm:py-3 sm:px-4 sm:text-xs md:py-2.5 md:px-5 md:text-sm lg:px-5 lg:py-3 lg:text-base transition-colors cursor-pointer shrink-0 group ${isParallax ? 'relative overflow-hidden border-black/50 bg-black hover:bg-gray-900' : 'hover:opacity-90'}`}
              style={isParallax ? { color: btnPrimary, borderColor: 'rgba(0,0,0,0.5)' } : { backgroundColor: btnPrimary, borderColor: btnPrimary, color: 'white' }}
            >
              {isParallax && <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" aria-hidden />}
              <span className="relative z-10">{cta}</span>
            </Link>
        </div>
      </header>

      {/* Hauptbereich: Headline + CTA – WYSIWYG-HTML pro Zeile; Parallax: 3 Zeilen, Zeile 1+2 font-medium, Zeile 3 font-bold */}
      <div className="relative z-10 flex flex-1 flex-col items-start justify-end pl-2 pr-4 pb-2 pt-2 sm:pl-2.5 sm:pr-5 sm:pb-2.5 sm:pt-4 md:pl-4 md:pr-8 md:pb-4 md:-translate-y-8 lg:pl-6 lg:pr-12 lg:pb-6 lg:-translate-y-12 xl:pl-8 xl:pr-16 xl:pb-8 xl:-translate-y-[75px]">
        <div className="w-full max-w-full min-w-0">
          <h1
            className={`text-left drop-shadow-lg leading-[1.15] sm:leading-[1.2] md:leading-tight break-words ${isParallax && line3 ? 'font-medium' : 'font-bold'} ${titleSizeClass}`}
            style={{ color: isParallax ? '#000000' : HEADLINE_COLOR_DEFAULT }}
          >
            {isParallax && line3 ? (
              <>
                <span className="block font-medium sm:hidden text-[1.15rem] break-words">{renderHeadlineHtml(line1)}</span>
                <span className="block font-medium -mt-0.5 sm:hidden text-[1rem] break-words">{renderHeadlineHtml(line2)}</span>
                <span className="block font-bold sm:hidden text-[1rem] break-words">{renderHeadlineHtml(line3)}</span>
                <span className={`hidden sm:block font-medium ${titleSizeClass}`}>{renderHeadlineHtml(line1)}</span>
                <span className={`hidden sm:block font-medium -mt-0.5 ${titleSizeClassLine2}`}>{renderHeadlineHtml(line2)}</span>
                <span className={`hidden sm:block font-bold -mt-0.5 ${titleSizeClassLine2}`}>{renderHeadlineHtml(line3)}</span>
              </>
            ) : (
              <>
                {/* Basic: kleinere Schrift nur auf Mobil (< 768px); ab md = normale Größe */}
                <span className="block md:hidden text-[0.6rem] leading-tight break-words">{renderHeadlineHtml(line1)}</span>
                <span className="block -mt-0.5 md:hidden text-[0.5rem] leading-tight break-words">{renderHeadlineHtml(line2)}</span>
                <span className={`hidden md:block ${titleSizeClass}`}>{renderHeadlineHtml(line1)}</span>
                <span className={`hidden md:block -mt-0.5 ${titleSizeClassLine2}`}>{renderHeadlineHtml(line2)}</span>
              </>
            )}
          </h1>
          <div className="mt-4 flex flex-row flex-nowrap items-center gap-2 sm:gap-3 sm:mt-6 md:mt-6 md:gap-4">
            <Link
              href={secondaryCtaHref || '#'}
              className="inline-flex items-center justify-center rounded-lg border-2 py-2 px-2.5 text-[10px] font-medium backdrop-blur-sm hover:bg-white/25 sm:rounded-xl sm:py-3 sm:px-4 sm:text-sm md:py-3 md:px-5 md:text-sm lg:px-6 lg:py-3.5 lg:text-base transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              style={isParallax ? { borderColor: 'rgba(0,0,0,0.5)', color: 'inherit', backgroundColor: 'rgba(255,255,255,0.1)' } : { borderColor: btnSecondary, color: btnSecondary, backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              {secondaryCta}
            </Link>
            <Link
              href={ctaHref}
              className={`inline-flex items-center justify-center rounded-lg border-2 py-2 px-2.5 text-[10px] font-semibold shadow-lg sm:rounded-xl sm:py-3 sm:px-4 sm:text-sm md:py-3 md:px-5 md:text-sm lg:px-6 lg:py-3.5 lg:text-base transition-colors cursor-pointer shrink-0 whitespace-nowrap group ${isParallax ? 'relative overflow-hidden border-black/50 bg-black hover:bg-gray-900' : 'hover:opacity-90'}`}
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
