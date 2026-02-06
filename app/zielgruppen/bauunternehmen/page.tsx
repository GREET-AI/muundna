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


export default function BauunternehmenPage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection
          title="Bauunternehmen"
          subtitle="Zielgruppe"
          description="Professionelle Bürodienstleistungen für Bauunternehmen"
          backgroundImage="/images/Bauunternehmen.png"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Effizienz für Bauunternehmen
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Als Bauunternehmen haben Sie viele Projekte gleichzeitig zu koordinieren. Die
                Verwaltung von Kundenanfragen, Terminen, Angeboten und Kommunikation kann
                zeitaufwändig sein.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Wir unterstützen Sie bei allen Büroaufgaben, damit Sie sich auf die Planung und
                Ausführung Ihrer Bauprojekte konzentrieren können.
              </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Unsere Leistungen für Bauunternehmen
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Telefonservice</h3>
                  <p className="text-gray-700 text-sm">
                    Professionelle Kundenbetreuung und Anfragenbearbeitung
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Terminorganisation</h3>
                  <p className="text-gray-700 text-sm">
                    Koordination von Baustellenbesichtigungen und Kundenterminen
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Social Media</h3>
                  <p className="text-gray-700 text-sm">
                    Präsentation Ihrer Projekte und Expertise online
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Google Bewertungen</h3>
                  <p className="text-gray-700 text-sm">
                    Aufbau einer starken Online-Reputation
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#fef3ed] rounded-lg p-8 text-center border border-[#fef3ed]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Optimieren Sie Ihre Effizienz
              </h3>
              <p className="text-gray-700 mb-6">
                Lassen Sie uns gemeinsam die optimale Lösung für Ihr Bauunternehmen finden.
              </p>
              <Link
                href={getRoute('Kontakt')}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#cb530a] text-white font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors text-lg"
              >
                Jetzt unverbindlich anfragen
              </Link>
            </div>
          </div>
        </section>

        <StatsSection
          stats={[
            { value: 40, suffix: '%', label: 'Mehr Effizienz', icon: '⚡' },
            { value: 100, suffix: '%', label: 'Projekte dokumentiert', icon: '📋' },
            { value: 24, suffix: '/7', label: 'Optionale Erreichbarkeit', icon: '🤝' },
            { value: 10, suffix: '+', label: 'Jahre Erfahrung im Bauumfeld', icon: '🏗️' }
          ]}
          title="Ihre Vorteile als Bauunternehmen"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '🏗️',
              title: 'Projekt-Koordination',
              description: 'Professionelle Koordination aller Projekte und Baustellenbesichtigungen.'
            },
            {
              icon: '📞',
              title: 'Kundenbetreuung',
              description: 'Vollständige Übernahme der Kundenkommunikation während Ihrer Projektarbeit.'
            },
            {
              icon: '📱',
              title: 'Online-Präsenz',
              description: 'Präsentation Ihrer Projekte und Expertise für mehr Aufträge.'
            },
            {
              icon: '⭐',
              title: 'Reputation',
              description: 'Aufbau einer starken Online-Reputation durch professionelles Bewertungsmanagement.'
            },
            {
              icon: '📊',
              title: 'Reporting',
              description: 'Vollständige Dokumentation aller Aktivitäten für Ihre Projektabrechnung.'
            },
            {
              icon: '🚀',
              title: 'Wachstum',
              description: 'Skalierbare Lösungen, die mit Ihrem Unternehmen mitwachsen.'
            }
          ]}
          title="Komplettlösung für Bauunternehmen"
          columns={3}
        />

        <ComparisonSection
          items={[
            { feature: 'Büroarbeit', ohne: 'Eigene Mitarbeiter', mit: 'Wir übernehmen' },
            { feature: 'Fokus', ohne: 'Aufgeteilt', mit: '100% auf Projekte' },
            { feature: 'Skalierung', ohne: 'Schwierig', mit: 'Flexibel & einfach' },
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
          description="Lassen Sie uns gemeinsam die optimale Lösung für Ihr Bauunternehmen finden. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

