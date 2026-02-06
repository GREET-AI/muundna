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
import Image from 'next/image';
import { getRoute } from '../../utils/routes';


export default function TerminorganisationPage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection
          title="Terminorganisation"
          subtitle="Dienstleistung"
          description="Effiziente Planung und Organisation Ihrer Kundentermine"
          backgroundImage="/images/Dienstleistungen/Termenirung.jpeg"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Optimale Terminplanung für Ihr Unternehmen
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Als Handwerksbetrieb oder Bauunternehmen haben Sie viele Termine zu koordinieren:
                    Kundentermine, Baustellenbesichtigungen, Angebotserstellungen und mehr. Wir übernehmen
                    die komplette Terminorganisation und sorgen dafür, dass Ihr Kalender optimal ausgelastet ist.
                  </p>
                </div>
                <div className="relative aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <Image src="/images/Dienstleistungen/Termenirung.jpeg" alt="Terminorganisation" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              </div>
            <div className="max-w-4xl mx-auto">

            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Leistungsumfang
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <span className="text-[#cb530a] mr-2">📅</span>
                    Kalenderverwaltung
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Zentrale Verwaltung aller Termine in einem übersichtlichen System
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <span className="text-[#cb530a] mr-2">🔄</span>
                    Terminkoordination
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Abstimmung mit Kunden, Kollegen und Partnern für optimale Terminplanung
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <span className="text-[#cb530a] mr-2">⏰</span>
                    Erinnerungsservice
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Automatische Erinnerungen für Sie und Ihre Kunden vor wichtigen Terminen
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <span className="text-[#cb530a] mr-2">🚫</span>
                    Konfliktvermeidung
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Prüfung auf Terminüberschneidungen und alternative Lösungsvorschläge
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <span className="text-[#cb530a] mr-2">📊</span>
                    Monatliche Übersichten
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Regelmäßige Reports mit Terminübersicht und Auslastungsanalyse
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <span className="text-[#cb530a] mr-2">📱</span>
                    Mobile Verfügbarkeit
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Zugriff auf Ihren Kalender von überall - auch auf der Baustelle
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#fef3ed] rounded-lg p-8 text-center border border-[#fef3ed]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Mehr Zeit für Ihr Handwerk
              </h3>
              <p className="text-gray-700 mb-6">
                Lassen Sie uns Ihre Termine organisieren und gewinnen Sie wertvolle Zeit für Ihre Kernkompetenzen.
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
          </div>
        </section>

        <StatsSection
          stats={[
            { value: 95, suffix: '%', label: 'Termine optimal geplant', icon: '📅' },
            { value: 50, suffix: '%', label: 'Zeitersparnis', icon: '⏰' },
            { value: 0, suffix: '', label: 'Verpasste Termine', icon: '✅' },
            { value: 100, suffix: '%', label: 'Kundenzufriedenheit', icon: '😊' }
          ]}
          title="Effiziente Terminorganisation in Zahlen"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '📅',
              title: 'Zentrale Kalenderverwaltung',
              description: 'Alle Termine an einem Ort - übersichtlich und immer aktuell.'
            },
            {
              icon: '🔄',
              title: 'Intelligente Koordination',
              description: 'Automatische Prüfung auf Überschneidungen und optimale Terminverteilung.'
            },
            {
              icon: '⏰',
              title: 'Erinnerungsservice',
              description: 'Automatische Erinnerungen für Sie und Ihre Kunden vor wichtigen Terminen.'
            },
            {
              icon: '📱',
              title: 'Mobile Verfügbarkeit',
              description: 'Zugriff auf Ihren Kalender von überall - auch auf der Baustelle.'
            },
            {
              icon: '🚫',
              title: 'Konfliktvermeidung',
              description: 'Frühzeitige Erkennung von Terminüberschneidungen mit Lösungsvorschlägen.'
            },
            {
              icon: '📊',
              title: 'Auslastungsanalyse',
              description: 'Regelmäßige Reports zur optimalen Planung Ihrer Kapazitäten.'
            }
          ]}
          title="Vollständige Terminorganisation"
          columns={3}
        />

        <ComparisonSection
          items={[
            { feature: 'Terminplanung', ohne: 'Manuell & zeitaufwändig', mit: 'Automatisch & optimiert' },
            { feature: 'Überschneidungen', ohne: 'Häufig', mit: 'Nie' },
            { feature: 'Erinnerungen', ohne: 'Selbst organisieren', mit: 'Automatisch' },
            { feature: 'Zeitaufwand', ohne: '2-3 Stunden/Woche', mit: '0 Stunden für Sie' },
            { feature: 'Kundenzufriedenheit', ohne: 'Durchschnittlich', mit: 'Sehr hoch' }
          ]}
        />

        <UseCasesSection
          useCases={[
            {
              icon: '🏗️',
              title: 'Mehrere Baustellen',
              description: 'Sie haben parallel mehrere Projekte und müssen Termine koordinieren.',
              result: 'Optimale Auslastung ohne Überschneidungen'
            },
            {
              icon: '📞',
              title: 'Viele Anfragen',
              description: 'Sie erhalten täglich viele Terminanfragen von Kunden.',
              result: 'Keine verpassten Termine mehr - alles wird professionell koordiniert'
            },
            {
              icon: '⏰',
              title: 'Zeit sparen',
              description: 'Sie verbringen zu viel Zeit mit Terminplanung statt mit Ihrem Handwerk.',
              result: '50% mehr Zeit für Ihr Kerngeschäft'
            }
          ]}
        />

        <ProcessSection
          steps={[
            {
              number: '1',
              title: 'Kalender-Setup',
              description: 'Wir richten Ihr Kalendersystem ein und integrieren alle relevanten Termine',
              icon: '📅'
            },
            {
              number: '2',
              title: 'Termin-Koordination',
              description: 'Wir koordinieren alle neuen Termine und prüfen auf Überschneidungen',
              icon: '🔄'
            },
            {
              number: '3',
              title: 'Erinnerungen',
              description: 'Automatische Erinnerungen für Sie und Ihre Kunden vor wichtigen Terminen',
              icon: '⏰'
            },
            {
              number: '4',
              title: 'Reporting',
              description: 'Monatliche Übersichten mit Auslastungsanalyse und Optimierungsvorschlägen',
              icon: '📊'
            }
          ]}
        />

        <CTASection
          title="Mehr Zeit für Ihr Handwerk"
          description="Lassen Sie uns Ihre Termine organisieren und gewinnen Sie wertvolle Zeit für Ihre Kernkompetenzen. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

