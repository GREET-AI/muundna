'use client';

import React from 'react';
import { ChevronUp, ChevronDown, Trash2, Pencil } from 'lucide-react';
import { usePageEditor } from './PageEditorContext';

type SectionToolbarProps = {
  sectionIndex: number;
  };

export function SectionToolbar({ sectionIndex }: SectionToolbarProps) {
  const { sections, moveSectionUp, moveSectionDown, removeSection, setSelectedSectionIndex, setShowSectionPropsPanel, setSectionToolbarIndex } = usePageEditor();
  const canMoveUp = sectionIndex > 0;
  const canMoveDown = sectionIndex < sections.length - 1;

  return (
    <div className="absolute top-2 right-2 z-50 flex items-center gap-0.5 px-2 py-1.5 rounded-lg bg-neutral-900/95 text-white shadow-lg border border-neutral-700">
      <button
        type="button"
        onClick={() => {
          setShowSectionPropsPanel(true);
          setSectionToolbarIndex(null);
        }}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-neutral-700 text-sm font-medium"
        title="Sektion bearbeiten (Hintergrund, Slider-Bilder, …)"
      >
        <Pencil className="w-4 h-4" />
        Bearbeiten
      </button>
      <span className="w-px h-5 bg-neutral-600" />
      <button
        type="button"
        onClick={() => moveSectionUp(sectionIndex)}
        disabled={!canMoveUp}
        className="p-1.5 rounded-md hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        title="Sektion nach oben"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => moveSectionDown(sectionIndex)}
        disabled={!canMoveDown}
        className="p-1.5 rounded-md hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        title="Sektion nach unten"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          removeSection(sectionIndex);
          setSelectedSectionIndex(null);
          setSectionToolbarIndex(null);
        }}
        className="p-1.5 rounded-md hover:bg-red-600/80 text-red-300 hover:text-white"
        title="Sektion löschen"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
