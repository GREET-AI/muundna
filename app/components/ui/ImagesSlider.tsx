'use client';

import { cn } from '../../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';

export interface ImagesSliderProps {
  images: string[];
  children?: React.ReactNode;
  overlay?: boolean;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: 'up' | 'down';
}

/** Schnelle Crossfade-Dauer – kein Leerraum während Transition */
const TRANSITION_DURATION = 0.2;

/** Bilder vorladen, damit sie beim Wechsel sofort aus dem Cache kommen */
function preloadImages(srcs: string[]) {
  srcs.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

export function ImagesSlider({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
}: ImagesSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1 === images.length ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    preloadImages(images);
  }, [images]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (autoplay && images.length > 0) interval = setInterval(handleNext, 5000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, images.length, handleNext]);

  if (images.length === 0) return null;

  const currentSrc = images[currentIndex];

  return (
    <div className={cn('relative h-full w-full overflow-hidden bg-gray-900', className)}>
      {children && (
        <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center [&>*]:pointer-events-auto">
          {children}
        </div>
      )}
      {overlay && (
        <div
          className={cn(
            'pointer-events-none absolute inset-0 z-[1]',
            overlayClassName ?? 'bg-black/50'
          )}
        />
      )}
      {/* img-Tag für zuverlässiges Laden + Fallback bei Fehler */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: 1,
            scale: [1, 1.08],
            x: [0, 12],
            y: [0, 8],
          }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: TRANSITION_DURATION, ease: 'easeInOut' },
            scale: { duration: 5, ease: 'easeOut' },
            x: { duration: 5, ease: 'easeOut' },
            y: { duration: 5, ease: 'easeOut' },
          }}
          className="absolute inset-0 z-0 origin-center overflow-hidden"
          style={{ willChange: 'transform' }}
          aria-hidden
        >
          {/* img statt background-image: zuverlässigeres Laden, onError-Fallback */}
          <img
            src={currentSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            onError={(e) => {
              const target = e.currentTarget;
              if (images[0] && target.src !== images[0]) {
                target.src = images[0];
              }
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
