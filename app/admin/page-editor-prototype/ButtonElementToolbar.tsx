'use client';

import React, { useEffect, useState } from 'react';
import { Copy, Trash2, Palette } from 'lucide-react';
import { usePageEditor } from './PageEditorContext';

export function ButtonElementToolbar() {
  const { sections, selectedElement, setSelectedElement, setProp, setStyle, getStyle } = usePageEditor();
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [styleOpen, setStyleOpen] = useState(false);

  useEffect(() => {
    if (!selectedElement) return;
    const el = document.querySelector(
      `[data-editor-block][data-section-index="${selectedElement.sectionIndex}"][data-prop-key="${selectedElement.propKey}"]`
    );
    if (el) {
      const rect = el.getBoundingClientRect();
      setPos({ top: rect.top - 48, left: rect.left + rect.width / 2 });
    }
  }, [selectedElement]);

  if (!selectedElement) return null;
  const isButton = selectedElement.propKey === 'buttonText' || selectedElement.propKey === 'ctaText' || selectedElement.propKey === 'secondaryCtaText';
  if (!isButton) return null;

  const sec = sections[selectedElement.sectionIndex];
  if (!sec) return null;
  const value = (sec.props[selectedElement.propKey] as string) ?? '';
  const style = getStyle(selectedElement.sectionIndex, selectedElement.propKey);

  return (
    <div
      className="fixed z-[100] flex flex-col gap-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-neutral-200"
      style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, 0)' }}
    >
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-neutral-600 shrink-0">Button-Text</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setProp(selectedElement.sectionIndex, selectedElement.propKey, e.target.value)}
          className="border rounded px-2 py-1.5 text-sm min-w-[140px]"
          placeholder="Button-Text"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setStyleOpen((o) => !o)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-neutral-100 text-sm"
        >
          <Palette className="w-4 h-4" />
          Stil
        </button>
        <button type="button" className="p-1.5 rounded hover:bg-neutral-100" title="Duplizieren">
          <Copy className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setSelectedElement(null)}
          className="p-1.5 rounded hover:bg-red-50 text-red-600"
          title="Schließen"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {styleOpen && (
        <div className="flex flex-wrap gap-3 pt-2 border-t border-neutral-100">
          <label className="flex items-center gap-2 text-xs">
            <span>Textfarbe</span>
            <input
              type="color"
              value={style.color ?? '#000000'}
              onChange={(e) => setStyle(selectedElement.sectionIndex, selectedElement.propKey, { color: e.target.value })}
              className="w-8 h-8 rounded border cursor-pointer"
            />
          </label>
          <label className="flex items-center gap-2 text-xs">
            <span>Hintergrund</span>
            <input
              type="color"
              value={style.backgroundColor ?? '#ffffff'}
              onChange={(e) => setStyle(selectedElement.sectionIndex, selectedElement.propKey, { backgroundColor: e.target.value })}
              className="w-8 h-8 rounded border cursor-pointer"
            />
          </label>
        </div>
      )}
    </div>
  );
}
