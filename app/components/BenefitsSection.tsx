'use client';

import { motion } from 'framer-motion';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: '📍',
      title: 'Top Lage',
      description: 'Strategisch in Oberderdingen gelegen, perfekt für die Betreuung im DACH-Raum'
    },
    {
      icon: '✅',
      title: 'Kostenlose Beratung',
      description: 'Unverbindliches Erstgespräch und individuelle Angebotserstellung'
    },
    {
      icon: '⚡',
      title: 'Sofort verfügbar',
      description: 'Keine langen Wartezeiten - wir starten schnell und flexibel'
    },
    {
      icon: '📅',
      title: 'Flexible Vertragslaufzeit',
      description: 'Monatlich kündbar - keine langfristigen Bindungen'
    },
    {
      icon: '💼',
      title: 'Professionelles Team',
      description: '10+ Jahre Erfahrung im Bauwesen - wir verstehen Ihre Branche'
    },
    {
      icon: '📊',
      title: 'Transparente Dokumentation',
      description: 'Monatliche Berichte und klare Übersicht über alle Aktivitäten'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Davon profitierst du
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Fülle unser Anfrageformular aus und sichere dir ein kostenfreies Angebot samt Beratungstermin. 
            Entdecke professionelle Bürodienstleistungen, die flexible Optionen, hohen Komfort und eine 
            inspirierende Arbeitsumgebung bieten.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:border-[#cb530a] dark:hover:border-[#182c30] transition-all group"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-[#cb530a] dark:group-hover:text-[#182c30] transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

