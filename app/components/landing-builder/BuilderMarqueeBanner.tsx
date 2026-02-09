'use client';

/** Nur für Builder / Produkt-Landingpages. Hauptseite nutzt app/components/MarqueeBanner. */
import { MARQUEE_QUOTES_PARALLAX } from '@/types/landing-section';

export function useMarqueeQuotesParallax() {
  return MARQUEE_QUOTES_PARALLAX;
}

export default function BuilderMarqueeBanner({
  customText,
  customQuotes,
  backgroundColor,
  textColor,
}: {
  customText?: string;
  customQuotes?: string[];
  backgroundColor?: string;
  textColor?: string;
} = {}) {
  const items =
    Array.isArray(customQuotes) && customQuotes.length > 0
      ? customQuotes
      : customText?.trim()
        ? [customText.trim()]
        : MARQUEE_QUOTES_PARALLAX;
  const bg = backgroundColor?.trim() || '#31214f';
  const color = textColor?.trim() || '#ffffff';
  return (
    <div className="w-full py-4 overflow-hidden border-y border-white/20" style={{ backgroundColor: bg }}>
      <div className="flex w-max items-center whitespace-nowrap text-sm md:text-base font-normal uppercase tracking-wide animate-marquee-right [text-shadow:0_0_8px_rgba(255,255,255,0.4)]" style={{ color: color }}>
        {items.map((quote, index) => (
          <span key={index} className="mx-8 shrink-0">{quote}</span>
        ))}
        {items.map((quote, index) => (
          <span key={`dup-${index}`} className="mx-8 shrink-0">{quote}</span>
        ))}
      </div>
    </div>
  );
}
