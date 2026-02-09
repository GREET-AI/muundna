'use client';

import React from 'react';
import { EditableBlock } from '../EditableBlock';
import type { EditorStyle } from '../PageEditorContext';

type EditorMarqueeSectionProps = {
  sectionIndex: number;
  props: Record<string, unknown>;
  getStyle: (sectionIndex: number, propKey: string) => EditorStyle;
  onSelect: (sectionIndex: number, propKey: string) => void;
  selectedElement: { sectionIndex: number; propKey: string } | null;
  textEditMode?: boolean;
  onPropChange?: (propKey: string, value: string) => void;
  backgroundColor?: string;
  textColor?: string;
};

export function EditorMarqueeSection({
  sectionIndex,
  props: p,
  getStyle,
  onSelect,
  selectedElement,
  textEditMode,
  onPropChange,
  backgroundColor = '#cb530a',
  textColor = '#ffffff',
}: EditorMarqueeSectionProps) {
  const text = (p.text as string) ?? 'Mit vermieteten Immobilien in die finanzielle Freiheit.';
  const customQuotes = (p.customQuotes as string[] | undefined);
  const displayText = Array.isArray(customQuotes) && customQuotes.length > 0 ? customQuotes[0] : text;

  const isSelected = (key: string) =>
    selectedElement?.sectionIndex === sectionIndex && selectedElement?.propKey === key;
  const isEditing = (key: string) => !!textEditMode && isSelected(key);

  const bg = (p.backgroundColor as string) || backgroundColor;
  const color = (p.textColor as string) || textColor;

  return (
    <section
      className="py-4 overflow-hidden"
      style={{ backgroundColor: bg, color }}
    >
      <div className="animate-marquee-right whitespace-nowrap flex gap-8">
        <EditableBlock
          sectionIndex={sectionIndex}
          propKey="text"
          value={displayText}
          style={getStyle(sectionIndex, 'text')}
          tag="span"
          className="text-lg font-medium inline-block"
          isSelected={isSelected('text')}
          isEditing={isEditing('text')}
          onBlur={onPropChange ? (v) => onPropChange('text', v) : undefined}
          onClick={() => onSelect(sectionIndex, 'text')}
          label="Lauftext"
        />
      </div>
      <p className="text-xs text-center mt-2 opacity-80">
        Weitere Zeilen und Farben: Sektion anklicken → Bearbeiten
      </p>
    </section>
  );
}
