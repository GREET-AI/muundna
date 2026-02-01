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


export default function HochTiefbauPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Hoch- & Tiefbau"
          subtitle="Zielgruppe"
          description="Professionelle Bürodienstleistungen für Hoch- und Tiefbauunternehmen"
          backgroundImage="/images/herobackgeneral5.png"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white dark:bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Spezialisiert auf Hoch- und Tiefbau
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Als Hoch- und Tiefbauunternehmen haben Sie komplexe Projekte zu koordinieren.
                  Wir unterstützen Sie bei allen Büroaufgaben, damit Sie sich auf die Planung
                  und Ausführung Ihrer Bauprojekte konzentrieren können.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Unsere Leistungen für Hoch- & Tiefbau
                </h2>
                <AnimatedList
                  items={[
                    'Telefonservice für Baustellenanfragen',
                    'Terminorganisation für Baustellenbesichtigungen',
                    'Social Media Präsentation Ihrer Projekte',
                    'Google Bewertungen von zufriedenen Kunden',
                    'Dokumentation aller Kommunikation und Termine',
                    'Monatliche Reports über alle Aktivitäten'
                  ]}
                />
              </div>

              <div className="bg-[#fef3ed] dark:bg-gray-900 rounded-lg p-8 text-center border border-[#fef3ed] dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Optimieren Sie Ihre Effizienz
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Lassen Sie uns gemeinsam die optimale Lösung für Ihr Hoch- oder Tiefbauunternehmen finden.
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
            { value: 100, suffix: '%', label: 'Projekte koordiniert', icon: '🏗️' },
            { value: 50, suffix: '%', label: 'Zeitersparnis', icon: '⏰' },
            { value: 24, suffix: '/7', label: 'Support verfügbar', icon: '🤝' },
            { value: 0, suffix: '', label: 'Verpasste Termine', icon: '✅' }
          ]}
          title="Ihre Vorteile im Hoch- & Tiefbau"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '🏗️',
              title: 'Projekt-Koordination',
              description: 'Professionelle Koordination aller Baustellenbesichtigungen und Projekttermine.'
            },
            {
              icon: '📞',
              title: 'Baustellenanfragen',
              description: 'Vollständige Übernahme der Kommunikation während Ihrer Projektarbeit.'
            },
            {
              icon: '📱',
              title: 'Projekt-Präsentation',
              description: 'Professionelle Darstellung Ihrer Projekte für mehr Aufträge.'
            },
            {
              icon: '⭐',
              title: 'Reputation',
              description: 'Aufbau einer starken Online-Reputation durch professionelles Management.'
            },
            {
              icon: '📊',
              title: 'Dokumentation',
              description: 'Vollständige Dokumentation für Ihre Projektabrechnung.'
            },
            {
              icon: '🚀',
              title: 'Wachstum',
              description: 'Skalierbare Lösungen für wachsende Unternehmen.'
            }
          ]}
          title="Spezialisiert auf Hoch- & Tiefbau"
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
              icon: '🏢',
              title: 'Großprojekte',
              description: 'Sie haben mehrere Großprojekte parallel und benötigen Unterstützung bei der Koordination.',
              result: 'Optimale Projektkoordination ohne zusätzliche Personalkosten'
            },
            {
              icon: '📈',
              title: 'Wachstum',
              description: 'Ihr Unternehmen wächst und Sie benötigen mehr Bürokapazität.',
              result: 'Skalierbare Lösung ohne langfristige Bindungen'
            },
            {
              icon: '🎯',
              title: 'Neue Aufträge',
              description: 'Sie möchten mehr Aufträge gewinnen, haben aber keine Zeit für Marketing.',
              result: '30% mehr Anfragen durch professionelle Online-Präsenz'
            }
          ]}
        />

        <CTASection
          title="Optimieren Sie Ihre Effizienz"
          description="Lassen Sie uns gemeinsam die optimale Lösung für Ihr Hoch- oder Tiefbauunternehmen finden. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

