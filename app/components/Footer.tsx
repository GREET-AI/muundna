import Link from 'next/link';
import Image from 'next/image';
import { getRoute } from '../utils/routes';
import { FileText, Shield, Cookie } from 'lucide-react';

const DEFAULT_PRIMARY = '#cb530a';
const DEFAULT_SECONDARY = '#a84308';

const DEFAULT_COPYRIGHT = 'Muckenfuss & Nagel. Alle Rechte vorbehalten.';

export default function Footer({ primaryColor = DEFAULT_PRIMARY, secondaryColor = DEFAULT_SECONDARY, copyrightText }: { primaryColor?: string; secondaryColor?: string; copyrightText?: string } = {}) {
  const linkClass = 'text-black transition-colors hover:opacity-70';
  return (
    <footer className="bg-white text-gray-800 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Über uns */}
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

          {/* Dienstleistungen */}
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

          {/* Zielgruppen */}
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

          {/* Kontakt */}
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

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <Link href="/" className="shrink-0">
                <Image
                  src="/logotransparent.png"
                  alt="Muckenfuss & Nagel"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain object-left"
                  unoptimized
                />
              </Link>
              <div>
                <p className="text-gray-600 text-sm mb-2">
                  &copy; {new Date().getFullYear()} {copyrightText ?? DEFAULT_COPYRIGHT}
                </p>
                <p className="text-gray-500 text-xs">
                  Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen | Oberderdingen
                </p>
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
