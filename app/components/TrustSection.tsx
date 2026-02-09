'use client';

import Link from 'next/link';
import { getRoute } from '../utils/routes';
import { RichTextBlock } from './ui/RichTextBlock';

const DEFAULT_PRIMARY = '#cb530a';
const DEFAULT_SECONDARY = '#a84308';

const DEFAULT_TITLE = 'Zufriedenheitsgarantie + Unverbindliche Beratung';
const DEFAULT_SEAL = 'ZUFRIEDENHEITSGARANTIE';
const DEFAULT_BODY_HTML = 'Sichere dir ein <strong style="color:#cb530a">unverbindliches Kennenlerngespräch</strong> und erlebe, wie das Coaching dich bei deinen ersten Schritten in Immobilien als Kapitalanlage unterstützt. Sollte es dir <strong style="color:#cb530a">nach dem vereinbarten Zeitraum</strong> nicht gefallen, bekommst du dein <strong style="color:#cb530a">Geld zurück</strong>. Starte risikofrei mit einem System, das Deal-Flow, Netzwerk und Umsetzung verbindet.';
const DEFAULT_BUTTON = 'Jetzt Platz sichern';

export default function TrustSection({
  primaryColor = DEFAULT_PRIMARY,
  secondaryColor = DEFAULT_SECONDARY,
  sealText,
  sectionTitle,
  bodyHtml,
  buttonText: buttonTextProp,
}: {
  primaryColor?: string;
  secondaryColor?: string;
  sealText?: string;
  sectionTitle?: string;
  bodyHtml?: string;
  buttonText?: string;
} = {}) {
  const isWebsite = sectionTitle === undefined && bodyHtml === undefined;
  const title = sectionTitle ?? DEFAULT_TITLE;
  const seal = sealText ?? (isWebsite ? 'NEU: ZUFRIEDENHEITSGARANTIE' : DEFAULT_SEAL);
  const buttonText = buttonTextProp ?? (isWebsite ? 'Jetzt anfragen' : DEFAULT_BUTTON);

  const hasBodyHtml = bodyHtml != null && bodyHtml.trim() !== '';
  const paragraphContent = hasBodyHtml ? (
    <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 break-words px-2 trust-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
  ) : isWebsite ? (
    <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 break-words px-2">
      Sichern Sie sich jetzt eine <strong style={{ color: primaryColor }}>kostenfreie Beratung</strong> und erleben Sie, wie Muckenfuss & Nagel Sie bei Ihrer Büroarbeit unterstützt. Sollte es Ihnen <strong style={{ color: primaryColor }}>nach einem Monat</strong> nicht gefallen, bekommen Sie Ihr <strong style={{ color: primaryColor }}>Geld zurück</strong>. Starten Sie risikofrei mit professionellen Bürodienstleistungen, die Produktivität und Wohlbefinden fördern.
    </p>
  ) : (
    <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 break-words px-2">
      Sichere dir ein <strong style={{ color: primaryColor }}>unverbindliches Kennenlerngespräch</strong> und erlebe, wie das Coaching dich bei deinen ersten Schritten in Immobilien als Kapitalanlage unterstützt. Sollte es dir <strong style={{ color: primaryColor }}> nach dem vereinbarten Zeitraum</strong> nicht gefallen, bekommst du dein <strong style={{ color: primaryColor }}>Geld zurück</strong>. Starte risikofrei mit einem System, das Deal-Flow, Netzwerk und Umsetzung verbindet.
    </p>
  );

  return (
    <section className="py-20 bg-white bg-dot-pattern relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                <RichTextBlock html={seal} />
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 break-words">
              <RichTextBlock html={title} tag="span" />
            </h2>
            {paragraphContent}
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

