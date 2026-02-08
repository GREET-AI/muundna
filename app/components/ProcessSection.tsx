'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { getRoute } from '../utils/routes';

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  icon: string;
  /** CTA-Link für Schritt 4 (z. B. Expert werden → /experts) */
  href?: string;
  /** CTA-Buttontext für Schritt 4 */
  ctaText?: string;
};

const BUSINESS_STEPS: ProcessStep[] = [
  { number: '1', title: 'Erstgespräch', description: 'Wir lernen Ihre Anforderungen und Ihren Arbeitsalltag kennen. Unverbindlich und kostenlos.', icon: '💬' },
  { number: '2', title: 'Bedarfsanalyse', description: 'Gemeinsam ermitteln wir, welche Bürodienstleistungen Sie entlasten – Telefon, Termine, Social Media, Webdesign oder mehr.', icon: '📋' },
  { number: '3', title: 'Leistungsumfang', description: 'Sie erhalten ein maßgeschneidertes Angebot. Transparent, ohne versteckte Kosten.', icon: '✅' },
  { number: '4', title: 'Jetzt anfragen', description: 'Starten Sie mit uns durch – wir übernehmen Ihre Büroarbeit, Sie konzentrieren sich auf Ihr Kerngeschäft.', icon: '🚀' },
];

const COACHING_STEPS: ProcessStep[] = [
  { number: '1', title: 'Kennenlernen', description: 'Kurzes Gespräch: Wo stehst du? Welche Ziele hast du mit Immobilien als Kapitalanlage? Unverbindlich.', icon: '💬' },
  { number: '2', title: 'Strategie & System', description: 'Du erhältst Zugang zu exklusiven Strategien, Deal-Flow und dem Netzwerk – strukturiert und praxisnah.', icon: '📋' },
  { number: '3', title: 'Umsetzung', description: 'Von der richtigen Immobilie bis zu Kauf und Vermietung: ein komplettes System mit 1:1-Betreuung.', icon: '✅' },
  { number: '4', title: 'Jetzt Platz sichern', description: 'Starte durch – mit klarer Methodik und Zugang zu Deals und Community.', icon: '🚀' },
];

const DEFAULT_PRIMARY = '#cb530a';
const DEFAULT_SECONDARY = '#a84308';

interface ProcessSectionProps {
  steps?: ProcessStep[];
  primaryColor?: string;
  secondaryColor?: string;
  /** Farbe für Schritt-Nummern-Badge und Verbindungslinie (Stil-Guide: #cb530a für Beratung) */
  badgeColor?: string;
  /** Primärfarbe für Go-Expert-Button (schwarz mit Primary-Text + Shimmer) */
  goExpertPrimaryColor?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  /** Wenn true: Untertitel nicht anzeigen (ImmoSparplan-Original hat keinen) */
  hideSubtitle?: boolean;
  /** Parallax: Expert-Card mit Gradient, grüner Border, grüner Button */
  expertCardParallaxStyle?: boolean;
  variant?: 'business' | 'coaching';
}

const BUSINESS_PROCESS_TITLE = 'So funktioniert die Zusammenarbeit';
const BUSINESS_PROCESS_SUBTITLE = 'In vier Schritten zu Ihrer maßgeschneiderten Bürolösung.';
const COACHING_PROCESS_TITLE = 'So funktioniert das Coaching';
const COACHING_PROCESS_SUBTITLE = 'In vier Schritten zu deinem Einstieg in Immobilien als Kapitalanlage';

export default function ProcessSection({ steps: customSteps, primaryColor = DEFAULT_PRIMARY, secondaryColor = DEFAULT_SECONDARY, badgeColor, goExpertPrimaryColor, sectionTitle, sectionSubtitle, hideSubtitle, expertCardParallaxStyle, variant = 'business' }: ProcessSectionProps = {}) {
  const isCoaching = variant === 'coaching';
  const defaultSteps = isCoaching ? COACHING_STEPS : BUSINESS_STEPS;
  const steps = customSteps ?? defaultSteps;
  const defaultTitle = isCoaching ? COACHING_PROCESS_TITLE : BUSINESS_PROCESS_TITLE;
  const defaultSubtitle = isCoaching ? COACHING_PROCESS_SUBTITLE : BUSINESS_PROCESS_SUBTITLE;
  const badge = badgeColor ?? primaryColor;
  return (
    <section className="py-20 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
            {sectionTitle ?? defaultTitle}
          </h2>
          {!hideSubtitle && (
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center mb-12">
            {sectionSubtitle ?? defaultSubtitle}
          </p>
          )}
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
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md" style={{ backgroundColor: badge }}>
                  {step.number}
                </div>
                <div
                  className={step.number === '4' && expertCardParallaxStyle ? 'pt-8 pb-6 px-6 rounded-lg border-2 border-[#60A917] text-center h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-md' : step.number === '4' ? 'pt-8 pb-6 px-6 rounded-lg border-2 border-gray-200 bg-white text-center h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-md' : 'bg-white pt-8 pb-6 px-6 rounded-lg shadow-md border border-gray-200 text-center h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'}
                  style={step.number === '4' && expertCardParallaxStyle ? { background: 'linear-gradient(to bottom, #C4D32A, #9BCB6B, #60A917)' } : undefined}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>
                  {step.number === '4' && (
                    expertCardParallaxStyle && (step.ctaText === 'Go Expert' || step.ctaText === 'Experte werden' || step.ctaText === 'Zum Experten-Bereich') ? (
                      <Link
                        href={step.href ?? '/experts'}
                        className="group relative overflow-hidden inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-colors shadow-md border-2 border-[#60A917] hover:opacity-90"
                        style={{ background: 'linear-gradient(to bottom, #C4D32A, #9BCB6B)', color: '#1a1a1a' }}
                      >
                        <span className="relative z-10">{step.ctaText}</span>
                      </Link>
                    ) : goExpertPrimaryColor && (step.ctaText === 'Go Expert' || step.ctaText === 'Experte werden' || step.ctaText === 'Zum Experten-Bereich') ? (
                      <Link
                        href={step.href ?? '/checkout/experte'}
                        className="group relative overflow-hidden inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-colors shadow-md border border-black/50 bg-black hover:bg-gray-900"
                        style={{ color: goExpertPrimaryColor }}
                      >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" aria-hidden />
                        <span className="relative z-10">{step.ctaText}</span>
                      </Link>
                    ) : (
                      <Link
                        href={step.href ?? getRoute('Quiz')}
                        className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg hover:opacity-90"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {step.ctaText ?? (isCoaching ? 'Jetzt Platz sichern' : 'Jetzt anfragen')}
                      </Link>
                    )
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 transform -translate-y-1/2 z-0" style={{ backgroundColor: `${badge}80` }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
