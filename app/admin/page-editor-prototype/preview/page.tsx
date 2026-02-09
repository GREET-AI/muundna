'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { OriginalSectionRenderer } from '../OriginalSectionRenderer';
import type { LandingSection, LandingTemplate } from '@/types/landing-section';

const STORAGE_KEY = 'pageEditorPreviewState';
const DEFAULT_PRIMARY = '#cb530a';
const PARALLAX_PRIMARY = '#C4D32A';
const PARALLAX_SECONDARY = '#60A917';

function PreviewContent() {
  const searchParams = useSearchParams();
  const viewportParam = searchParams.get('viewport');
  const viewportWidth = viewportParam === '768' ? 768 : viewportParam === '430' ? 430 : 0;

  const [sections, setSections] = useState<LandingSection[]>([]);
  const [template, setTemplate] = useState<LandingTemplate>('standard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { sections: LandingSection[]; template: LandingTemplate };
        if (Array.isArray(data.sections)) setSections(data.sections);
        if (data.template === 'parallax' || data.template === 'standard') setTemplate(data.template);
      }
    } catch {
      // ignore
    }
  }, [mounted]);

  // Re-read from sessionStorage when storage event fires (parent updated)
  useEffect(() => {
    if (!mounted) return;
    const handler = () => {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw) as { sections: LandingSection[]; template: LandingTemplate };
          if (Array.isArray(data.sections)) setSections(data.sections);
          if (data.template === 'parallax' || data.template === 'standard') setTemplate(data.template);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [mounted]);

  const isParallax = template === 'parallax';
  const primary = isParallax ? PARALLAX_PRIMARY : DEFAULT_PRIMARY;
  const secondary = isParallax ? PARALLAX_SECONDARY : '#f0e6e0';
  const productSlug = 'coaching';
  const productTitle = 'Dein Coaching';

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-neutral-500">
        Lade Vorschau…
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-neutral-500 text-sm">
        Keine Vorschau-Daten. Bitte im Editor „Preview“ öffnen.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-white"
      style={viewportWidth > 0 ? { width: viewportWidth, minWidth: viewportWidth } : undefined}
    >
      {sections.map((sec, index) => (
        <OriginalSectionRenderer
          key={sec.id}
          section={sec}
          index={index}
          isParallax={isParallax}
          primary={primary}
          secondary={secondary}
          productSlug={productSlug}
          productTitle={productTitle}
        />
      ))}
    </div>
  );
}

export default function PageEditorPreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-neutral-500">Lade Vorschau…</div>}>
      <PreviewContent />
    </Suspense>
  );
}
