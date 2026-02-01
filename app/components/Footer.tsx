import Link from 'next/link';
import { getRoute } from '../utils/routes';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Über uns */}
          <div>
            <h3 className="text-lg font-bold mb-4">Über uns</h3>
            <ul className="space-y-2">
              <li>
                <Link href={getRoute('Über uns')} className="text-gray-300 hover:text-[#cb530a]">
                  Über Muckenfuss & Nagel
                </Link>
              </li>
              <li>
                <Link href={getRoute('Unternehmensgeschichte')} className="text-gray-300 hover:text-[#cb530a]">
                  Unternehmensgeschichte
                </Link>
              </li>
              <li>
                <Link href={getRoute('Standort')} className="text-gray-300 hover:text-[#cb530a]">
                  Standort
                </Link>
              </li>
              <li>
                <Link href={getRoute('Erfahrung & Kompetenz')} className="text-gray-300 hover:text-[#cb530a]">
                  Erfahrung & Kompetenz
                </Link>
              </li>
            </ul>
          </div>

          {/* Dienstleistungen */}
          <div>
            <h3 className="text-lg font-bold mb-4">Dienstleistungen</h3>
            <ul className="space-y-2">
              <li>
                <Link href={getRoute('Telefonservice & Kommunikation')} className="text-gray-300 hover:text-[#cb530a]">
                  Telefonservice
                </Link>
              </li>
              <li>
                <Link href={getRoute('Terminorganisation')} className="text-gray-300 hover:text-[#cb530a]">
                  Terminorganisation
                </Link>
              </li>
              <li>
                <Link href={getRoute('Social Media Betreuung')} className="text-gray-300 hover:text-[#cb530a]">
                  Social Media
                </Link>
              </li>
              <li>
                <Link href={getRoute('Google Bewertungen')} className="text-gray-300 hover:text-[#cb530a]">
                  Google Bewertungen
                </Link>
              </li>
              <li>
                <Link href={getRoute('Dokumentation & Reporting')} className="text-gray-300 hover:text-[#cb530a]">
                  Dokumentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Zielgruppen */}
          <div>
            <h3 className="text-lg font-bold mb-4">Zielgruppen</h3>
            <ul className="space-y-2">
              <li>
                <Link href={getRoute('Handwerksbetriebe')} className="text-gray-300 hover:text-[#cb530a]">
                  Handwerksbetriebe
                </Link>
              </li>
              <li>
                <Link href={getRoute('Bauunternehmen')} className="text-gray-300 hover:text-[#cb530a]">
                  Bauunternehmen
                </Link>
              </li>
              <li>
                <Link href={getRoute('Hoch- & Tiefbau')} className="text-gray-300 hover:text-[#cb530a]">
                  Hoch- & Tiefbau
                </Link>
              </li>
              <li>
                <Link href={getRoute('Straßen- & Brückenbau')} className="text-gray-300 hover:text-[#cb530a]">
                  Straßen- & Brückenbau
                </Link>
              </li>
              <li>
                <Link href={getRoute('Sanierung & Renovierung')} className="text-gray-300 hover:text-[#cb530a]">
                  Sanierung
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt & Rechtliches */}
          <div>
            <h3 className="text-lg font-bold mb-4">Kontakt</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <Link href={getRoute('Kontakt')} className="text-gray-300 hover:text-[#cb530a]">
                  Kontakt aufnehmen
                </Link>
              </li>
              <li>
                <Link href={getRoute('Anfrage')} className="text-gray-300 hover:text-[#cb530a]">
                  Anfrage stellen
                </Link>
              </li>
            </ul>
            <div className="border-t border-gray-700 pt-6">
              <ul className="space-y-2">
                <li>
                  <Link href={getRoute('Impressum')} className="text-gray-300 hover:text-[#cb530a] text-sm">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link href={getRoute('Datenschutz')} className="text-gray-300 hover:text-[#cb530a] text-sm">
                    Datenschutz
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm mb-2">
            &copy; {new Date().getFullYear()} Muckenfuss & Nagel. Alle Rechte vorbehalten.
          </p>
          <p className="text-gray-500 text-xs">
            Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen | Oberderdingen
          </p>
        </div>
      </div>
    </footer>
  );
}
