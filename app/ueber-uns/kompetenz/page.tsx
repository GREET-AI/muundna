import Header from '../../components/Header';
import HeroSection from '../../components/HeroSection';
import Footer from '../../components/Footer';
import CookieBanner from '../../components/CookieBanner';
import StatsSection from '../../components/StatsSection';
import FeaturesGridSection from '../../components/FeaturesGridSection';
import ComparisonSection from '../../components/ComparisonSection';
import CTASection from '../../components/CTASection';
import ExpertiseCTABanner from '../../components/ExpertiseCTABanner';
import Link from 'next/link';
import { getRoute } from '../../utils/routes';

export default function KompetenzPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Erfahrung & Kompetenz"
          subtitle="Über uns"
          description="10+ Jahre Bau-Erfahrung kombiniert mit Expertise in Bürodienstleistungen"
          backgroundImage="/images/herobackgeneral5.png"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white dark:bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">10+ Jahre Bau-Erfahrung</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Unser Gründer bringt über 10 Jahre praktische Erfahrung im Bauwesen mit. Diese
                  Erfahrung umfasst verschiedene Bereiche:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-3">Hoch- und Tiefbau</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Umfassende Erfahrung in allen Bereichen des Hoch- und Tiefbaus
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-3">Straßenbau</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Planung und Ausführung von Straßenbauprojekten
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-3">Brückenbau</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Expertise im komplexen Bereich des Brückenbaus
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-3">Sanierung</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Sanierung und Renovierung von Wohnobjekten
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-3">Dachdecker</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Zusammenarbeit mit Dachdeckern und Expertise in diesem Bereich
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-3">Zimmermänner</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Koordination und Zusammenarbeit mit Zimmermännern
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Bürodienstleistungen</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Zusätzlich zur Bau-Erfahrung verfügen wir über umfassende Kompetenz in:
              </p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#cb530a] dark:text-[#182c30] mr-3 text-xl">✓</span>
                  <span>Professionelle Telefonkommunikation und Kundenbetreuung</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#cb530a] dark:text-[#182c30] mr-3 text-xl">✓</span>
                  <span>Effiziente Terminorganisation und Kalenderverwaltung</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#cb530a] dark:text-[#182c30] mr-3 text-xl">✓</span>
                  <span>Social Media Management und Content-Erstellung</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#cb530a] dark:text-[#182c30] mr-3 text-xl">✓</span>
                  <span>Google Bewertungsmanagement und Online-Reputation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#cb530a] dark:text-[#182c30] mr-3 text-xl">✓</span>
                  <span>Professionelle Dokumentation und Reporting</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#fef3ed] dark:bg-gray-900 rounded-lg p-8 border border-[#fef3ed] dark:border-gray-800">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Die perfekte Kombination</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Die Kombination aus praktischer Bau-Erfahrung und Expertise in Bürodienstleistungen
                macht uns zum idealen Partner für Handwerksbetriebe und Bauunternehmen. Wir verstehen
                Ihr Geschäft und wissen, welche Unterstützung wirklich hilfreich ist.
              </p>
            </div>
            </div>
          </div>
        </section>

        <StatsSection
          stats={[
            { value: 10, suffix: '+', label: 'Jahre Bau-Erfahrung', icon: '🏗️' },
            { value: 6, suffix: '', label: 'Baubereiche', icon: '🔧' },
            { value: 5, suffix: '', label: 'Bürodienstleistungen', icon: '💼' },
            { value: 50, suffix: '+', label: 'Zufriedene Kunden', icon: '😊' }
          ]}
          title="Unsere Kompetenz in Zahlen"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '🏗️',
              title: 'Hoch- & Tiefbau',
              description: 'Umfassende Erfahrung in allen Bereichen des Hoch- und Tiefbaus.'
            },
            {
              icon: '🛣️',
              title: 'Straßen- & Brückenbau',
              description: 'Expertise in komplexen Infrastrukturprojekten.'
            },
            {
              icon: '🔨',
              title: 'Sanierung',
              description: 'Erfahrung in der Sanierung und Renovierung von Wohnobjekten.'
            },
            {
              icon: '🏠',
              title: 'Dachdecker & Zimmermänner',
              description: 'Zusammenarbeit und Koordination mit Fachbetrieben.'
            },
            {
              icon: '📞',
              title: 'Telefonkommunikation',
              description: 'Professionelle Kundenbetreuung und Kommunikation.'
            },
            {
              icon: '📊',
              title: 'Dokumentation',
              description: 'Professionelle Dokumentation und Reporting.'
            }
          ]}
          title="Unsere Kompetenzbereiche"
          description="Bau-Erfahrung kombiniert mit Büro-Expertise"
          columns={3}
        />

        <ComparisonSection
          items={[
            { feature: 'Branchenkenntnis', ohne: 'Allgemein', mit: 'Bauspezifisch' },
            { feature: 'Erfahrung', ohne: 'Theoretisch', mit: '10+ Jahre praktisch' },
            { feature: 'Verständnis', ohne: 'Oberflächlich', mit: 'Aus erster Hand' },
            { feature: 'Lösungen', ohne: 'Standard', mit: 'Maßgeschneidert' },
            { feature: 'Erfolg', ohne: 'Durchschnittlich', mit: 'Nachweislich' }
          ]}
          title="Warum unsere Kompetenz überzeugt"
        />

        <CTASection
          title="Profitieren Sie von unserer Kompetenz"
          description="Lassen Sie uns gemeinsam die optimale Lösung für Ihr Unternehmen finden. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

