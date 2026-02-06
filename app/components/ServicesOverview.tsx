'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedCard3D from './ui/AnimatedCard3D';

export default function ServicesOverview() {
  const services = [
    {
      title: 'Telefonservice & Kommunikation',
      description: 'Professionelle telefonische Kundenbetreuung während Ihrer Arbeitszeiten. Wir übernehmen Anrufe, beantworten Fragen und leiten wichtige Informationen weiter.',
      icon: '📞',
      href: '/dienstleistungen/telefonservice',
      image: '/images/Dienstleistungen/Telefonieren.jpeg'
    },
    {
      title: 'Terminorganisation',
      description: 'Effiziente Planung und Organisation Ihrer Kundentermine. Wir koordinieren Ihren Kalender und sorgen für optimale Terminverteilung.',
      icon: '📅',
      href: '/dienstleistungen/terminorganisation',
      image: '/images/Dienstleistungen/Termenirung.jpeg'
    },
    {
      title: 'Social Media Betreuung',
      description: 'Professionelle Betreuung Ihrer Social Media Kanäle. Content-Erstellung, Posting & Scheduling, Community Management und Markenaufbau.',
      icon: '📱',
      href: '/dienstleistungen/social-media',
      image: '/images/Dienstleistungen/SocialMedia.jpeg'
    },
    {
      title: 'Google Bewertungen',
      description: 'Optimierung und Betreuung Ihrer Google Bewertungen. Bewertungsmanagement, Kundenanfragen für Bewertungen und strategische Optimierung.',
      icon: '⭐',
      href: '/dienstleistungen/google-bewertungen',
      image: '/images/Dienstleistungen/GoogleBewertungen.jpeg'
    },
    {
      title: 'Dokumentation & Reporting',
      description: 'Klare Dokumentation mit monatlichem Überblick. Monatliche Reports, Aktivitätsdokumentation, KPI-Tracking und individuelle Auswertungen.',
      icon: '📊',
      href: '/dienstleistungen/dokumentation',
      image: '/images/Dienstleistungen/Raport.jpeg'
    },
    {
      title: 'Webdesign & App Lösungen',
      description: 'Professionelle Websites und maßgeschneiderte App-Lösungen für Ihr Unternehmen. Moderne, responsive Designs die Kunden überzeugen.',
      icon: '💻',
      href: '/dienstleistungen/webdesign-app',
      image: '/images/Dienstleistungen/SocialMedia.jpeg'
    }
  ];

  return (
    <section className="py-20 bg-white bg-dot-pattern relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Unsere Dienstleistungen
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professionelle Bürodienstleistungen speziell für Handwerksbetriebe und Bauunternehmen
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AnimatedCard3D>
                <Link href={service.href} className="block h-full">
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden h-full group hover:shadow-xl transition-all">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-white text-sm font-semibold drop-shadow-md">{service.title}</span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center mb-4">
                        <span className="text-4xl mr-4">{service.icon}</span>
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[#cb530a] transition-colors">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <span className="inline-flex items-center text-[#cb530a] font-semibold group-hover:translate-x-2 transition-transform">
                        Mehr erfahren
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedCard3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
