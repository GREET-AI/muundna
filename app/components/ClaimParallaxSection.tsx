'use client';

import { useRef, useState, useEffect } from 'react';
import type { MotionValue } from 'framer-motion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MessageCircle, ClipboardList, Home, TrendingUp } from 'lucide-react';
import { TextGenerateEffect } from './ui/TextGenerateEffect';

const CARD_ROW_Y = -100;
const CARD_ROW_X = [-430, -143, 143, 430];
/** Desktop: Nach der Reihe wandern die Cards in eine senkrechte Anordnung links. */
const LIST_PHASE_SCROLL = [0.55, 0.72] as const;
const LIST_X = -380;
const LIST_CARD_SIZE = 250;
const LIST_GAP = 20;
const LIST_Y = (() => {
  const step = LIST_CARD_SIZE + LIST_GAP;
  const start = -1.5 * step;
  return [start, start + step, start + 2 * step, start + 3 * step];
})();
/** Desktop: kompakte Liste + CTA, gleicher Abstand (LIST_GAP) + 150px vor CTA; gesamter Block nach oben, damit CTA-Text voll sichtbar. */
const LIST_Y_DESKTOP = (() => {
  const step = LIST_CARD_SIZE + LIST_GAP;
  const start = -800;
  return [start, start + step, start + 2 * step, start + 3 * step];
})();
const CTA_Y_DESKTOP = 160;
/** Scroll-Progress-Bereiche für Desktop: Fly-in (entspricht animProgress 0.32..0.55) dann Liste. */
const DESKTOP_FLY_IN_SCROLL = [0.145, 0.289] as const;
const FLY_IN_OFFSCREEN_MOBILE = 380;
// Kürzere Scroll-Spanne pro Karte = schnellere Bewegung (gleicher Weg)
const MOBILE_SCROLL_START = [0.08, 0.24, 0.40, 0.56];
const MOBILE_SCROLL_END = [0.18, 0.34, 0.50, 0.66];
const MOBILE_CARD_X = [0, 0, 0, 0];
/** Mobile/Tablet: Cards an Viewport-Höhe anpassen, damit alle 4 sichtbar sind (kein Abschneiden unten). */
const MOBILE_CARD_GAP = 24;
/** Initial Y = End Y (fliegen nur von links/rechts ein) – MOBILE_CARD_Y wird dynamisch berechnet */
/** Desktop: Original-Timing Start 0.32, Ende 0.55 */
const DESKTOP_ANIM_START = 0.32;
const DESKTOP_ANIM_END = 0.55;

/** Tablet: 768–1023px, Mobile: <768px. Cards Tablet +100% (2x), Mobile +50% (1.5x). */
const TABLET_MIN_WIDTH = 768;
const TABLET_CARD_MULTIPLIER = 2;
const MOBILE_CARD_MULTIPLIER = 1.5;

