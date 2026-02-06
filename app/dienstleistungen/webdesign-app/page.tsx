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


export default function WebdesignAppPage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection
          title="Webdesign & App Lösungen"
          subtitle="Dienstleistung"
          description="Professionelle Websites und maßgeschneiderte App-Lösungen für Ihr Unternehmen"
          backgroundImage="/images/Dienstleistungen/SocialMedia.jpeg"
        />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Ihre digitale Präsenz – professionell umgesetzt
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Als Handwerksbetrieb oder Bauunternehmen benötigen Sie eine starke Online-Präsenz.
                    Wir erstellen moderne, responsive Websites und individuelle App-Lösungen,
                    die Ihre Kunden überzeugen und Ihre Aufträge steigern. Von der Konzeption
                    bis zur Umsetzung – alles aus einer Hand.
                  </p>
                </div>
                <div className="relative aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <Image src="/images/Dienstleistungen/SocialMedia.jpeg" alt="Webdesign & App Lösungen" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              </div>
            <div className="max-w-4xl mx-auto">

            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Was wir für Sie umsetzen
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">🌐</span>
                    Responsive Websites
                  </h3>
                  <p className="text-gray-700">
                    Moderne Websites, die auf allen Geräten perfekt dargestellt werden.
                    Optimiert für Desktop, Tablet und Smartphone.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">📱</span>
                    Individuelle Apps
                  </h3>
                  <p className="text-gray-700">
                    Maßgeschneiderte App-Lösungen für Ihre spezifischen Anforderungen –
                    ob Kundenportal, Angebotstool oder interne Verwaltung.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">⚙️</span>
                    CMS-Integration
                  </h3>
                  <p className="text-gray-700">
                    Einfache Content-Verwaltung durch intuitive Content-Management-Systeme.
                    Sie behalten die Kontrolle über Ihre Inhalte.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">🔍</span>
                    Suchmaschinenoptimierung
                  </h3>
                  <p className="text-gray-700">
                    SEO-Optimierung für bessere Sichtbarkeit in Google und anderen Suchmaschinen.
                    Mehr Sichtbarkeit bedeutet mehr Anfragen.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-[#cb530a] mr-2">🛠️</span>
                    Wartung & Support
                  </h3>
                  <p className="text-gray-700">
                    Regelmäßige Updates, Sicherheitspflege und technischer Support –
                    damit Ihre digitale Präsenz immer einwandfrei funktioniert.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#fef3ed] rounded-lg p-8 text-center border border-[#fef3ed]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Jetzt durchstarten
              </h3>
              <p className="text-gray-700 mb-6">
                Lassen Sie uns gemeinsam Ihre digitale Präsenz gestalten – professionell und maßgeschneidert.
              </p>
              <Link
                href={getRoute('Quiz')}
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
            { value: 100, suffix: '%', label: 'Responsive', icon: '📱' },
            { value: 1, suffix: '', label: 'Ansprechpartner', icon: '🤝' },
            { value: 24, suffix: 'h', label: 'Support möglich', icon: '⏰' },
            { value: 0, suffix: '', label: 'Versteckte Kosten', icon: '💰' }
          ]}
          title="Professionelle digitale Lösungen"
        />

        <FeaturesGridSection
          features={[
            {
              icon: '🌐',
              title: 'Responsive Design',
              description: 'Websites die auf allen Geräten perfekt funktionieren – von Smartphone bis Desktop.'
            },
            {
              icon: '📱',
              title: 'App-Entwicklung',
              description: 'Individuelle Apps für Ihre spezifischen Geschäftsprozesse und Kundenbedürfnisse.'
            },
            {
              icon: '⚙️',
              title: 'CMS-Systeme',
              description: 'Einfache Verwaltung Ihrer Inhalte durch benutzerfreundliche Content-Management-Systeme.'
            },
            {
              icon: '🔍',
              title: 'SEO-Optimierung',
              description: 'Bessere Auffindbarkeit in Suchmaschinen – mehr Sichtbarkeit für Ihr Unternehmen.'
            },
            {
              icon: '🎨',
              title: 'Individuelles Design',
              description: 'Maßgeschneiderte Gestaltung, die zu Ihrer Marke und Ihrem Unternehmen passt.'
            },
            {
              icon: '🛠️',
              title: 'Wartung & Support',
              description: 'Regelmäßige Updates und technischer Support für Ihre digitale Präsenz.'
            }
          ]}
          title="Unsere Webdesign- und App-Leistungen"
          columns={3}
        />

        <ComparisonSection
          items={[
            { feature: 'Website', ohne: 'Veraltet oder fehlend', mit: 'Modern & professionell' },
            { feature: 'Mobile', ohne: 'Schlecht auf Smartphones', mit: 'Perfekt responsive' },
            { feature: 'Auffindbarkeit', ohne: 'Schwer zu finden', mit: 'SEO-optimiert' },
            { feature: 'Apps', ohne: 'Nicht vorhanden', mit: 'Individuell entwickelt' },
            { feature: 'Support', ohne: 'Selbst warten', mit: 'Professioneller Support' }
          ]}
        />

        <UseCasesSection
          useCases={[
            {
              icon: '🌐',
              title: 'Neue Website',
              description: 'Sie haben noch keine professionelle Website oder diese ist veraltet.',
              result: 'Moderne, suchmaschinenoptimierte Website die Kunden überzeugt'
            },
            {
              icon: '📱',
              title: 'Kunden-App',
              description: 'Sie möchten Ihren Kunden eine eigene App für Angebote oder Buchungen anbieten.',
              result: 'Individuelle App-Lösung für mehr Kundenbindung'
            },
            {
              icon: '🔄',
              title: 'Rel launch',
              description: 'Ihre bestehende Website entspricht nicht mehr modernen Standards.',
              result: 'Neugestaltung mit aktuellem Design und Technologie'
            }
          ]}
        />

        <ProcessSection
          steps={[
            {
              number: '1',
              title: 'Beratung & Konzept',
              description: 'Gemeinsam analysieren wir Ihre Anforderungen und entwickeln das passende Konzept',
              icon: '💬'
            },
            {
              number: '2',
              title: 'Design & Umsetzung',
              description: 'Professionelles Design und technische Umsetzung nach Ihren Wünschen',
              icon: '🎨'
            },
            {
              number: '3',
              title: 'Test & Optimierung',
              description: 'Gründliches Testen auf allen Geräten und Feinschliff',
              icon: '✅'
            },
            {
              number: '4',
              title: 'Launch & Support',
              description: 'Go-Live und kontinuierlicher Support sowie Wartung',
              icon: '🚀'
            }
          ]}
        />

        <CTASection
          title="Ihre digitale Präsenz – professionell umgesetzt"
          description="Lassen Sie uns gemeinsam Ihre Website oder App realisieren. Kostenlose Beratung inklusive."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
