import Link from 'next/link';
import Image from 'next/image';
import { getRoute } from '../utils/routes';
import NumberTicker from './ui/NumberTicker';

export default function AboutSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-black relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6 break-words">
              Muckenfuss & Nagel
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 break-words">
              Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                <NumberTicker value={10} className="text-[#cb530a] dark:text-[#182c30]" />+ Jahre Erfahrung
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Mit über 10 Jahren Erfahrung im Bauwesen verstehen wir die
                Herausforderungen von Handwerksbetrieben und Bauunternehmen.
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Hoch- und Tiefbau</li>
                <li>• Straßenbau & Brückenbau</li>
                <li>• Sanierung von Wohnobjekten</li>
                <li>• Dachdecker & Zimmermänner</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 relative overflow-hidden">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Überregionale Betreuung
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Wir betreuen Handwerksbetriebe und Bauunternehmen in ganz
                Deutschland, der Schweiz und Österreich.
              </p>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>📍 Standort: Oberderdingen</p>
                <p>🌍 Betreuung: DACH-Raum</p>
                <p>🎯 Zielgruppe: Handwerksbetriebe & Bauunternehmen</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
              Warum Muckenfuss & Nagel?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">⚡</div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Zeitersparnis</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Konzentrieren Sie sich auf Ihr Handwerk, wir übernehmen die Büroarbeit
                </p>
              </div>
              <div className="text-center group">
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">💼</div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Professionell</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Erfahrenes Team mit Branchenkenntnis im Bauwesen
                </p>
              </div>
              <div className="text-center group">
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">📈</div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Wachstum</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Steigern Sie Ihre Sichtbarkeit und gewinnen Sie neue Kunden
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href={getRoute('Kontakt')}
              className="inline-flex items-center justify-center px-8 py-4 bg-[#cb530a] text-white font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors text-lg"
            >
              Jetzt unverbindlich anfragen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
