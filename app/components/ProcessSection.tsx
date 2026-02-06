'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { getRoute } from '../utils/routes';

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  icon: string;
};

const DEFAULT_STEPS: ProcessStep[] = [
  {
    number: '1',
    title: 'Erstgespräch',
    description: 'Wir lernen Ihre Anforderungen und Ihren Arbeitsalltag kennen. Unverbindlich und kostenlos.',
    icon: '💬',
  },
  {
    number: '2',
    title: 'Bedarfsanalyse',
    description: 'Gemeinsam ermitteln wir, welche Bürodienstleistungen Sie entlasten – Telefon, Termine, Social Media, Webdesign oder mehr.',
    icon: '📋',
  },
  {
    number: '3',
    title: 'Leistungsumfang',
    description: 'Sie erhalten ein maßgeschneidertes Angebot. Transparent, ohne versteckte Kosten.',
    icon: '✅',
  },
  {
    number: '4',
    title: 'Jetzt anfragen',
    description: 'Starten Sie mit uns durch – wir übernehmen Ihre Büroarbeit, Sie konzentrieren sich auf Ihr Kerngeschäft.',
    icon: '🚀',
  },
];

interface ProcessSectionProps {
  steps?: ProcessStep[];
}

export default function ProcessSection({ steps: customSteps }: ProcessSectionProps = {}) {
  const steps = customSteps ?? DEFAULT_STEPS;
  return (
    <section className="py-20 bg-white bg-dot-pattern relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
            So funktioniert die Zusammenarbeit
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center mb-12">
            In vier Schritten zu Ihrer maßgeschneiderten Bürolösung
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group pt-6"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-10 h-10 bg-[#cb530a] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                  {step.number}
                </div>
                <div
                  className={
                    step.number === '4'
                      ? 'bg-gradient-to-b from-[#cb530a]/10 to-[#fef3ed] pt-8 pb-6 px-6 rounded-lg border-2 border-[#cb530a]/30 text-center h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'
                      : 'bg-white pt-8 pb-6 px-6 rounded-lg shadow-md border border-gray-200 text-center h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-[#cb530a]/30'
                  }
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>
                  {step.number === '4' && (
                    <Link
                      href={getRoute('Quiz')}
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#cb530a] text-white font-semibold rounded-lg hover:bg-[#a84308] transition-colors shadow-md hover:shadow-lg"
                    >
                      Jetzt anfragen
                    </Link>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#cb530a]/50 transform -translate-y-1/2 z-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
