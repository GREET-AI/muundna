'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Pencil, Copy, Trash2 } from 'lucide-react';
import { usePageEditor } from './PageEditorContext';

const FONT_SIZES = [14, 16, 18, 20, 24, 28, 32, 40, 48];

export function TextElementToolbar() {
  const { sections, selectedElement, setSelectedElement, setTextEditMode, setProp, setStyle, getStyle } = usePageEditor();
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

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
  const sec = sections[selectedElement.sectionIndex];
  if (!sec) return null;
  const value = (sec.props[selectedElement.propKey] as string) ?? '';
  const style = getStyle(selectedElement.sectionIndex, selectedElement.propKey);

  const isButton = selectedElement.propKey === 'buttonText' || selectedElement.propKey === 'ctaText';
  if (isButton) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[100] flex items-center gap-1 px-2 py-1.5 bg-white rounded-lg shadow-lg border border-neutral-200"
      style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, 0)' }}
    >
      <button
        type="button"
        onClick={() => setTextEditMode(true)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-neutral-100 text-sm font-medium"
        title="Text bearbeiten"
      >
        <Pencil className="w-4 h-4" />
        Text bearbeiten
      </button>
      <span className="w-px h-5 bg-neutral-200" />
      <button type="button" className="p-1.5 rounded hover:bg-neutral-100" title="Duplizieren (noch nicht implementiert)">
        <Copy className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => { setSelectedElement(null); setTextEditMode(false); }}
        className="p-1.5 rounded hover:bg-red-50 text-red-600"
        title="Schließen"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function FormattingToolbar() {
  const { selectedElement, setProp, setStyle, getStyle, setTextEditMode } = usePageEditor();
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!selectedElement) return;
    const el = document.querySelector(
      `[data-editor-block][data-section-index="${selectedElement.sectionIndex}"][data-prop-key="${selectedElement.propKey}"]`
    );
    if (el) {
      const rect = el.getBoundingClientRect();
      setPos({ top: rect.top - 52, left: rect.left + rect.width / 2 });
    }
  }, [selectedElement]);

  if (!selectedElement) return null;
  const style = getStyle(selectedElement.sectionIndex, selectedElement.propKey);

  return (
    <div
      className="fixed z-[101] flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-neutral-200"
      style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, 0)' }}
    >
      <label className="flex items-center gap-1 text-xs">
        <span className="text-neutral-500">Größe</span>
        <select
          value={style.fontSize ?? ''}
          onChange={(e) => setStyle(selectedElement.sectionIndex, selectedElement.propKey, { fontSize: e.target.value ? Number(e.target.value) : undefined })}
          className="border rounded px-2 py-1 text-xs w-16"
        >
          <option value="">—</option>
          {FONT_SIZES.map((n) => (
            <option key={n} value={n}>{n}px</option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-1 text-xs">
        <span className="text-neutral-500">Farbe</span>
        <input
          type="color"
          value={style.color ?? '#000000'}
          onChange={(e) => setStyle(selectedElement.sectionIndex, selectedElement.propKey, { color: e.target.value })}
          className="w-7 h-7 rounded border cursor-pointer"
        />
      </label>
      <button
        type="button"
        onClick={() => setTextEditMode(false)}
        className="ml-2 text-xs text-neutral-500 hover:text-neutral-700"
      >
        Fertig
      </button>
    </div>
  );
}
