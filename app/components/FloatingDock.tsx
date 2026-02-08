'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getRoute } from '../utils/routes';

/** Parallax-Vorlage: Schwarze Pille unten mittig, grüner Shimmer-Rand. Items: Immobilien/Produkte, Experts, Community. */
export type ParallaxDockItem = { title: string; href: string };

const DEFAULT_PARALLAX_ITEMS: ParallaxDockItem[] = [
  { title: 'Start', href: '/' },
  { title: 'Immobilien', href: '/p' },
  { title: 'Experts', href: '/experts' },
  { title: 'Community', href: '/community' },
];

export function FloatingDockParallax({
  items = DEFAULT_PARALLAX_ITEMS,
  className = '',
}: { items?: ParallaxDockItem[]; className?: string } = {}) {
  const [hovered, setHovered] = useState(false);
  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[35] bg-white/10 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}
      />
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="fixed bottom-6 left-1/2 z-40 mx-auto w-fit -translate-x-1/2 rounded-full p-[1px] shadow-xl sm:bottom-8"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.9), #C4D32A, rgba(255,255,255,0.9), #C4D32A)',
          backgroundSize: '200% 100%',
        }}
      >
        <div className={`flex h-12 items-center gap-1.5 rounded-full bg-black px-2.5 py-1.5 ${className}`}>
          {items.map((item, i) => (
            <Link
              key={item.href + i}
              href={item.href}
              className="relative flex h-9 min-w-0 shrink-0 items-center justify-center rounded-full px-3 text-sm font-medium text-white transition-colors hover:bg-white/20"
              aria-label={item.title}
              title={item.title}
            >
              <motion.span whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                {item.title}
              </motion.span>
            </Link>
          ))}
        </div>
      </motion.div>
    </>
  );
}
import {
  ChevronDown,
  Home,
  Building2,
  Briefcase,
  Users,
  Star,
  Mail,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';

export type DockItemBase = {
  title: string;
  href?: string;
  icon: LucideIcon;
  /** Submenü öffnet nach oben (Dropup) */
  submenu?: string[];
  /** CTA-Styling (z. B. Jetzt Anfragen) */
  cta?: boolean;
};

const menuItems: DockItemBase[] = [
  { title: 'Start', href: '/', icon: Home },
  { title: 'Über uns', icon: Building2 },
  {
    title: 'Dienstleistungen',
    icon: Briefcase,
    submenu: [
      'Telefonservice & Kommunikation',
      'Terminorganisation',
      'Social Media Betreuung',
      'Google Bewertungen',
      'Dokumentation & Reporting',
      'Webdesign & App Lösungen',
    ],
  },
  {
    title: 'Zielgruppen',
    icon: Users,
    submenu: [
      'Handwerksbetriebe',
      'Bauunternehmen',
      'Straßen- & Brückenbau',
      'Sanierung & Renovierung',
      'Dachdecker & Zimmerleute',
    ],
  },
  { title: 'Referenzen', icon: Star },
  { title: 'Kontakt', icon: Mail },
  { title: 'Jetzt Anfragen', href: '/kontakt/quiz', icon: MessageCircle, cta: true },
];

export function FloatingDock() {
  const [openDropup, setOpenDropup] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef<number | NodeJS.Timeout | null>(null);

  const clearTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearTimeout();
    timeoutRef.current = window.setTimeout(() => setOpenDropup(null), 150);
  };

  const cancelClose = () => {
    clearTimeout();
  };

  useEffect(() => () => clearTimeout(), []);

  return (
    <>
      {/* Leichter Overlay wenn Menü gehovert wird */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[35] bg-black/20 transition-opacity duration-200 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Schwebendes Dock unten mittig – Mobile: Icons + höher, Desktop: Text + Icons */}
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          scheduleClose();
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 sm:bottom-8"
      >
        {/* Orange schimmernder Rand */}
        <div
          className="rounded-full p-[2px] shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4), #cb530a, #a84308, rgba(255,255,255,0.3))',
            backgroundSize: '200% 200%',
            animation: 'dock-border-pulse 4s ease-in-out infinite',
          }}
        >
          <div className="flex h-11 items-center gap-0.5 rounded-full bg-[#d45d0f] px-1 py-1.5 sm:h-12 sm:gap-1 sm:px-1.5">
            {menuItems.map((item, i) => {
              const hasSub = item.submenu && item.submenu.length > 0;
              const isOpen = openDropup === i;
              const Icon = item.icon;

              const trigger = (
                <div
                  className="relative flex items-center"
                  onMouseEnter={() => {
                    cancelClose();
                    if (hasSub) setOpenDropup(i);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  {hasSub ? (
                    <Link
                      href={getRoute(item.title)}
                      onClick={() => setOpenDropup(null)}
                      className={`flex shrink-0 items-center justify-center gap-1.5 rounded-full p-2.5 text-sm font-medium text-white transition-colors sm:px-3 sm:py-2 ${
                        item.cta
                          ? 'bg-[#a84308] hover:bg-[#8f3a07]'
                          : 'hover:bg-white/20'
                      } ${isOpen ? 'bg-white/20' : ''}`}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-label={item.title}
                      title={item.title}
                    >
                      <Icon className="h-5 w-5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                      <span className="hidden max-w-[7rem] truncate sm:inline sm:max-w-none md:max-w-[7rem]">
                        {item.title}
                      </span>
                      <ChevronDown
                        className={`hidden h-4 w-4 shrink-0 transition-transform sm:block ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden
                      />
                    </Link>
                  ) : (
                    <Link
                      href={item.href ?? getRoute(item.title)}
                      className={`flex shrink-0 items-center justify-center gap-1.5 rounded-full p-2.5 text-sm font-medium text-white transition-colors sm:px-3 sm:py-2 ${
                        item.cta
                          ? 'bg-[#a84308] hover:bg-[#8f3a07]'
                          : 'hover:bg-white/20'
                      }`}
                      aria-label={item.title}
                      title={item.title}
                    >
                      <Icon className="h-5 w-5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                      <span className="hidden max-w-[7rem] truncate sm:inline sm:max-w-none md:max-w-[7rem]">
                        {item.title}
                      </span>
                    </Link>
                  )}

                  {/* Dropup: Submenü nach oben */}
                  <AnimatePresence>
                    {hasSub && isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                        className="absolute bottom-full left-1/2 mb-1 min-w-[220px] -translate-x-1/2 rounded-xl border border-[#cb530a]/50 bg-[#a84308]/95 shadow-xl shadow-black/50"
                      >
                        <div className="py-2">
                          {(item.submenu ?? []).map((sub) => (
                            <Link
                              key={sub}
                              href={getRoute(sub)}
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#cb530a]/15 hover:text-white"
                              onClick={() => setOpenDropup(null)}
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                        {/* Kleiner Pfeil nach unten zum Dock */}
                        <div
                          className="absolute -bottom-2 left-1/2 h-2 w-4 -translate-x-1/2 bg-[#a84308]/95 [clip-path:polygon(50%_100%,0_0,100%_0)]"
                          aria-hidden
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
              return <React.Fragment key={item.title}>{trigger}</React.Fragment>;
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
