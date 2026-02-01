'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface GlowingEffectProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlowingEffect({ children, className }: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setIsHovered(true));
      container.addEventListener('mouseleave', () => setIsHovered(false));
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', () => setIsHovered(true));
        container.removeEventListener('mouseleave', () => setIsHovered(false));
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
    >
      <div
        className="pointer-events-none absolute -inset-[2px] rounded-lg transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(203, 83, 10, 0.5), rgba(203, 83, 10, 0.1), transparent 60%)`,
          boxShadow: isHovered ? `0 0 30px rgba(203, 83, 10, 0.3)` : 'none',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

