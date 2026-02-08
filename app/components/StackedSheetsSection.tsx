'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

/** Wie immosparplan-experts: Bilder aus images/slider1 */
const SHEET_IMAGES = [
  '/images/slider1/3.png',
  '/images/slider1/4.png',
  '/images/slider1/5.png',
];

function useViewportHeight() {
  const [vh, setVh] = useState(0);
  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return vh;
}

type Sheet = {
  eyebrow: string;
  title: string;
  body: string;
  imageSrc?: string;
  accent?: 'grid' | 'stamp' | 'none';
  paper: { base: string; edge: string; glow: string };
};

/** Punktemuster gemäß Stil-Guide: #b8d0a0, 35% */
const DOT_PATTERN_COLOR = '#b8d0a0';

function dotPattern(hex: string) {
  const c = hex.replace('#', '%23');
  return `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='${c}' fill-opacity='0.35' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`;
}

interface StackedSheetsSectionProps {
  primaryColor?: string;
  secondaryColor?: string;
}

export default function StackedSheetsSection({ primaryColor = '#cb530a' }: StackedSheetsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const vh = useViewportHeight();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const isParallax = primaryColor === '#C4D32A';

  const sheets: Sheet[] = useMemo(() => {
    const s1 = isParallax ? { base: '#B8D96E', edge: '#B8D96E', glow: 'rgba(184,217,110,0.32)' } : { base: primaryColor, edge: primaryColor, glow: primaryColor + '32' };
    const s2 = isParallax ? { base: '#8DB731', edge: '#8DB731', glow: 'rgba(141,183,49,0.30)' } : { base: primaryColor + 'dd', edge: primaryColor + 'dd', glow: primaryColor + '30' };
    const s3 = isParallax ? { base: '#60A917', edge: '#60A917', glow: 'rgba(96,169,23,0.28)' } : { base: primaryColor + '99', edge: primaryColor + '99', glow: primaryColor + '28' };
    return [
      { eyebrow: '01', title: 'Expats', body: 'Investieren wie ein Insider: klar, schnell, planbar. Dein Einstieg in Immobilien – ohne Fachchinesisch.', imageSrc: SHEET_IMAGES[0], accent: 'grid' as const, paper: s1 },
      { eyebrow: '02', title: 'Experts', body: 'Marketing-Ansatz statt Banken-Drama: Strategie, Deals, Umsetzung. Du bekommst den Plan – wir liefern die Klarheit.', imageSrc: SHEET_IMAGES[1], accent: 'stamp' as const, paper: s2 },
      { eyebrow: '03', title: 'Exparts', body: 'Vom ersten Objekt bis zur Routine: wiederholbare Prozesse, starke Partner, echte Ergebnisse. Let\'s go.', imageSrc: SHEET_IMAGES[2], accent: 'none' as const, paper: s3 },
    ];
  }, [primaryColor]);

  const SHEET_INSET_PX = 10;
  const exitY = vh > 0 ? -(vh - SHEET_INSET_PX * 2) : -900;
  const dotColor = dotPattern(isParallax ? DOT_PATTERN_COLOR : primaryColor);

  const sheet0Y = useTransform(scrollYProgress, [0.08, 0.28, 0.36], [0, 0, exitY]);
  const sheet1Y = useTransform(scrollYProgress, [0.42, 0.56, 0.64], [0, 0, exitY]);
  const sheet0Opacity = useTransform(scrollYProgress, [0.08, 0.34, 0.38], [1, 1, 0]);
  const sheet1Opacity = useTransform(scrollYProgress, [0.42, 0.62, 0.66], [1, 1, 0]);

  const sheet1BasePeek = 6;
  const sheet2BasePeek = 12;
  const sheet1Follow0 = useTransform(scrollYProgress, [0.28, 0.36], [0, -24]);
  const sheet2Follow0 = useTransform(scrollYProgress, [0.28, 0.36], [0, -12]);
  const sheet2Follow1 = useTransform(scrollYProgress, [0.56, 0.64], [0, -20]);
  const sheet1YReal = useTransform([sheet1Y, sheet1Follow0], ([base, f0]: number[]) => base + f0 + sheet1BasePeek);
  const sheet2YReal = useTransform([sheet2Follow0, sheet2Follow1], ([f0, f1]: number[]) => sheet2BasePeek + f0 + f1);

  const bumpA = useTransform(scrollYProgress, [0.28, 0.31, 0.36], [0, 10, 0]);
  const bumpB = useTransform(scrollYProgress, [0.56, 0.59, 0.64], [0, 10, 0]);
  const stageBumpY = useTransform([bumpA, bumpB], ([a, b]: number[]) => a + b);

  const sectionHeightVh = sheets.length * (isParallax ? 75 : 95);
  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: `${sectionHeightVh}vh` }}>
      <div className="sticky top-0 left-0 right-0 h-screen w-full overflow-visible bg-white">
        <div className="absolute inset-0 bg-white" aria-hidden />
        <div className="absolute inset-[10px] overflow-hidden rounded-t-[28px] rounded-b-[44px]">
          <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: dotColor, backgroundSize: '16px 16px' }} />
          <motion.div className="relative z-10 h-full w-full will-change-transform" style={{ y: stageBumpY }}>
            <SheetPage sheet={sheets[2]} z={10} y={sheet2YReal} scale={1} opacity={1} />
            <SheetPage sheet={sheets[1]} z={20} y={sheet1YReal} scale={1} opacity={sheet1Opacity} />
            <SheetPage sheet={sheets[0]} z={30} y={sheet0Y} scale={1} opacity={sheet0Opacity} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SheetPage({
  sheet,
  z,
  y,
  scale,
  opacity,
}: {
  sheet: Sheet;
  z: number;
  y: MotionValue<number>;
  scale: number;
  opacity: number | MotionValue<number>;
}) {
  return (
    <motion.div className="absolute inset-0 will-change-transform" style={{ zIndex: z, y, scale, opacity }}>
      <div className="relative h-full w-full overflow-hidden rounded-t-[28px] rounded-b-[44px]" style={{ background: sheet.paper.base }}>
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.08), inset 1px 0 0 rgba(255,255,255,0.35), inset -1px 0 0 rgba(0,0,0,0.06), 0 14px 40px rgba(0,0,0,0.18)',
          }}
        />
        {sheet.accent === 'grid' && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            aria-hidden
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />
        )}
        {sheet.accent === 'stamp' && (
          <div
            className="pointer-events-none absolute -right-24 top-24 h-64 w-64 rotate-12 rounded-full"
            aria-hidden
            style={{ background: `radial-gradient(circle at 30% 30%, ${sheet.paper.edge} 0%, transparent 65%)`, opacity: 0.55 }}
          />
        )}
        <div className="relative z-10 flex h-full w-full items-center">
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-widest text-white/80">{sheet.eyebrow}</p>
              <h3 className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-7xl">{sheet.title}</h3>
              <p className="mt-6 text-lg leading-relaxed text-white/85 sm:text-2xl">{sheet.body}</p>
              {sheet.imageSrc && (
                <div className="mt-8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sheet.imageSrc}
                    alt=""
                    className="h-[220px] w-full max-w-[720px] rounded-2xl object-cover shadow-[0_18px_50px_rgba(0,0,0,0.22)] ring-1 ring-white/20 sm:h-[260px]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
