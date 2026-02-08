'use client';

import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Zap, Calendar, Briefcase, BarChart2, type LucideIcon } from 'lucide-react';

const DEFAULT_PRIMARY = '#cb530a';

const BUSINESS_SUBTITLE = 'Füllen Sie unser Anfrageformular aus und sichern Sie sich ein kostenfreies Angebot samt Beratungstermin. Professionelle Bürodienstleistungen mit flexiblen Optionen, hohem Komfort und einer inspirierenden Arbeitsumgebung.';
const COACHING_SUBTITLE = 'Sichere dir Zugang zu exklusiven Strategien und einem starken Netzwerk. Lerne, die richtigen Immobilien als Kapitalanlagen zu finden – und sie zu kaufen und zu vermieten.';

const BUSINESS_BENEFITS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: MapPin, title: 'Top Lage', description: 'Strategisch in Oberderdingen gelegen, perfekt für die Betreuung im DACH-Raum' },
  { icon: CheckCircle2, title: 'Kostenlose Beratung', description: 'Unverbindliches Erstgespräch und individuelle Angebotserstellung' },
  { icon: Zap, title: 'Sofort verfügbar', description: 'Keine langen Wartezeiten – wir starten schnell und flexibel' },
  { icon: Calendar, title: 'Flexible Vertragslaufzeit', description: 'Monatlich kündbar – keine langfristigen Bindungen' },
  { icon: Briefcase, title: 'Professionelles Team', description: '10+ Jahre Erfahrung im Bauwesen – wir verstehen Ihre Branche' },
  { icon: BarChart2, title: 'Transparente Dokumentation', description: 'Monatliche Berichte und klare Übersicht über alle Aktivitäten' },
];

const COACHING_BENEFITS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: MapPin, title: 'Deal-Flow & Netzwerk', description: 'Zugang zu exklusiven Off-Market-Deals und einem Netzwerk von Investoren und Partnern' },
  { icon: CheckCircle2, title: 'Systematischer Einstieg', description: 'Klare Strategie: Wie du die richtigen Immobilien findest, bewertest und sicherst' },
  { icon: Zap, title: 'Kauf & Vermietung', description: 'Von der Due Diligence bis zur Vermietung – ein komplettes System für Kapitalanlagen' },
  { icon: Calendar, title: 'Individuelles Coaching', description: '1:1-Betreuung und maßgeschneiderte Schritte für deine Ziele' },
  { icon: Briefcase, title: 'Erprobte Methodik', description: 'Strategien, die in der Praxis funktionieren – kein graue Theorie' },
  { icon: BarChart2, title: 'Klare Struktur', description: 'Modulare Inhalte, klare Meilensteine und messbare Fortschritte' },
];

export default function BenefitsSection({ primaryColor = DEFAULT_PRIMARY, secondaryColor, sectionTitle, sectionSubtitle, variant = 'business' }: { primaryColor?: string; secondaryColor?: string; sectionTitle?: string; sectionSubtitle?: string; variant?: 'business' | 'coaching' } = {}) {
  const isCoaching = variant === 'coaching';
  const benefits = isCoaching ? COACHING_BENEFITS : BUSINESS_BENEFITS;
  const defaultTitle = isCoaching ? 'Davon profitierst du' : 'Davon profitieren Sie';
  const defaultSubtitle = isCoaching ? COACHING_SUBTITLE : BUSINESS_SUBTITLE;

  return (
    <section className="py-24 bg-white bg-dot-pattern relative" style={{ ['--primary']: primaryColor } as React.CSSProperties}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
            {isCoaching ? 'Deine Vorteile' : 'Ihre Vorteile'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {sectionTitle ?? defaultTitle}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {sectionSubtitle ?? defaultSubtitle}
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
                style={{ ['--primary']: primaryColor } as React.CSSProperties}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 transition-colors duration-300 group-hover:bg-[var(--primary)] group-hover:text-white" style={{ backgroundColor: `${primaryColor}1a`, color: primaryColor }}>
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

