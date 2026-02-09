'use client';

/** Nur für Builder / Produkt-Landingpages. Hauptseite nutzt app/components/ServicesOverview. */
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedCard3D from '../ui/AnimatedCard3D';
import { RichTextBlock } from '../ui/RichTextBlock';
import type { ServiceItem } from '@/types/landing-section';

const DEFAULT_PRIMARY = '#cb530a';
const BUSINESS_TITLE = 'Unsere Dienstleistungen';
const BUSINESS_SUBTITLE = 'Professionelle Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen';
const COACHING_TITLE = 'Was dir das Coaching ermöglicht';
const COACHING_SUBTITLE = 'Ein komplettes System: von der richtigen Immobilie bis zu Kauf und Vermietung';

const BUSINESS_SERVICES: ServiceItem[] = [
  { title: 'Telefonservice & Kommunikation', description: 'Professionelle Kundenbetreuung, Anrufe, Terminvereinbarungen und 24/7 möglich.', icon: '📞', href: '/dienstleistungen/telefonservice', image: '/images/Dienstleistungen/Telefonieren.jpeg', imageSlogan: 'Telefonservice & Kommunikation', buttonText: 'Mehr erfahren' },
  { title: 'Terminorganisation', description: 'Kalenderverwaltung, Erinnerungsservice und monatliche Übersichten.', icon: '📅', href: '/dienstleistungen/terminorganisation', image: '/images/Dienstleistungen/Termenirung.jpeg', imageSlogan: 'Terminorganisation', buttonText: 'Mehr erfahren' },
  { title: 'Social Media Betreuung', description: 'Content, Posting, Community Management und Markenaufbau.', icon: '📱', href: '/dienstleistungen/social-media', image: '/images/Dienstleistungen/SocialMedia.jpeg', imageSlogan: 'Social Media Betreuung', buttonText: 'Mehr erfahren' },
  { title: 'Google Bewertungen', description: 'Bewertungsmanagement, Reaktionsservice und strategische Optimierung.', icon: '⭐', href: '/dienstleistungen/google-bewertungen', image: '/images/Dienstleistungen/GoogleBewertungen.jpeg', imageSlogan: 'Google Bewertungen', buttonText: 'Mehr erfahren' },
  { title: 'Dokumentation & Reporting', description: 'Monatliche Reports, KPI-Tracking und transparente Abrechnung.', icon: '📊', href: '/dienstleistungen/dokumentation', image: '/images/Dienstleistungen/Raport.jpeg', imageSlogan: 'Dokumentation & Reporting', buttonText: 'Mehr erfahren' },
  { title: 'Webdesign & App Lösungen', description: 'Responsive Websites, CMS und individuelle App-Entwicklung.', icon: '🌐', href: '/dienstleistungen/webdesign-app', image: '/images/Dienstleistungen/SocialMedia.jpeg', imageSlogan: 'Webdesign & App Lösungen', buttonText: 'Mehr erfahren' },
];

