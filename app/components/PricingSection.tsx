'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { getRoute } from '../utils/routes';
import AnimatedCard3D from './ui/AnimatedCard3D';

export default function PricingSection() {
  const packages = [
    {
      name: 'Paket 1: Basis',
      description: 'Einsteigerfreundlich – Kernkommunikation',
      price: 'ab 299',
      period: ' €/Monat',
      subline: 'Optional: Google Bewertungen +99 €/Monat',
      features: [
        'Professionelle Telefonie (Anrufannahme, Weiterleitung)',
        'E-Mail-Betreuung',
        'Kalendermanagement & Terminlegung',
        'Optional: Google Bewertungen (Rezensions-Management, automatisierte Kundenanfragen)',
        'Fair-Use: z. B. 80 Anrufe, 50 E-Mails, 30 Termine/Monat – Extras auf Anfrage'
      ],
      popular: false
    },
    {
      name: 'Paket 2: Professional',
      description: 'Erweiterte Telefonbetreuung + optionale Social-Media-Add-ons',
      price: 'ab 599',
      period: ' €/Monat',
      subline: 'Google Bewertungen inklusive · Social modular: Basic +249 €, Growth +449 €, Pro +749 €',
      features: [
        'Erweiterte Telefonie (Branding, Team-Weiterleitung bis 3 Mitarbeiter)',
        'E-Mail, Kalender & Terminlegung (erweitert)',
        'Google Bewertungen inkl. Rezensions-Management & Optimierung',
        'Monatliches Reporting',
        'Social Media modular: Plattform-, Content- und Häufigkeits-Auswahl'
      ],
      popular: true
    },
    {
      name: 'Paket 3: Enterprise',
      description: 'Voll modular – fixe Preise pro Komponente, Volumenrabatte 10–20 %',
      price: 'ab ca. 999',
      period: ' €/Monat',
      subline: 'Auf Anfrage · Rabatt ab 1.000 € (10 %), ab 1.500 € (15 %), ab 2.000 € (20 %)',
      features: [
        'Telefonie, E-Mail/Kalender, Google Bewertungen, Social (custom) – frei kombinierbar',
        'Reporting & Dokumentation (z. B. 99 €/Monat)',
        'Website: einmalig ab 2.000 € + 99 €/Monat minimale Betreuung',
        '24/7-Option, CRM-Sync, unbegrenzte Google-Anfragen je nach Modul',
        'Individuelle Anpassungen & dedizierter Support'
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white bg-dot-pattern relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Unsere Angebote
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible Pakete für jeden Bedarf – monatlich kündbar, keine langfristigen Bindungen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${pkg.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 bg-[#cb530a] text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                  Stolz empfohlen
                </div>
              )}
              <AnimatedCard3D>
                <div className={`bg-white rounded-lg shadow-xl border-2 h-full flex flex-col ${
                  pkg.popular 
                    ? 'border-[#cb530a]'
                    : 'border-gray-200'
                }`}>
                  <div className="p-8 flex-grow">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {pkg.description}
                    </p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-800">
                        {pkg.price}
                      </span>
                      {pkg.period && (
                        <span className="text-gray-600 ml-2">
                          {pkg.period}
                        </span>
                      )}
                      {'subline' in pkg && pkg.subline && (
                        <p className="text-sm text-gray-500 mt-2">{pkg.subline}</p>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-[#cb530a] mr-2 mt-1">✓</span>
                          <span className="text-gray-700 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-8 pt-0">
                    {index === 2 ? (
                      <Link
                        href="/kontakt/enterprise-konfigurator"
                        className="block w-full text-center px-6 py-3 bg-[#cb530a] text-white font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors"
                      >
                        Jetzt zusammenstellen
                      </Link>
                    ) : index === 0 ? (
                      <Link
                        href="/kontakt/quiz?paket=1"
                        className="block w-full text-center px-6 py-3 bg-[#cb530a] text-white font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors"
                      >
                        Jetzt anfragen
                      </Link>
                    ) : (
                      <Link
                        href="/kontakt/quiz?paket=2"
                        className="block w-full text-center px-6 py-3 bg-[#cb530a] text-white font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors"
                      >
                        Jetzt anfragen
                      </Link>
                    )}
                  </div>
                </div>
              </AnimatedCard3D>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-gray-600 text-sm mb-2">
            Alle Preise netto zzgl. MwSt. · Monatlich kündbar · Monatlicher Report inklusive.
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Fair-Use-Grenzen inklusive; Extra-Gebühren bei Überschreitung (z. B. pro Anruf/E-Mail) – Details im Angebot.
          </p>
          <p className="text-gray-600 text-sm">
            Individuelle Kombinationen möglich. 
            <Link href={getRoute('Kontakt')} className="text-[#cb530a] hover:underline ml-1">
              Kontaktieren Sie uns
            </Link>
            {' '}für ein maßgeschneidertes Angebot.
          </p>
        </div>
      </div>
    </section>
  );
}

