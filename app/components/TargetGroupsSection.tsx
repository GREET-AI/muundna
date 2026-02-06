'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedCard3D from './ui/AnimatedCard3D';

export default function TargetGroupsSection() {
  const targetGroups = [
    {
      title: 'Handwerksbetriebe',
      description: 'Professionelle Bürodienstleistungen speziell für Handwerksbetriebe. Wir übernehmen Ihre Büroarbeit, damit Sie sich voll auf Ihr Handwerk konzentrieren können.',
      icon: '🔧',
      href: '/zielgruppen/handwerksbetriebe',
      image: '/images/Handwerker.png'
    },
    {
      title: 'Bauunternehmen',
      description: 'Komplette Bürodienstleistungen für Bauunternehmen. Von Telefonservice bis Social Media – wir unterstützen Sie bei allen administrativen Aufgaben.',
      icon: '🏗️',
      href: '/zielgruppen/bauunternehmen',
      image: '/images/Bauunternehmen.png'
    },
    {
      title: 'Straßen- & Brückenbau',
      description: 'Bürodienstleistungen für Straßen- und Brückenbauunternehmen. Wir unterstützen Sie bei Terminorganisation, Kommunikation und Dokumentation.',
      icon: '🛣️',
      href: '/zielgruppen/strassen-brueckenbau',
      image: '/images/Brückenbau.png'
    },
    {
      title: 'Sanierung & Renovierung',
      description: 'Professionelle Unterstützung für Sanierungs- und Renovierungsbetriebe. Effiziente Terminorganisation und Kundenkommunikation für Ihren Erfolg.',
      icon: '🔨',
      href: '/zielgruppen/sanierung',
      image: '/images/Renovierung.png'
    },
    {
      title: 'Dachdecker & Zimmerleute',
      description: 'Professionelle Bürodienstleistungen für Dachdecker und Zimmerleute. Wir übernehmen die Büroarbeit – Sie konzentrieren sich auf Ihr Handwerk.',
      icon: '🏠',
      href: '/zielgruppen/dachdecker-zimmerleute',
      image: '/images/Dachdecker.png'
    }
  ];

  return (
    <section className="w-full py-20 bg-white bg-dot-pattern relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Das passende Angebot für Sie
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professionelle Bürodienstleistungen speziell für Ihre Branche – maßgeschneidert und effizient
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-12">
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
                    <div className="relative h-56 md:h-64 overflow-hidden bg-gray-100">
                      <Image
                        src={group.image}
                        alt={group.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 34vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-white text-sm font-semibold drop-shadow-md">{group.title}</span>
                      </div>
                    </div>
                    <div className="p-8 md:p-10">
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

