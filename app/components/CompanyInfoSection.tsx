'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getRoute } from '../utils/routes';
import NumberTicker from './ui/NumberTicker';

export default function CompanyInfoSection() {
  const stats = [
    { label: 'Jahre Erfahrung', value: 10, suffix: '+' },
    { label: 'Zufriedene Kunden', value: 50, suffix: '+' },
    { label: 'DACH-Länder', value: 3 },
    { label: 'Dienstleistungen', value: 6 }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Branchenkenntnis',
      description: '10+ Jahre Erfahrung im Bauwesen – wir verstehen Ihre Herausforderungen'
    },
    {
      icon: '⚡',
      title: 'Effizienz',
      description: 'Optimierte Prozesse für maximale Zeitersparnis und Produktivität'
    },
    {
      icon: '🤝',
      title: 'Partnerschaft',
      description: 'Langfristige Zusammenarbeit auf Augenhöhe mit persönlicher Betreuung'
    },
    {
      icon: '📊',
      title: 'Transparenz',
      description: 'Klare Dokumentation und monatliche Berichte für volle Übersicht'
    }
  ];

  return (
    <section className="py-20 bg-white bg-dot-pattern relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Über Muckenfuss & Nagel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ihr verlässlicher Partner für Bürodienstleistungen im Bauwesen
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center"
              >
                <div className="text-4xl font-bold text-[#cb530a] mb-2">
                  <NumberTicker value={stat.value} className="text-[#cb530a]" />
                  {stat.suffix}
                </div>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left: Image & Location */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Standort & Betreuung
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📍</span>
                    <div>
                      <p className="font-semibold">Standort</p>
                      <p>Oberderdingen, Deutschland</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🌍</span>
                    <div>
                      <p className="font-semibold">Betreuungsgebiet</p>
                      <p>Deutschland, Schweiz, Österreich</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🎯</span>
                    <div>
                      <p className="font-semibold">Zielgruppe</p>
                      <p>Handwerksbetriebe & Bauunternehmen</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Company Story & Values */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Unsere Geschichte
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mit über 10 Jahren Erfahrung im Bauwesen haben wir die Herausforderungen von 
                  Handwerksbetrieben und Bauunternehmen aus erster Hand kennengelernt. Aus dieser 
                  Erfahrung heraus haben wir Muckenfuss & Nagel gegründet – um anderen Unternehmen 
                  in der Branche zu helfen, sich auf ihr Kerngeschäft zu konzentrieren.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Wir verstehen die Besonderheiten von Hoch- und Tiefbau, Straßenbau, Brückenbau, 
                  Sanierung und Renovierung. Diese Branchenkenntnis macht uns zu Ihrem idealen 
                  Partner für alle Bürodienstleistungen.
                </p>
                <Link
                  href={getRoute('Unternehmensgeschichte')}
                  className="inline-flex items-center text-[#cb530a] font-semibold hover:underline"
                >
                  Mehr erfahren
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Unsere Werte
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-start group">
                      <span className="text-3xl mr-4 transform group-hover:scale-110 transition-transform">
                        {value.icon}
                      </span>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">
                          {value.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

