'use client';

import React from 'react';
import { usePageEditor } from './PageEditorContext';
import { EditorCanvas } from './EditorCanvas';
import { EditorPropsPanel } from './EditorPropsPanel';
import { FloatingEditorToolbar } from './FloatingEditorToolbar';
import type { FloatingEditorToolbarProps } from './FloatingEditorToolbar';

const VIEWPORTS = [
  { mode: 'desktop' as const, width: 0 },
  { mode: 'tablet' as const, width: 768 },
  { mode: 'mobile' as const, width: 430 },
];

export type EditorLayoutProps = FloatingEditorToolbarProps;

/**
 * Layout: Floating Toolbar (rechts oben) + Canvas + optional Props-Panel.
 * Keine Top-Navbar mehr – Toolbar wie in der Preview (abgerundet, Schatten).
 */
export function EditorLayout(props: EditorLayoutProps) {
  const { showSectionPropsPanel, viewportMode } = usePageEditor();
  const viewportWidth = VIEWPORTS.find((v) => v.mode === viewportMode)?.width ?? 0;

  return (
    <div className="flex flex-col min-h-screen">
      <FloatingEditorToolbar {...props} />
      <div className="flex flex-1 min-h-0">
        <main className="flex-1 min-w-0 overflow-visible bg-neutral-100 relative flex justify-center min-h-0">
          <div
            className="w-full transition-[max-width] duration-200 @container editor-viewport"
            style={{ maxWidth: viewportWidth === 0 ? 'none' : `${viewportWidth}px`, width: viewportWidth > 0 ? viewportWidth : undefined }}
          >
            <EditorCanvas />
          </div>
        </main>
        {showSectionPropsPanel && <EditorPropsPanel />}
      </div>
    </div>
  );
}
