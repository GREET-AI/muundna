import Header from '../../components/Header';
import HeroSection from '../../components/HeroSection';
import Footer from '../../components/Footer';
import CookieBanner from '../../components/CookieBanner';
import StatsSection from '../../components/StatsSection';
import FeaturesGridSection from '../../components/FeaturesGridSection';
import ComparisonSection from '../../components/ComparisonSection';
import UseCasesSection from '../../components/UseCasesSection';
import ProcessSection from '../../components/ProcessSection';
import CTASection from '../../components/CTASection';
import ExpertiseCTABanner from '../../components/ExpertiseCTABanner';
import Link from 'next/link';
import { getRoute } from '../../utils/routes';
import AnimatedList from '../../components/ui/AnimatedList';


export default function DachdeckerZimmermännerPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Dachdecker & Zimmermänner"
          subtitle="Zielgruppe"
          description="Professionelle Betreuung für Dachdecker und Zimmermänner"
          backgroundImage="/images/herobackgeneral3.png"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Für Dachdecker & Zimmermänner
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Als Dachdecker oder Zimmermann arbeiten Sie oft in großer Höhe und benötigen
                  Unterstützung bei der Büroarbeit. Wir übernehmen die Kommunikation und
                  Terminorganisation, damit Sie sich auf Ihr Handwerk konzentrieren können.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Unsere Leistungen
                </h2>
                <AnimatedList
                  items={[
                    'Telefonservice während Ihrer Arbeitszeiten auf dem Dach',
                    'Terminorganisation für Dachbesichtigungen',
                    'Social Media Präsentation Ihrer Dach- und Holzarbeiten',
                    'Google Bewertungen von zufriedenen Kunden',
                    'Vollständige Dokumentation aller Anfragen',
                    'Regelmäßige Reports für Übersicht'
                  ]}
                />
              </div>

              <div className="bg-[#fef3ed] rounded-lg p-8 text-center border border-[#fef3ed]">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Professionelle Unterstützung
                </h3>
                <p className="text-gray-700 mb-6">
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
            { value: 100, suffix: '%', label: 'Anrufe entgegengenommen', icon: '📞' },
            { value: 50, suffix: '%', label: 'Zeitersparnis', icon: '⏰' },
            { value: 0, suffix: '', label: 'Verpasste Termine', icon: '✅' },
            { value: 30, suffix: '%', label: 'Mehr Aufträge', icon: '📈' }
          ]}
          title="Ihre Vorteile als Dachdecker & Zimmermann"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '🏠',
              title: 'Dachbesichtigungen',
              description: 'Professionelle Koordination aller Dachbesichtigungen und Kundentermine.'
            },
            {
              icon: '📞',
              title: 'Telefonservice',
              description: 'Keine verpassten Anrufe mehr, auch wenn Sie auf dem Dach arbeiten.'
            },
            {
              icon: '📱',
              title: 'Projekt-Showcase',
              description: 'Professionelle Darstellung Ihrer Dach- und Holzarbeiten für mehr Aufträge.'
            },
            {
              icon: '⭐',
              title: 'Kundenbewertungen',
              description: 'Aufbau einer starken Reputation durch professionelles Management.'
            },
            {
              icon: '📊',
              title: 'Dokumentation',
              description: 'Vollständige Dokumentation für Ihre Projektabrechnung.'
            },
            {
              icon: '⚡',
              title: 'Mehr Zeit',
              description: 'Konzentrieren Sie sich auf Ihre Arbeit auf dem Dach.'
            }
          ]}
          title="Spezialisiert auf Dachdecker & Zimmermänner"
          columns={3}
        />

        <ComparisonSection
          items={[
            { feature: 'Büroarbeit', ohne: 'Selbst erledigen', mit: 'Wir übernehmen' },
            { feature: 'Fokus', ohne: 'Aufgeteilt', mit: '100% auf Ihr Handwerk' },
            { feature: 'Zeitaufwand', ohne: 'Mehrere Stunden/Tag', mit: '0 Stunden für Sie' },
            { feature: 'Kosten', ohne: 'Eigene Mitarbeiter', mit: 'Flexible Pakete' },
            { feature: 'Wachstum', ohne: 'Begrenzt', mit: 'Skalierbar' }
          ]}
        />

        <UseCasesSection
          useCases={[
            {
              icon: '🏠',
              title: 'Dachdecker',
              description: 'Sie arbeiten auf dem Dach und können nicht ans Telefon gehen.',
              result: 'Keine verpassten Aufträge - wir nehmen alle Anfragen entgegen'
            },
            {
              icon: '🪵',
              title: 'Zimmermann',
              description: 'Sie sind auf der Baustelle und benötigen Unterstützung bei der Büroarbeit.',
              result: 'Optimale Terminplanung - auch für Notfälle'
            },
            {
              icon: '📈',
              title: 'Mehr Aufträge',
              description: 'Sie möchten mehr Kunden gewinnen, haben aber keine Zeit für Marketing.',
              result: '30% mehr Anfragen durch professionelle Online-Präsenz'
            }
          ]}
        />

        <ProcessSection
          steps={[
            {
              number: '1',
              title: 'Kostenlose Beratung',
              description: 'Wir analysieren Ihre spezifischen Bedürfnisse als Dachdecker oder Zimmermann',
              icon: '📞'
            },
            {
              number: '2',
              title: 'Maßgeschneiderte Lösung',
              description: 'Entwicklung einer individuellen Lösung für Ihre Arbeitsweise',
              icon: '⚙️'
            },
            {
              number: '3',
              title: 'Start',
              description: 'Wir übernehmen Ihre Büroaufgaben und Sie können sich auf Ihr Handwerk konzentrieren',
              icon: '🚀'
            },
            {
              number: '4',
              title: 'Kontinuierliche Betreuung',
              description: 'Regelmäßige Reports und Anpassung an Ihre Bedürfnisse',
              icon: '📊'
            }
          ]}
        />

        <CTASection
          title="Professionelle Unterstützung"
          description="Lassen Sie uns gemeinsam die optimale Lösung für Ihr Unternehmen finden. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

