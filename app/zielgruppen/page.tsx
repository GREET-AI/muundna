import Footer from '../components/Footer';
import ZielgruppenSlider from '../components/ZielgruppenSlider';
import CookieBanner from '../components/CookieBanner';
import StatsSection from '../components/StatsSection';
import BenefitsSection from '../components/BenefitsSection';
import CTASection from '../components/CTASection';
import ExpertiseCTABanner from '../components/ExpertiseCTABanner';
import Link from 'next/link';
import { getRoute } from '../utils/routes';
import AnimatedCard3D from '../components/ui/AnimatedCard3D';

export default function ZielgruppenPage() {
  const zielgruppen = [
    {
      title: 'Handwerksbetriebe',
      description: 'Professionelle Bürodienstleistungen speziell für Handwerksbetriebe',
      icon: '🔧',
      href: '/zielgruppen/handwerksbetriebe'
    },
    {
      title: 'Bauunternehmen',
      description: 'Effiziente Lösungen für Bauunternehmen aller Größen',
      icon: '🏗️',
      href: '/zielgruppen/bauunternehmen'
    },
    {
      title: 'Straßen- & Brückenbau',
      description: 'Bürodienstleistungen für Straßen- und Brückenbauunternehmen',
      icon: '🛣️',
      href: '/zielgruppen/strassen-brueckenbau'
    },
    {
      title: 'Sanierung & Renovierung',
      description: 'Unterstützung für Sanierungs- und Renovierungsbetriebe',
      icon: '🔨',
      href: '/zielgruppen/sanierung'
    },
    {
      title: 'Dachdecker & Zimmerleute',
      description: 'Professionelle Betreuung für Dachdecker und Zimmerleute',
      icon: '🏠',
      href: '/zielgruppen/dachdecker-zimmerleute'
    }
  ];

  return (
    <div className="min-h-screen">
      <main>
        <ZielgruppenSlider />
        <ExpertiseCTABanner />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Für wen arbeiten wir?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Wir betreuen Handwerksbetriebe und Bauunternehmen in verschiedenen Branchen
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {zielgruppen.map((item, index) => (
                <AnimatedCard3D key={index}>
                  <Link
                    href={item.href}
                    className="block p-8 border-2 border-gray-200 rounded-lg hover:border-[#cb530a] hover:shadow-xl transition-all bg-white group h-full"
                  >
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#cb530a] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                    <span className="inline-block mt-4 text-[#cb530a] font-medium group-hover:translate-x-2 transition-transform">
                      Mehr erfahren →
                    </span>
                  </Link>
                </AnimatedCard3D>
              ))}
            </div>
          </div>
        </section>

        <StatsSection
          stats={[
            { value: 6, suffix: '', label: 'Zielgruppen', icon: '🎯' },
            { value: 3, suffix: '', label: 'DACH-Länder betreut', icon: '🌍' },
            { value: 10, suffix: '+', label: 'Jahre Erfahrung im Bauwesen', icon: '🏗️' },
            { value: 1, suffix: '', label: 'Standort Oberderdingen', icon: '📍' }
          ]}
          title="Unsere Zielgruppen in Zahlen"
        />

        <BenefitsSection />

        <CTASection
          title="Finden Sie Ihre passende Lösung"
          description="Wir betreuen Handwerksbetriebe und Bauunternehmen in allen Bereichen. Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch."
          variant="gradient"
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

