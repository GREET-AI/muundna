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

export default function StandortPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Standort"
          subtitle="Über uns"
          description="Oberderdingen - Ihr Partner für Bürodienstleistungen im Bauwesen"
          backgroundImage="/images/herobackgeneral6.png"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Oberderdingen</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Unser Standort befindet sich in Oberderdingen, einer Gemeinde im Landkreis
                Karlsruhe in Baden-Württemberg. Von hier aus betreuen wir Handwerksbetriebe
                und Bauunternehmen in ganz Deutschland, der Schweiz und Österreich.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Überregionale Betreuung</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Obwohl unser Standort in Oberderdingen ist, arbeiten wir überregional und betreuen
                Kunden in:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Deutschland (alle Bundesländer)</li>
                <li>• Schweiz (alle Kantone)</li>
                <li>• Österreich (alle Bundesländer)</li>
              </ul>
            </div>

            <div className="bg-[#fef3ed] rounded-lg p-8 border border-[#fef3ed]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Digitale Zusammenarbeit</h3>
              <p className="text-gray-700 leading-relaxed">
                Durch moderne Kommunikationstechnologien können wir Sie unabhängig von Ihrem
                Standort professionell betreuen. Telefonservice, Terminorganisation, Social Media
                Betreuung und alle anderen Dienstleistungen funktionieren ortsunabhängig.
              </p>
            </div>
            </div>
          </div>
        </section>

        <StatsSection
          stats={[
            { value: 1, suffix: '', label: 'Standort', icon: '📍' },
            { value: 3, suffix: '', label: 'DACH-Länder', icon: '🌍' },
            { value: 100, suffix: '%', label: 'Digital erreichbar', icon: '💻' },
            { value: 24, suffix: '/7', label: 'Verfügbarkeit', icon: '⏰' }
          ]}
          title="Unser Standort & Erreichbarkeit"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '📍',
              title: 'Oberderdingen',
              description: 'Unser Standort im Landkreis Karlsruhe - zentral gelegen in Baden-Württemberg.'
            },
            {
              icon: '🌍',
              title: 'Überregional',
              description: 'Betreuung von Kunden in Deutschland, Schweiz und Österreich - ortsunabhängig.'
            },
            {
              icon: '💻',
              title: 'Digital',
              description: 'Moderne Kommunikationstechnologien ermöglichen ortsunabhängige Zusammenarbeit.'
            },
            {
              icon: '📞',
              title: 'Erreichbar',
              description: 'Immer für Sie da - telefonisch, per E-Mail oder über unser Online-Portal.'
            },
            {
              icon: '🤝',
              title: 'Persönlich',
              description: 'Trotz digitaler Zusammenarbeit bleibt der persönliche Kontakt wichtig.'
            },
            {
              icon: '⚡',
              title: 'Schnell',
              description: 'Kurze Reaktionszeiten und schnelle Umsetzung Ihrer Anforderungen.'
            }
          ]}
          title="Warum unser Standort kein Hindernis ist"
          description="Moderne Technologie ermöglicht überregionale Betreuung"
          columns={3}
        />

        <CTASection
          title="Starten Sie die Zusammenarbeit"
          description="Unabhängig von Ihrem Standort können wir Ihnen helfen. Kontaktieren Sie uns für ein unverbindliches Gespräch."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

