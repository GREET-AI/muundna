'use client';

import { useState } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

const VIEWPORTS: { mode: ViewportMode; label: string; icon: typeof Monitor; width: number }[] = [
  { mode: 'desktop', label: 'Desktop', icon: Monitor, width: 0 },
  { mode: 'tablet', label: 'Tablet', icon: Tablet, width: 768 },
  { mode: 'mobile', label: 'Responsive', icon: Smartphone, width: 430 },
];

/** Wenn slug + Tablet/Mobile: iframe, damit Media Queries im inneren Fenster greifen. Sonst: children direkt. */
export default function PreviewViewportWrapper({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug?: string;
}) {
  const [mode, setMode] = useState<ViewportMode>('desktop');

  const current = VIEWPORTS.find((v) => v.mode === mode) ?? VIEWPORTS[0];
  const useIframe = slug && (mode === 'tablet' || mode === 'mobile');
  const iframeWidth = current.width;

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="sticky top-0 z-50 flex items-center justify-center gap-2 border-b border-neutral-200 bg-white px-4 py-2 shadow-sm">
        <span className="mr-2 text-sm font-medium text-neutral-600">Ansicht:</span>
        <div className="flex rounded-lg border border-neutral-200 p-0.5 bg-neutral-100">
          {VIEWPORTS.map((v) => {
            const Icon = v.icon;
            const isActive = mode === v.mode;
            return (
              <button
                key={v.mode}
                type="button"
                onClick={() => setMode(v.mode)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {v.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center px-2 py-4">
        <div
          className="min-h-[80vh] w-full overflow-visible bg-white shadow-xl transition-all duration-200"
          style={{ maxWidth: current.width === 0 ? '100%' : `${current.width}px` }}
        >
          {useIframe ? (
            <iframe
              src={`/admin/preview-landing/${slug}?embed=1`}
              title="Vorschau"
              className="block border-0 w-full min-h-[80vh]"
              style={{ width: iframeWidth, height: '80vh', minHeight: 600 }}
            />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
