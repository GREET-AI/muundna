'use client';

/** Nur für Builder / Produkt-Landingpages. Hauptseite nutzt app/components/ExpertiseCTABanner. */
import Link from 'next/link';
import { getRoute } from '@/app/utils/routes';
import { Sparkles } from 'lucide-react';

const DEFAULT_PRIMARY = '#cb530a';
const DEFAULT_SECONDARY = '#a84308';

export default function BuilderExpertiseCTABanner({
  productSlug,
  primaryColor = DEFAULT_PRIMARY,
  secondaryColor = DEFAULT_SECONDARY,
}: {
  productSlug?: string;
  primaryColor?: string;
  secondaryColor?: string;
}) {
  const quizHref = productSlug ? `/p/${productSlug}/quiz` : getRoute('Quiz');
  const isCoaching = !!productSlug;
  const headline = isCoaching ? 'Dein Einstieg ins Coaching' : 'Kostenlose Beratung';
  const description = isCoaching
    ? 'Beantworte 4 kurze Fragen und erhalte ein maßgeschneidertes Angebot für das Immobiliencoaching'
    : 'Beantworte 4 kurze Fragen und erhalte ein unverbindliches Angebot für unsere Bürodienstleistungen.';
  const buttonText = isCoaching ? 'Jetzt starten →' : 'Jetzt anfragen →';
  return (
    <section style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor || DEFAULT_SECONDARY})` }}>
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 md:p-8 border border-white/20 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 break-words">{headline}</h3>
                  <p className="text-white/90 text-xs sm:text-sm md:text-base break-words">{description}</p>
                </div>
              </div>
              <Link
                href={quizHref}
                className="inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-colors whitespace-nowrap flex-shrink-0 w-full md:w-auto justify-center"
                style={{ color: primaryColor === '#C4D32A' ? '#60A917' : primaryColor }}
              >
                {buttonText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
