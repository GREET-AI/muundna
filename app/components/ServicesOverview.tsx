import Link from 'next/link';
import { getRoute } from '../utils/routes';
import AnimatedCard3D from './ui/AnimatedCard3D';

export default function ServicesOverview() {
  const services = [
    {
      title: 'Telefonservice & Kommunikation',
      description: 'Professionelle telefonische Kundenbetreuung während Ihrer Arbeitszeiten',
      icon: '📞',
      href: '/dienstleistungen/telefonservice'
    },
    {
      title: 'Terminorganisation',
      description: 'Effiziente Planung und Organisation Ihrer Kundentermine',
      icon: '📅',
      href: '/dienstleistungen/terminorganisation'
    },
    {
      title: 'Social Media Betreuung',
      description: 'Professionelle Betreuung Ihrer Social Media Kanäle',
      icon: '📱',
      href: '/dienstleistungen/social-media'
    },
    {
      title: 'Google Bewertungen',
      description: 'Optimierung und Betreuung Ihrer Google Bewertungen',
      icon: '⭐',
      href: '/dienstleistungen/google-bewertungen'
    },
    {
      title: 'Dokumentation & Reporting',
      description: 'Klare Dokumentation mit monatlichem Überblick',
      icon: '📊',
      href: '/dienstleistungen/dokumentation'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Unsere Dienstleistungen
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professionelle Bürodienstleistungen speziell für Handwerksbetriebe und Bauunternehmen
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedCard3D key={index}>
              <Link
                href={service.href}
                className="block p-8 border-2 border-gray-200 dark:border-gray-800 rounded-lg hover:border-[#cb530a] dark:hover:border-[#182c30] hover:shadow-xl transition-all bg-white dark:bg-gray-900 group h-full"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-[#cb530a] dark:group-hover:text-[#182c30] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {service.description}
                </p>
                <span className="inline-block mt-4 text-[#cb530a] dark:text-[#182c30] font-medium group-hover:translate-x-2 transition-transform">
                  Mehr erfahren →
                </span>
              </Link>
            </AnimatedCard3D>
          ))}
        </div>
      </div>
    </section>
  );
}

