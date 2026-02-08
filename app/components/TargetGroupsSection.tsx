'use client';

/**
 * NUR FÜR DIE HAUPTSEITE (Handwerker / Bürodienstleistungen).
 * Feste Inhalte – keine Builder-Props. Builder/Produkt-Landingpages nutzen
 * app/components/landing-builder/ (BuilderTargetGroupsSection).
 * Darstellung: horizontaler Card-Carousel mit Wischen (Touch) und Pfeil-Navigation.
 */
import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedCard3D from './ui/AnimatedCard3D';

const TITLE = 'Das passende Angebot für Sie';
const SUBTITLE = 'Professionelle Bürodienstleistungen speziell für Ihre Branche – maßgeschneidert und effizient';
const PRIMARY = '#cb530a';

const GROUPS = [
  { title: 'Handwerksbetriebe', description: 'Professionelle Bürodienstleistungen speziell für Handwerksbetriebe. Wir übernehmen Ihre Büroarbeit, damit Sie sich voll auf Ihr Handwerk konzentrieren können.', icon: '🔧', href: '/zielgruppen/handwerksbetriebe', image: '/images/Handwerker.png' },
  { title: 'Bauunternehmen', description: 'Komplette Bürodienstleistungen für Bauunternehmen. Von Telefonservice bis Social Media – wir unterstützen Sie bei allen administrativen Aufgaben.', icon: '🏗️', href: '/zielgruppen/bauunternehmen', image: '/images/Bauunternehmen.png' },
  { title: 'Straßen- & Brückenbau', description: 'Bürodienstleistungen für Straßen- und Brückenbauunternehmen. Wir unterstützen Sie bei Terminorganisation, Kommunikation und Dokumentation.', icon: '🛣️', href: '/zielgruppen/strassen-brueckenbau', image: '/images/Brückenbau.png' },
  { title: 'Sanierung & Renovierung', description: 'Professionelle Unterstützung für Sanierungs- und Renovierungsbetriebe. Effiziente Terminorganisation und Kundenkommunikation für Ihren Erfolg.', icon: '🔨', href: '/zielgruppen/sanierung', image: '/images/Renovierung.png' },
  { title: 'Dachdecker & Zimmerleute', description: 'Professionelle Bürodienstleistungen für Dachdecker und Zimmerleute. Wir übernehmen die Büroarbeit – Sie konzentrieren sich auf Ihr Handwerk.', icon: '🏠', href: '/zielgruppen/dachdecker-zimmerleute', image: '/images/Dachdecker.png' },
];

const CARD_WIDTH = 380;
const GAP = 24;

export default function TargetGroupsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const run = () => {
      updateScrollState();
    };
    run();
    const t = setTimeout(run, 300);
    window.addEventListener('resize', updateScrollState);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = CARD_WIDTH + GAP;
    el.scrollTo({ left: el.scrollLeft + (direction === 'left' ? -step : step), behavior: 'smooth' });
    setTimeout(updateScrollState, 400);
  };

  return (
    <section className="w-full py-20 bg-white bg-dot-pattern relative" style={{ ['--primary']: PRIMARY } as React.CSSProperties}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{TITLE}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{SUBTITLE}</p>
        </div>

        <div className="relative">
          {/* Pfeile – nur sichtbar wenn scrollbar */}
          <div className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Vorherige Karte"
              className={`pointer-events-auto w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${canScrollLeft ? 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              disabled={!canScrollLeft}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          </div>
          <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Nächste Karte"
              className={`pointer-events-auto w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${canScrollRight ? 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              disabled={!canScrollRight}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4 md:mx-0 md:px-12 scroll-smooth snap-x snap-mandatory scrollbar-thin hover:scrollbar-thumb-gray-300"
            style={{
              scrollbarWidth: 'thin',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {GROUPS.map((group, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex-shrink-0 w-[320px] sm:w-[360px] md:w-[380px] snap-center snap-always"
              >
                <AnimatedCard3D>
                  <Link href={group.href} className="block h-full">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden h-full group hover:shadow-xl transition-all" style={{ ['--primary']: PRIMARY } as React.CSSProperties}>
                      <div className="relative h-52 md:h-56 overflow-hidden bg-gray-100">
                        <Image
                          src={group.image}
                          alt={group.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="380px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="text-white text-sm font-semibold drop-shadow-md">{group.title}</span>
                        </div>
                      </div>
                      <div className="p-6 md:p-8">
                        <div className="flex items-center mb-3">
                          <span className="text-3xl mr-3">{group.icon}</span>
                          <h3 className="text-xl font-bold text-gray-800 transition-colors group-hover:text-[var(--primary)]">
                            {group.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                          {group.description}
                        </p>
                        <span className="inline-flex items-center font-semibold group-hover:translate-x-2 transition-transform text-sm" style={{ color: PRIMARY }}>
                          Mehr erfahren
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedCard3D>
              </motion.div>
            ))}
          </div>

          {/* Dots als Hinweis auf mehr Karten (optional) */}
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {GROUPS.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gray-300 transition-colors"
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

