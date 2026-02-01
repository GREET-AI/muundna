import Header from '../../components/Header';
import HeroSection from '../../components/HeroSection';
import Footer from '../../components/Footer';
import CookieBanner from '../../components/CookieBanner';
import StatsSection from '../../components/StatsSection';
import FeaturesGridSection from '../../components/FeaturesGridSection';
import ComparisonSection from '../../components/ComparisonSection';
import UseCasesSection from '../../components/UseCasesSection';
import CTASection from '../../components/CTASection';
import ExpertiseCTABanner from '../../components/ExpertiseCTABanner';
import Link from 'next/link';
import { getRoute } from '../../utils/routes';
import AnimatedList from '../../components/ui/AnimatedList';


export default function SanierungPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Sanierung & Renovierung"
          subtitle="Zielgruppe"
          description="Bürodienstleistungen für Sanierungs- und Renovierungsbetriebe"
          backgroundImage="/images/herobackgeneral2.png"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white dark:bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Sanierung & Renovierung
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Sanierungs- und Renovierungsbetriebe benötigen professionelle Bürodienstleistungen,
                  um sich auf die handwerkliche Arbeit zu konzentrieren. Wir übernehmen die
                  Kommunikation und Organisation für Sie.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Unsere Leistungen
                </h2>
                <AnimatedList
                  items={[
                    'Telefonservice für Sanierungsanfragen',
                    'Terminorganisation für Objektbesichtigungen',
                    'Social Media Präsentation Ihrer Sanierungsprojekte',
                    'Google Bewertungen von zufriedenen Eigentümern',
                    'Dokumentation aller Kundenkommunikation',
                    'Monatliche Übersichten über alle Aktivitäten'
                  ]}
                />
              </div>

              <div className="bg-[#fef3ed] dark:bg-gray-900 rounded-lg p-8 text-center border border-[#fef3ed] dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Mehr Zeit für Ihre Sanierungsprojekte
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Lassen Sie uns gemeinsam die optimale Lösung für Ihr Sanierungsunternehmen finden.
                </p>
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

        <StatsSection
          stats={[
            { value: 100, suffix: '%', label: 'Anfragen bearbeitet', icon: '📞' },
            { value: 50, suffix: '%', label: 'Zeitersparnis', icon: '⏰' },
            { value: 0, suffix: '', label: 'Verpasste Termine', icon: '✅' },
            { value: 25, suffix: '%', label: 'Mehr Aufträge', icon: '📈' }
          ]}
          title="Ihre Vorteile bei Sanierung & Renovierung"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '🏠',
              title: 'Objektbesichtigungen',
              description: 'Professionelle Koordination aller Objektbesichtigungen und Kundentermine.'
            },
            {
              icon: '📞',
              title: 'Sanierungsanfragen',
              description: 'Vollständige Übernahme der Kommunikation während Ihrer Projektarbeit.'
            },
            {
              icon: '📱',
              title: 'Projekt-Showcase',
              description: 'Professionelle Darstellung Ihrer Sanierungsprojekte für mehr Aufträge.'
            },
            {
              icon: '⭐',
              title: 'Eigentümer-Bewertungen',
              description: 'Aufbau einer starken Reputation durch professionelles Bewertungsmanagement.'
            },
            {
              icon: '📊',
              title: 'Dokumentation',
              description: 'Vollständige Dokumentation für Ihre Projektabrechnung.'
            },
            {
              icon: '⚡',
              title: 'Mehr Zeit',
              description: 'Konzentrieren Sie sich auf Ihre Sanierungsprojekte.'
            }
          ]}
          title="Spezialisiert auf Sanierung & Renovierung"
          columns={3}
        />

        <ComparisonSection
          items={[
            { feature: 'Büroarbeit', ohne: 'Selbst erledigen', mit: 'Wir übernehmen' },
            { feature: 'Fokus', ohne: 'Aufgeteilt', mit: '100% auf Sanierung' },
            { feature: 'Zeitaufwand', ohne: 'Mehrere Stunden/Tag', mit: '0 Stunden für Sie' },
            { feature: 'Kosten', ohne: 'Eigene Mitarbeiter', mit: 'Flexible Pakete' },
            { feature: 'Wachstum', ohne: 'Begrenzt', mit: 'Skalierbar' }
          ]}
        />

        <UseCasesSection
          useCases={[
            {
              icon: '🏠',
              title: 'Wohnungssanierung',
              description: 'Sie sanieren Wohnungen und benötigen Unterstützung bei der Kundenkommunikation.',
              result: 'Optimale Koordination aller Objektbesichtigungen'
            },
            {
              icon: '🏢',
              title: 'Gebäudesanierung',
              description: 'Sie haben große Sanierungsprojekte und benötigen professionelle Bürobetreuung.',
              result: 'Vollständige Übernahme aller Büroaufgaben'
            },
            {
              icon: '📈',
              title: 'Mehr Aufträge',
              description: 'Sie möchten mehr Sanierungsaufträge gewinnen.',
              result: '25% mehr Anfragen durch professionelle Online-Präsenz'
            }
          ]}
        />

        <CTASection
          title="Mehr Zeit für Ihre Sanierungsprojekte"
          description="Lassen Sie uns gemeinsam die optimale Lösung für Ihr Sanierungsunternehmen finden. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

