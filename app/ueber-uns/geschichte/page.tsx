import Header from '../../components/Header';
import HeroSection from '../../components/HeroSection';
import Footer from '../../components/Footer';
import CookieBanner from '../../components/CookieBanner';
import StatsSection from '../../components/StatsSection';
import FeaturesGridSection from '../../components/FeaturesGridSection';
import CTASection from '../../components/CTASection';
import ExpertiseCTABanner from '../../components/ExpertiseCTABanner';
import Link from 'next/link';
import { getRoute } from '../../utils/routes';

export default function GeschichtePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Unternehmensgeschichte"
          subtitle="Über uns"
          description="Die Entstehung und Entwicklung von Muckenfuss & Nagel"
          backgroundImage="/images/herobackgeneral4.png"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
            
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Die Anfänge</h2>
                <p className="text-gray-700 leading-relaxed">
                  Muckenfuss & Nagel wurde von einem erfahrenen Bauprofi gegründet, der über 10 Jahre
                  praktische Erfahrung im Bauwesen gesammelt hat. Während dieser Zeit wurde deutlich,
                  dass viele Handwerksbetriebe und Bauunternehmen Unterstützung bei Büroaufgaben
                  benötigen, um sich auf ihr Kerngeschäft konzentrieren zu können.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Unsere Erfahrung</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Unser Gründer hat umfassende Erfahrung in verschiedenen Bereichen des Bauwesens:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Hoch- und Tiefbau</li>
                  <li>• Straßenbau und Brückenbau</li>
                  <li>• Sanierung von Wohnobjekten</li>
                  <li>• Zusammenarbeit mit Dachdeckern und Zimmermännern</li>
                  <li>• Projektmanagement und Koordination</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Die Idee</h2>
                <p className="text-gray-700 leading-relaxed">
                  Aus der praktischen Erfahrung entstand die Idee, Bürodienstleistungen speziell
                  für Handwerksbetriebe und Bauunternehmen anzubieten. Wir verstehen die
                  Herausforderungen der Branche und wissen, welche Unterstützung wirklich hilfreich ist.
                </p>
              </div>

              <div className="bg-[#fef3ed] rounded-lg p-8 border border-[#fef3ed]">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Heute</h2>
                <p className="text-gray-700 leading-relaxed">
                  Heute betreuen wir Handwerksbetriebe und Bauunternehmen in ganz Deutschland,
                  der Schweiz und Österreich. Unser Standort in Oberderdingen ist der Ausgangspunkt
                  für unsere überregionale Betreuung. Wir sind stolz darauf, Unternehmen dabei zu
                  helfen, effizienter zu arbeiten und zu wachsen.
                </p>
              </div>
            </div>
            </div>
          </div>
        </section>

        <StatsSection
          stats={[
            { value: 10, suffix: '+', label: 'Jahre Bau-Erfahrung', icon: '🏗️' },
            { value: 50, suffix: '+', label: 'Zufriedene Kunden', icon: '😊' },
            { value: 3, suffix: '', label: 'DACH-Länder', icon: '🌍' },
            { value: 5, suffix: '', label: 'Dienstleistungen', icon: '💼' }
          ]}
          title="Unsere Entwicklung in Zahlen"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '🎯',
              title: 'Branchenkenntnis',
              description: '10+ Jahre praktische Erfahrung im Bauwesen - wir verstehen Ihre Herausforderungen.'
            },
            {
              icon: '💡',
              title: 'Innovative Idee',
              description: 'Aus praktischer Erfahrung entstand die Idee für maßgeschneiderte Bürodienstleistungen.'
            },
            {
              icon: '🤝',
              title: 'Partnerschaft',
              description: 'Langfristige Zusammenarbeit auf Augenhöhe mit persönlicher Betreuung.'
            },
            {
              icon: '📈',
              title: 'Wachstum',
              description: 'Von einem Standort zu überregionaler Betreuung in ganz DACH.'
            },
            {
              icon: '⭐',
              title: 'Erfolg',
              description: '50+ zufriedene Kunden vertrauen auf unsere Expertise.'
            },
            {
              icon: '🚀',
              title: 'Zukunft',
              description: 'Kontinuierliche Weiterentwicklung unserer Dienstleistungen.'
            }
          ]}
          title="Unsere Erfolgsgeschichte"
          description="Von der Idee zur Realität"
          columns={3}
        />

        <CTASection
          title="Werden Sie Teil unserer Erfolgsgeschichte"
          description="Lassen Sie uns gemeinsam Ihre Büroaufgaben übernehmen und Ihnen helfen, sich auf Ihr Kerngeschäft zu konzentrieren. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

