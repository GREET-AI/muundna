'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { getRoute } from '../utils/routes';
import AnimatedCard3D from './ui/AnimatedCard3D';

const DEFAULT_PRIMARY = '#cb530a';
const DEFAULT_SECONDARY = '#a84308';

const WEBSITE_TITLE = 'Unsere Angebote';
const WEBSITE_SUBTITLE = 'Flexible Pakete für jeden Bedarf – monatlich kündbar, keine langfristigen Bindungen';

const COACHING_TITLE = 'Unser Coaching-Angebot';
const COACHING_SUBTITLE = 'Hochpreisiges Immobiliencoaching – Zugang zu System, Deal-Flow und Netzwerk';

const WEBSITE_PACKAGES = [
  {
    name: 'Paket 1: Basis',
    description: 'Einsteigerfreundlich – Kernkommunikation',
    price: 'ab 299 €',
    period: '/Monat',
    subline: 'Optional: Google Bewertungen +99 €/Monat',
    features: [
      'Fair-Use: z. B. 80 Anrufe, 50 E-Mails, 30 Termine/Monat – Extras auf Anfrage',
      'Optional: Google Bewertungen (Rezensions-Management, automatisierte Kundenanfragen)',
      'Kalendermanagement & Terminlegung',
      'E-Mail-Betreuung',
      'Professionelle Telefonie (Anrufannahme, Weiterleitung)',
    ],
    popular: false,
  },
  {
    name: 'Paket 2: Professional',
    description: 'Erweiterte Telefonbetreuung + optionale Social-Media-Add-ons',
    price: 'ab 599 €',
    period: '/Monat',
    subline: 'Google Bewertungen inklusive',
    optionalAddons: [
      { label: 'Social Pro', price: '', detail: '3 Plattformen, 3 Posts/Woche, inkl. viraler Reel-Content' },
      { label: 'Social Growth', price: '', detail: '3 Plattformen, je 2 Posts/Woche, Community' },
      { label: 'Social Basic', price: '', detail: '1 Plattform, 2 Posts/Woche' },
    ],
    features: [
      'Social Media modular: Plattform-, Content- und Häufigkeits-Auswahl',
      'Monatliches Reporting',
      'Google Bewertungen inkl. Rezensions-Management & Optimierung',
      'E-Mail, Kalender & Terminlegung (erweitert)',
      'Erweiterte Telefonie (Branding, Team-Weiterleitung bis 3 Mitarbeiter)',
    ],
    popular: true,
  },
  {
    name: 'Paket 3: Enterprise',
    description: 'Voll modular – fixe Preise pro Komponente',
    price: 'ab ca. 999 €',
    period: '/Monat',
    subline: '',
    features: [
      'Individuelle Anpassungen & dedizierter Support',
      '24/7-Option, CRM-Sync, unbegrenzte Google-Anfragen je nach Modul',
      'Website: ab 2.000 € (einmalig) + 99 €/Monat minimale Betreuung – Einstiegspreis',
      'Reporting & Dokumentation (z. B. 99 €/Monat)',
      'Telefonie, E-Mail/Kalender, Google Bewertungen, Social (custom) – frei kombinierbar',
    ],
    popular: false,
  },
];

const COACHING_PACKAGES = [
  { name: 'Einstieg', description: 'Systematischer Start in Immobilien als Kapitalanlage', price: 'auf Anfrage', period: '', subline: 'Ideal für Quereinsteiger', features: ['Zugang zu exklusiven Strategien und der Methodik', 'Deal-Flow & Einführung ins Netzwerk', 'Strukturierte Schritte: richtige Immobilie finden, bewerten, sichern', '1:1-Coaching-Sessions', 'Zufriedenheitsgarantie'], popular: false },
  { name: 'Komplett-System', description: 'Alles von Strategie bis Kauf & Vermietung', price: 'auf Anfrage', period: '', includedNote: 'Empfohlen für ernsthafte Einstiege', optionalAddons: [] as { label: string; price: string; detail: string }[], features: ['Volles System: Deal-Flow, Due Diligence, Kauf, Vermietung', 'Exklusiver Zugang zu Off-Market-Deals und Netzwerk', '1:1-Betreuung und maßgeschneiderte Umsetzung', 'Community und laufender Austausch', 'Zufriedenheitsgarantie'], popular: true },
  { name: 'Premium', description: 'Maximale Betreuung und exklusive Inhalte', price: 'auf Anfrage', period: '', features: ['Alles aus dem Komplett-System', 'Intensivere 1:1-Betreuung und Prioritätszugang', 'Individuelle Strategie und Deal-Begleitung', 'Langfristige Begleitung beim Portfolio-Aufbau', 'Zufriedenheitsgarantie'], popular: false },
];

