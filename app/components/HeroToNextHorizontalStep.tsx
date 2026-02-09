'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/** Wie viel man runterscrollt (vh), um von Hero zur nächsten Section zu wechseln. */
const SCROLL_ZONE_VH = 80;

/**
 * Nur EINE Bewegung nach rechts: Hero → nächste Section.
 * Danach geht die Seite normal weiter (kein weiterer Horizontal-Scroll).
 */
export function HeroToNextHorizontalStep({
  firstChild,
  secondChild,
}: {
  firstChild: React.ReactNode;
  secondChild: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [vwPx, setVwPx] = useState(0);

  useEffect(() => {
    const update = () => setVwPx(typeof window !== 'undefined' ? window.innerWidth : 0);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  });

  const xPx = useTransform(scrollYProgress, (v) => (vwPx > 0 ? -v * vwPx : 0));

  return (
    <div
      ref={wrapperRef}
      className="w-full"
      style={{ minHeight: `${100 + SCROLL_ZONE_VH}vh` }}
    >
      <div className="sticky top-0 left-0 h-screen w-full overflow-hidden">
        <motion.div
          className="flex h-full w-full flex-nowrap"
          style={{ width: '200vw', x: xPx }}
        >
          <div className="h-full flex-shrink-0 overflow-y-auto" style={{ width: '100vw' }}>
            {firstChild}
          </div>
          <div className="h-full flex-shrink-0 overflow-y-auto" style={{ width: '100vw' }}>
            {secondChild}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
