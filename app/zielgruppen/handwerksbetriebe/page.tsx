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


export default function HandwerksbetriebePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Handwerksbetriebe"
          subtitle="Zielgruppe"
          description="Professionelle Bürodienstleistungen speziell für Handwerksbetriebe"
          backgroundImage="/images/herobackgeneral3.png"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white dark:bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Die Herausforderungen von Handwerksbetrieben
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Als Handwerksbetrieb haben Sie viele Aufgaben zu bewältigen: Kundenbetreuung,
                Terminplanung, Angebotserstellung, Materialbestellung und natürlich die
                handwerkliche Arbeit selbst. Oft bleibt für Büroaufgaben wenig Zeit.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Wir übernehmen die Büroarbeit, damit Sie sich auf Ihr Handwerk konzentrieren können.
              </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Unsere Lösungen für Handwerksbetriebe
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                    <span className="text-[#cb530a] dark:text-[#182c30] mr-2">📞</span>
                    Telefonservice
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Keine verpassten Anrufe mehr, auch wenn Sie auf der Baustelle sind. Professionelle
                    Kundenbetreuung während Ihrer Arbeitszeiten.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                    <span className="text-[#cb530a] dark:text-[#182c30] mr-2">📅</span>
                    Terminorganisation
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Optimale Planung Ihrer Kundentermine. Wir koordinieren Ihren Kalender und sorgen
                    für effiziente Terminverteilung.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                    <span className="text-[#cb530a] dark:text-[#182c30] mr-2">📱</span>
                    Social Media
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Zeigen Sie Ihre Arbeit online. Professionelle Social Media Betreuung für mehr
                    Sichtbarkeit und neue Kunden.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                    <span className="text-[#cb530a] dark:text-[#182c30] mr-2">⭐</span>
                    Google Bewertungen
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Mehr positive Bewertungen und professionelles Bewertungsmanagement für ein
                    besseres Online-Image.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#fef3ed] dark:bg-gray-900 rounded-lg p-8 text-center border border-[#fef3ed] dark:border-gray-800">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Mehr Zeit für Ihr Handwerk
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Lassen Sie uns Ihre Büroaufgaben übernehmen und gewinnen Sie wertvolle Zeit für
                Ihre Kernkompetenzen.
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
            { value: 50, suffix: '%', label: 'Zeitersparnis', icon: '⏰' },
            { value: 100, suffix: '%', label: 'Anrufe entgegengenommen', icon: '📞' },
            { value: 0, suffix: '', label: 'Verpasste Termine', icon: '✅' },
            { value: 30, suffix: '%', label: 'Mehr Aufträge', icon: '📈' }
          ]}
          title="Ihre Vorteile als Handwerksbetrieb"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '📞',
              title: 'Telefonservice',
              description: 'Keine verpassten Anrufe mehr, auch wenn Sie auf der Baustelle sind. Professionelle Kundenbetreuung während Ihrer Arbeitszeiten.'
            },
            {
              icon: '📅',
              title: 'Terminorganisation',
              description: 'Optimale Planung Ihrer Kundentermine. Wir koordinieren Ihren Kalender und sorgen für effiziente Terminverteilung.'
            },
            {
              icon: '📱',
              title: 'Social Media',
              description: 'Zeigen Sie Ihre Arbeit online. Professionelle Social Media Betreuung für mehr Sichtbarkeit und neue Kunden.'
            },
            {
              icon: '⭐',
              title: 'Google Bewertungen',
              description: 'Mehr positive Bewertungen und professionelles Bewertungsmanagement für ein besseres Online-Image.'
            },
            {
              icon: '📊',
              title: 'Dokumentation',
              description: 'Vollständige Dokumentation aller Aktivitäten mit monatlichen Reports für volle Transparenz.'
            },
            {
              icon: '⚡',
              title: 'Mehr Zeit',
              description: 'Konzentrieren Sie sich auf Ihr Handwerk - wir übernehmen alle Büroaufgaben.'
            }
          ]}
          title="Vollständige Bürodienstleistungen für Handwerksbetriebe"
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
          title="Mit vs. Ohne Muckenfuss & Nagel"
        />

        <UseCasesSection
          useCases={[
            {
              icon: '🔧',
              title: 'Elektriker',
              description: 'Sie sind den ganzen Tag auf Montage und können nicht ans Telefon.',
              result: 'Keine verpassten Aufträge - wir nehmen alle Anfragen entgegen'
            },
            {
              icon: '🚿',
              title: 'Sanitärbetrieb',
              description: 'Sie haben viele Notfälle und können Termine nicht optimal planen.',
              result: 'Optimale Terminplanung - auch für Notfälle'
            },
            {
              icon: '🔨',
              title: 'Malerbetrieb',
              description: 'Sie möchten mehr Kunden gewinnen, haben aber keine Zeit für Social Media.',
              result: '30% mehr Anfragen durch professionelle Online-Präsenz'
            }
          ]}
          title="Beispiele aus der Praxis"
        />

        <CTASection
          title="Mehr Zeit für Ihr Handwerk"
          description="Lassen Sie uns Ihre Büroaufgaben übernehmen und gewinnen Sie wertvolle Zeit für Ihre Kernkompetenzen. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

