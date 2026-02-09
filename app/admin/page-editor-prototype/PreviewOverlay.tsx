'use client';

import React, { useEffect } from 'react';
import { Monitor, Tablet, Smartphone, X } from 'lucide-react';
import { usePageEditor, type ViewportMode } from './PageEditorContext';

const STORAGE_KEY = 'pageEditorPreviewState';

const VIEWPORTS: { mode: ViewportMode; label: string; icon: typeof Monitor; width: number }[] = [
  { mode: 'desktop', label: 'Desktop', icon: Monitor, width: 0 },
  { mode: 'tablet', label: 'Tablet', icon: Tablet, width: 768 },
  { mode: 'mobile', label: 'Responsive', icon: Smartphone, width: 430 },
];

export function PreviewOverlay() {
  const { previewOpen, setPreviewOpen, sections, template, viewportMode, setViewportMode } = usePageEditor();
  const viewportWidth = VIEWPORTS.find((v) => v.mode === viewportMode)?.width ?? 0;
  const iframeViewport = viewportWidth === 0 ? 'desktop' : String(viewportWidth);

  // Für Tablet/Mobile: Daten für iframe in sessionStorage schreiben (echter Viewport = echte Media Queries)
  useEffect(() => {
    if (!previewOpen || typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ sections, template }));
    } catch {
      // ignore
    }
  }, [previewOpen, sections, template]);

  if (!previewOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      {/* Toolbar: Desktop mittig oben, Tablet/Mobile rechts oben (weniger verdeckt) */}
      <div
        className={`absolute top-0 z-50 flex items-center gap-2 p-3 ${
          viewportMode === 'desktop' ? 'left-1/2 -translate-x-1/2' : 'right-0'
        }`}
      >
        <div className="flex rounded-xl border-2 border-white/90 bg-white/10 backdrop-blur-sm shadow-lg p-0.5">
          {VIEWPORTS.map((v) => {
            const Icon = v.icon;
            const isActive = viewportMode === v.mode;
            return (
              <button
                key={v.mode}
                type="button"
                onClick={() => setViewportMode(v.mode)}
                className={`flex items-center gap-1.5 px-2.5 py-2 text-sm rounded-lg transition-colors ${isActive ? 'bg-white/25 text-neutral-900 font-medium' : 'text-neutral-700 hover:bg-white/25 hover:text-neutral-900'}`}
                title={v.label}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setPreviewOpen(false)}
          className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-white/90 bg-white/10 backdrop-blur-sm text-neutral-700 hover:bg-white/25 hover:text-neutral-900 transition-colors"
          title="Schließen und zurück zum Editor"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Immer iframe: eigener Document-Scroll = Parallax (useScroll) funktioniert; echte Viewport-Breite = Media Queries (2x2, Headline-Größe) wie Original */}
      <div className="flex-1 overflow-hidden flex justify-center min-h-0">
        <iframe
          key={`preview-${viewportMode}-${iframeViewport}`}
          src={`/admin/page-editor-prototype/preview?viewport=${iframeViewport}`}
          title="Vorschau"
          className="border-0 bg-white flex-1 w-full"
          style={{
            maxWidth: viewportWidth === 0 ? 'none' : viewportWidth,
            minHeight: '100%',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
}
