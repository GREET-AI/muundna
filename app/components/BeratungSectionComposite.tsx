'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProcessSection from '@/app/components/ProcessSection';
import StatsSection from '@/app/components/StatsSection';

/** ImmoSparplan Original – Prozess (von immosparplan.com) */
const BERATUNG_PROCESS_STEPS = [
  { number: '1', title: 'Individuelle Beratung', description: 'Wir analysieren Ihre finanzielle Situation und Anlageziele, um Sie sicher und verständlich durch den Immobilienmarkt zu führen.', icon: '💬' },
  { number: '2', title: 'Gezielte Objektauswahl', description: 'Wir ermitteln Ihre Anforderungen und finden gezielt Immobilien, die perfekt zu Ihnen passen und Ihren Kriterien entsprechen.', icon: '🏠' },
  { number: '3', title: 'Full-Service-Konzept', description: 'Von der Finanzierung über den Notartermin bis zur Verwaltung – wir begleiten Sie in jeder Phase und arbeiten mit erfahrenen Partnern zusammen.', icon: '✅' },
  { number: '4', title: 'Expert werden', description: 'Exklusive Inhalte, Vernetzung mit Investoren und Zugang zur Experten-Plattform.', icon: '🚀', href: '/experts', ctaText: 'Zum Experten-Bereich' },
];

const BERATUNG_STATS = [
  { value: 230, label: 'Zufriedene Kunden', suffix: '+', icon: '🏠' },
  { value: 8, label: 'Wochen zur ersten Immobilie', suffix: '', icon: '⏱️' },
  { value: 800, label: 'Wohnungen fehlen 2024 in Deutschland', suffix: '+', icon: '📊' },
];

/** Punktemuster gemäß Stil-Guide: #b8d0a0, 35% Opacity – für alle weißen Parallax-Sektionen */
function dotPattern(hex: string) {
  const c = hex.replace('#', '%23');
  return `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='${c}' fill-opacity='0.35' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`;
}

const DOT_PATTERN_COLOR = '#b8d0a0';

interface BeratungSectionCompositeProps {
  sectionTitle?: string;
  /** Wörter, die in der Headline mit primaryColor hervorgehoben werden */
  highlightWords?: string[];
  primaryColor?: string;
  secondaryColor?: string;
}

const DEFAULT_HIGHLIGHT_WORDS = ['finanzielle Freiheit', '8 Wochen', 'ersten', 'Immobilie'];

function highlightHeadline(text: string, words: string[]) {
  if (!words.length) return [{ text, highlight: false }];
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const re = new RegExp(`(${escaped})`, 'gi');
  const raw = text.split(re).filter(Boolean);
  const lowerWords = words.map((w) => w.toLowerCase());
  return raw.map((seg) => ({ text: seg, highlight: lowerWords.includes(seg.toLowerCase()) }));
}

export default function BeratungSectionComposite({
  sectionTitle = 'Mit vermieteten Immobilien in die finanzielle Freiheit – wir begleiten Sie in 8 Wochen zu Ihrer ersten Immobilie.',
  highlightWords = DEFAULT_HIGHLIGHT_WORDS,
  primaryColor = '#cb530a',
  secondaryColor = '#f0e6e0',
}: BeratungSectionCompositeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const headlineY = useTransform(scrollYProgress, [0, 0.25], [0, -15]);

  const isParallax = primaryColor === '#C4D32A';
  return (
    <section ref={sectionRef} className="relative w-full bg-white min-h-screen overflow-hidden">
      {!isParallax && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none will-change-transform"
          style={{
            y: backgroundY,
            backgroundImage: dotPattern(DOT_PATTERN_COLOR),
            backgroundSize: '16px 16px',
          }}
        />
      )}
      <div className="relative z-10">
        <motion.div
          className="w-full min-h-[320px] md:min-h-[380px] py-16 md:py-24 flex items-center justify-center will-change-transform bg-white"
          style={{ y: headlineY }}
        >
          <h1 className="font-bold text-2xl md:text-5xl lg:text-6xl leading-relaxed tracking-tight text-neutral-700 max-w-5xl text-center mx-auto px-4">
            {highlightHeadline(sectionTitle, highlightWords).map((part, i) =>
              part.highlight ? (
                <span
                  key={i}
                  className="rounded-md px-1 text-black"
                  style={{ background: 'linear-gradient(to right, #60A917, #C4D32A)' }}
                >
                  {part.text}
                </span>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </h1>
        </motion.div>

        <ProcessSection
          steps={BERATUNG_PROCESS_STEPS}
          sectionTitle="Der Prozess – Ihr Weg zur erfolgreichen Immobilieninvestition"
          hideSubtitle={isParallax}
          sectionSubtitle={isParallax ? undefined : 'In vier Schritten zu deinem Einstieg in Immobilien als Kapitalanlage'}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          badgeColor={primaryColor}
          goExpertPrimaryColor={isParallax ? '#C4D32A' : primaryColor}
          expertCardParallaxStyle={isParallax}
        />

        <StatsSection
          stats={BERATUNG_STATS}
          title="Bereits mehr als 230 Kunden freuen sich über den Kauf ihrer Immobilie"
          description="Über den Kauf ihrer Immobilie."
          primaryColor={primaryColor}
        />
      </div>
    </section>
  );
}
