'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { getRoute } from '../utils/routes';
import AnimatedCard3D from './ui/AnimatedCard3D';

export default function PricingSection() {
  const packages = [
    {
      name: 'Basis',
      description: 'Perfekt für kleine Betriebe',
      price: 'ab 299',
      period: '/ Monat',
      features: [
        'Telefonservice (bis 20 Anrufe/Monat)',
        'Terminorganisation',
        'E-Mail-Betreuung',
        'Monatliche Dokumentation'
      ],
      popular: false
    },
    {
      name: 'Professional',
      description: 'Ideal für wachsende Unternehmen',
      price: 'ab 599',
      period: '/ Monat',
      features: [
        'Telefonservice (unbegrenzt)',
        'Terminorganisation',
        'Social Media Betreuung',
        'Google Bewertungen',
        'Dokumentation & Reporting',
        'Prioritärer Support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'Komplettlösung für große Betriebe',
      price: 'Auf Anfrage',
      period: '',
      features: [
        'Alle Professional Features',
        'Dedizierter Account Manager',
        'Individuelle Anpassungen',
        '24/7 Support',
        'Custom Reporting',
        'Team-Schulungen'
      ],
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Unsere Angebote
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible Pakete für jeden Bedarf – monatlich kündbar, keine langfristigen Bindungen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${pkg.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#cb530a] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  BELIEBTEST
                </div>
              )}
              <AnimatedCard3D>
                <div className={`bg-white rounded-lg shadow-xl border-2 h-full flex flex-col ${
                  pkg.popular 
                    ? 'border-[#cb530a]'
                    : 'border-gray-200'
                }`}>
                  <div className="p-8 flex-grow">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {pkg.description}
                    </p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-800">
                        {pkg.price}
                      </span>
                      {pkg.period && (
                        <span className="text-gray-600 ml-2">
                          {pkg.period}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-[#cb530a] mr-2 mt-1">✓</span>
                          <span className="text-gray-700 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-8 pt-0">
                    <Link
                      href={getRoute('Kontakt')}
                      className="block w-full text-center px-6 py-3 bg-[#cb530a] text-white font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors"
                    >
                      Jetzt anfragen
                    </Link>
                  </div>
                </div>
              </AnimatedCard3D>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm mb-4">
            Alle Preise netto zzgl. Umsatzsteuer
          </p>
          <p className="text-gray-600 text-sm">
            Individuelle Anpassungen möglich. 
            <Link href={getRoute('Kontakt')} className="text-[#cb530a] hover:underline ml-1">
              Kontaktieren Sie uns
            </Link>
            {' '}für ein maßgeschneidertes Angebot.
          </p>
        </div>
      </div>
    </section>
  );
}

