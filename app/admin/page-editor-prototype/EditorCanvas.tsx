'use client';

import React from 'react';
import { usePageEditor } from './PageEditorContext';
import { OriginalSectionRenderer } from './OriginalSectionRenderer';
import { SectionToolbar } from './SectionToolbar';

const DEFAULT_PRIMARY = '#cb530a';
const PARALLAX_PRIMARY = '#C4D32A';
const PARALLAX_SECONDARY = '#60A917';

/**
 * Canvas rendert ausschließlich OriginalSectionRenderer (1:1 wie Live-Seite).
 * Keine eigenen Editor-Sektionen, keine Regeln die Padding/Schrift/Typo beeinflussen.
 * Auswahl nur für Sektions-Toolbar (Rechtsklick) und rechtes Panel (Bearbeiten).
 */
export function EditorCanvas() {
  const {
    sections,
    template,
    selectedSectionIndex,
    setSelectedSectionIndex,
    sectionToolbarIndex,
    setSectionToolbarIndex,
  } = usePageEditor();
  const isParallax = template === 'parallax';
  const primary = isParallax ? PARALLAX_PRIMARY : DEFAULT_PRIMARY;
  const secondary = isParallax ? PARALLAX_SECONDARY : '#f0e6e0';
  const productSlug = 'coaching';
  const productTitle = 'Dein Coaching';

  const handleSectionClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedSectionIndex(index);
    setSectionToolbarIndex(null);
  };

  const handleSectionContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSectionToolbarIndex(index);
    setSelectedSectionIndex(index);
  };

  return (
    <div
      className="min-h-screen bg-white"
      onClick={() => setSectionToolbarIndex(null)}
      onContextMenu={() => setSectionToolbarIndex(null)}
    >
      {sections.map((sec, index) => {
        const isSelected = selectedSectionIndex === index;
        const showSectionToolbar = sectionToolbarIndex === index;

        return (
          <div
            key={sec.id}
            role="button"
            tabIndex={0}
            onClick={(e) => handleSectionClick(e, index)}
            onContextMenu={(e) => handleSectionContextMenu(e, index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedSectionIndex(index);
              }
            }}
            className={`relative cursor-pointer outline-none transition-[box-shadow] ${isSelected ? 'ring-2 ring-[#cb530a] ring-inset' : 'hover:ring-2 hover:ring-[#cb530a]/40 hover:ring-inset'}`}
          >
            {showSectionToolbar && <SectionToolbar sectionIndex={index} />}

            <OriginalSectionRenderer
              section={sec}
              index={index}
              isParallax={isParallax}
              primary={primary}
              secondary={secondary}
              productSlug={productSlug}
              productTitle={productTitle}
            />
          </div>
        );
      })}
    </div>
  );
}
