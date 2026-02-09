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

const DEFAULT_SHEET1 = { title: 'Expats', body: 'Investieren wie ein Insider: klar, schnell, planbar. Dein Einstieg in Immobilien – ohne Fachchinesisch.' };
const DEFAULT_SHEET2 = { title: 'Experts', body: 'Marketing-Ansatz statt Banken-Drama: Strategie, Deals, Umsetzung. Du bekommst den Plan – wir liefern die Klarheit.' };
const DEFAULT_SHEET3 = { title: 'Exparts', body: 'Vom ersten Objekt bis zur Routine: wiederholbare Prozesse, starke Partner, echte Ergebnisse. Let\'s go.' };

/** Sektionshöhe je Viewport: Desktop wie Original (75/95), Mobil/Tablet kürzer */
const TABLET_MIN = 768;
const DESKTOP_MIN = 1024;

function useStackedSheetsSectionHeight(sheetCount: number, isParallax: boolean) {
  const [heightVh, setHeightVh] = useState(sheetCount * (isParallax ? 55 : 70));
  useEffect(() => {
    const update = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 768;
      const perSheet = w >= DESKTOP_MIN
        ? (isParallax ? 75 : 95)
        : w >= TABLET_MIN
          ? (isParallax ? 62 : 82)
          : (isParallax ? 55 : 70);
      setHeightVh(sheetCount * perSheet);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [sheetCount, isParallax]);
  return heightVh;
}

interface StackedSheetsSectionProps {
  primaryColor?: string;
  secondaryColor?: string;
  sheet1Title?: string;
  sheet1Body?: string;
  sheet2Title?: string;
  sheet2Body?: string;
  sheet3Title?: string;
  sheet3Body?: string;
}

export default function StackedSheetsSection({
  primaryColor = '#cb530a',
  sheet1Title,
  sheet1Body,
  sheet2Title,
  sheet2Body,
  sheet3Title,
  sheet3Body,
}: StackedSheetsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const vh = useViewportHeight();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const isParallax = primaryColor === '#C4D32A';

  const sheets: Sheet[] = useMemo(() => {
    const s1 = isParallax ? { base: '#ffffff', edge: '#B8D96E', glow: 'rgba(184,217,110,0.32)' } : { base: '#ffffff', edge: primaryColor, glow: primaryColor + '32' };
    const s2 = isParallax ? { base: '#ffffff', edge: '#8DB731', glow: 'rgba(141,183,49,0.30)' } : { base: '#ffffff', edge: primaryColor + 'dd', glow: primaryColor + '30' };
    const s3 = isParallax ? { base: '#ffffff', edge: '#60A917', glow: 'rgba(96,169,23,0.28)' } : { base: '#ffffff', edge: primaryColor + '99', glow: primaryColor + '28' };
    const t1 = (sheet1Title ?? DEFAULT_SHEET1.title).trim() || DEFAULT_SHEET1.title;
    const b1 = (sheet1Body ?? DEFAULT_SHEET1.body).trim() || DEFAULT_SHEET1.body;
    const t2 = (sheet2Title ?? DEFAULT_SHEET2.title).trim() || DEFAULT_SHEET2.title;
    const b2 = (sheet2Body ?? DEFAULT_SHEET2.body).trim() || DEFAULT_SHEET2.body;
    const t3 = (sheet3Title ?? DEFAULT_SHEET3.title).trim() || DEFAULT_SHEET3.title;
    const b3 = (sheet3Body ?? DEFAULT_SHEET3.body).trim() || DEFAULT_SHEET3.body;
    return [
      { eyebrow: '01', title: t1, body: b1, imageSrc: SHEET_IMAGES[0], accent: 'grid' as const, paper: s1 },
      { eyebrow: '02', title: t2, body: b2, imageSrc: SHEET_IMAGES[1], accent: 'stamp' as const, paper: s2 },
      { eyebrow: '03', title: t3, body: b3, imageSrc: SHEET_IMAGES[2], accent: 'none' as const, paper: s3 },
    ];
  }, [primaryColor, sheet1Title, sheet1Body, sheet2Title, sheet2Body, sheet3Title, sheet3Body]);

  const SHEET_INSET_PX = 10;
  const exitY = vh > 0 ? -(vh - SHEET_INSET_PX * 2) : -900;
  const dotColor = dotPattern(isParallax ? DOT_PATTERN_COLOR : primaryColor);

  /* Gleichmäßige Verweildauer Blatt 1+2; letztes Blatt mit Scroll-Stop (Übergang endet früher). */
  const sheet0Y = useTransform(scrollYProgress, [0, 0.15, 0.22, 0.38], [0, 0, 0, exitY]);
  const sheet1Y = useTransform(scrollYProgress, [0.35, 0.55, 0.58, 0.66], [0, 0, 0, exitY]);
  const sheet0Opacity = useTransform(scrollYProgress, [0, 0.26, 0.34, 0.42], [1, 1, 1, 0]);
  const sheet1Opacity = useTransform(scrollYProgress, [0.35, 0.58, 0.62, 0.70], [1, 1, 1, 0]);

  const sheet1BasePeek = 6;
  const sheet2BasePeek = 12;
  const sheet1Follow0 = useTransform(scrollYProgress, [0.22, 0.30, 0.38], [0, -8, -24]);
  const sheet2Follow0 = useTransform(scrollYProgress, [0.22, 0.30, 0.38], [0, -4, -12]);
  const sheet2Follow1 = useTransform(scrollYProgress, [0.58, 0.63, 0.66], [0, -8, -20]);
  const sheet1YReal = useTransform([sheet1Y, sheet1Follow0], ([base, f0]: number[]) => base + f0 + sheet1BasePeek);
  const sheet2YReal = useTransform([sheet2Follow0, sheet2Follow1], ([f0, f1]: number[]) => sheet2BasePeek + f0 + f1);

  const bumpA = useTransform(scrollYProgress, [0.20, 0.28, 0.36, 0.42], [0, 6, 10, 0]);
  const bumpB = useTransform(scrollYProgress, [0.54, 0.60, 0.66, 0.72], [0, 6, 10, 0]);
  const stageBumpY = useTransform([bumpA, bumpB], ([a, b]: number[]) => a + b);

  const sectionHeightVh = useStackedSheetsSectionHeight(sheets.length, isParallax);

  const stickyContent = (
    <>
      <div className="absolute inset-0 bg-white" aria-hidden />
      <div className="absolute inset-[10px] overflow-hidden rounded-t-[28px] rounded-b-[44px]">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: dotColor, backgroundSize: '16px 16px' }} />
        <motion.div className="relative z-10 h-full w-full will-change-transform" style={{ y: stageBumpY }}>
          <SheetPage sheet={sheets[2]} z={10} y={sheet2YReal} scale={1} opacity={1} variant="desktop" />
          <SheetPage sheet={sheets[1]} z={20} y={sheet1YReal} scale={1} opacity={sheet1Opacity} variant="desktop" />
          <SheetPage sheet={sheets[0]} z={30} y={sheet0Y} scale={1} opacity={sheet0Opacity} variant="desktop" />
        </motion.div>
      </div>
    </>
  );

  const stickyContentMobile = (
    <>
      <div className="absolute inset-0 bg-white" aria-hidden />
      <div className="absolute inset-[10px] overflow-hidden rounded-t-[28px] rounded-b-[44px]">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: dotColor, backgroundSize: '16px 16px' }} />
        <motion.div className="relative z-10 h-full w-full will-change-transform" style={{ y: stageBumpY }}>
          <SheetPage sheet={sheets[2]} z={10} y={sheet2YReal} scale={1} opacity={1} variant="mobile" />
          <SheetPage sheet={sheets[1]} z={20} y={sheet1YReal} scale={1} opacity={sheet1Opacity} variant="mobile" />
          <SheetPage sheet={sheets[0]} z={30} y={sheet0Y} scale={1} opacity={sheet0Opacity} variant="mobile" />
        </motion.div>
      </div>
    </>
  );

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: `${sectionHeightVh}vh` }}>
      <div className="sticky top-0 left-0 right-0 h-screen w-full overflow-visible bg-white">
        <div className="hidden lg:block absolute inset-0">{stickyContent}</div>
        <div className="block lg:hidden absolute inset-0">{stickyContentMobile}</div>
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
  variant = 'desktop',
}: {
  sheet: Sheet;
  z: number;
  y: MotionValue<number>;
  scale: number;
  opacity: number | MotionValue<number>;
  variant?: 'desktop' | 'mobile';
}) {
  const isMobile = variant === 'mobile';
  return (
    <motion.div className="absolute inset-0 will-change-transform" style={{ zIndex: z, y, scale, opacity }}>
      <div className="relative h-full w-full overflow-hidden rounded-t-[28px] rounded-b-[44px]" style={{ background: sheet.paper.base, border: `3px solid ${sheet.paper.edge}` }}>
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            boxShadow: '0 14px 40px rgba(0,0,0,0.18)',
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
              {isMobile ? (
                <>
                  <p className="text-[0.65rem] font-semibold tracking-widest text-black/70">{sheet.eyebrow}</p>
                  <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">{sheet.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-black/85 sm:text-lg">{sheet.body}</p>
                  {sheet.imageSrc && (
                    <div className="mt-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sheet.imageSrc}
                        alt=""
                        className="h-[180px] w-full max-w-[720px] rounded-2xl object-cover shadow-[0_18px_50px_rgba(0,0,0,0.22)] ring-1 ring-black/10 sm:h-[220px]"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold tracking-widest text-black/70 md:text-[0.6rem] lg:text-xs">{sheet.eyebrow}</p>
                  <h3 className="mt-4 text-5xl font-extrabold tracking-tight text-black sm:text-7xl md:text-[2.4rem] lg:text-7xl">{sheet.title}</h3>
                  <p className="mt-6 text-lg leading-relaxed text-black/85 sm:text-2xl md:text-[1.2rem] lg:text-2xl">{sheet.body}</p>
                  {sheet.imageSrc && (
                    <div className="mt-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sheet.imageSrc}
                        alt=""
                        className="h-[220px] w-full max-w-[720px] rounded-2xl object-cover shadow-[0_18px_50px_rgba(0,0,0,0.22)] ring-1 ring-black/10 sm:h-[260px]"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
