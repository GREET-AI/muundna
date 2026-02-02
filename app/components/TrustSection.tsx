'use client';

import Link from 'next/link';
import { getRoute } from '../utils/routes';

export default function TrustSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#fef3ed] to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
            <div className="mb-6">
              <span className="inline-block bg-[#fef3ed] text-[#cb530a] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                NEU: ZUFRIEDENHEITSGARANTIE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 break-words">
              Zufriedenheitsgarantie + Unverbindliche Beratung
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 break-words px-2">
              Sichere dir jetzt eine <strong className="text-[#cb530a]">kostenfreie Beratung</strong> und 
              erlebe, wie Muckenfuss & Nagel dich bei deiner Büroarbeit unterstützt. Sollte es dir 
              <strong className="text-[#cb530a]"> nach einem Monat</strong> nicht gefallen, 
              bekommst du dein <strong className="text-[#cb530a]">Geld zurück</strong>. 
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

