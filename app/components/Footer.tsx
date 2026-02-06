import Link from 'next/link';
import Image from 'next/image';
import { getRoute } from '../utils/routes';
import { FileText, Shield, Cookie } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Über uns */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900">Über uns</h3>
            <ul className="space-y-2">
              <li>
                <Link href={getRoute('Über uns')} className="text-gray-600 hover:text-[#cb530a] transition-colors">
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
                <Link href={getRoute('Telefonservice & Kommunikation')} className="text-gray-600 hover:text-[#cb530a] transition-colors">
                  Telefonservice
                </Link>
              </li>
              <li>
                <Link href={getRoute('Terminorganisation')} className="text-gray-600 hover:text-[#cb530a] transition-colors">
                  Terminorganisation
                </Link>
              </li>
              <li>
                <Link href={getRoute('Social Media Betreuung')} className="text-gray-600 hover:text-[#cb530a] transition-colors">
                  Social Media
                </Link>
              </li>
              <li>
                <Link href={getRoute('Google Bewertungen')} className="text-gray-600 hover:text-[#cb530a] transition-colors">
                  Google Bewertungen
                </Link>
              </li>
              <li>
                <Link href={getRoute('Dokumentation & Reporting')} className="text-gray-600 hover:text-[#cb530a] transition-colors">
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
                <Link href={getRoute('Handwerksbetriebe')} className="text-gray-600 hover:text-[#cb530a] transition-colors">
                  Handwerksbetriebe
                </Link>
              </li>
              <li>
                <Link href={getRoute('Bauunternehmen')} className="text-gray-600 hover:text-[#cb530a] transition-colors">
                  Bauunternehmen
                </Link>
              </li>
              <li>
                <Link href={getRoute('Straßen- & Brückenbau')} className="text-gray-600 hover:text-[#cb530a] transition-colors">
                  Straßen- & Brückenbau
                </Link>
              </li>
              <li>
                <Link href={getRoute('Sanierung & Renovierung')} className="text-gray-600 hover:text-[#cb530a] transition-colors">
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
                <Link href={getRoute('Kontakt')} className="text-gray-600 hover:text-[#cb530a] transition-colors">
                  Kontakt aufnehmen
                </Link>
              </li>
              <li>
                <Link href={getRoute('Anfrage')} className="text-gray-600 hover:text-[#cb530a] transition-colors">
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
                  &copy; {new Date().getFullYear()} Muckenfuss & Nagel. Alle Rechte vorbehalten.
                </p>
                <p className="text-gray-500 text-xs">
                  Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen | Oberderdingen
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={getRoute('Impressum')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#cb530a] text-white hover:bg-[#a84308] transition-colors"
                title="Impressum"
                aria-label="Impressum"
              >
                <FileText className="w-5 h-5" />
              </Link>
              <Link
                href={getRoute('Datenschutz')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#cb530a] text-white hover:bg-[#a84308] transition-colors"
                title="Datenschutz"
                aria-label="Datenschutz"
              >
                <Shield className="w-5 h-5" />
              </Link>
              <Link
                href={getRoute('Cookies')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#cb530a] text-white hover:bg-[#a84308] transition-colors"
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
