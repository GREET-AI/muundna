'use client';

import { useEffect, useRef } from 'react';

type Pixel = { id: string; provider: string; pixel_id: string | null; name: string | null; script_content?: string | null };

function injectPixel(p: Pixel, container: HTMLDivElement) {
  const id = `pixel-${p.id}`;
  if (document.getElementById(id)) return;

  if (p.provider === 'facebook' && p.pixel_id) {
    const s = document.createElement('script');
    s.id = id;
    s.innerHTML = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${p.pixel_id.replace(/'/g, "\\'")}');fbq('track','PageView');
`;
    container.appendChild(s);
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1; img.width = 1; img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${p.pixel_id}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    container.appendChild(noscript);
    return;
  }

  if (p.provider === 'google_analytics' && p.pixel_id) {
    const s = document.createElement('script');
    s.id = id;
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${p.pixel_id}`;
    container.appendChild(s);
    const s2 = document.createElement('script');
    s2.id = id + '-config';
    s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${p.pixel_id.replace(/'/g, "\\'")}');`;
    container.appendChild(s2);
    return;
  }

  if (p.provider === 'google_ads' && p.pixel_id) {
    const s = document.createElement('script');
    s.id = id;
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + p.pixel_id;
    container.appendChild(s);
    const s2 = document.createElement('script');
    s2.id = id + '-config';
    s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${p.pixel_id.replace(/'/g, "\\'")}');`;
    container.appendChild(s2);
    return;
  }

  if (p.provider === 'tiktok' && p.pixel_id) {
    const s = document.createElement('script');
    s.id = id;
    s.innerHTML = `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date(),ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${p.pixel_id.replace(/'/g, "\\'")}');ttq.page();
}(window, document, 'ttq');
`;
    container.appendChild(s);
    return;
  }

  if (p.provider === 'custom' && p.script_content) {
    const s = document.createElement('script');
    s.id = id;
    s.innerHTML = p.script_content;
    container.appendChild(s);
  }
}

/** Führt bei Lead-Conversion (Formular abgeschickt) fbq/gtag/ttq aus. Nach Form-Submit aufrufen. */
export function trackPixelLead(productSlug: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (typeof (window as unknown as { fbq?: (a: string, b: string) => void }).fbq === 'function') {
      (window as unknown as { fbq: (a: string, b: string) => void }).fbq('track', 'Lead');
    }
    if (typeof (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag === 'function') {
      (window as unknown as { gtag: (a: string, b: string, c: object) => void }).gtag('event', 'conversion', { send_to: 'AW-LEAD' });
    }
    if (typeof (window as unknown as { ttq?: { track: (a: string) => void } }).ttq === 'object') {
      (window as unknown as { ttq: { track: (a: string) => void } }).ttq.track('CompleteRegistration');
    }
  } catch (_) {}
}

export default function LandingPixelsInjector({ productSlug }: { productSlug: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!productSlug || !containerRef.current) return;
    fetch(`/api/public/products/${productSlug}/pixels`)
      .then((r) => r.json())
      .then((data) => {
        const pixels: Pixel[] = data.pixels ?? [];
        pixels.forEach((p) => {
          if (loaded.current.has(p.id)) return;
          injectPixel(p, containerRef.current!);
          loaded.current.add(p.id);
        });
      })
      .catch(() => {});
  }, [productSlug]);

  return <div ref={containerRef} style={{ display: 'none' }} aria-hidden="true" />;
}
