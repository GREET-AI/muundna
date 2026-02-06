'use client';

import { usePathname } from 'next/navigation';
import { FloatingDock } from './FloatingDock';

export default function ConditionalDock() {
  const pathname = usePathname();
  if (pathname === '/angebot') return null;
  if (pathname?.startsWith('/admin')) return null;
  return <FloatingDock />;
}
