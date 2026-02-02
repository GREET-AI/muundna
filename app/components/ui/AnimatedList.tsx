'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface AnimatedListProps {
  items: string[];
  className?: string;
}

export default function AnimatedList({ items, className }: AnimatedListProps) {
  const [displayedItems, setDisplayedItems] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < items.length) {
      const timer = setTimeout(() => {
        setDisplayedItems((prev) => [...prev, items[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, items]);

  return (
    <ul className={cn('space-y-2', className)}>
      {displayedItems.map((item, index) => (
        <li
          key={index}
          className="flex items-start animate-in fade-in slide-in-from-left-4 duration-500"
        >
          <span className="text-[#cb530a] mr-3 mt-1">✓</span>
          <span className="text-gray-700">{item}</span>
        </li>
      ))}
    </ul>
  );
}

