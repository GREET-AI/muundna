import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import StatsSection from '../components/StatsSection';
import FeaturesGridSection from '../components/FeaturesGridSection';
import CTASection from '../components/CTASection';
import ExpertiseCTABanner from '../components/ExpertiseCTABanner';
import Link from 'next/link';
import Image from 'next/image';
import { getRoute } from '../utils/routes';

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Über Muckenfuss & Nagel"
          subtitle="Unternehmen"
          description="10+ Jahre Erfahrung im Bauwesen - Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen"
          backgroundImage="/images/herobackgeneral3.png"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white dark:bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                    10+ Jahre Erfahrung im Bauwesen
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    Muckenfuss & Nagel wurde von einem erfahrenen Bauprofi gegründet, der über 10 Jahre
                    praktische Erfahrung im Bauwesen gesammelt hat. Wir verstehen die Herausforderungen
                    und Bedürfnisse von Handwerksbetrieben und Bauunternehmen aus erster Hand.
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    Unsere Expertise umfasst Hoch- und Tiefbau, Straßenbau, Brückenbau, Sanierung von
                    Wohnobjekten sowie die Arbeit mit Dachdeckern und Zimmermännern. Diese praktische
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
            { value: 5, suffix: '', label: 'Dienstleistungen', icon: '💼' }
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
