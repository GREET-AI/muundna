'use client';

/** Nur für Builder / Produkt-Landingpages. Hauptseite nutzt app/components/ExpertiseCTABanner. */
import Link from 'next/link';
import { getRoute } from '@/app/utils/routes';
import { Sparkles } from 'lucide-react';
import { RichTextBlock } from '../ui/RichTextBlock';

const DEFAULT_PRIMARY = '#cb530a';
const DEFAULT_SECONDARY = '#a84308';

const DEFAULT_TITLE = 'Expertise erhalten';
const DEFAULT_SUBTITLE = 'Beantworten Sie 4 kurze Fragen und erhalten Sie ein maßgeschneidertes Angebot';
const DEFAULT_BUTTON = 'Jetzt starten →';

export default function BuilderExpertiseCTABanner({
  productSlug,
  primaryColor = DEFAULT_PRIMARY,
  secondaryColor = DEFAULT_SECONDARY,
  title,
  subtitle,
  buttonText: buttonTextProp,
}: {
  productSlug?: string;
  primaryColor?: string;
  secondaryColor?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}) {
  const quizHref = productSlug ? `/p/${productSlug}/quiz` : getRoute('Quiz');
  const isCoaching = !!productSlug;
  const headline = title?.trim() || (isCoaching ? DEFAULT_TITLE : 'Kostenlose Beratung');
  const description = subtitle?.trim() || (isCoaching ? DEFAULT_SUBTITLE : 'Beantworte 4 kurze Fragen und erhalte ein unverbindliches Angebot für unsere Bürodienstleistungen.');
  const buttonText = buttonTextProp?.trim() || (isCoaching ? DEFAULT_BUTTON : 'Jetzt anfragen →');
  return (
    <section style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor || DEFAULT_SECONDARY})` }}>
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 md:p-8 border border-white/20 shadow-lg">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Zeile 1: Icon links, Headline rechts davon */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-2xl font-bold text-white break-words min-w-0"><RichTextBlock html={headline} tag="span" /></h3>
              </div>
              {/* Subheadline darunter */}
              <p className="text-white/90 text-[11px] sm:text-sm md:text-base break-words leading-snug"><RichTextBlock html={description} tag="span" /></p>
              {/* Button volle Breite */}
              <Link
                href={quizHref}
                className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 bg-white text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
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
