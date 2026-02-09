'use client';

import React from 'react';
import { EditableBlock } from '../EditableBlock';
import type { EditorStyle } from '../PageEditorContext';

type EditorProcessSectionProps = {
  sectionIndex: number;
  props: Record<string, unknown>;
  getStyle: (sectionIndex: number, propKey: string) => EditorStyle;
  onSelect: (sectionIndex: number, propKey: string) => void;
  selectedElement: { sectionIndex: number; propKey: string } | null;
  textEditMode?: boolean;
  onPropChange?: (propKey: string, value: string) => void;
};

export function EditorProcessSection({
  sectionIndex,
  props: p,
  getStyle,
  onSelect,
  selectedElement,
  textEditMode,
  onPropChange,
}: EditorProcessSectionProps) {
  const sectionTitle = (p.sectionTitle as string) ?? 'So funktioniert das Coaching';
  const sectionSubtitle = (p.sectionSubtitle as string) ?? 'In vier Schritten zu deinem Einstieg in Immobilien als Kapitalanlage';

  const isSelected = (key: string) =>
    selectedElement?.sectionIndex === sectionIndex && selectedElement?.propKey === key;
  const isEditing = (key: string) => !!textEditMode && isSelected(key);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            <EditableBlock
              sectionIndex={sectionIndex}
              propKey="sectionTitle"
              value={sectionTitle}
              style={getStyle(sectionIndex, 'sectionTitle')}
              tag="span"
              isSelected={isSelected('sectionTitle')}
              isEditing={isEditing('sectionTitle')}
              onBlur={onPropChange ? (v) => onPropChange('sectionTitle', v) : undefined}
              onClick={() => onSelect(sectionIndex, 'sectionTitle')}
              label="Sektions-Titel"
            />
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            <EditableBlock
              sectionIndex={sectionIndex}
              propKey="sectionSubtitle"
              value={sectionSubtitle}
              style={getStyle(sectionIndex, 'sectionSubtitle')}
              tag="span"
              isSelected={isSelected('sectionSubtitle')}
              isEditing={isEditing('sectionSubtitle')}
              onBlur={onPropChange ? (v) => onPropChange('sectionSubtitle', v) : undefined}
              onClick={() => onSelect(sectionIndex, 'sectionSubtitle')}
              label="Untertitel"
            />
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {['1', '2', '3', '4'].map((num, i) => (
            <div key={num} className="bg-white p-6 rounded-lg shadow border border-gray-200 text-center">
              <div className="w-10 h-10 rounded-full bg-[#cb530a] text-white flex items-center justify-center font-bold mx-auto mb-4">
                {num}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Schritt {num}</h3>
              <p className="text-gray-600 text-sm">Beschreibung Schritt {num}.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
