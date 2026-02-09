'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { cn } from '@/app/lib/utils';

/**
 * WYSIWYG-Richtext-Editor (wie Word): Text markieren, dann Fett/Kursiv/Farbe/Größe anwenden.
 * Gespeichert wird HTML – Frontend rendert dasselbe.
 */
export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder = 'Text eingeben…',
  className,
  minHeight = '120px',
}: {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSizePt, setFontSizePt] = useState(16);
  const [color, setColor] = useState('#cb530a');

  // Nur syncen wenn Wert von außen kommt (z. B. Reset, Sektion wechsel) – nicht nach eigenem onChange
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = value ?? '';
    if (el.innerHTML !== html) {
      el.innerHTML = html;
    }
  }, [value]);

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    onChange(el.innerHTML);
  }, [onChange]);

  // Selection behalten beim Klick auf Toolbar (nicht Fokus verlieren)
  const keepSelection = useCallback((fn: () => void) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    fn();
    emitChange();
  }, [emitChange]);

  const applyBold = useCallback(() => {
    keepSelection(() => document.execCommand('bold', false));
  }, [keepSelection]);

  const applyItalic = useCallback(() => {
    keepSelection(() => document.execCommand('italic', false));
  }, [keepSelection]);

  const applyColor = useCallback(() => {
    keepSelection(() => document.execCommand('foreColor', false, color));
  }, [keepSelection, color]);

  const applyFontSize = useCallback(() => {
    keepSelection(() => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (range.collapsed) return;
      try {
        const span = document.createElement('span');
        span.style.fontSize = `${fontSizePt}pt`;
        range.surroundContents(span);
      } catch {
        // Fallback: insertHTML
        const text = range.toString();
        const html = `<span style="font-size:${fontSizePt}pt">${text}</span>`;
        range.deleteContents();
        document.execCommand('insertHTML', false, html);
      }
    });
  }, [keepSelection, fontSizePt]);

  const onInput = useCallback(() => {
    emitChange();
  }, [emitChange]);

  const onMouseDownToolbar = (e: React.MouseEvent) => {
    e.preventDefault(); // Fokus bleibt im Editor, Auswahl bleibt erhalten
  };

  return (
    <div className={cn('space-y-1', className)}>
      {label && <Label className="text-[10px] font-semibold">{label}</Label>}
      <div className="flex flex-wrap items-center gap-1.5 mb-1">
        <Button type="button" variant="outline" size="sm" className="h-7 text-[10px] font-bold" onMouseDown={onMouseDownToolbar} onClick={applyBold} title="Fett">
          Fett
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-7 text-[10px] italic" onMouseDown={onMouseDownToolbar} onClick={applyItalic} title="Kursiv">
          Kursiv
        </Button>
        <span className="flex items-center gap-1 text-[10px] font-semibold">Farbe:</span>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-6 w-8 rounded border cursor-pointer" onMouseDown={onMouseDownToolbar} aria-label="Farbe" />
        <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onMouseDown={onMouseDownToolbar} onClick={applyColor}>
          Anwenden
        </Button>
        <span className="flex items-center gap-1 text-[10px] font-semibold">Größe (pt):</span>
        <input type="number" min={10} max={24} value={fontSizePt} onChange={(e) => setFontSizePt(Number(e.target.value) || 16)} className="h-7 w-12 rounded border border-input px-1 text-[10px]" onMouseDown={onMouseDownToolbar} />
        <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onMouseDown={onMouseDownToolbar} onClick={applyFontSize}>
          Anwenden
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        data-placeholder={placeholder}
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-gray-800 leading-relaxed outline-none focus:ring-2 focus:ring-[#cb530a]/30 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
        style={{ minHeight }}
      />
    </div>
  );
}
