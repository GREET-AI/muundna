'use client';

import { usePathname } from 'next/navigation';
import { FloatingDock } from './FloatingDock';

export default function ConditionalDock() {
  const pathname = usePathname();
  if (pathname === '/angebot') return null;
  return <FloatingDock />;
}
