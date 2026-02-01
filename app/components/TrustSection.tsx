'use client';

import Link from 'next/link';
import { getRoute } from '../utils/routes';

export default function TrustSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#fef3ed] to-gray-50 dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-800">
            <div className="mb-6">
              <span className="inline-block bg-[#fef3ed] dark:bg-gray-800 text-[#cb530a] dark:text-[#182c30] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                NEU: ZUFRIEDENHEITSGARANTIE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6 break-words">
              Zufriedenheitsgarantie + Unverbindliche Beratung
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8 break-words px-2">
              Sichere dir jetzt eine <strong className="text-[#cb530a] dark:text-[#182c30]">kostenfreie Beratung</strong> und 
              erlebe, wie Muckenfuss & Nagel dich bei deiner Büroarbeit unterstützt. Sollte es dir 
              <strong className="text-[#cb530a] dark:text-[#182c30]"> nach einem Monat</strong> nicht gefallen, 
              bekommst du dein <strong className="text-[#cb530a] dark:text-[#182c30]">Geld zurück</strong>. 
              Starte risikofrei mit professionellen Bürodienstleistungen, die Produktivität und 
              Wohlbefinden fördern.
            </p>
            <Link
              href={getRoute('Kontakt')}
              className="inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-[#cb530a] text-white text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors whitespace-nowrap"
            >
              Jetzt unverbindlich anfragen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

