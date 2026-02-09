'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Monitor, Tablet, Smartphone, Save, ChevronDown, LayoutTemplate, GripVertical } from 'lucide-react';
import { usePageEditor, type ViewportMode } from './PageEditorContext';
import type { LandingSection } from '@/types/landing-section';
import { getMainpageTemplateJson } from '@/lib/mainpage-template';
import type { LandingTemplate } from '@/types/landing-section';

const VIEWPORTS: { mode: ViewportMode; label: string; icon: typeof Monitor; width: number }[] = [
  { mode: 'desktop', label: 'Desktop', icon: Monitor, width: 0 },
  { mode: 'tablet', label: 'Tablet', icon: Tablet, width: 768 },
  { mode: 'mobile', label: 'Responsive', icon: Smartphone, width: 430 },
];

/** Gleicher Look wie Preview-Toolbar: durchsichtig, Blur, heller Rand, graue Schrift */
const TOOLBAR_GLASS = 'rounded-xl border-2 border-white/90 bg-white/10 backdrop-blur-sm shadow-lg';
const TOOLBAR_BUTTON =
  'flex items-center gap-1.5 px-2.5 py-2 text-sm rounded-lg transition-colors text-neutral-700 hover:bg-white/25 hover:text-neutral-900';
const TOOLBAR_BUTTON_ACTIVE = 'bg-white/25 text-neutral-900 font-medium';

export type FloatingEditorToolbarProps = {
  backHref?: string;
  backLabel?: string;
  onSave?: (sections: LandingSection[]) => void | Promise<void>;
  saving?: boolean;
  showTemplateSwitch?: boolean;
};

export function FloatingEditorToolbar({
  backHref = '/admin',
  backLabel = 'Zurück',
  onSave,
  saving = false,
  showTemplateSwitch = true,
}: FloatingEditorToolbarProps) {
  const {
    template,
    setTemplateWithFullSections,
    viewportMode,
    setViewportMode,
    sections,
    applySections,
  } = usePageEditor();
  const [templateOpen, setTemplateOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  /** Verschiebbar: null = Standard-Position (mittig/rechts), gesetzt = User hat verschoben */
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; startLeft: number; startTop: number } | null>(null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!toolbarRef.current) return;
    e.preventDefault();
    const rect = toolbarRef.current.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: position?.x ?? rect.left,
      startTop: position?.y ?? rect.top,
    };
  }, [position]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      let x = dragRef.current.startLeft + dx;
      let y = dragRef.current.startTop + dy;
      const padding = 8;
      x = Math.max(padding, Math.min(window.innerWidth - (toolbarRef.current?.offsetWidth ?? 400) - padding, x));
      y = Math.max(padding, Math.min(window.innerHeight - (toolbarRef.current?.offsetHeight ?? 60) - padding, y));
      setPosition({ x, y });
    };
    const onUp = () => { dragRef.current = null; };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setTemplateOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyLanding = (t: LandingTemplate) => {
    setTemplateWithFullSections(t);
    setTemplateOpen(false);
  };

  const handleApplyMainpage = () => {
    const main = getMainpageTemplateJson();
    applySections(main.components);
    setTemplateOpen(false);
  };

  const isDesktop = viewportMode === 'desktop';
  const defaultPositionClass = isDesktop ? 'left-1/2 -translate-x-1/2' : 'right-4';

  return (
    <>
      {backHref && (
        <Link
          href={backHref}
          className={`fixed top-4 left-4 z-50 text-sm text-neutral-600 hover:text-neutral-900 shrink-0 rounded-xl px-3 py-2 ${TOOLBAR_GLASS} transition-colors`}
        >
          ← {backLabel}
        </Link>
      )}

      <div
        ref={toolbarRef}
        className={`fixed top-4 z-50 flex items-center gap-2 p-0.5 ${position == null ? defaultPositionClass : ''}`}
        style={position != null ? { left: position.x, top: position.y, transform: 'none' } : undefined}
      >
        <div className={`flex items-center gap-0.5 ${TOOLBAR_GLASS}`}>
          {/* Drag-Handle: verschiebbar */}
          <div
            onMouseDown={handleDragStart}
            className={`flex items-center justify-center w-8 shrink-0 rounded-l-lg cursor-move text-neutral-500 hover:text-neutral-700 hover:bg-white/20 select-none ${TOOLBAR_BUTTON} py-2`}
            title="Toolbar verschieben"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          <div className="flex items-center gap-0.5 pr-0.5 py-0.5">
            {VIEWPORTS.map((v) => {
              const Icon = v.icon;
              const isActive = viewportMode === v.mode;
              return (
                <button
                  key={v.mode}
                  type="button"
                  onClick={() => setViewportMode(v.mode)}
                  className={`${TOOLBAR_BUTTON} ${isActive ? TOOLBAR_BUTTON_ACTIVE : ''}`}
                  title={v.label}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {showTemplateSwitch && (
          <div className={`relative ${TOOLBAR_GLASS}`} ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setTemplateOpen((o) => !o)}
              className={`${TOOLBAR_BUTTON} rounded-xl`}
              title="Template wechseln"
            >
              <LayoutTemplate className="h-4 w-4" />
              <span className="hidden sm:inline">Template</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${templateOpen ? 'rotate-180' : ''}`} />
            </button>
            {templateOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 rounded-xl border-2 border-white/90 bg-white/95 backdrop-blur-sm shadow-xl py-1 z-50">
                <div className="px-3 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
                  Landingpages
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyLanding('standard')}
                  className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-white/50 flex items-center gap-2"
                >
                  <span className="flex-1">Basic</span>
                  {template === 'standard' && <span className="text-[#cb530a] text-xs font-medium">Aktiv</span>}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyLanding('parallax')}
                  className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-white/50 flex items-center gap-2"
                >
                  <span className="flex-1">Parallax</span>
                  {template === 'parallax' && <span className="text-[#cb530a] text-xs font-medium">Aktiv</span>}
                </button>
                <div className="px-3 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-t border-neutral-200 mt-1">
                  Main Page
                </div>
                <button
                  type="button"
                  onClick={handleApplyMainpage}
                  className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-white/50 flex items-center gap-2"
                >
                  <span className="flex-1">Startseite (Main)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {onSave && (
          <div className={TOOLBAR_GLASS}>
            <button
              type="button"
              onClick={() => onSave(sections)}
              disabled={saving}
              className={`${TOOLBAR_BUTTON} rounded-lg p-2 disabled:opacity-60`}
              title={saving ? 'Speichern…' : 'Speichern'}
            >
              <Save className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
