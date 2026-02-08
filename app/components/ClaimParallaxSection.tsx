'use client';

import { useRef, useState, useEffect } from 'react';
import type { MotionValue } from 'framer-motion';
import { motion, useScroll, useTransform } from 'framer-motion';

const CARD_ROW_Y = -100;
const CARD_ROW_X = [-430, -143, 143, 430];
const FLY_IN_OFFSCREEN_MOBILE = 380;
const MOBILE_SCROLL_START = [0.08, 0.24, 0.40, 0.56];
const MOBILE_SCROLL_END = [0.22, 0.38, 0.54, 0.70];
const MOBILE_CARD_X = [0, 0, 0, 0];
/** Mobile/Tablet: Cards an Viewport-Höhe anpassen, damit alle 4 sichtbar sind (kein Abschneiden unten). */
const MOBILE_CARD_GAP = 24;
/** Initial Y = End Y (fliegen nur von links/rechts ein) – MOBILE_CARD_Y wird dynamisch berechnet */
/** Desktop: Original-Timing Start 0.32, Ende 0.55 */
const DESKTOP_ANIM_START = 0.32;
const DESKTOP_ANIM_END = 0.55;

/** Mobile/Tablet: Card-Höhe und Y-Positionen so, dass alle 4 Cards sichtbar sind (nicht abgeschnitten). */
function useMobileCardLayout() {
  const [layout, setLayout] = useState({ cardHeight: 200, cardY: [-290, -8, 274, 556] });
  useEffect(() => {
    const update = () => {
      const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
      const gap = MOBILE_CARD_GAP;
      const padding = 48;
      const cardHeight = Math.min(250, Math.max(70, Math.floor((vh - padding - 3 * gap) / 4)));
      const cardY = [
        -(1.5 * cardHeight + 1.5 * gap),
        -(0.5 * cardHeight + 0.5 * gap),
        0.5 * cardHeight + 0.5 * gap,
        1.5 * cardHeight + 1.5 * gap,
      ];
      setLayout({ cardHeight, cardY });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return layout;
}


/** Stil-Guide: Parallax-Cards Vollflächige Farben – Card 1–4 */
const PARALLAX_CARD_COLORS = ['#B8D96E', '#9BCB6B', '#A8D08D', '#C4D32A'];
/** Punktemuster gemäß Stil-Guide: #b8d0a0, 35% */
const DOT_PATTERN_COLOR = '#b8d0a0';

/** flyInOffscreen = ceil(viewportWidth/2 + 200), bei Resize neu berechnen */
function useFlyInOffscreen() {
  const [flyInOffscreen, setFlyInOffscreen] = useState(1160);
  useEffect(() => {
    const update = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
      setFlyInOffscreen(Math.ceil(w / 2 + 200));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return flyInOffscreen;
}

function ParallaxStepCard({
  initialX,
  initialY,
  endOffsetX,
  endOffsetY,
  scrollYProgress,
  animationStart,
  animationEnd,
  noScale,
  bgColor,
  cardSize,
}: {
  number: string;
  initialX: number;
  initialY: number;
  endOffsetX: number;
  endOffsetY: number;
  scrollYProgress: MotionValue<number>;
  animationStart?: number;
  animationEnd?: number;
  noScale?: boolean;
  bgColor: string;
  cardSize?: number;
}) {
  const start = animationStart ?? DESKTOP_ANIM_START;
  const end = animationEnd ?? DESKTOP_ANIM_END;
  const x = useTransform(scrollYProgress, [start, end], [initialX, endOffsetX]);
  const y = useTransform(scrollYProgress, [start, end], [initialY, endOffsetY]);
  const scale = useTransform(scrollYProgress, [start, end], noScale ? [1, 1] : [0.85, 1]);
  const size = cardSize ?? 250;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform -translate-x-1/2 -translate-y-1/2 origin-center pointer-events-auto z-10 rounded-2xl shadow-lg overflow-hidden"
      style={{ width: size, height: size, x, y, scale, backgroundColor: bgColor }}
    />
  );
}

const MOBILE_INITIAL_X = [-FLY_IN_OFFSCREEN_MOBILE, FLY_IN_OFFSCREEN_MOBILE, -FLY_IN_OFFSCREEN_MOBILE, FLY_IN_OFFSCREEN_MOBILE];

function getMobileCards(cardY: number[]) {
  return MOBILE_CARD_X.map((_, i) => ({
    number: String(i + 1),
    initialX: MOBILE_INITIAL_X[i],
    initialY: cardY[i],
    endOffsetX: MOBILE_CARD_X[i],
    endOffsetY: cardY[i],
  }));
}

interface ClaimParallaxSectionProps {
  primaryColor?: string;
  secondaryColor?: string;
}

function getDesktopCards(flyInOffscreen: number) {
  return [
    { number: '1', initialX: -flyInOffscreen, initialY: CARD_ROW_Y, endOffsetX: CARD_ROW_X[0], endOffsetY: CARD_ROW_Y },
    { number: '2', initialX: CARD_ROW_X[1], initialY: -flyInOffscreen, endOffsetX: CARD_ROW_X[1], endOffsetY: CARD_ROW_Y },
    { number: '3', initialX: CARD_ROW_X[2], initialY: flyInOffscreen, endOffsetX: CARD_ROW_X[2], endOffsetY: CARD_ROW_Y },
    { number: '4', initialX: flyInOffscreen, initialY: CARD_ROW_Y, endOffsetX: CARD_ROW_X[3], endOffsetY: CARD_ROW_Y },
  ];
}

/** Punktemuster-SVG-URL */
function dotPatternUrl(hex: string) {
  const c = hex.replace('#', '%23');
  return `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='${c}' fill-opacity='0.35' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`;
}

/** Desktop: Scroll-Stop hält bis die Schrift komplett verschwunden ist (animProgress 0.60).
 * Animation nach vorne verschoben: Anfang schneller (weniger totes Scrollen), Ende gedehnt (nicht mehr so hektisch). */
function ClaimParallaxDesktop({ scrollYProgress }: { sectionRef: React.RefObject<HTMLElement | null>; scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']; primaryColor: string }) {
  const flyInOffscreen = useFlyInOffscreen();
  const desktopCards = getDesktopCards(flyInOffscreen);
  const DOT_PATTERN = dotPatternUrl(DOT_PATTERN_COLOR);
  // Raw 0..0.02 → Anim 0..0.12 (Anfang schnell), Raw 0.02..0.45 → Anim 0.12..0.42, Raw 0.45..0.98 → Anim 0.42..0.6 (letzte 30% bekommen ~53% der Zeit)
  const animProgress = useTransform(scrollYProgress, [0, 0.02, 0.45, 0.98, 1], [0, 0.12, 0.42, 0.6, 0.6]);
  const headlineOpacity = useTransform(animProgress, [0, 0.06, 0.24, 0.55, 0.60], [0, 1, 1, 0, 0]);
  const headlineScale = useTransform(animProgress, [0, 0.06, 0.24, 0.32, 0.55], [1.4, 1.75, 1.75, 1.75, 0.45]);
  const headlineY = useTransform(animProgress, [0, 0.24], [220, 0]);
  return (
    <div className="hidden md:flex absolute inset-0 items-center justify-center overflow-hidden [contain:layout] [transform:translateZ(0)]">
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: DOT_PATTERN, backgroundSize: '16px 16px' }} />
        <motion.div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none z-[1] will-change-transform" style={{ opacity: headlineOpacity, scale: headlineScale, y: headlineY }}>
          <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center tracking-tight max-w-[min(90vw,64rem)] leading-tight py-2 sm:py-4 bg-clip-text text-transparent bg-gradient-to-b from-emerald-50 to-[#60A917]">Ihre Immobilie.<br />Ihr Vermögen.</h2>
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-10 pointer-events-none">
          <div className="relative w-full h-full" aria-hidden>
            {desktopCards.map((card, i) => (
              <ParallaxStepCard key={i} number={card.number} initialX={card.initialX} initialY={card.initialY} endOffsetX={card.endOffsetX} endOffsetY={card.endOffsetY} scrollYProgress={animProgress} bgColor={PARALLAX_CARD_COLORS[i] ?? '#C4D32A'} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile/Tablet: Cards untereinander, viewport-angepasst */
function ClaimParallaxMobile({ scrollYProgress }: { sectionRef: React.RefObject<HTMLElement | null>; scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']; primaryColor: string }) {
  const mobileLayout = useMobileCardLayout();
  const DOT_PATTERN = dotPatternUrl(DOT_PATTERN_COLOR);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.06, 0.24, 0.55, 0.6], [0, 1, 1, 0, 0]);
  const headlineScale = useTransform(scrollYProgress, [0, 0.06, 0.24, 0.32, 0.55], [1.4, 1.75, 1.75, 1.75, 0.45]);
  const headlineY = useTransform(scrollYProgress, [0, 0.24], [220, 0]);
  return (
    <div className="flex md:hidden absolute inset-0 items-center justify-center overflow-hidden [contain:layout] [transform:translateZ(0)]">
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: DOT_PATTERN, backgroundSize: '16px 16px' }} />
        <motion.div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none z-[1] will-change-transform" style={{ opacity: headlineOpacity, scale: headlineScale, y: headlineY }}>
          <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-center tracking-tight max-w-[min(90vw,64rem)] leading-tight py-2 sm:py-4 bg-clip-text text-transparent bg-gradient-to-b from-emerald-50 to-[#60A917]">Ihre Immobilie.<br />Ihr Vermögen.</h2>
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-10 pointer-events-none">
          <div className="relative w-full h-full" aria-hidden>
            {getMobileCards(mobileLayout.cardY).map((card, i) => (
              <ParallaxStepCard key={i} number={card.number} initialX={MOBILE_INITIAL_X[i]} initialY={mobileLayout.cardY[i]} endOffsetX={MOBILE_CARD_X[i]} endOffsetY={mobileLayout.cardY[i]} scrollYProgress={scrollYProgress} animationStart={MOBILE_SCROLL_START[i]} animationEnd={MOBILE_SCROLL_END[i]} noScale bgColor={PARALLAX_CARD_COLORS[i] ?? '#C4D32A'} cardSize={mobileLayout.cardHeight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClaimParallaxSection({ primaryColor = '#cb530a' }: ClaimParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  return (
    <section ref={sectionRef} className="relative w-full bg-white h-[380vh] md:h-[550vh]">
      <div className="sticky top-0 left-0 right-0 h-screen w-full overflow-visible">
        <ClaimParallaxDesktop sectionRef={sectionRef} scrollYProgress={scrollYProgress} primaryColor={primaryColor} />
        <ClaimParallaxMobile sectionRef={sectionRef} scrollYProgress={scrollYProgress} primaryColor={primaryColor} />
      </div>
    </section>
  );
}
