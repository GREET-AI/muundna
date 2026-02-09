'use client';

import React from 'react';
import { EditableBlock } from '../EditableBlock';
import type { EditorStyle } from '../PageEditorContext';

const PRIMARY = '#cb530a';
const SECONDARY = '#a84308';

type EditorQuizCtaSectionProps = {
  sectionIndex: number;
  props: Record<string, unknown>;
  getStyle: (sectionIndex: number, propKey: string) => EditorStyle;
  onSelect: (sectionIndex: number, propKey: string) => void;
  selectedElement: { sectionIndex: number; propKey: string } | null;
  textEditMode?: boolean;
  onPropChange?: (propKey: string, value: string) => void;
};

export function EditorQuizCtaSection({
  sectionIndex,
  props: p,
  getStyle,
  onSelect,
  selectedElement,
  textEditMode,
  onPropChange,
}: EditorQuizCtaSectionProps) {
  const title = (p.title as string) ?? 'Expertise erhalten';
  const subtitle = (p.subtitle as string) ?? 'Beantworten Sie 4 kurze Fragen und erhalten Sie ein maßgeschneidertes Angebot';
  const buttonText = (p.buttonText as string) ?? 'Jetzt starten →';

  const isSelected = (key: string) =>
    selectedElement?.sectionIndex === sectionIndex && selectedElement?.propKey === key;
  const isEditing = (key: string) => !!textEditMode && isSelected(key);

  return (
    <section style={{ background: `linear-gradient(to right, ${PRIMARY}, ${SECONDARY})` }}>
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 md:p-8 border border-white/20 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  <EditableBlock
                    sectionIndex={sectionIndex}
                    propKey="title"
                    value={title}
                    style={getStyle(sectionIndex, 'title')}
                    tag="span"
                    isSelected={isSelected('title')}
                    isEditing={isEditing('title')}
                    onBlur={onPropChange ? (v) => onPropChange('title', v) : undefined}
                    onClick={() => onSelect(sectionIndex, 'title')}
                    label="Titel"
                  />
                </h3>
                <p className="text-white/90 text-sm md:text-base">
                  <EditableBlock
                    sectionIndex={sectionIndex}
                    propKey="subtitle"
                    value={subtitle}
                    style={getStyle(sectionIndex, 'subtitle')}
                    tag="span"
                    isSelected={isSelected('subtitle')}
                    isEditing={isEditing('subtitle')}
                    onBlur={onPropChange ? (v) => onPropChange('subtitle', v) : undefined}
                    onClick={() => onSelect(sectionIndex, 'subtitle')}
                    label="Untertitel"
                  />
                </p>
              </div>
              <EditableBlock
                sectionIndex={sectionIndex}
                propKey="buttonText"
                value={buttonText}
                style={{
                  ...getStyle(sectionIndex, 'buttonText'),
                  color: getStyle(sectionIndex, 'buttonText').color ?? PRIMARY,
                  backgroundColor: getStyle(sectionIndex, 'buttonText').backgroundColor ?? '#ffffff',
                }}
                tag="span"
                className="inline-flex px-6 py-3 font-semibold rounded-lg hover:opacity-90"
                isSelected={isSelected('buttonText')}
                onClick={() => onSelect(sectionIndex, 'buttonText')}
                label="Button-Text"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
