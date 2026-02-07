'use client';

import { motion } from 'framer-motion';

type TextGenerateEffectProps = {
  words: string;
  className?: string;
  duration?: number;
  as?: 'p' | 'span' | 'div';
  /** Größere, weichere Animation (cinematisch) */
  cinematic?: boolean;
};

/**
 * Zeigt Text Wort für Wort mit Fade-in (ähnlich Aceternity Text Generate Effect).
 * duration = Verzögerung zwischen Wörtern in Sekunden.
 * cinematic = längere, weichere Bewegung für große Einleitungstexte.
 */
export function TextGenerateEffect({
  words,
  className = '',
  duration = 0.05,
  as: Tag = 'p',
  cinematic = false,
}: TextGenerateEffectProps) {
  const wordList = words.trim().split(/\s+/);
  const wordDuration = cinematic ? 0.5 : 0.3;
  const initialY = cinematic ? 20 : 8;
  const easing = cinematic ? [0.22, 0.61, 0.36, 1] as const : undefined;

  return (
    <Tag className={className}>
      {wordList.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: initialY }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: wordDuration,
            delay: i * duration,
            ease: easing,
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