/** Mobile/Tablet: Card-Höhe und Y-Positionen; Tablet 2x, Mobile 1.5x größer. */
function useMobileCardLayout() {
  const [layout, setLayout] = useState({ cardHeight: 200, cardY: [-290, -8, 274, 556] });
  useEffect(() => {
    const update = () => {
      const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
      const w = typeof window !== 'undefined' ? window.innerWidth : 768;
      const gap = MOBILE_CARD_GAP;
      const padding = 48;
      const baseHeight = Math.min(250, Math.max(70, Math.floor((vh - padding - 3 * gap) / 4)));
      const isTablet = w >= TABLET_MIN_WIDTH && w < 1024;
      const isMobile = w < TABLET_MIN_WIDTH;
      const mult = isTablet ? TABLET_CARD_MULTIPLIER : (isMobile ? MOBILE_CARD_MULTIPLIER : 1);
      const cardHeight = Math.round(baseHeight * mult);
      const baseY = [
        -(1.5 * baseHeight + 1.5 * gap),
        -(0.5 * baseHeight + 0.5 * gap),
        0.5 * baseHeight + 0.5 * gap,
        1.5 * baseHeight + 1.5 * gap,
      ];
      const cardY = baseY.map((y) => Math.round(y * mult));
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
/** Parallax-Builder: Default-Labels und Icon-Map (Builder: card1Icon = "message-circle" etc.) */
const PARALLAX_CARD_LABELS = ['Beratung', 'Planung', 'Bau', 'Wert'] as const;
const PARALLAX_ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>> = {
  'message-circle': MessageCircle,
  'clipboard-list': ClipboardList,
  home: Home,
  'trending-up': TrendingUp,
};
const PARALLAX_CARD_ICONS = [MessageCircle, ClipboardList, Home, TrendingUp];
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

export type ParallaxCardConfig = {
  label: string;
  textColor: string;
  textSize: number;
  iconKey: string;
  iconColor: string;
  /** Card 1 (Beratung): optional Bild; Card 3 (Bau): Bild + Overlay-Text */
  imageUrl?: string;
  trustText?: string;
  buttonText?: string;
  /** Card 2 (Planung): zwei Zeilen + Status */
  line1?: string;
  line2?: string;
  statusText?: string;
  overlayText?: string;
  /** Card 4 (Wert): große Zahl + Kontext + Button */
  numberText?: string;
  contextText?: string;
};

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
  cardConfig,
  defaultIconIndex,
  listOffsetX,
  listOffsetY,
  positionX,
  positionY,
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
  cardConfig: ParallaxCardConfig;
  defaultIconIndex: number;
  /** Wenn gesetzt: gleiche Cards wandern von der Reihe in senkrechte Position links (Desktop-Parallax Phase 2). */
  listOffsetX?: number;
  listOffsetY?: number;
  /** Mobile/Tablet: scroll-getrieben, Card wird in eigenem Bereich zentriert (überschreibt x/y). */
  positionX?: MotionValue<number>;
  positionY?: MotionValue<number>;
}) {
  const useScrollDrivenPosition = positionX !== undefined && positionY !== undefined;
  const start = animationStart ?? DESKTOP_ANIM_START;
  const end = animationEnd ?? DESKTOP_ANIM_END;
  const useListPhase = !useScrollDrivenPosition && listOffsetX !== undefined && listOffsetY !== undefined;
  const flyStart = useListPhase ? DESKTOP_FLY_IN_SCROLL[0] : start;
  const flyEnd = useListPhase ? DESKTOP_FLY_IN_SCROLL[1] : end;
  const x = useScrollDrivenPosition
    ? positionX!
    : useListPhase
      ? useTransform(scrollYProgress, [flyStart, flyEnd, LIST_PHASE_SCROLL[0], LIST_PHASE_SCROLL[1]], [initialX, endOffsetX, endOffsetX, listOffsetX!])
      : useTransform(scrollYProgress, [start, end], [initialX, endOffsetX]);
  const y = useScrollDrivenPosition
    ? positionY!
    : useListPhase
      ? useTransform(scrollYProgress, [flyStart, flyEnd, LIST_PHASE_SCROLL[0], LIST_PHASE_SCROLL[1]], [initialY, endOffsetY, endOffsetY, listOffsetY!])
      : useTransform(scrollYProgress, [start, end], [initialY, endOffsetY]);
  const scale = useScrollDrivenPosition
    ? useTransform(scrollYProgress, [0, 1], [1, 1])
    : useListPhase
      ? useTransform(scrollYProgress, [flyStart, flyEnd, LIST_PHASE_SCROLL[0], LIST_PHASE_SCROLL[1]], noScale ? [1, 1, 1, 1] : [0.85, 1, 1, 1])
      : useTransform(scrollYProgress, [start, end], noScale ? [1, 1] : [0.85, 1]);
  const size = cardSize ?? 250;
  const Icon = (PARALLAX_ICON_MAP[cardConfig.iconKey] ?? PARALLAX_CARD_ICONS[defaultIconIndex]) as React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  const textPx = cardConfig.textSize > 0 ? cardConfig.textSize : Math.min(size * 0.078, 20);
  const smallPx = Math.max(10, Math.round(textPx * 0.7));
  const isCompact = size < 200;
  const displayPx = isCompact ? Math.min(textPx, 16) : textPx;
  const displaySmallPx = isCompact ? Math.max(9, Math.round(displayPx * 0.7)) : smallPx;
  const stickerPx = isCompact ? Math.min(10, displaySmallPx) : Math.max(11, smallPx);
  const numberPx = Math.max(12, Math.round(size * 0.09));
  const numberPxDesktopSmaller = Math.max(14, Math.round(size * 0.063));
  const card4LabelPx = Math.max(10, Math.round(displayPx * 0.82));
  const card4SmallPx = Math.max(8, Math.round(displaySmallPx * 0.82));
  const card4LabelPxDesktop = Math.round(card4LabelPx * 1.3);
  const card4SmallPxDesktop = Math.round(card4SmallPx * 1.3);
  const i = defaultIconIndex;

  const baseCard = (
    <motion.div
      className={`absolute left-1/2 top-1/2 will-change-transform -translate-x-1/2 -translate-y-1/2 origin-center pointer-events-auto z-10 rounded-2xl shadow-lg overflow-hidden flex flex-col items-center justify-center gap-1 ${i === 1 ? 'group p-0' : 'p-3'}`}
      style={{ width: size, height: size, x, y, scale, backgroundColor: bgColor }}
    >
      {i === 0 && (
        <>
          {/* Bild als Hintergrund der ganzen Card bis zum Rand, 30 % transparent (70 % sichtbar) */}
          <div className="absolute inset-0 rounded-2xl bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${cardConfig.imageUrl || '/images/trust/14.png'})`, opacity: 0.7 }} />
          <div className="absolute inset-0 rounded-2xl bg-black/25 pointer-events-none" />
        </>
      )}
      {i === 1 && (
        <>
          {/* Layer 1: weiße Card-Basis */}
          <div className="absolute inset-0 rounded-2xl bg-white" aria-hidden />
          {/* Hover: Hintergrundbild + dunkles Overlay */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/slider1/5.png)' }}
            aria-hidden
          >
            <div className="absolute inset-0 bg-black/50 rounded-2xl" />
          </div>
          {/* Grün-Trenner – fährt beim Hover schnell nach links raus */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none group-hover:-translate-x-full" aria-hidden>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              <path fill={bgColor} d="M 0 0 L 0 100 L 100 100 Q 50 58 0 0 Z" />
            </svg>
          </div>
          {/* „gemeinsam“ – fährt beim Hover schnell nach links raus */}
          <span
            className="absolute left-5 bottom-5 font-bold leading-tight whitespace-nowrap group-hover:-translate-x-[140%]"
            style={{ color: cardConfig.textColor, fontSize: `${Math.round((size * 0.6) / 6.6 * 1.25 * 0.85 * 0.9)}px`, fontFamily: 'var(--font-inter), "Segoe UI", Helvetica, Arial, sans-serif', padding: 0 }}
          >
            gemeinsam
          </span>
          {/* „planen wir.“ – verschwindet beim Hover schnell */}
          <div className="absolute pointer-events-none w-0 h-0 opacity-100 group-hover:opacity-0" style={{ right: 25, top: '20%' }}>
            <span
              className="absolute font-bold leading-tight whitespace-nowrap origin-right"
              style={{
                right: 0,
                bottom: 0,
                color: cardConfig.textColor,
                fontSize: `${Math.round((size * 0.6) / 6.6 * 1.25 * 0.85)}px`,
                fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
                transform: 'rotate(-90deg)',
                transformOrigin: 'right bottom',
              }}
            >
              planen wir.
            </span>
          </div>
          {/* Hover-Sticker wie bei Card 3 – erscheinen, wenn Rest weg ist */}
          <div className="absolute left-2 bottom-2 right-2 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 pointer-events-none justify-end">
            <span className={`rounded-xl font-semibold shadow-md whitespace-nowrap w-fit ${isCompact ? 'px-1.5 py-1' : 'px-2.5 py-1.5'}`} style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: cardConfig.textColor || '#000000', fontSize: `${stickerPx}px` }}>Top-Lage</span>
            <span className={`rounded-xl font-semibold shadow-md whitespace-nowrap w-fit ${isCompact ? 'px-1.5 py-1' : 'px-2.5 py-1.5'}`} style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: cardConfig.textColor || '#000000', fontSize: `${stickerPx}px` }}>Top-Rendite Objekte</span>
            <span className={`rounded-xl font-semibold shadow-md whitespace-nowrap w-fit ${isCompact ? 'px-1.5 py-1' : 'px-2.5 py-1.5'}`} style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: cardConfig.textColor || '#000000', fontSize: `${stickerPx}px` }}>Top 10% der Mieteinnahmen</span>
          </div>
        </>
      )}
      {i === 2 && (
        <>
          {cardConfig.imageUrl ? (
            <>
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cardConfig.imageUrl})` }} />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute left-2 top-2 right-2 z-10 flex justify-start">
                <span className={`rounded-xl font-semibold shadow-md whitespace-nowrap ${isCompact ? 'px-1.5 py-1' : 'px-2.5 py-1.5'}`} style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: cardConfig.textColor || '#000000', fontSize: `${stickerPx}px` }}>{cardConfig.overlayText || cardConfig.label}</span>
              </div>
            </>
          ) : (
            <>
              <span className="shrink-0 inline-flex" style={{ color: cardConfig.iconColor }}><Icon size={size * 0.32} strokeWidth={2} /></span>
              <span className="font-bold text-center leading-tight px-2" style={{ color: cardConfig.textColor, fontSize: `${displayPx}px` }}>{cardConfig.label}</span>
            </>
          )}
        </>
      )}
      {i === 3 && (
        <>
          <div className="absolute inset-0 flex flex-col gap-2" style={{ padding: isCompact ? Math.min(10, size * 0.04) : Math.min(20, size * 0.08), gap: isCompact ? 6 : 8 }}>
            <div className={`flex-1 rounded-2xl bg-white/95 shadow-sm border border-black/5 flex flex-col items-center justify-center gap-0.5 min-h-0 ${isCompact ? 'px-2 py-2' : 'px-3 py-4'}`}>
              <span className="shrink-0 inline-flex" style={{ color: cardConfig.iconColor }}><Icon size={size * (isCompact ? 0.12 : 0.14)} strokeWidth={2} /></span>
              <span className="font-bold text-center leading-tight" style={{ color: cardConfig.textColor, fontSize: `${isCompact ? card4LabelPx : card4LabelPxDesktop}px` }}>{cardConfig.label}</span>
              {cardConfig.numberText && <span className="font-bold text-center leading-none" style={{ color: cardConfig.textColor, fontSize: `${numberPxDesktopSmaller}px` }}>{cardConfig.numberText}</span>}
              {cardConfig.contextText && <span className="text-center leading-tight text-neutral-600" style={{ fontSize: `${isCompact ? card4SmallPx : card4SmallPxDesktop}px` }}>{cardConfig.contextText}</span>}
            </div>
            {cardConfig.buttonText && (
              <div className="w-full rounded-2xl overflow-hidden shadow-sm" style={{ padding: 0 }}>
                <span className={`block w-full rounded-2xl text-center font-semibold bg-white border border-black/10 ${isCompact ? 'py-1.5' : 'py-2'}`} style={{ color: cardConfig.textColor, fontSize: `${isCompact ? Math.max(8, card4SmallPx) : card4SmallPxDesktop}px` }}>{cardConfig.buttonText}</span>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );

  return baseCard;
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

const DEFAULT_CTA_TEXT = 'Jetzt unverbindlich beraten lassen – Ihr Traumhaus beginnt hier.';
const DEFAULT_HEADLINE_LINE1 = 'Ihre Immobilie.';
const DEFAULT_HEADLINE_LINE2 = 'Ihr Vermögen.';

interface ClaimParallaxSectionProps {
  primaryColor?: string;
  secondaryColor?: string;
  claimHeadlineLine1?: string;
  claimHeadlineLine2?: string;
  ctaText?: string;
  cardLabel1?: string;
  cardLabel2?: string;
  cardLabel3?: string;
  cardLabel4?: string;
  card1ImageUrl?: string;
  card1TrustText?: string;
  card1ButtonText?: string;
  card2Line1?: string;
  card2Line2?: string;
  card2StatusText?: string;
  card3ImageUrl?: string;
  card3OverlayText?: string;
  card4NumberText?: string;
  card4ContextText?: string;
  card4ButtonText?: string;
  card1TextColor?: string;
  card2TextColor?: string;
  card3TextColor?: string;
  card4TextColor?: string;
  card1TextSize?: number | string;
  card2TextSize?: number | string;
  card3TextSize?: number | string;
  card4TextSize?: number | string;
  card1Icon?: string;
  card2Icon?: string;
  card3Icon?: string;
  card4Icon?: string;
  card1IconColor?: string;
  card2IconColor?: string;
  card3IconColor?: string;
  card4IconColor?: string;
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

/** Desktop: Scroll-Stop, dann gleiche Cards wandern von waagerecht zentriert zu senkrecht links. */
function ClaimParallaxDesktop({
  scrollYProgress,
  headlineLine1 = DEFAULT_HEADLINE_LINE1,
  headlineLine2 = DEFAULT_HEADLINE_LINE2,
  ctaText = DEFAULT_CTA_TEXT,
  cardConfigs,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  primaryColor: string;
  headlineLine1?: string;
  headlineLine2?: string;
  ctaText?: string;
  cardConfigs: ParallaxCardConfig[];
}) {
  const flyInOffscreen = useFlyInOffscreen();
  const desktopCards = getDesktopCards(flyInOffscreen);
  const DOT_PATTERN = dotPatternUrl(DOT_PATTERN_COLOR);
  const animProgress = useTransform(scrollYProgress, [0, 0.02, 0.32, 0.98, 1], [0, 0.12, 0.6, 0.6, 0.6]);
  const headlineOpacity = useTransform(animProgress, [0, 0.06, 0.24, 0.55, 0.60], [0, 1, 1, 0, 0]);
  const headlineScale = useTransform(animProgress, [0, 0.06, 0.24, 0.32, 0.55], [1.4, 1.75, 1.75, 1.75, 0.45]);
  const headlineY = useTransform(animProgress, [0, 0.24], [220, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.48, 0.56, 0.58, 0.66], [0, 1, 1, 1]);
  const ctaY = useTransform(scrollYProgress, [0.52, 0.58, 0.66], [0, 0, CTA_Y_DESKTOP]);
  return (
    <div className="hidden lg:flex absolute inset-0 items-center justify-center overflow-visible [contain:layout] [transform:translateZ(0)]">
      <div className="relative w-full h-full overflow-visible">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: DOT_PATTERN, backgroundSize: '16px 16px' }} />
        <motion.div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none z-[1] will-change-transform" style={{ opacity: headlineOpacity, scale: headlineScale, y: headlineY }}>
          <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center tracking-tight max-w-[min(90vw,64rem)] leading-tight py-2 sm:py-4 bg-clip-text text-transparent bg-gradient-to-b from-emerald-50 to-[#60A917]">{headlineLine1}<br />{headlineLine2}</h2>
        </motion.div>
        {/* Gleiche 4 Cards: erst waagerecht zentriert, dann Parallax-Phase 2 = senkrecht links */}
        <div className="absolute inset-0 flex items-center justify-center overflow-visible z-10 pointer-events-none">
          <div className="relative w-full h-full" aria-hidden>
            {desktopCards.map((card, i) => (
              <ParallaxStepCard
                key={i}
                number={card.number}
                initialX={card.initialX}
                initialY={card.initialY}
                endOffsetX={card.endOffsetX}
                endOffsetY={card.endOffsetY}
                scrollYProgress={scrollYProgress}
                listOffsetX={LIST_X}
                listOffsetY={LIST_Y_DESKTOP[i]}
                bgColor={PARALLAX_CARD_COLORS[i] ?? '#C4D32A'}
                cardConfig={cardConfigs[i]}
                defaultIconIndex={i}
              />
            ))}
          </div>
        </div>
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 text-center pointer-events-none z-10"
          style={{ top: 'calc(50% + 125px)', opacity: ctaOpacity, y: ctaY }}
        >
          <TextGenerateEffect
            words={ctaText}
            className="text-2xl md:text-3xl lg:text-6xl font-bold text-neutral-800"
            duration={0.06}
            as="p"
          />
        </motion.div>
      </div>
    </div>
  );
}

/** Mobile/Tablet: Scroll-getrieben – jede Card hat einen Bereich, in dem sie zentriert steht; Einflug abwechselnd links/rechts. */
const MOBILE_CARD_Y_OFFSCREEN = 380;
const MOBILE_CARD_Y_NEAR = 70;
const MOBILE_CARD_X_OFFSCREEN_BASE = 420;
const TABLET_X_OFFSCREEN_AT_768 = 560;
const TABLET_X_OFFSCREEN_MAX = 720;

/** X-Startpunkt: auf Tablet (ab 768px) weiter außen als auf Mobile; Preview-Tablet = 768px bekommt sofort sichtbar mehr. */
function useMobileCardXOffscreen() {
  const [xOffscreen, setXOffscreen] = useState(MOBILE_CARD_X_OFFSCREEN_BASE);
  useEffect(() => {
    const update = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 768;
      if (w >= 1024) setXOffscreen(MOBILE_CARD_X_OFFSCREEN_BASE);
      else if (w >= TABLET_MIN_WIDTH) {
        const t = (w - TABLET_MIN_WIDTH) / (1024 - TABLET_MIN_WIDTH);
        setXOffscreen(Math.round(TABLET_X_OFFSCREEN_AT_768 + t * (TABLET_X_OFFSCREEN_MAX - TABLET_X_OFFSCREEN_AT_768)));
      } else setXOffscreen(MOBILE_CARD_X_OFFSCREEN_BASE);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return xOffscreen;
}

function ClaimParallaxMobile({ scrollYProgress, headlineLine1 = DEFAULT_HEADLINE_LINE1, headlineLine2 = DEFAULT_HEADLINE_LINE2, cardConfigs }: { sectionRef: React.RefObject<HTMLElement | null>; scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']; primaryColor: string; headlineLine1?: string; headlineLine2?: string; cardConfigs: ParallaxCardConfig[] }) {
  const mobileLayout = useMobileCardLayout();
  const cardXOffscreen = useMobileCardXOffscreen();
  const DOT_PATTERN = dotPatternUrl(DOT_PATTERN_COLOR);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.06, 0.24, 0.55, 0.6], [0, 1, 1, 0, 0]);
  const headlineScale = useTransform(scrollYProgress, [0, 0.06, 0.24, 0.32, 0.55], [1.4, 1.75, 1.75, 1.75, 0.45]);
  const headlineY = useTransform(scrollYProgress, [0, 0.24], [220, 0]);
  const mobileX0 = useTransform(scrollYProgress, [0, 0.08, 0.125, 0.25], [-cardXOffscreen, -80, 0, 0]);
  const mobileX1 = useTransform(scrollYProgress, [0.25, 0.315, 0.375, 0.5], [cardXOffscreen, 80, 0, 0]);
  const mobileX2 = useTransform(scrollYProgress, [0.5, 0.565, 0.625, 0.75], [-cardXOffscreen, -80, 0, 0]);
  const mobileX3 = useTransform(scrollYProgress, [0.75, 0.815, 0.875, 1], [cardXOffscreen, 80, 0, 0]);
  const mobileXs = [mobileX0, mobileX1, mobileX2, mobileX3];
  const mobileY0 = useTransform(scrollYProgress, [0, 0.065, 0.125, 0.185, 0.25], [MOBILE_CARD_Y_OFFSCREEN, MOBILE_CARD_Y_NEAR, 0, -MOBILE_CARD_Y_NEAR, -MOBILE_CARD_Y_OFFSCREEN]);
  const mobileY1 = useTransform(scrollYProgress, [0.25, 0.315, 0.375, 0.435, 0.5], [MOBILE_CARD_Y_OFFSCREEN, MOBILE_CARD_Y_NEAR, 0, -MOBILE_CARD_Y_NEAR, -MOBILE_CARD_Y_OFFSCREEN]);
  const mobileY2 = useTransform(scrollYProgress, [0.5, 0.565, 0.625, 0.685, 0.75], [MOBILE_CARD_Y_OFFSCREEN, MOBILE_CARD_Y_NEAR, 0, -MOBILE_CARD_Y_NEAR, -MOBILE_CARD_Y_OFFSCREEN]);
  const mobileY3 = useTransform(scrollYProgress, [0.75, 0.815, 0.875, 0.935, 1], [MOBILE_CARD_Y_OFFSCREEN, MOBILE_CARD_Y_NEAR, 0, -MOBILE_CARD_Y_NEAR, -MOBILE_CARD_Y_OFFSCREEN]);
  const mobileYs = [mobileY0, mobileY1, mobileY2, mobileY3];
  return (
    <div className="flex lg:hidden absolute inset-0 items-center justify-center overflow-hidden [contain:layout] [transform:translateZ(0)]">
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: DOT_PATTERN, backgroundSize: '16px 16px' }} />
        <motion.div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none z-[1] will-change-transform" style={{ opacity: headlineOpacity, scale: headlineScale, y: headlineY }}>
          <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-center tracking-tight max-w-[min(90vw,64rem)] leading-tight py-2 sm:py-4 bg-clip-text text-transparent bg-gradient-to-b from-emerald-50 to-[#60A917]">{headlineLine1}<br />{headlineLine2}</h2>
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-10 pointer-events-none">
          <div className="relative w-full h-full" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <ParallaxStepCard
                key={i}
                number={String(i + 1)}
                initialX={0}
                initialY={0}
                endOffsetX={0}
                endOffsetY={0}
                scrollYProgress={scrollYProgress}
                noScale
                bgColor={PARALLAX_CARD_COLORS[i] ?? '#C4D32A'}
                cardSize={mobileLayout.cardHeight}
                cardConfig={cardConfigs[i]}
                defaultIconIndex={i}
                positionX={mobileXs[i]}
                positionY={mobileYs[i]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function parsePx(v: unknown): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string') { const n = parseInt(v, 10); if (!Number.isNaN(n)) return n; }
  return 16;
}

/** Card 4 (Wert): gewünschte Texte – überschreiben alte DB-Werte, damit sie überall ankommen. */
const CARD4_LABEL = 'Ihre Immobilie';
const CARD4_NUMBER = '875.000€';
const CARD4_CONTEXT = 'Garantierter Zugang zu exklusivsten Wohnobjekten';

function buildCardConfig(p: ClaimParallaxSectionProps, i: number): ParallaxCardConfig {
  const label4 = (p.cardLabel4 === 'Wert' || !p.cardLabel4) ? CARD4_LABEL : p.cardLabel4;
  const num4 = (p.card4NumberText === '8' || !p.card4NumberText) ? CARD4_NUMBER : p.card4NumberText;
  const ctx4 = (p.card4ContextText === 'Wochen zur ersten Immobilie' || !p.card4ContextText) ? CARD4_CONTEXT : p.card4ContextText;
  const labels = [p.cardLabel1 ?? 'Individuelle Beratung', p.cardLabel2 ?? PARALLAX_CARD_LABELS[1], p.cardLabel3 ?? PARALLAX_CARD_LABELS[2], label4];
  const colors = [p.card1TextColor ?? '#000000', p.card2TextColor ?? '#000000', p.card3TextColor ?? '#000000', p.card4TextColor ?? '#000000'];
  const sizes = [parsePx(p.card1TextSize), parsePx(p.card2TextSize), parsePx(p.card3TextSize), parsePx(p.card4TextSize)];
  const icons = [p.card1Icon ?? 'message-circle', p.card2Icon ?? 'clipboard-list', p.card3Icon ?? 'home', p.card4Icon ?? 'trending-up'];
  const iconColors = [p.card1IconColor ?? '#000000', p.card2IconColor ?? '#000000', p.card3IconColor ?? '#ffffff', p.card4IconColor ?? '#000000'];
  return {
    label: labels[i],
    textColor: colors[i],
    textSize: sizes[i],
    iconKey: icons[i],
    iconColor: iconColors[i],
    imageUrl: i === 0 ? (p.card1ImageUrl || '/images/trust/14.png') : i === 2 ? (p.card3ImageUrl || '/images/parallax-cards/wohnhaus1.png') : undefined,
    trustText: i === 0 ? (p.card1TrustText ?? 'Unverbindlich & transparent') : undefined,
    buttonText: i === 0 ? p.card1ButtonText : i === 3 ? p.card4ButtonText : undefined,
    line1: i === 1 ? (p.card2Line1 ?? 'Strategie') : undefined,
    line2: i === 1 ? (p.card2Line2 ?? 'Objektauswahl') : undefined,
    statusText: i === 1 ? (p.card2StatusText ?? 'Strukturiert') : undefined,
    overlayText: i === 2 ? (p.card3OverlayText ?? 'Ihr Traumhaus') : undefined,
    numberText: i === 3 ? num4 : undefined,
    contextText: i === 3 ? ctx4 : undefined,
  };
}

const SECTION_HEIGHT_BASE_MOBILE = 380;
const SECTION_HEIGHT_BASE_DESKTOP = 340;

function useParallaxSectionHeight() {
  const [heightVh, setHeightVh] = useState(SECTION_HEIGHT_BASE_MOBILE);
  useEffect(() => {
    const update = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 768;
      if (w >= 1024) setHeightVh(SECTION_HEIGHT_BASE_DESKTOP);
      else if (w >= TABLET_MIN_WIDTH) setHeightVh(SECTION_HEIGHT_BASE_MOBILE * TABLET_CARD_MULTIPLIER);
      else setHeightVh(SECTION_HEIGHT_BASE_MOBILE * MOBILE_CARD_MULTIPLIER);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return heightVh;
}

export default function ClaimParallaxSection({
  primaryColor = '#cb530a',
  claimHeadlineLine1 = DEFAULT_HEADLINE_LINE1,
  claimHeadlineLine2 = DEFAULT_HEADLINE_LINE2,
  ctaText = DEFAULT_CTA_TEXT,
  ...rest
}: ClaimParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionHeightVh = useParallaxSectionHeight();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const cardConfigs: ParallaxCardConfig[] = [0, 1, 2, 3].map((i) => buildCardConfig({ ...rest, claimHeadlineLine1, claimHeadlineLine2, ctaText }, i));
  return (
    <section ref={sectionRef} className="relative w-full bg-white" style={{ height: `${sectionHeightVh}vh` }}>
      <div className="sticky top-0 left-0 right-0 h-screen w-full overflow-visible">
        <ClaimParallaxDesktop sectionRef={sectionRef} scrollYProgress={scrollYProgress} primaryColor={primaryColor} headlineLine1={claimHeadlineLine1} headlineLine2={claimHeadlineLine2} ctaText={ctaText} cardConfigs={cardConfigs} />
        <ClaimParallaxMobile sectionRef={sectionRef} scrollYProgress={scrollYProgress} primaryColor={primaryColor} headlineLine1={claimHeadlineLine1} headlineLine2={claimHeadlineLine2} cardConfigs={cardConfigs} />
      </div>
    </section>
  );
}
