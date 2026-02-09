'use client';

import React from 'react';
import Link from 'next/link';
import { Monitor, Tablet, Smartphone, Eye, Save } from 'lucide-react';
import { usePageEditor, type ViewportMode } from './PageEditorContext';
import type { LandingSection } from '@/types/landing-section';

const VIEWPORTS: { mode: ViewportMode; label: string; icon: typeof Monitor; width: number }[] = [
  { mode: 'desktop', label: 'Desktop', icon: Monitor, width: 0 },
  { mode: 'tablet', label: 'Tablet', icon: Tablet, width: 768 },
  { mode: 'mobile', label: 'Responsive', icon: Smartphone, width: 430 },
];

type EditorNavbarProps = {
  /** Link „← Admin“ oder „← Zurück“ */
  backHref?: string;
  backLabel?: string;
  /** Titel neben dem Back-Link */
  title?: string;
  /** Speichern-Button: wird mit aktuellen sections aus dem Editor aufgerufen. */
  onSave?: (sections: LandingSection[]) => void | Promise<void>;
  saving?: boolean;
  /** „Prototyp“-Badge anzeigen (Standard: true beim Prototype, false bei Homepage) */
  showPrototypeBadge?: boolean;
  /** Template-Umschalter (Basic/Parallax) anzeigen (Standard: true) */
  showTemplateSwitch?: boolean;
};

export function EditorNavbar({
  backHref = '/admin',
  backLabel = 'Admin',
  title = 'Page-Editor',
  onSave,
  saving = false,
  showPrototypeBadge = false,
  showTemplateSwitch = true,
}: EditorNavbarProps) {
  const { template, setTemplateWithFullSections, viewportMode, setViewportMode, setPreviewOpen, sections } = usePageEditor();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white px-4 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        {backHref ? (
          <Link href={backHref} className="text-sm text-neutral-500 hover:text-neutral-700 shrink-0">
            ← {backLabel}
          </Link>
        ) : null}
        <span className="font-semibold text-neutral-800 shrink-0">{title}</span>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 shrink-0"
          title="Vollbild-Vorschau (Desktop/Tablet/Mobile)"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>
        {showTemplateSwitch && (
          <div className="flex rounded-lg border border-neutral-200 p-0.5 bg-neutral-50">
            {(['standard', 'parallax'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTemplateWithFullSections(t)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${template === t ? 'bg-white text-neutral-900 font-medium shadow-sm' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                {t === 'standard' ? 'Basic' : 'Parallax'}
              </button>
            ))}
          </div>
        )}
        <div className="flex rounded-lg border border-neutral-200 p-0.5 bg-neutral-50">
          {VIEWPORTS.map((v) => {
            const Icon = v.icon;
            const isActive = viewportMode === v.mode;
            return (
              <button
                key={v.mode}
                type="button"
                onClick={() => setViewportMode(v.mode)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-md transition-colors ${isActive ? 'bg-white text-neutral-900 font-medium shadow-sm' : 'text-neutral-600 hover:text-neutral-900'}`}
                title={v.label}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            );
          })}
        </div>
        {onSave && (
          <button
            type="button"
            onClick={() => onSave(sections)}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#cb530a] hover:bg-[#a84308] text-white shrink-0 disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Speichern…' : 'Speichern'}
          </button>
        )}
        {showPrototypeBadge && (
          <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
            Prototyp
          </span>
        )}
      </div>
    </header>
  );
}