const COACHING_SERVICES: ServiceItem[] = [
  { title: 'Deal-Flow & Netzwerk', description: 'Zugang zu exklusiven Off-Market-Deals und einem Netzwerk von Investoren und Partnern. Keine graue Theorie – echte Gelegenheiten.', icon: '🔑', href: '#', image: '/images/Dienstleistungen/Telefonieren.jpeg', imageSlogan: 'Deal-Flow & Netzwerk', buttonText: 'Mehr erfahren' },
  { title: 'Strategie & Auswahl', description: 'Wie du die richtigen Immobilien als Kapitalanlage findest und bewertest. Systematische Kriterien und Due Diligence.', icon: '📋', href: '#', image: '/images/Dienstleistungen/Termenirung.jpeg', imageSlogan: 'Strategie & Auswahl', buttonText: 'Mehr erfahren' },
  { title: 'Kauf & Finanzierung', description: 'Von der Entscheidung bis zum Kauf – Begleitung bei Verhandlung, Finanzierung und Abschluss.', icon: '📄', href: '#', image: '/images/Dienstleistungen/SocialMedia.jpeg', imageSlogan: 'Kauf & Finanzierung', buttonText: 'Mehr erfahren' },
  { title: 'Vermietung & Management', description: 'Erste Vermietung, laufendes Management und Skalierung. Ein klares System für dein Portfolio.', icon: '🏠', href: '#', image: '/images/Dienstleistungen/GoogleBewertungen.jpeg', imageSlogan: 'Vermietung & Management', buttonText: 'Mehr erfahren' },
  { title: '1:1-Coaching', description: 'Individuelle Betreuung und maßgeschneiderte Schritte. Du bleibst nicht allein – wir gehen den Weg mit.', icon: '👤', href: '#', image: '/images/Dienstleistungen/Raport.jpeg', imageSlogan: '1:1-Coaching', buttonText: 'Mehr erfahren' },
  { title: 'Community', description: 'Austausch mit anderen Teilnehmern, laufende Updates und Zugang zu exklusiven Inhalten im Mitgliederbereich.', icon: '🤝', href: '#', image: '/images/Dienstleistungen/SocialMedia.jpeg', imageSlogan: 'Community', buttonText: 'Mehr erfahren' },
];

export default function BuilderServicesOverview({
  primaryColor = DEFAULT_PRIMARY,
  secondaryColor,
  sectionTitle,
  sectionSubtitle,
  services: servicesProp,
  variant = 'business',
}: {
  primaryColor?: string;
  secondaryColor?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  services?: ServiceItem[];
  variant?: 'business' | 'coaching';
} = {}) {
  const isCoaching = variant === 'coaching';
  const fallbackServices = isCoaching ? COACHING_SERVICES : BUSINESS_SERVICES;
  const services = Array.isArray(servicesProp) && servicesProp.length > 0 ? servicesProp : fallbackServices;
  const defaultTitle = isCoaching ? COACHING_TITLE : BUSINESS_TITLE;
  const defaultSubtitle = isCoaching ? COACHING_SUBTITLE : BUSINESS_SUBTITLE;

  return (
    <section className="@container py-20 bg-white bg-dot-pattern relative" style={{ ['--primary']: primaryColor } as React.CSSProperties}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-4 break-words"><RichTextBlock html={sectionTitle ?? defaultTitle} tag="span" /></h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto break-words"><RichTextBlock html={sectionSubtitle ?? defaultSubtitle} tag="span" /></p>
        </div>
        {/* Mobil <640px: 1 Spalte. Tablet 640–1023px: 2 Spalten. Desktop ≥1024px: 3 Spalten. Arbitrary container breakpoints damit es in Editor-Vorschau greift. */}
        <div className="grid grid-cols-1 @[640px]:grid-cols-2 @[1024px]:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <AnimatedCard3D>
                <Link href={service.href ?? '#'} className="block h-full" prefetch={!(service.href ?? '').startsWith('#')}>
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden h-full group hover:shadow-xl transition-all" style={{ ['--primary']: primaryColor } as React.CSSProperties}>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <Image src={service.image || '/images/Dienstleistungen/Telefonieren.jpeg'} alt={service.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-white text-sm font-semibold drop-shadow-md">{service.imageSlogan ?? service.title}</span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 md:p-8">
                      <div className="flex items-center mb-3 md:mb-4">
                        {service.icon ? <span className="text-2xl sm:text-3xl md:text-4xl mr-3 md:mr-4">{service.icon}</span> : null}
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 transition-colors group-hover:text-[var(--primary)] break-words">{service.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 break-words">{service.description}</p>
                      <span className="inline-flex items-center font-semibold group-hover:translate-x-2 transition-transform" style={{ color: primaryColor }}>
                        {service.buttonText ?? 'Mehr erfahren'}
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedCard3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
