'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { usePageEditor } from './PageEditorContext';
import {
  SECTION_TYPES_BY_TEMPLATE,
  SECTION_PREVIEW_IMAGES,
  SECTION_PREVIEW_IMAGES_PARALLAX,
  getSectionLabel,
  type LandingSectionType,
} from '@/types/landing-section';

const PLACEHOLDER_PREVIEW = '/landing-previews/section-process.png';

function getPreviewSrc(type: LandingSectionType, template: 'standard' | 'parallax'): string {
  const map = template === 'parallax' ? SECTION_PREVIEW_IMAGES_PARALLAX : SECTION_PREVIEW_IMAGES;
  return map[type] ?? PLACEHOLDER_PREVIEW;
}

export function EditorSidebar() {
  const { template, sections, addSection, selectedSectionIndex, setSelectedSectionIndex } = usePageEditor();
  const [addOpen, setAddOpen] = useState(false);
  const sectionTypes = SECTION_TYPES_BY_TEMPLATE[template] as readonly LandingSectionType[];

  return (
    <aside className="w-40 shrink-0 border-r border-neutral-200 bg-white flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {sections.map((sec, index) => {
          const src = getPreviewSrc(sec.type as LandingSectionType, template);
          const isSelected = selectedSectionIndex === index;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setSelectedSectionIndex(index)}
              className={`w-full rounded-lg border-2 overflow-hidden transition-colors text-left block ${isSelected ? 'border-[#cb530a] ring-1 ring-[#cb530a]' : 'border-transparent hover:border-neutral-300'}`}
            >
              <div className="relative aspect-[4/3] w-full bg-neutral-100">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
              <p className="px-1.5 py-1 text-[10px] font-medium text-neutral-600 truncate">
                {getSectionLabel(sec.type as LandingSectionType, template)}
              </p>
            </button>
          );
        })}

        {/* Sektion hinzufügen durch Klick auf +-Fenster */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAddOpen((o) => !o)}
            className="w-full rounded-lg border-2 border-dashed border-neutral-300 hover:border-[#cb530a] hover:bg-[#cb530a]/5 transition-colors flex flex-col items-center justify-center aspect-[4/3] text-neutral-400 hover:text-[#cb530a]"
          >
            <Plus className="w-8 h-8 mb-1" />
            <span className="text-[10px] font-medium">Sektion</span>
          </button>
          {addOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border border-neutral-200 bg-white shadow-xl py-2 max-h-64 overflow-y-auto">
              {sectionTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    addSection(type);
                    setAddOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  {getSectionLabel(type, template)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
