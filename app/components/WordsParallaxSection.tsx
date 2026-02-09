'use client';

import { useRef, useState, useEffect } from 'react';
import type { MotionValue } from 'framer-motion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Globe, Award, Building2 } from 'lucide-react';

const ROW_GAP_DESKTOP = 140;
const ROW_GAP_MOBILE = 80;
const START_Y_DESKTOP = 380;
const START_Y_MOBILE = 220;

/** Sektionshöhe je Viewport wie im Original: Mobil/Tablet mehr Scroll, Desktop kompakter */
const HEIGHT_VH_MOBILE = 280;
const HEIGHT_VH_TABLET = 240;
const HEIGHT_VH_DESKTOP = 200;
const TABLET_MIN = 768;
const DESKTOP_MIN = 1024;

function useWordsParallaxSectionHeight() {
  const [heightVh, setHeightVh] = useState(HEIGHT_VH_MOBILE);
  useEffect(() => {
    const update = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 768;
      if (w >= DESKTOP_MIN) setHeightVh(HEIGHT_VH_DESKTOP);
      else if (w >= TABLET_MIN) setHeightVh(HEIGHT_VH_TABLET);
      else setHeightVh(HEIGHT_VH_MOBILE);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return heightVh;
}

interface WordsParallaxSectionProps {
  primaryColor?: string;
  secondaryColor?: string;
  word1?: string;
  word2?: string;
  word3?: string;
}

/** Stil-Guide ImmoSparplan: WordsParallax Expats #B8D96E, Experts #8DB731, Exparts #60a917 */
const WORDS_PARALLAX_COLORS = { expats: '#B8D96E', experts: '#8DB731', exparts: '#60a917' };
const DOT_PATTERN_COLOR = '#b8d0a0';

function WordsParallaxDesktop({
  scrollYProgress,
  items,
  dotPattern,
}: {
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  items: { label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; color: string; y: MotionValue<number>; opacity: MotionValue<number> }[];
  dotPattern: string;
}) {
  const endTop = -ROW_GAP_DESKTOP;
  const endMid = 0;
  const endBottom = ROW_GAP_DESKTOP;
  const expatsY = useTransform(scrollYProgress, [0, 0.2, 0.42, 0.64, 1], [START_Y_DESKTOP, endMid, endTop, endTop, endTop]);
  const expertsY = useTransform(scrollYProgress, [0, 0.2, 0.42, 0.64, 1], [START_Y_DESKTOP, START_Y_DESKTOP, endMid, endMid, endMid]);
  const expartsY = useTransform(scrollYProgress, [0, 0.42, 0.64, 1], [START_Y_DESKTOP, START_Y_DESKTOP, endBottom, endBottom]);
  const ys = [expatsY, expertsY, expartsY];
  const desktopItems = items.map((item, i) => ({ ...item, y: ys[i] }));

  return (
    <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none">
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: dotPattern, backgroundSize: '16px 16px' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {desktopItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                className="absolute left-1/2 top-1/2 flex items-center justify-center gap-6 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap will-change-transform"
                style={{ y: item.y, opacity: item.opacity }}
              >
                <span
                  className="flex h-24 w-24 items-center justify-center rounded-2xl text-white shrink-0"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon className="h-12 w-12" strokeWidth={2.5} />
                </span>
                <span className="font-bold text-7xl lg:text-8xl tracking-tight text-center" style={{ color: item.color }}>
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WordsParallaxMobile({
  scrollYProgress,
  items,
  dotPattern,
}: {
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  items: { label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; color: string; y: MotionValue<number>; opacity: MotionValue<number> }[];
  dotPattern: string;
}) {
  const endTop = -ROW_GAP_MOBILE;
  const endMid = 0;
  const endBottom = ROW_GAP_MOBILE;
  const expatsY = useTransform(scrollYProgress, [0, 0.2, 0.42, 0.64, 1], [START_Y_MOBILE, endMid, endTop, endTop, endTop]);
  const expertsY = useTransform(scrollYProgress, [0, 0.2, 0.42, 0.64, 1], [START_Y_MOBILE, START_Y_MOBILE, endMid, endMid, endMid]);
  const expartsY = useTransform(scrollYProgress, [0, 0.42, 0.64, 1], [START_Y_MOBILE, START_Y_MOBILE, endBottom, endBottom]);
  const mobileItems = [
    { ...items[0], y: expatsY },
    { ...items[1], y: expertsY },
    { ...items[2], y: expartsY },
  ];

  return (
    <div className="flex lg:hidden absolute inset-0 items-center justify-center pointer-events-none">
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: dotPattern, backgroundSize: '16px 16px' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {mobileItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                className="absolute left-1/2 top-1/2 flex items-center justify-center gap-3 sm:gap-4 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap will-change-transform"
                style={{ y: item.y, opacity: item.opacity }}
              >
                <span
                  className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl text-white shrink-0"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.5} />
                </span>
                <span className="font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-center" style={{ color: item.color }}>
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function WordsParallaxSection({ primaryColor = '#cb530a', word1 = 'Expats', word2 = 'Experts', word3 = 'Exparts' }: WordsParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionHeightVh = useWordsParallaxSectionHeight();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const isParallax = primaryColor === '#C4D32A';
  const colorLight = isParallax ? WORDS_PARALLAX_COLORS.expats : primaryColor + 'ee';
  const colorMid = isParallax ? WORDS_PARALLAX_COLORS.experts : primaryColor + 'cc';
  const colorDark = isParallax ? WORDS_PARALLAX_COLORS.exparts : primaryColor + '99';
  const dotHex = isParallax ? DOT_PATTERN_COLOR : primaryColor;
  const dotColor = dotHex.replace('#', '%23');
  const DOT_PATTERN = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='${dotColor}' fill-opacity='0.35' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`;

  const expatsOpacity = useTransform(scrollYProgress, [0, 0.04, 0.2], [0, 1, 1]);
  const expertsOpacity = useTransform(scrollYProgress, [0.18, 0.24, 0.42], [0, 1, 1]);
  const expartsOpacity = useTransform(scrollYProgress, [0.4, 0.46, 0.64], [0, 1, 1]);

  const w1 = (word1 ?? 'Expats').trim() || 'Expats';
  const w2 = (word2 ?? 'Experts').trim() || 'Experts';
  const w3 = (word3 ?? 'Exparts').trim() || 'Exparts';

  type ParallaxItem = { label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; color: string; y: MotionValue<number>; opacity: MotionValue<number> };
  const items: ParallaxItem[] = [
    { label: w1, icon: Globe, color: colorLight, y: null as unknown as MotionValue<number>, opacity: expatsOpacity },
    { label: w2, icon: Award, color: colorMid, y: null as unknown as MotionValue<number>, opacity: expertsOpacity },
    { label: w3, icon: Building2, color: colorDark, y: null as unknown as MotionValue<number>, opacity: expartsOpacity },
  ];

  return (
    <section ref={sectionRef} className="relative w-full bg-white" style={{ height: `${sectionHeightVh}vh` }}>
      <div className="sticky top-0 left-0 right-0 w-full h-screen overflow-visible bg-white">
        <WordsParallaxDesktop scrollYProgress={scrollYProgress} items={items} dotPattern={DOT_PATTERN} />
        <WordsParallaxMobile scrollYProgress={scrollYProgress} items={items} dotPattern={DOT_PATTERN} />
      </div>
    </section>
  );
}