export default function PricingSection({
  primaryColor = DEFAULT_PRIMARY,
  secondaryColor = DEFAULT_SECONDARY,
  sectionTitle,
  sectionSubtitle,
}: { primaryColor?: string; secondaryColor?: string; sectionTitle?: string; sectionSubtitle?: string } = {}) {
  const isWebsite = sectionTitle === undefined;
  const title = sectionTitle ?? (isWebsite ? WEBSITE_TITLE : COACHING_TITLE);
  const subtitle = sectionSubtitle ?? (isWebsite ? WEBSITE_SUBTITLE : COACHING_SUBTITLE);
  const packages = isWebsite ? WEBSITE_PACKAGES : COACHING_PACKAGES;

  return (
    <section id="pricing" className="py-20 bg-white bg-dot-pattern relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
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
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md" style={{ backgroundColor: primaryColor }}>
                  {isWebsite ? 'Stolz empfohlen' : 'Stolz empfohlen'}
                </div>
              )}
              <AnimatedCard3D>
                <div className={`bg-white rounded-lg shadow-xl border-2 h-full flex flex-col ${pkg.popular ? '' : 'border-gray-200'}`} style={pkg.popular ? { borderColor: primaryColor } : undefined}>
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
                      {'includedNote' in pkg && pkg.includedNote && (
                        <p className="text-sm text-gray-600 mt-2">{pkg.includedNote}</p>
                      )}
                      {'optionalAddons' in pkg && Array.isArray(pkg.optionalAddons) && pkg.optionalAddons.length > 0 && (
                        <div className="mt-2 text-xs">
                          <p className="text-gray-500 font-medium mb-1">Zusätzlich buchbar:</p>
                          <ul className="space-y-0.5 text-gray-600">
                            {pkg.optionalAddons.map((addon: { label: string; price: string; detail: string }, i: number) => (
                              <li key={i}><span className="font-medium">{addon.label}</span> – {addon.detail}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2 mt-1" style={{ color: primaryColor }}>✓</span>
                          <span className="text-gray-700 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-8 pt-0">
                    {isWebsite ? (
                      index === 2 ? (
                        <Link href="/kontakt/enterprise-konfigurator" className="block w-full text-center px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition-colors hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                          Jetzt zusammenstellen
                        </Link>
                      ) : index === 0 ? (
                        <Link href="/kontakt/quiz?paket=1" className="block w-full text-center px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition-colors hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                          Jetzt anfragen
                        </Link>
                      ) : (
                        <Link href="/kontakt/quiz?paket=2" className="block w-full text-center px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition-colors hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                          Jetzt anfragen
                        </Link>
                      )
                    ) : index === 2 ? (
                      <Link href="/kontakt/enterprise-konfigurator" className="block w-full text-center px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition-colors hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                        Jetzt Platz sichern
                      </Link>
                    ) : index === 0 ? (
                      <Link href="/kontakt/quiz?paket=1" className="block w-full text-center px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition-colors hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                        Jetzt Platz sichern
                      </Link>
                    ) : (
                      <Link href="/kontakt/quiz?paket=2" className="block w-full text-center px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition-colors hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                        Jetzt Platz sichern
                      </Link>
                    )}
                  </div>
                </div>
              </AnimatedCard3D>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center max-w-2xl mx-auto">
          {isWebsite && (
            <>
              <p className="text-gray-600 text-sm mb-2">
                Alle Preise netto zzgl. MwSt. · Monatlich kündbar · Monatlicher Report inklusive.
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Fair-Use-Grenzen inklusive; Extra-Gebühren bei Überschreitung (z. B. pro Anruf/E-Mail) – Details im Angebot.
              </p>
            </>
          )}
          <p className="text-gray-600 text-sm">
            {isWebsite ? 'Individuelle Kombinationen möglich. ' : ''}
            <Link href={getRoute('Kontakt')} className="hover:underline ml-1" style={{ color: primaryColor }}>
              {isWebsite ? 'Kontaktieren Sie uns' : 'Kontakt aufnehmen'}
            </Link>
            {isWebsite ? ' für ein maßgeschneidertes Angebot.' : ' für ein maßgeschneidertes Coaching-Angebot.'}
          </p>
        </div>
      </div>
    </section>
  );
}

