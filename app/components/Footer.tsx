import Link from 'next/link';
import Image from 'next/image';
import { getRoute } from '../utils/routes';
import { FileText, Shield, Cookie } from 'lucide-react';
import { RichTextBlock } from './ui/RichTextBlock';

const DEFAULT_PRIMARY = '#cb530a';
const DEFAULT_SECONDARY = '#a84308';

const DEFAULT_COPYRIGHT = '© Alle Rechte vorbehalten.';
const DEFAULT_SUBLINE = 'Impressum · Datenschutz · Cookies (Links folgen)';

export default function Footer({
  primaryColor = DEFAULT_PRIMARY,
  secondaryColor = DEFAULT_SECONDARY,
  copyrightText,
  sublineText,
  logoUrl,
  variant = 'business',
}: {
  primaryColor?: string;
  secondaryColor?: string;
  copyrightText?: string;
  /** Optionale Zeile unter der Copyright-Zeile (editierbar im Builder). */
  sublineText?: string;
  /** Logo nur anzeigen wenn gesetzt (bei Coaching-Default: kein Logo). */
  logoUrl?: string;
  /** 'coaching' = schlank ohne Link-Spalten, kein Logo; 'business' = mit Über uns/Dienstleistungen/Zielgruppen/Kontakt + Logo wenn logoUrl. */
  variant?: 'coaching' | 'business';
} = {}) {
  const linkClass = 'text-black transition-colors hover:opacity-70';
  const showSubline = sublineText != null && String(sublineText).trim() !== '';
  const logoSrc = variant === 'business' && (!logoUrl || !String(logoUrl).trim()) ? '/logotransparent.png' : (logoUrl?.trim() || '');
  const showLogo = logoSrc.length > 0;

  return (
    <footer className="bg-white text-gray-800 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        {variant === 'business' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-900">Über uns</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={getRoute('Über uns')} className={linkClass}>
                    Über Muckenfuss & Nagel
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-900">Dienstleistungen</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={getRoute('Telefonservice & Kommunikation')} className={linkClass} style={{ color: primaryColor }}>
                    Telefonservice
                  </Link>
                </li>
                <li>
                  <Link href={getRoute('Terminorganisation')} className={linkClass}>
                    Terminorganisation
                  </Link>
                </li>
                <li>
                  <Link href={getRoute('Social Media Betreuung')} className={linkClass}>
                    Social Media
                  </Link>
                </li>
                <li>
                  <Link href={getRoute('Google Bewertungen')} className={linkClass}>
                    Google Bewertungen
                  </Link>
                </li>
                <li>
                  <Link href={getRoute('Dokumentation & Reporting')} className={linkClass}>
                    Dokumentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-900">Zielgruppen</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={getRoute('Handwerksbetriebe')} className={linkClass}>
                    Handwerksbetriebe
                  </Link>
                </li>
                <li>
                  <Link href={getRoute('Bauunternehmen')} className={linkClass}>
                    Bauunternehmen
                  </Link>
                </li>
                <li>
                  <Link href={getRoute('Straßen- & Brückenbau')} className={linkClass}>
                    Straßen- & Brückenbau
                  </Link>
                </li>
                <li>
                  <Link href={getRoute('Sanierung & Renovierung')} className={linkClass}>
                    Sanierung
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-900">Kontakt</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={getRoute('Kontakt')} className={linkClass}>
                    Kontakt aufnehmen
                  </Link>
                </li>
                <li>
                  <Link href={getRoute('Anfrage')} className={linkClass}>
                    Anfrage stellen
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className={variant === 'business' ? 'pt-8 border-t border-gray-200' : ''}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              {showLogo && (
                <Link href="/" className="shrink-0">
                  <Image
                    src={logoSrc}
                    alt="Logo"
                    width={120}
                    height={40}
                    className="h-10 w-auto object-contain object-left"
                    unoptimized
                  />
                </Link>
              )}
              <div>
                <p className="text-gray-600 text-sm mb-2">
                  &copy; {new Date().getFullYear()} <RichTextBlock html={copyrightText ?? DEFAULT_COPYRIGHT} tag="span" />
                </p>
                {showSubline && (
                  <p className="text-gray-500 text-xs">
                    <RichTextBlock html={sublineText} tag="span" />
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={getRoute('Impressum')}
                className="flex items-center justify-center w-10 h-10 rounded-full text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
                title="Impressum"
                aria-label="Impressum"
              >
                <FileText className="w-5 h-5" />
              </Link>
              <Link
                href={getRoute('Datenschutz')}
                className="flex items-center justify-center w-10 h-10 rounded-full text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
                title="Datenschutz"
                aria-label="Datenschutz"
              >
                <Shield className="w-5 h-5" />
              </Link>
              <Link
                href={getRoute('Cookies')}
                className="flex items-center justify-center w-10 h-10 rounded-full text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
                title="Cookies"
                aria-label="Cookies"
              >
                <Cookie className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
