'use client';

import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Zap, Calendar, Briefcase, BarChart2, type LucideIcon } from 'lucide-react';

export default function BenefitsSection() {
  const benefits: { icon: LucideIcon; title: string; description: string }[] = [
    {
      icon: MapPin,
      title: 'Top Lage',
      description: 'Strategisch in Oberderdingen gelegen, perfekt für die Betreuung im DACH-Raum'
    },
    {
      icon: CheckCircle2,
      title: 'Kostenlose Beratung',
      description: 'Unverbindliches Erstgespräch und individuelle Angebotserstellung'
    },
    {
      icon: Zap,
      title: 'Sofort verfügbar',
      description: 'Keine langen Wartezeiten – wir starten schnell und flexibel'
    },
    {
      icon: Calendar,
      title: 'Flexible Vertragslaufzeit',
      description: 'Monatlich kündbar – keine langfristigen Bindungen'
    },
    {
      icon: Briefcase,
      title: 'Professionelles Team',
      description: '10+ Jahre Erfahrung im Bauwesen – wir verstehen Ihre Branche'
    },
    {
      icon: BarChart2,
      title: 'Transparente Dokumentation',
      description: 'Monatliche Berichte und klare Übersicht über alle Aktivitäten'
    }
  ];

  return (
    <section className="py-24 bg-white bg-dot-pattern relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block text-[#cb530a] font-semibold text-sm uppercase tracking-wider mb-3">
            Ihre Vorteile
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Davon profitieren Sie
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Füllen Sie unser Anfrageformular aus und sichern Sie sich ein kostenfreies Angebot samt Beratungstermin. 
            Professionelle Bürodienstleistungen mit flexiblen Optionen, hohem Komfort und einer inspirierenden Arbeitsumgebung.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#cb530a]/10 text-[#cb530a] mb-6 group-hover:bg-[#cb530a] group-hover:text-white transition-colors duration-300">
                  <IconComponent className="w-7 h-7" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

