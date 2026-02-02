'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { getRoute } from '../utils/routes';
import AnimatedCard3D from './ui/AnimatedCard3D';

export default function TargetGroupsSection() {
  const targetGroups = [
    {
      title: 'Handwerksbetriebe',
      description: 'Professionelle Bürodienstleistungen speziell für Handwerksbetriebe. Wir übernehmen Ihre Büroarbeit, damit Sie sich voll auf Ihr Handwerk konzentrieren können.',
      icon: '🔧',
      href: '/zielgruppen/handwerksbetriebe',
      image: '/images/herobackgeneral2.png'
    },
    {
      title: 'Bauunternehmen',
      description: 'Komplette Bürodienstleistungen für Bauunternehmen. Von Telefonservice bis Social Media – wir unterstützen Sie bei allen administrativen Aufgaben.',
      icon: '🏗️',
      href: '/zielgruppen/bauunternehmen',
      image: '/images/herobackgeneral3.png'
    },
    {
      title: 'Hoch- & Tiefbau',
      description: 'Spezialisierte Betreuung für Hoch- und Tiefbauunternehmen. Wir verstehen die Besonderheiten Ihrer Branche und bieten maßgeschneiderte Lösungen.',
      icon: '🏢',
      href: '/zielgruppen/hoch-tiefbau',
      image: '/images/herobackgeneral4.png'
    },
    {
      title: 'Sanierung & Renovierung',
      description: 'Professionelle Unterstützung für Sanierungs- und Renovierungsbetriebe. Effiziente Terminorganisation und Kundenkommunikation für Ihren Erfolg.',
      icon: '🔨',
      href: '/zielgruppen/sanierung',
      image: '/images/herobackgeneral5.png'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Das passende Angebot für Sie
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professionelle Bürodienstleistungen speziell für Ihre Branche – maßgeschneidert und effizient
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {targetGroups.map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AnimatedCard3D>
                <Link href={group.href} className="block h-full">
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden h-full group hover:shadow-xl transition-all">
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#cb530a] to-[#a84308]">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-7xl opacity-20">{group.icon}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center mb-4">
                        <span className="text-4xl mr-4">{group.icon}</span>
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[#cb530a] transition-colors">
                          {group.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {group.description}
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

