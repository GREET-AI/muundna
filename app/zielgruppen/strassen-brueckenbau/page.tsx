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


export default function StrassenBrueckenbauPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Straßen- & Brückenbau"
          subtitle="Zielgruppe"
          description="Bürodienstleistungen für Straßen- und Brückenbauunternehmen"
          backgroundImage="/images/herobackgeneral6.png"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white dark:bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Expertise im Straßen- und Brückenbau
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Mit über 10 Jahren Erfahrung im Straßen- und Brückenbau verstehen wir die
                  besonderen Anforderungen dieser Branche. Wir unterstützen Sie bei der
                  professionellen Kundenbetreuung und Büroorganisation.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Unsere Leistungen
                </h2>
                <AnimatedList
                  items={[
                    'Professionelle Telefonbetreuung für Projektanfragen',
                    'Koordination von Baustellenbesichtigungen',
                    'Social Media Präsentation Ihrer Infrastrukturprojekte',
                    'Google Bewertungen von Auftraggebern',
                    'Vollständige Dokumentation aller Kommunikation',
                    'Regelmäßige Reports für Projektübersicht'
                  ]}
                />
              </div>

              <div className="bg-[#fef3ed] dark:bg-gray-900 rounded-lg p-8 text-center border border-[#fef3ed] dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Professionelle Unterstützung
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Lassen Sie uns gemeinsam die optimale Lösung für Ihr Unternehmen finden.
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
            { value: 10, suffix: '+', label: 'Jahre Branchenerfahrung', icon: '🎯' },
            { value: 100, suffix: '%', label: 'Projekte dokumentiert', icon: '📋' },
            { value: 24, suffix: '/7', label: 'Support verfügbar', icon: '🤝' },
            { value: 0, suffix: '', label: 'Verpasste Anfragen', icon: '✅' }
          ]}
          title="Ihre Vorteile im Straßen- & Brückenbau"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '🛣️',
              title: 'Projekt-Koordination',
              description: 'Professionelle Koordination aller Baustellenbesichtigungen und Projekttermine.'
            },
            {
              icon: '📞',
              title: 'Projektanfragen',
              description: 'Vollständige Übernahme der Kommunikation während Ihrer Projektarbeit.'
            },
            {
              icon: '📱',
              title: 'Infrastruktur-Präsentation',
              description: 'Professionelle Darstellung Ihrer Infrastrukturprojekte für mehr Aufträge.'
            },
            {
              icon: '⭐',
              title: 'Auftraggeber-Bewertungen',
              description: 'Aufbau einer starken Reputation durch professionelles Management.'
            },
            {
              icon: '📊',
              title: 'Projekt-Dokumentation',
              description: 'Vollständige Dokumentation für Ihre Projektabrechnung.'
            },
            {
              icon: '🚀',
              title: 'Wachstum',
              description: 'Skalierbare Lösungen für wachsende Unternehmen.'
            }
          ]}
          title="Spezialisiert auf Straßen- & Brückenbau"
          columns={3}
        />

        <ComparisonSection
          items={[
            { feature: 'Büroarbeit', ohne: 'Eigene Mitarbeiter', mit: 'Wir übernehmen' },
            { feature: 'Fokus', ohne: 'Aufgeteilt', mit: '100% auf Projekte' },
            { feature: 'Koordination', ohne: 'Manuell & zeitaufwändig', mit: 'Automatisch & optimiert' },
            { feature: 'Kosten', ohne: 'Fixe Personalkosten', mit: 'Variable Pakete' },
            { feature: 'Expertise', ohne: 'Allgemein', mit: 'Bauspezifisch' }
          ]}
        />

        <UseCasesSection
          useCases={[
            {
              icon: '🛣️',
              title: 'Straßenbauprojekte',
              description: 'Sie haben große Straßenbauprojekte und benötigen Unterstützung bei der Koordination.',
              result: 'Optimale Projektkoordination ohne zusätzliche Personalkosten'
            },
            {
              icon: '🌉',
              title: 'Brückenbau',
              description: 'Komplexe Brückenbauprojekte erfordern professionelle Bürobetreuung.',
              result: 'Vollständige Übernahme aller Büroaufgaben'
            },
            {
              icon: '📈',
              title: 'Mehr Aufträge',
              description: 'Sie möchten mehr Infrastrukturprojekte gewinnen.',
              result: '30% mehr Anfragen durch professionelle Online-Präsenz'
            }
          ]}
        />

        <CTASection
          title="Professionelle Unterstützung"
          description="Lassen Sie uns gemeinsam die optimale Lösung für Ihr Straßen- oder Brückenbauunternehmen finden. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

