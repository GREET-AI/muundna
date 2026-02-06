import HeroSection from '../../components/HeroSection';
import ExpertiseCTABanner from '../../components/ExpertiseCTABanner';
import Footer from '../../components/Footer';
import CookieBanner from '../../components/CookieBanner';
import StatsSection from '../../components/StatsSection';
import FeaturesGridSection from '../../components/FeaturesGridSection';
import ComparisonSection from '../../components/ComparisonSection';
import UseCasesSection from '../../components/UseCasesSection';
import ProcessSection from '../../components/ProcessSection';
import CTASection from '../../components/CTASection';
import Link from 'next/link';
import Image from 'next/image';
import { getRoute } from '../../utils/routes';


export default function DokumentationPage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection
          title="Dokumentation & Reporting"
          subtitle="Dienstleistung"
          description="Klare Dokumentation mit monatlichem Überblick über alle Aktivitäten"
          backgroundImage="/images/Dienstleistungen/Raport.jpeg"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Transparenz und Übersicht
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Sie behalten stets den Überblick über alle durchgeführten Leistungen und Aktivitäten.
                    Unsere monatlichen Reports geben Ihnen eine klare Übersicht über Anrufe, Termine,
                    Social Media Aktivitäten und mehr. So wissen Sie immer, was für Sie getan wurde.
                  </p>
                </div>
                <div className="relative aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <Image src="/images/Dienstleistungen/Raport.jpeg" alt="Dokumentation & Reporting" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              </div>
            <div className="max-w-4xl mx-auto">

            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Was enthalten unsere Reports?
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">📊</span>
                    Monatliche Übersichten
                  </h3>
                  <p className="text-gray-700">
                    Detaillierte Aufstellung aller durchgeführten Aktivitäten im vergangenen Monat.
                    Übersichtlich aufbereitet und leicht verständlich.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">📞</span>
                    Anrufstatistiken
                  </h3>
                  <p className="text-gray-700">
                    Anzahl der entgegengenommenen Anrufe, behandelten Anfragen und vereinbarten Termine.
                    Aufschlüsselung nach Kategorien.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">📅</span>
                    Terminübersichten
                  </h3>
                  <p className="text-gray-700">
                    Vollständige Liste aller organisierten Termine mit Details zu Kunden und Zweck.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">📱</span>
                    Social Media Aktivitäten
                  </h3>
                  <p className="text-gray-700">
                    Übersicht über veröffentlichte Posts, erreichte Reichweite und Engagement.
                    Kennzahlen und Entwicklungen.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">⭐</span>
                    Bewertungsentwicklung
                  </h3>
                  <p className="text-gray-700">
                    Entwicklung Ihrer Google Bewertungen, neue Bewertungen und Reaktionen.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">💰</span>
                    Transparente Abrechnung
                  </h3>
                  <p className="text-gray-700">
                    Klare Aufstellung aller Leistungen und Kosten. Keine versteckten Gebühren.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#fef3ed] rounded-lg p-8 text-center border border-[#fef3ed]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Immer im Bilde
              </h3>
              <p className="text-gray-700 mb-6">
                Mit unseren monatlichen Reports behalten Sie stets den Überblick über alle Aktivitäten.
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
            { value: 100, suffix: '%', label: 'Transparenz', icon: '📊' },
            { value: 1, suffix: 'x', label: 'Report pro Monat', icon: '📅' },
            { value: 10, suffix: '+', label: 'Kategorien dokumentiert', icon: '📋' },
            { value: 0, suffix: '', label: 'Versteckte Kosten', icon: '💰' }
          ]}
          title="Vollständige Transparenz"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '📊',
              title: 'Monatliche Übersichten',
              description: 'Detaillierte Aufstellung aller Aktivitäten - übersichtlich und leicht verständlich.'
            },
            {
              icon: '📞',
              title: 'Anrufstatistiken',
              description: 'Vollständige Dokumentation aller Anrufe mit Kategorisierung und Details.'
            },
            {
              icon: '📅',
              title: 'Terminübersichten',
              description: 'Komplette Liste aller organisierten Termine mit allen relevanten Informationen.'
            },
            {
              icon: '📱',
              title: 'Social Media Reports',
              description: 'Detaillierte Auswertungen Ihrer Social Media Performance mit Kennzahlen.'
            },
            {
              icon: '⭐',
              title: 'Bewertungsentwicklung',
              description: 'Übersicht über neue Bewertungen, Trends und Entwicklungen.'
            },
            {
              icon: '💰',
              title: 'Transparente Abrechnung',
              description: 'Klare Aufstellung aller Leistungen und Kosten - keine versteckten Gebühren.'
            }
          ]}
          title="Was enthalten unsere Reports?"
          columns={3}
        />

        <ComparisonSection
          items={[
            { feature: 'Dokumentation', ohne: 'Manuell & unvollständig', mit: 'Automatisch & vollständig' },
            { feature: 'Übersicht', ohne: 'Verstreut in verschiedenen Systemen', mit: 'Alles an einem Ort' },
            { feature: 'Reports', ohne: 'Selbst erstellen', mit: 'Monatlich automatisch' },
            { feature: 'Transparenz', ohne: 'Unklar', mit: '100% transparent' },
            { feature: 'Zeitaufwand', ohne: 'Mehrere Stunden/Monat', mit: '0 Stunden für Sie' }
          ]}
        />

        <UseCasesSection
          useCases={[
            {
              icon: '📊',
              title: 'Steuerliche Dokumentation',
              description: 'Sie benötigen Nachweise für Ihre Steuererklärung.',
              result: 'Vollständige Dokumentation aller Leistungen für den Steuerberater'
            },
            {
              icon: '📈',
              title: 'Performance-Analyse',
              description: 'Sie möchten sehen, welche Maßnahmen am erfolgreichsten waren.',
              result: 'Detaillierte Kennzahlen helfen bei strategischen Entscheidungen'
            },
            {
              icon: '🤝',
              title: 'Kundenkommunikation',
              description: 'Sie möchten Kunden zeigen, was für sie getan wurde.',
              result: 'Professionelle Reports für transparente Kundenkommunikation'
            }
          ]}
        />

        <ProcessSection
          steps={[
            {
              number: '1',
              title: 'Automatische Erfassung',
              description: 'Alle Aktivitäten werden automatisch und in Echtzeit dokumentiert',
              icon: '📝'
            },
            {
              number: '2',
              title: 'Kategorisierung',
              description: 'Intelligente Zuordnung zu verschiedenen Kategorien und Projekten',
              icon: '🏷️'
            },
            {
              number: '3',
              title: 'Aufbereitung',
              description: 'Monatliche Zusammenstellung aller Daten in übersichtlichen Reports',
              icon: '📊'
            },
            {
              number: '4',
              title: 'Übermittlung',
              description: 'Pünktliche Zusendung Ihrer Reports per E-Mail oder Online-Portal',
              icon: '📧'
            }
          ]}
        />

        <CTASection
          title="Immer im Bilde"
          description="Mit unseren monatlichen Reports behalten Sie stets den Überblick über alle Aktivitäten. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

