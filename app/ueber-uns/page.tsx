import Footer from '../components/Footer';
import TeamHeroGrid from '../components/TeamHeroGrid';
import CookieBanner from '../components/CookieBanner';
import StatsSection from '../components/StatsSection';
import FeaturesGridSection from '../components/FeaturesGridSection';
import CTASection from '../components/CTASection';
import ExpertiseCTABanner from '../components/ExpertiseCTABanner';
import Link from 'next/link';
import { getRoute } from '../utils/routes';

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen">
      <main>
        <TeamHeroGrid />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    10+ Jahre Erfahrung im Bauwesen
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Muckenfuss & Nagel wurde von einem erfahrenen Bauprofi gegründet, der über 10 Jahre
                    praktische Erfahrung im Bauwesen gesammelt hat. Wir verstehen die Herausforderungen
                    und Bedürfnisse von Handwerksbetrieben und Bauunternehmen aus erster Hand.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Unsere Expertise umfasst Hoch- und Tiefbau, Straßenbau, Brückenbau, Sanierung von
                    Wohnobjekten sowie die Arbeit mit Dachdeckern und Zimmerleuten. Diese praktische
                    Erfahrung ermöglicht es uns, Bürodienstleistungen anzubieten, die perfekt auf die
                    Bedürfnisse der Baubranche zugeschnitten sind.
                  </p>
                </div>
              </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Unsere Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  Handwerksbetrieben und Bauunternehmen dabei helfen, sich auf ihr Kerngeschäft zu
                  konzentrieren, indem wir professionelle Bürodienstleistungen übernehmen.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Unsere Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  Die führende Anlaufstelle für Bürodienstleistungen im Handwerks- und Baubereich
                  in Deutschland, der Schweiz und Österreich zu werden.
                </p>
              </div>
            </div>

            <div className="bg-[#fef3ed] rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Warum Muckenfuss & Nagel?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#cb530a] mr-3 text-xl">✓</span>
                  <span><strong>Branchenkenntnis:</strong> Wir verstehen Ihr Geschäft, weil wir selbst im Bauwesen tätig waren</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#cb530a] mr-3 text-xl">✓</span>
                  <span><strong>Professionell:</strong> Erfahrene Mitarbeiter mit Expertise in Bürodienstleistungen</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#cb530a] mr-3 text-xl">✓</span>
                  <span><strong>Zuverlässig:</strong> Pünktliche Lieferung und transparente Kommunikation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#cb530a] mr-3 text-xl">✓</span>
                  <span><strong>Individuell:</strong> Maßgeschneiderte Lösungen für Ihr Unternehmen</span>
                </li>
              </ul>
            </div>

            <section id="geschichte" className="scroll-mt-24 mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Unternehmensgeschichte</h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Muckenfuss & Nagel wurde von einem erfahrenen Bauprofi gegründet, der über 10 Jahre praktische Erfahrung im Bauwesen gesammelt hat. Während dieser Zeit wurde deutlich, dass viele Handwerksbetriebe und Bauunternehmen Unterstützung bei Büroaufgaben benötigen. Aus dieser Erfahrung entstand die Idee, Bürodienstleistungen speziell für die Baubranche anzubieten.
                </p>
                <p className="leading-relaxed">
                  Heute betreuen wir Handwerksbetriebe und Bauunternehmen in Deutschland, der Schweiz und Österreich. Unser Standort in Oberderdingen ist der Ausgangspunkt für unsere überregionale Betreuung.
                </p>
              </div>
            </section>

            <section id="standort" className="scroll-mt-24 mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Standort</h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Unser Standort befindet sich in Oberderdingen, Landkreis Karlsruhe in Baden-Württemberg. Von hier aus betreuen wir Kunden in ganz Deutschland, der Schweiz und Österreich.
                </p>
                <p className="leading-relaxed">
                  Durch moderne Kommunikationstechnologien können wir Sie ortsunabhängig professionell betreuen – Telefonservice, Terminorganisation, Social Media und alle anderen Dienstleistungen funktionieren überregional.
                </p>
              </div>
            </section>

            <section id="kompetenz" className="scroll-mt-24 mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Erfahrung & Kompetenz</h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Unser Gründer bringt über 10 Jahre praktische Erfahrung im Bauwesen mit: Hoch- und Tiefbau, Straßen- und Brückenbau, Sanierung, Zusammenarbeit mit Dachdeckern und Zimmerleuten. Zusätzlich verfügen wir über umfassende Kompetenz in Bürodienstleistungen – von Telefonkommunikation über Terminorganisation bis zu Social Media, Dokumentation und Webdesign.
                </p>
                <p className="leading-relaxed">
                  Die Kombination aus Bau-Erfahrung und Büro-Expertise macht uns zum idealen Partner für Handwerksbetriebe und Bauunternehmen.
                </p>
              </div>
            </section>

            <section id="team" className="scroll-mt-24 mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Team & Büro</h3>
              <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
                Unser Team und unsere Arbeitsumgebung – hier entstehen Ihre Bürolösungen.
              </p>
            </section>

            <div className="text-center">
              <Link
                href={getRoute('Kontakt')}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#cb530a] text-white font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors text-lg"
              >
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </section>

        <StatsSection
          stats={[
            { value: 10, suffix: '+', label: 'Jahre Erfahrung', icon: '🎯' },
            { value: 50, suffix: '+', label: 'Zufriedene Kunden', icon: '😊' },
            { value: 3, suffix: '', label: 'DACH-Länder', icon: '🌍' },
            { value: 6, suffix: '', label: 'Dienstleistungen', icon: '💼' }
          ]}
          title="Muckenfuss & Nagel in Zahlen"
        />


        <FeaturesGridSection
          features={[
            {
              icon: '🎯',
              title: 'Branchenkenntnis',
              description: '10+ Jahre Erfahrung im Bauwesen - wir verstehen Ihre Herausforderungen aus erster Hand.'
            },
            {
              icon: '⚡',
              title: 'Effizienz',
              description: 'Optimierte Prozesse für maximale Zeitersparnis und Produktivität.'
            },
            {
              icon: '🤝',
              title: 'Partnerschaft',
              description: 'Langfristige Zusammenarbeit auf Augenhöhe mit persönlicher Betreuung.'
            },
            {
              icon: '📊',
              title: 'Transparenz',
              description: 'Klare Dokumentation und monatliche Berichte für volle Übersicht.'
            },
            {
              icon: '🔒',
              title: 'Zuverlässigkeit',
              description: 'Pünktliche Lieferung und transparente Kommunikation - immer.'
            },
            {
              icon: '💡',
              title: 'Innovation',
              description: 'Moderne Tools und Prozesse für optimale Ergebnisse.'
            }
          ]}
          title="Unsere Stärken"
          description="Was uns auszeichnet"
          columns={3}
        />

        <CTASection
          title="Lernen Sie uns kennen"
          description="Erfahren Sie mehr über unsere Geschichte, unsere Werte und wie wir Ihnen helfen können. Kontaktieren Sie uns für ein unverbindliches Gespräch."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
