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


export default function SocialMediaPage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection
          title="Social Media Betreuung"
          subtitle="Dienstleistung"
          description="Professionelle Betreuung Ihrer Social Media Kanäle für mehr Sichtbarkeit"
          backgroundImage="/images/Dienstleistungen/SocialMedia.jpeg"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Warum Social Media für Handwerksbetriebe?
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Immer mehr Kunden suchen Handwerker und Bauunternehmen online. Eine professionelle
                    Social Media Präsenz hilft Ihnen, neue Kunden zu gewinnen und Ihr Unternehmen
                    positiv darzustellen. Wir übernehmen die komplette Betreuung Ihrer Social Media
                    Kanäle – von der Content-Erstellung bis zum Community Management.
                  </p>
                </div>
                <div className="relative aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <Image src="/images/Dienstleistungen/SocialMedia.jpeg" alt="Social Media Betreuung" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              </div>
            <div className="max-w-4xl mx-auto">

            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Unsere Leistungen
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">✍️</span>
                    Content-Erstellung
                  </h3>
                  <p className="text-gray-700">
                    Professionelle Texte, Bilder und Videos für Ihre Social Media Kanäle.
                    Wir zeigen Ihre Projekte, Ihre Expertise und Ihr Team.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">📅</span>
                    Posting & Scheduling
                  </h3>
                  <p className="text-gray-700">
                    Regelmäßige Posts zu optimalen Zeiten für maximale Reichweite.
                    Planung und Veröffentlichung Ihrer Inhalte.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">💬</span>
                    Community Management
                  </h3>
                  <p className="text-gray-700">
                    Professionelle Beantwortung von Kommentaren und Nachrichten.
                    Aufbau und Pflege Ihrer Online-Community.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">📊</span>
                    Analytics & Reporting
                  </h3>
                  <p className="text-gray-700">
                    Regelmäßige Auswertungen Ihrer Social Media Performance.
                    Monatliche Reports mit Kennzahlen und Optimierungsvorschlägen.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">🎯</span>
                    Markenaufbau
                  </h3>
                  <p className="text-gray-700">
                    Entwicklung einer konsistenten Markenidentität über alle Kanäle.
                    Steigerung Ihrer Bekanntheit und Reputation.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#fef3ed] rounded-lg p-8 text-center border border-[#fef3ed]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Steigern Sie Ihre Online-Präsenz
              </h3>
              <p className="text-gray-700 mb-6">
                Lassen Sie uns gemeinsam Ihre Social Media Strategie entwickeln und umsetzen.
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
            { value: 200, suffix: '+', label: 'Posts pro Monat', icon: '📱' },
            { value: 85, suffix: '%', label: 'Mehr Reichweite', icon: '📈' },
            { value: 3, suffix: 'x', label: 'Mehr Engagement', icon: '💬' },
            { value: 24, suffix: '/7', label: 'Community Management', icon: '🤝' }
          ]}
          title="Ihre Social Media Performance"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '✍️',
              title: 'Content-Erstellung',
              description: 'Professionelle Texte, Bilder und Videos, die Ihre Projekte und Expertise zeigen.'
            },
            {
              icon: '📅',
              title: 'Strategische Planung',
              description: 'Content-Kalender mit optimalen Posting-Zeiten für maximale Reichweite.'
            },
            {
              icon: '🎨',
              title: 'Markenidentität',
              description: 'Konsistente Darstellung Ihrer Marke über alle Social Media Kanäle.'
            },
            {
              icon: '📊',
              title: 'Analytics & Reporting',
              description: 'Detaillierte Auswertungen Ihrer Performance mit Optimierungsvorschlägen.'
            },
            {
              icon: '💬',
              title: 'Community Management',
              description: 'Professionelle Beantwortung von Kommentaren und Nachrichten.'
            },
            {
              icon: '🚀',
              title: 'Wachstumsstrategie',
              description: 'Gezielte Maßnahmen zur Steigerung Ihrer Follower und Reichweite.'
            }
          ]}
          title="Vollständige Social Media Betreuung"
          columns={3}
        />

        <ComparisonSection
          items={[
            { feature: 'Content-Erstellung', ohne: 'Selbst erstellen', mit: 'Wir übernehmen' },
            { feature: 'Posting-Frequenz', ohne: 'Unregelmäßig', mit: 'Regelmäßig & strategisch' },
            { feature: 'Community Management', ohne: 'Nur sporadisch', mit: '24/7 Betreuung' },
            { feature: 'Analytics', ohne: 'Keine Auswertung', mit: 'Detaillierte Reports' },
            { feature: 'Zeitaufwand', ohne: 'Mehrere Stunden/Woche', mit: '0 Stunden für Sie' }
          ]}
        />

        <UseCasesSection
          useCases={[
            {
              icon: '🏗️',
              title: 'Projekt-Showcase',
              description: 'Zeigen Sie Ihre abgeschlossenen Projekte und gewinnen Sie neue Kunden.',
              result: 'Durchschnittlich 30% mehr Anfragen durch Social Media'
            },
            {
              icon: '⭐',
              title: 'Reputation aufbauen',
              description: 'Stärken Sie Ihr Image als Experte in Ihrer Branche.',
              result: 'Erhöhte Glaubwürdigkeit und Vertrauen bei potenziellen Kunden'
            },
            {
              icon: '📱',
              title: 'Junge Zielgruppe erreichen',
              description: 'Erschließen Sie neue Kundengruppen über Social Media.',
              result: 'Erweiterte Zielgruppe und mehr Aufträge'
            }
          ]}
        />

        <ProcessSection
          steps={[
            {
              number: '1',
              title: 'Strategie-Entwicklung',
              description: 'Wir analysieren Ihre Zielgruppe und entwickeln eine passende Social Media Strategie',
              icon: '🎯'
            },
            {
              number: '2',
              title: 'Content-Planung',
              description: 'Erstellung eines Content-Kalenders mit passenden Themen und Posting-Zeiten',
              icon: '📅'
            },
            {
              number: '3',
              title: 'Umsetzung',
              description: 'Regelmäßige Posts, Community Management und kontinuierliche Optimierung',
              icon: '🚀'
            },
            {
              number: '4',
              title: 'Reporting',
              description: 'Monatliche Reports mit Kennzahlen und Handlungsempfehlungen',
              icon: '📊'
            }
          ]}
        />

        <CTASection
          title="Steigern Sie Ihre Online-Präsenz"
          description="Lassen Sie uns gemeinsam Ihre Social Media Strategie entwickeln und umsetzen. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

