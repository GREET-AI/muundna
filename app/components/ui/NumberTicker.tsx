'use client';

import { useEffect, useRef, useState } from 'react';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  className?: string;
}

export default function NumberTicker({
  value,
  direction = 'up',
  delay = 0,
  className = '',
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(direction === 'down' ? value : 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startAnimation = () => {
      setIsAnimating(true);
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = direction === 'down' ? value : 0;
      let step = 0;

      intervalRef.current = setInterval(() => {
        step++;
        if (direction === 'up') {
          current = Math.min(value, current + increment);
        } else {
          current = Math.max(0, current - increment);
        }
        setDisplayValue(Math.floor(current));

        if (step >= steps) {
          setDisplayValue(value);
          setIsAnimating(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }, duration / steps);
    };

    const timer = setTimeout(startAnimation, delay);
    return () => {
      clearTimeout(timer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [value, direction, delay]);

  return (
    <span className={`tabular-nums ${className}`}>
      {displayValue}
    </span>
  );
}

