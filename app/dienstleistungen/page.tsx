import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import StatsSection from '../components/StatsSection';
import BenefitsSection from '../components/BenefitsSection';
import CTASection from '../components/CTASection';
import ExpertiseCTABanner from '../components/ExpertiseCTABanner';
import Link from 'next/link';
import { getRoute } from '../utils/routes';
import AnimatedCard3D from '../components/ui/AnimatedCard3D';

export default function DienstleistungenPage() {
  const services = [
    {
      title: 'Telefonservice & Kommunikation',
      description: 'Professionelle telefonische Kundenbetreuung während Ihrer Arbeitszeiten. Wir übernehmen Anrufe, beantworten Fragen und leiten wichtige Informationen weiter.',
      features: [
        'Professionelle Kundenansprache',
        'Terminvereinbarungen',
        'Anfragenbearbeitung',
        'Rückrufservice',
        '24/7 Verfügbarkeit möglich'
      ],
      href: '/dienstleistungen/telefonservice'
    },
    {
      title: 'Terminorganisation',
      description: 'Effiziente Planung und Organisation Ihrer Kundentermine. Wir koordinieren Ihren Kalender und sorgen für optimale Terminverteilung.',
      features: [
        'Kalenderverwaltung',
        'Terminkoordination',
        'Erinnerungsservice',
        'Konfliktvermeidung',
        'Monatliche Übersichten'
      ],
      href: '/dienstleistungen/terminorganisation'
    },
    {
      title: 'Social Media Betreuung',
      description: 'Professionelle Betreuung Ihrer Social Media Kanäle. Steigern Sie Ihre Online-Präsenz und gewinnen Sie neue Kunden.',
      features: [
        'Content-Erstellung',
        'Posting & Scheduling',
        'Community Management',
        'Analytics & Reporting',
        'Markenaufbau'
      ],
      href: '/dienstleistungen/social-media'
    },
    {
      title: 'Google Bewertungen',
      description: 'Optimierung und Betreuung Ihrer Google Bewertungen. Verbessern Sie Ihr Online-Image und gewinnen Sie Vertrauen.',
      features: [
        'Bewertungsmanagement',
        'Kundenanfragen für Bewertungen',
        'Reaktionsservice',
        'Monitoring & Analyse',
        'Strategische Optimierung'
      ],
      href: '/dienstleistungen/google-bewertungen'
    },
    {
      title: 'Dokumentation & Reporting',
      description: 'Klare Dokumentation mit monatlichem Überblick. Behalten Sie den Überblick über alle Aktivitäten und Leistungen.',
      features: [
        'Monatliche Reports',
        'Aktivitätsdokumentation',
        'KPI-Tracking',
        'Transparente Abrechnung',
        'Individuelle Auswertungen'
      ],
      href: '/dienstleistungen/dokumentation'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Unsere Dienstleistungen"
          subtitle="Services"
          description="Professionelle Bürodienstleistungen speziell für Handwerksbetriebe und Bauunternehmen"
          backgroundImage="/images/herobackgeneral2.png"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
            {services.map((service, index) => (
              <AnimatedCard3D key={index}>
                <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-200">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      {service.title}
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start text-gray-700">
                          <span className="text-[#cb530a] mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={service.href}
                      className="inline-block bg-[#cb530a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#a84308] transition-colors"
                    >
                      Mehr Details →
                    </Link>
                  </div>
                </div>
              </div>
              </AnimatedCard3D>
            ))}
            </div>

            <div className="mt-16 bg-[#fef3ed] rounded-lg p-8 text-center border border-[#fef3ed]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Individuelle Lösungen für Ihr Unternehmen
              </h3>
              <p className="text-gray-700 mb-6">
                Wir passen unsere Dienstleistungen an Ihre spezifischen Bedürfnisse an.
                Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch.
              </p>
              <Link
                href={getRoute('Kontakt')}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#cb530a] text-white font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors text-lg"
              >
                Jetzt Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </section>

        <StatsSection
          stats={[
            { value: 5, suffix: '', label: 'Dienstleistungen', icon: '💼' },
            { value: 50, suffix: '+', label: 'Zufriedene Kunden', icon: '😊' },
            { value: 100, suffix: '%', label: 'Zufriedenheit', icon: '⭐' },
            { value: 24, suffix: '/7', label: 'Verfügbarkeit', icon: '⏰' }
          ]}
          title="Unsere Dienstleistungen im Überblick"
        />

        <BenefitsSection />

        <CTASection
          title="Individuelle Lösungen für Ihr Unternehmen"
          description="Wir passen unsere Dienstleistungen an Ihre spezifischen Bedürfnisse an. Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

