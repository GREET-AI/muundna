'use client';

import { useEffect } from 'react';
import { trackFunnelEvent } from '@/app/lib/landing-funnel-tracker';

/** Sendet einmal landing_view beim Mount (nur wenn slug und mit Builder-Layout). */
export default function ProductLandingTracker({ productSlug, enabled }: { productSlug: string; enabled: boolean }) {
  useEffect(() => {
    if (!enabled || !productSlug) return;
    trackFunnelEvent(productSlug, 'landing_view');
  }, [productSlug, enabled]);
  return null;
}
