import Header from '../../components/Header';
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
import { getRoute } from '../../utils/routes';


export default function GoogleBewertungenPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Google Bewertungen"
          subtitle="Dienstleistung"
          description="Optimierung und Betreuung Ihrer Google Bewertungen für mehr Vertrauen"
          backgroundImage="/images/herobackgeneral6.png"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Warum Google Bewertungen wichtig sind
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Über 80% der Kunden lesen vor der Auftragsvergabe die Google Bewertungen eines
                Handwerkers oder Bauunternehmens. Positive Bewertungen steigern nicht nur Ihre
                Sichtbarkeit, sondern auch das Vertrauen potenzieller Kunden. Wir helfen Ihnen,
                mehr positive Bewertungen zu erhalten und professionell mit allen Bewertungen
                umzugehen.
              </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Unsere Leistungen
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">⭐</span>
                    Bewertungsmanagement
                  </h3>
                  <p className="text-gray-700">
                    Professionelle Verwaltung und Überwachung aller Ihrer Google Bewertungen.
                    Regelmäßige Kontrolle und Analyse Ihrer Bewertungsentwicklung.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">📧</span>
                    Kundenanfragen für Bewertungen
                  </h3>
                  <p className="text-gray-700">
                    Professionelle Anfragen bei zufriedenen Kunden um positive Bewertungen zu erhalten.
                    Wir kontaktieren Ihre Kunden im richtigen Moment und auf die richtige Art.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">💬</span>
                    Reaktionsservice
                  </h3>
                  <p className="text-gray-700">
                    Professionelle Antworten auf alle Bewertungen - positiv wie negativ.
                    Zeigen Sie Ihren Kunden, dass Ihnen Feedback wichtig ist.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">📊</span>
                    Monitoring & Analyse
                  </h3>
                  <p className="text-gray-700">
                    Kontinuierliche Überwachung Ihrer Bewertungen und Analyse von Trends.
                    Identifikation von Verbesserungspotenzialen.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">🎯</span>
                    Strategische Optimierung
                  </h3>
                  <p className="text-gray-700">
                    Entwicklung von Strategien zur Steigerung positiver Bewertungen.
                    Langfristige Verbesserung Ihres Online-Images.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#fef3ed] rounded-lg p-8 text-center border border-[#fef3ed]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Verbessern Sie Ihr Online-Image
              </h3>
              <p className="text-gray-700 mb-6">
                Lassen Sie uns gemeinsam Ihre Google Bewertungen optimieren und mehr Vertrauen bei potenziellen Kunden schaffen.
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
            { value: 80, suffix: '%', label: 'Kunden lesen Bewertungen', icon: '👀' },
            { value: 4.5, suffix: '★', label: 'Durchschnittliche Bewertung', icon: '⭐' },
            { value: 150, suffix: '+', label: 'Neue Bewertungen/Monat', icon: '📈' },
            { value: 95, suffix: '%', label: 'Positive Bewertungen', icon: '😊' }
          ]}
          title="Ihre Bewertungen im Überblick"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '⭐',
              title: 'Bewertungsmanagement',
              description: 'Professionelle Verwaltung und Überwachung aller Google Bewertungen.'
            },
            {
              icon: '📧',
              title: 'Kundenanfragen',
              description: 'Strategische Anfragen bei zufriedenen Kunden für mehr positive Bewertungen.'
            },
            {
              icon: '💬',
              title: 'Reaktionsservice',
              description: 'Professionelle Antworten auf alle Bewertungen - positiv wie negativ.'
            },
            {
              icon: '📊',
              title: 'Monitoring & Analyse',
              description: 'Kontinuierliche Überwachung und Analyse Ihrer Bewertungsentwicklung.'
            },
            {
              icon: '🎯',
              title: 'Strategische Optimierung',
              description: 'Entwicklung von Strategien zur langfristigen Verbesserung Ihres Images.'
            },
            {
              icon: '🔒',
              title: 'DSGVO-konform',
              description: 'Alle Anfragen erfolgen vollständig DSGVO-konform und datenschutzgerecht.'
            }
          ]}
          title="Vollständige Bewertungsbetreuung"
          columns={3}
        />

        <ComparisonSection
          items={[
            { feature: 'Bewertungen erhalten', ohne: 'Selbst aktiv werden', mit: 'Wir übernehmen' },
            { feature: 'Bewertungen verwalten', ohne: 'Manuell & zeitaufwändig', mit: 'Automatisch & professionell' },
            { feature: 'Auf Bewertungen antworten', ohne: 'Nur sporadisch', mit: 'Auf alle Bewertungen' },
            { feature: 'Bewertungsanalyse', ohne: 'Keine Auswertung', mit: 'Detaillierte Reports' },
            { feature: 'Online-Image', ohne: 'Unkontrolliert', mit: 'Professionell gemanagt' }
          ]}
        />

        <UseCasesSection
          useCases={[
            {
              icon: '📱',
              title: 'Mehr Sichtbarkeit',
              description: 'Steigern Sie Ihre Position in Google-Suchergebnissen durch positive Bewertungen.',
              result: 'Durchschnittlich 40% mehr Klickrate in Google Maps'
            },
            {
              icon: '🤝',
              title: 'Vertrauen aufbauen',
              description: 'Zeigen Sie potenziellen Kunden, dass andere zufrieden waren.',
              result: 'Erhöhte Conversion-Rate durch mehr Vertrauen'
            },
            {
              icon: '⭐',
              title: 'Wettbewerbsvorteil',
              description: 'Stehen Sie mit besseren Bewertungen über Ihren Mitbewerbern.',
              result: 'Mehr Aufträge durch bessere Positionierung'
            }
          ]}
        />

        <ProcessSection
          steps={[
            {
              number: '1',
              title: 'Analyse',
              description: 'Wir analysieren Ihre aktuelle Bewertungssituation und identifizieren Potenziale',
              icon: '📊'
            },
            {
              number: '2',
              title: 'Strategie',
              description: 'Entwicklung einer maßgeschneiderten Strategie für mehr positive Bewertungen',
              icon: '🎯'
            },
            {
              number: '3',
              title: 'Umsetzung',
              description: 'Professionelle Kundenanfragen und kontinuierliches Bewertungsmanagement',
              icon: '🚀'
            },
            {
              number: '4',
              title: 'Optimierung',
              description: 'Regelmäßige Analyse und kontinuierliche Optimierung Ihrer Bewertungsstrategie',
              icon: '📈'
            }
          ]}
        />

        <CTASection
          title="Verbessern Sie Ihr Online-Image"
          description="Lassen Sie uns gemeinsam Ihre Google Bewertungen optimieren und mehr Vertrauen bei potenziellen Kunden schaffen. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

