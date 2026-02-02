'use client';

import { useRef, useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
}

export default function CardSpotlight({ children, className }: CardSpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!divRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const div = divRef.current;
    if (div) {
      div.addEventListener('mousemove', handleMouseMove);
      return () => div.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => {
      if (divRef.current) {
        observer.unobserve(divRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={divRef}
      className={cn(
        'relative rounded-lg overflow-hidden bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300',
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isInView ? 0.8 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(203, 83, 10, 0.4), transparent 50%)`,
        }}
      />
      {children}
    </div>
  );
}

