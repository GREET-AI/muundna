'use client';

import React, { useEffect, useState } from 'react';
import { usePageEditor } from './PageEditorContext';

const FONT_SIZES = [14, 16, 18, 20, 24, 28, 32, 40, 48, 56];

export function EditorToolbar() {
  const { sections, selectedElement, setSelectedElement, setStyle, setProp, getStyle } = usePageEditor();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!selectedElement) return;
    const el = document.querySelector(
      `[data-editor-block][data-section-index="${selectedElement.sectionIndex}"][data-prop-key="${selectedElement.propKey}"]`
    );
    if (el) {
      const rect = el.getBoundingClientRect();
      setPosition({
        top: rect.top - 52,
        left: rect.left + rect.width / 2,
      });
    }
  }, [selectedElement]);

  if (!selectedElement) return null;

  const style = getStyle(selectedElement.sectionIndex, selectedElement.propKey);
  const currentValue = (sections[selectedElement.sectionIndex]?.props?.[selectedElement.propKey] as string) ?? '';

  return (
    <div
      className="fixed z-[100] flex flex-wrap items-center gap-2 px-3 py-2 bg-neutral-900 text-white rounded-lg shadow-xl border border-neutral-700 max-w-[90vw]"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, 0)',
      }}
    >
      <label className="flex items-center gap-1.5 text-xs">
        <span className="text-neutral-400">Inhalt</span>
        <input
          type="text"
          value={currentValue}
          onChange={(e) => setProp(selectedElement.sectionIndex, selectedElement.propKey, e.target.value)}
          className="min-w-[120px] max-w-[200px] bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-white text-xs"
          placeholder="Text…"
        />
      </label>
      <label className="flex items-center gap-1.5 text-xs">
        <span className="text-neutral-400">Schrift</span>
        <select
          value={style.fontSize ?? ''}
          onChange={(e) =>
            setStyle(selectedElement.sectionIndex, selectedElement.propKey, {
              fontSize: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-white text-xs min-w-[4rem]"
        >
          <option value="">Standard</option>
          {FONT_SIZES.map((n) => (
            <option key={n} value={n}>
              {n}px
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-1.5 text-xs">
        <span className="text-neutral-400">Farbe</span>
        <input
          type="color"
          value={style.color ?? '#000000'}
          onChange={(e) =>
            setStyle(selectedElement.sectionIndex, selectedElement.propKey, { color: e.target.value })
          }
          className="w-8 h-6 rounded border border-neutral-600 cursor-pointer"
        />
        <input
          type="text"
          value={style.color ?? '#000000'}
          onChange={(e) =>
            setStyle(selectedElement.sectionIndex, selectedElement.propKey, { color: e.target.value || undefined })
          }
          className="w-20 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-white text-xs font-mono"
        />
      </label>
      <button
        type="button"
        onClick={() => setSelectedElement(null)}
        className="ml-2 p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-white"
        title="Schließen"
      >
        ✕
      </button>
    </div>
  );
}
