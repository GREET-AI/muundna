'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Globe, Award, Building2 } from 'lucide-react';

const ROW_GAP = 140;
const START_Y = 380;

interface WordsParallaxSectionProps {
  primaryColor?: string;
  secondaryColor?: string;
}

/** Stil-Guide ImmoSparplan: WordsParallax Expats #B8D96E, Experts #8DB731, Exparts #60a917 */
const WORDS_PARALLAX_COLORS = { expats: '#B8D96E', experts: '#8DB731', exparts: '#60a917' };
const DOT_PATTERN_COLOR = '#b8d0a0';

export default function WordsParallaxSection({ primaryColor = '#cb530a' }: WordsParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
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

  const endTop = -ROW_GAP;
  const endMid = 0;
  const endBottom = ROW_GAP;

  const expatsY = useTransform(scrollYProgress, [0, 0.2, 0.42, 0.64, 1], [START_Y, endMid, endTop, endTop, endTop]);
  const expatsOpacity = useTransform(scrollYProgress, [0, 0.04, 0.2], [0, 1, 1]);

  const expertsY = useTransform(scrollYProgress, [0, 0.2, 0.42, 0.64, 1], [START_Y, START_Y, endMid, endMid, endMid]);
  const expertsOpacity = useTransform(scrollYProgress, [0.18, 0.24, 0.42], [0, 1, 1]);

  const expartsY = useTransform(scrollYProgress, [0, 0.42, 0.64, 1], [START_Y, START_Y, endBottom, endBottom]);
  const expartsOpacity = useTransform(scrollYProgress, [0.4, 0.46, 0.64], [0, 1, 1]);

  const items = [
    { label: 'Expats', icon: Globe, color: colorLight, y: expatsY, opacity: expatsOpacity },
    { label: 'Experts', icon: Award, color: colorMid, y: expertsY, opacity: expertsOpacity },
    { label: 'Exparts', icon: Building2, color: colorDark, y: expartsY, opacity: expartsOpacity },
  ];

  return (
    <section ref={sectionRef} className="relative w-full bg-white h-[280vh] md:h-[200vh]">
      <div className="sticky top-0 left-0 right-0 w-full h-screen overflow-visible bg-white">
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ backgroundImage: DOT_PATTERN, backgroundSize: '16px 16px' }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  className="absolute left-1/2 top-1/2 flex items-center justify-center gap-4 sm:gap-5 lg:gap-6 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap will-change-transform"
                  style={{ y: item.y, opacity: item.opacity }}
                >
                  <span
                    className="flex h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 items-center justify-center rounded-xl sm:rounded-2xl text-white shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" strokeWidth={2.5} />
                  </span>
                  <span className="font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-center" style={{ color: item.color }}>
                    {item.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
