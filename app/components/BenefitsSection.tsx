'use client';

import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Zap, Calendar, Briefcase, BarChart2, type LucideIcon } from 'lucide-react';
import type { BenefitItem } from '@/types/landing-section';
import { RichTextBlock } from './ui/RichTextBlock';

const DEFAULT_PRIMARY = '#cb530a';

const ICON_MAP: Record<string, LucideIcon> = {
  MapPin,
  CheckCircle2,
  Zap,
  Calendar,
  Briefcase,
  BarChart2,
};

const BUSINESS_SUBTITLE = 'Füllen Sie unser Anfrageformular aus und sichern Sie sich ein kostenfreies Angebot samt Beratungstermin. Professionelle Bürodienstleistungen mit flexiblen Optionen, hohem Komfort und einer inspirierenden Arbeitsumgebung.';
const COACHING_SUBTITLE = 'Sichere dir Zugang zu exklusiven Strategien und einem starken Netzwerk. Lerne, die richtigen Immobilien als Kapitalanlagen zu finden – und sie zu kaufen und zu vermieten.';

const BUSINESS_BENEFITS: BenefitItem[] = [
  { icon: 'MapPin', iconColor: DEFAULT_PRIMARY, title: 'Top Lage', description: 'Strategisch in Oberderdingen gelegen, perfekt für die Betreuung im DACH-Raum' },
  { icon: 'CheckCircle2', iconColor: DEFAULT_PRIMARY, title: 'Kostenlose Beratung', description: 'Unverbindliches Erstgespräch und individuelle Angebotserstellung' },
  { icon: 'Zap', iconColor: DEFAULT_PRIMARY, title: 'Sofort verfügbar', description: 'Keine langen Wartezeiten – wir starten schnell und flexibel' },
  { icon: 'Calendar', iconColor: DEFAULT_PRIMARY, title: 'Flexible Vertragslaufzeit', description: 'Monatlich kündbar – keine langfristigen Bindungen' },
  { icon: 'Briefcase', iconColor: DEFAULT_PRIMARY, title: 'Professionelles Team', description: '10+ Jahre Erfahrung im Bauwesen – wir verstehen Ihre Branche' },
  { icon: 'BarChart2', iconColor: DEFAULT_PRIMARY, title: 'Transparente Dokumentation', description: 'Monatliche Berichte und klare Übersicht über alle Aktivitäten' },
];

const COACHING_BENEFITS: BenefitItem[] = [
  { icon: 'MapPin', iconColor: DEFAULT_PRIMARY, title: 'Deal-Flow & Netzwerk', description: 'Zugang zu exklusiven Off-Market-Deals und einem Netzwerk von Investoren und Partnern' },
  { icon: 'CheckCircle2', iconColor: DEFAULT_PRIMARY, title: 'Systematischer Einstieg', description: 'Klare Strategie: Wie du die richtigen Immobilien findest, bewertest und sicherst' },
  { icon: 'Zap', iconColor: DEFAULT_PRIMARY, title: 'Kauf & Vermietung', description: 'Von der Due Diligence bis zur Vermietung – ein komplettes System für Kapitalanlagen' },
  { icon: 'Calendar', iconColor: DEFAULT_PRIMARY, title: 'Individuelles Coaching', description: '1:1-Betreuung und maßgeschneiderte Schritte für deine Ziele' },
  { icon: 'Briefcase', iconColor: DEFAULT_PRIMARY, title: 'Erprobte Methodik', description: 'Strategien, die in der Praxis funktionieren – keine graue Theorie' },
  { icon: 'BarChart2', iconColor: DEFAULT_PRIMARY, title: 'Klare Struktur', description: 'Modulare Inhalte, klare Meilensteine und messbare Fortschritte' },
];

export default function BenefitsSection({
  primaryColor = DEFAULT_PRIMARY,
  secondaryColor,
  sectionTitle,
  sectionSubtitle,
  benefits: benefitsProp,
  variant = 'business',
}: {
  primaryColor?: string;
  secondaryColor?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  benefits?: BenefitItem[];
  variant?: 'business' | 'coaching';
} = {}) {
  const isCoaching = variant === 'coaching';
  const fallbackBenefits = isCoaching ? COACHING_BENEFITS : BUSINESS_BENEFITS;
  const benefits = Array.isArray(benefitsProp) && benefitsProp.length > 0 ? benefitsProp : fallbackBenefits;
  const defaultTitle = isCoaching ? 'Davon profitierst du' : 'Davon profitieren Sie';
  const defaultSubtitle = isCoaching ? COACHING_SUBTITLE : BUSINESS_SUBTITLE;

  return (
    <section className="@container py-24 bg-white bg-dot-pattern relative" style={{ ['--primary']: primaryColor } as React.CSSProperties}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16 max-w-3xl mx-auto">
          <span className="inline-block font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
            {isCoaching ? 'Deine Vorteile' : 'Ihre Vorteile'}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 break-words">
            <RichTextBlock html={sectionTitle ?? defaultTitle} tag="span" />
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed break-words">
            <RichTextBlock html={sectionSubtitle ?? defaultSubtitle} tag="span" />
          </p>
        </div>
        <div className="grid grid-cols-1 @[640px]:grid-cols-2 @[1024px]:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = (benefit.icon && ICON_MAP[benefit.icon]) ? ICON_MAP[benefit.icon] : MapPin;
            const iconColor = benefit.iconColor ?? primaryColor;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative bg-white p-4 sm:p-6 md:p-10 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300"
                style={{ ['--primary']: primaryColor } as React.CSSProperties}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-4 sm:mb-6 transition-colors duration-300 group-hover:bg-[var(--primary)] group-hover:text-white" style={{ backgroundColor: `${iconColor}1a`, color: iconColor }}>
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 md:mb-3 break-words">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed break-words">
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

