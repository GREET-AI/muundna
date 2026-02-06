import HeroSection from '../../components/HeroSection';
import Footer from '../../components/Footer';
import CookieBanner from '../../components/CookieBanner';
import ProcessSection from '../../components/ProcessSection';
import StatsSection from '../../components/StatsSection';
import FeaturesGridSection from '../../components/FeaturesGridSection';
import ComparisonSection from '../../components/ComparisonSection';
import UseCasesSection from '../../components/UseCasesSection';
import CTASection from '../../components/CTASection';
import ExpertiseCTABanner from '../../components/ExpertiseCTABanner';
import Link from 'next/link';
import Image from 'next/image';
import { getRoute } from '../../utils/routes';
import AnimatedList from '../../components/ui/AnimatedList';

export default function TelefonservicePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection
          title="Telefonservice & Kommunikation"
          subtitle="Dienstleistung"
          description="Professionelle telefonische Kundenbetreuung während Ihrer Arbeitszeiten"
          backgroundImage="/images/Dienstleistungen/Telefonieren.jpeg"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Ihre Vorteile
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Professionelle telefonische Kundenbetreuung – wir übernehmen Anrufe, beantworten Fragen und leiten wichtige Informationen weiter.
                  </p>
                </div>
                <div className="relative aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <Image src="/images/Dienstleistungen/Telefonieren.jpeg" alt="Telefonservice & Kommunikation" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Ihre Vorteile im Überblick
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <span className="text-[#cb530a] text-2xl mr-3">📞</span>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Keine verpassten Anrufe</h3>
                    <p className="text-gray-700">
                      Jeder Kundenanruf wird professionell entgegengenommen, auch wenn Sie auf der Baustelle sind.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-[#cb530a] text-2xl mr-3">💼</span>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Professionelle Ansprache</h3>
                    <p className="text-gray-700">
                      Ihre Kunden werden kompetent beraten und erhalten sofort Auskunft.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-[#cb530a] text-2xl mr-3">⚡</span>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Zeitersparnis</h3>
                    <p className="text-gray-700">
                      Konzentrieren Sie sich auf Ihr Handwerk, wir übernehmen die Kommunikation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-[#cb530a] text-2xl mr-3">📋</span>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Dokumentation</h3>
                    <p className="text-gray-700">
                      Alle Anrufe werden dokumentiert und Ihnen übersichtlich übermittelt.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Leistungsumfang
              </h2>
              <AnimatedList
                items={[
                  'Anrufentgegennahme: Professionelle Kundenansprache in Ihrem Namen',
                  'Terminvereinbarungen: Koordination und Planung von Kundenterminen',
                  'Anfragenbearbeitung: Beantwortung von Kundenfragen zu Leistungen und Preisen',
                  'Rückrufservice: Organisation von Rückrufen zu Ihren Wunschzeiten',
                  'Notfallservice: 24/7 Verfügbarkeit für dringende Anrufe (optional)',
                  'Dokumentation: Vollständige Erfassung aller Anrufe und Anfragen'
                ]}
              />
            </div>

            <div className="bg-[#fef3ed] rounded-lg p-8 text-center border border-[#fef3ed]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Bereit für professionellen Telefonservice?
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
            { value: 24, suffix: '/7', label: 'Verfügbarkeit', icon: '⏰' },
            { value: 50, suffix: '+', label: 'Zufriedene Kunden', icon: '😊' },
            { value: 2, suffix: ' Min', label: 'Durchschnittliche Antwortzeit', icon: '⚡' }
          ]}
          title="Ihre Zahlen sprechen für sich"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '🎯',
              title: 'Professionelle Ansprache',
              description: 'Ihre Kunden werden kompetent und freundlich beraten - immer im Namen Ihres Unternehmens.'
            },
            {
              icon: '📋',
              title: 'Vollständige Dokumentation',
              description: 'Jeder Anruf wird detailliert erfasst und Ihnen übersichtlich zur Verfügung gestellt.'
            },
            {
              icon: '⚡',
              title: 'Schnelle Reaktionszeiten',
              description: 'Keine verpassten Anrufe mehr - wir sind immer für Ihre Kunden da.'
            },
            {
              icon: '🔒',
              title: 'Datenschutz & Sicherheit',
              description: 'Alle Daten werden DSGVO-konform verarbeitet und sicher gespeichert.'
            },
            {
              icon: '📊',
              title: 'Detaillierte Reports',
              description: 'Monatliche Auswertungen mit allen wichtigen Kennzahlen und Trends.'
            },
            {
              icon: '🤝',
              title: 'Individuelle Betreuung',
              description: 'Maßgeschneiderte Lösungen für Ihr Unternehmen und Ihre Branche.'
            }
          ]}
          title="Warum unser Telefonservice überzeugt"
          description="Professionell, zuverlässig und immer für Sie da"
          columns={3}
        />

        <ComparisonSection
          items={[
            { feature: 'Anrufe entgegennehmen', ohne: 'Selbst erledigen', mit: 'Wir übernehmen' },
            { feature: 'Verfügbarkeit', ohne: 'Nur während Arbeitszeiten', mit: '24/7 möglich' },
            { feature: 'Dokumentation', ohne: 'Manuell & zeitaufwändig', mit: 'Automatisch & übersichtlich' },
            { feature: 'Kosten', ohne: 'Eigene Mitarbeiter', mit: 'Flexible Pakete' },
            { feature: 'Fokus auf Kerngeschäft', ohne: false, mit: true }
          ]}
        />

        <UseCasesSection
          useCases={[
            {
              icon: '🏗️',
              title: 'Bauunternehmen',
              description: 'Sie sind auf der Baustelle und können nicht ans Telefon gehen.',
              result: 'Keine verpassten Aufträge mehr - wir nehmen alle Anfragen entgegen'
            },
            {
              icon: '🔧',
              title: 'Handwerksbetrieb',
              description: 'Ihre Mitarbeiter sind im Außendienst und nicht erreichbar.',
              result: 'Professionelle Kundenbetreuung auch außerhalb der Geschäftszeiten'
            },
            {
              icon: '📈',
              title: 'Wachsendes Unternehmen',
              description: 'Sie haben mehr Anfragen als Kapazität für die Büroarbeit.',
              result: 'Skalierbare Lösung, die mit Ihrem Wachstum mitwächst'
            }
          ]}
        />

        <ProcessSection
          steps={[
            {
              number: '1',
              title: 'Kostenlose Beratung',
              description: 'Wir analysieren Ihre Bedürfnisse und erstellen ein individuelles Angebot',
              icon: '📞'
            },
            {
              number: '2',
              title: 'Einrichtung',
              description: 'Wir richten alle Systeme ein und schulen Ihr Team (falls gewünscht)',
              icon: '⚙️'
            },
            {
              number: '3',
              title: 'Start',
              description: 'Wir übernehmen Ihren Telefonservice und starten mit der Betreuung',
              icon: '🚀'
            },
            {
              number: '4',
              title: 'Dokumentation',
              description: 'Sie erhalten regelmäßige Berichte und haben volle Transparenz',
              icon: '📊'
            }
          ]}
        />

        <CTASection
          title="Bereit für professionellen Telefonservice?"
          description="Lassen Sie uns gemeinsam die optimale Lösung für Ihr Unternehmen finden. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

