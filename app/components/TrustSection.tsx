'use client';

import Link from 'next/link';
import { getRoute } from '../utils/routes';

const DEFAULT_PRIMARY = '#cb530a';
const DEFAULT_SECONDARY = '#a84308';

const DEFAULT_TITLE = 'Zufriedenheitsgarantie + Unverbindliche Beratung';

export default function TrustSection({ primaryColor = DEFAULT_PRIMARY, secondaryColor = DEFAULT_SECONDARY, sectionTitle }: { primaryColor?: string; secondaryColor?: string; sectionTitle?: string } = {}) {
  const isWebsite = sectionTitle === undefined;
  const title = sectionTitle ?? DEFAULT_TITLE;
  const paragraph = isWebsite ? (
    <>
      Sichern Sie sich jetzt eine <strong style={{ color: primaryColor }}>kostenfreie Beratung</strong> und erleben Sie, wie Muckenfuss & Nagel Sie bei Ihrer Büroarbeit unterstützt. Sollte es Ihnen <strong style={{ color: primaryColor }}>nach einem Monat</strong> nicht gefallen, bekommen Sie Ihr <strong style={{ color: primaryColor }}>Geld zurück</strong>. Starten Sie risikofrei mit professionellen Bürodienstleistungen, die Produktivität und Wohlbefinden fördern.
    </>
  ) : (
    <>
      Sichere dir ein <strong style={{ color: primaryColor }}>unverbindliches Kennenlerngespräch</strong> und
      erlebe, wie das Coaching dich bei deinen ersten Schritten in Immobilien als Kapitalanlage unterstützt. Sollte es dir
      <strong style={{ color: primaryColor }}> nach dem vereinbarten Zeitraum</strong> nicht gefallen,
      bekommst du dein <strong style={{ color: primaryColor }}>Geld zurück</strong>.
      Starte risikofrei mit einem System, das Deal-Flow, Netzwerk und Umsetzung verbindet.
    </>
  );
  const buttonText = isWebsite ? 'Jetzt anfragen' : 'Jetzt Platz sichern';

  return (
    <section className="py-20 bg-white bg-dot-pattern relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                {isWebsite ? 'NEU: ZUFRIEDENHEITSGARANTIE' : 'ZUFRIEDENHEITSGARANTIE'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 break-words">
              {title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 break-words px-2">
              {paragraph}
            </p>
            <Link
              href={getRoute('Quiz')}
              className="inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-white text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-lg transition-colors whitespace-nowrap hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

