import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import StatsSection from '../components/StatsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';
import ExpertiseCTABanner from '../components/ExpertiseCTABanner';
import AnimatedCard3D from '../components/ui/AnimatedCard3D';
import Link from 'next/link';
import { getRoute } from '../utils/routes';

export default function ReferenzenPage() {
  const referenzen = [
    {
      title: 'Handwerksbetrieb aus Bretten',
      branche: 'Hochbau',
      leistung: 'Telefonservice & Terminorganisation',
      beschreibung: 'Seit 2 Jahren betreuen wir diesen Handwerksbetrieb und haben die Kundenkommunikation deutlich verbessert.'
    },
    {
      title: 'Bauunternehmen aus Karlsruhe',
      branche: 'Tiefbau',
      leistung: 'Vollständige Bürodienstleistungen',
      beschreibung: 'Komplette Übernahme der Büroarbeit ermöglicht dem Unternehmen, sich auf große Projekte zu konzentrieren.'
    },
    {
      title: 'Dachdeckerei aus Bruchsal',
      branche: 'Dachdecker',
      leistung: 'Social Media & Google Bewertungen',
      beschreibung: 'Durch professionelle Online-Präsenz konnten neue Kunden gewonnen werden.'
    },
    {
      title: 'Sanierungsbetrieb aus Oberderdingen',
      branche: 'Sanierung',
      leistung: 'Telefonservice & Dokumentation',
      beschreibung: 'Effiziente Terminorganisation und vollständige Dokumentation aller Aktivitäten.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Referenzen"
          subtitle="Unsere Kunden"
          description="Erfolgreiche Zusammenarbeit mit Handwerksbetrieben und Bauunternehmen"
          backgroundImage="/images/herobackgeneral4.png"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white dark:bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                Unsere Erfolgsgeschichten
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Vertrauen Sie auf unsere Erfahrung und Expertise
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {referenzen.map((ref, index) => (
                <AnimatedCard3D key={index}>
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                          {ref.title}
                        </h3>
                        <span className="inline-block bg-[#fef3ed] dark:bg-gray-800 text-[#cb530a] dark:text-[#182c30] px-3 py-1 rounded text-sm font-semibold">
                          {ref.branche}
                        </span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                        Leistungen:
                      </p>
                      <p className="text-gray-800 dark:text-white">
                        {ref.leistung}
                      </p>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {ref.beschreibung}
                    </p>
                  </div>
                </AnimatedCard3D>
              ))}
            </div>
          </div>
        </section>

        <StatsSection
          stats={[
            { value: 50, suffix: '+', label: 'Zufriedene Kunden', icon: '😊' },
            { value: 95, suffix: '%', label: 'Zufriedenheitsrate', icon: '⭐' },
            { value: 2, suffix: '+', label: 'Jahre Durchschnitt', icon: '📅' },
            { value: 100, suffix: '%', label: 'Weiterempfehlung', icon: '💬' }
          ]}
          title="Unsere Erfolgszahlen"
        />

        <TestimonialsSection />

        <CTASection
          title="Werden Sie unser nächster Erfolg"
          description="Lassen Sie uns gemeinsam Ihre Büroaufgaben übernehmen und Ihnen helfen, effizienter zu arbeiten. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

