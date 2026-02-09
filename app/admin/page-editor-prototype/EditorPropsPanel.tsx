'use client';

import React from 'react';
import { usePageEditor } from './PageEditorContext';
import { getEditablePropsForSection, getSectionLabel, getDefaultPropsForSection } from '@/types/landing-section';
import type { LandingSectionType } from '@/types/landing-section';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { RichTextEditor } from '@/app/components/ui/RichTextEditor';
import type { EditablePropDef } from '@/types/landing-section';

const COMPLEX_TYPES = ['testimonials', 'target_groups', 'services', 'benefits', 'pricing_cards', 'process_steps', 'faq_items', 'beratung_process_steps', 'beratung_stats', 'image_array'];

export function EditorPropsPanel() {
  const { sections, template, selectedSectionIndex, setProp, setSelectedSectionIndex, setShowSectionPropsPanel } = usePageEditor();

  if (selectedSectionIndex == null || !sections[selectedSectionIndex]) {
    return (
      <aside className="w-72 shrink-0 border-l border-neutral-200 bg-white flex flex-col items-center justify-center text-neutral-400 text-sm p-6">
        Sektion im Canvas anklicken, um Eigenschaften hier zu bearbeiten.
      </aside>
    );
  }

  const sec = sections[selectedSectionIndex];
  const type = sec.type as LandingSectionType;
  const editableProps = getEditablePropsForSection(type, template);
  const sectionDefaults = getDefaultPropsForSection(type, template);

  return (
    <aside className="w-80 shrink-0 border-l border-neutral-200 bg-white flex flex-col overflow-hidden">
      <div className="p-3 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-800 truncate">
          {getSectionLabel(type, template)}
        </h3>
        <button
          type="button"
          onClick={() => { setSelectedSectionIndex(null); setShowSectionPropsPanel(false); }}
          className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700"
          title="Schließen"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {editableProps.map((field: EditablePropDef) => {
          const rawValue = sec.props[field.key];
          const fallback = sectionDefaults[field.key];
          const value =
            field.key === 'customQuotes' && Array.isArray(rawValue)
              ? (rawValue as string[]).join('\n')
              : field.key === 'highlightWords' && Array.isArray(rawValue)
                ? (rawValue as string[]).join(', ')
                : (rawValue !== undefined && rawValue !== null ? String(rawValue) : (fallback as string) ?? '');

          if (COMPLEX_TYPES.includes(field.type)) {
            return (
              <div key={field.key} className="text-xs text-neutral-500 p-2 rounded bg-amber-50 border border-amber-100">
                <span className="font-medium text-amber-800">{field.label}</span>
                <p className="mt-1">Listen/Cards: Inhalt im alten Builder oder per Daten-Import bearbeiten.</p>
              </div>
            );
          }

          if (field.type === 'richtext') {
            return (
              <div key={field.key}>
                <Label className="text-[10px] font-semibold">{field.label}</Label>
                <RichTextEditor
                  value={value}
                  onChange={(html) => setProp(selectedSectionIndex, field.key, html)}
                  label={field.label}
                  placeholder="Text eingeben…"
                  minHeight="120px"
                />
              </div>
            );
          }
          if (field.key === 'customQuotes') {
            return (
              <div key={field.key}>
                <Label className="text-[10px] font-semibold">{field.label}</Label>
                <Textarea
                  value={value}
                  onChange={(e) => setProp(selectedSectionIndex, field.key, e.target.value.split('\n').filter(Boolean))}
                  rows={6}
                  className="mt-0.5 text-xs font-mono"
                  placeholder="Ein Text pro Zeile"
                />
              </div>
            );
          }
          if (field.key === 'highlightWords') {
            return (
              <div key={field.key}>
                <Label className="text-[10px] font-semibold">{field.label}</Label>
                <Input
                  value={value}
                  onChange={(e) => setProp(selectedSectionIndex, field.key, e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  className="mt-0.5 h-8 text-xs"
                  placeholder="Wort1, Wort2, Wort3"
                />
              </div>
            );
          }
          if (field.type === 'textarea') {
            return (
              <div key={field.key}>
                <Label className="text-[10px] font-semibold">{field.label}</Label>
                <Textarea
                  value={value}
                  onChange={(e) => setProp(selectedSectionIndex, field.key, e.target.value)}
                  rows={3}
                  className="mt-0.5 text-xs"
                />
              </div>
            );
          }
          if (field.type === 'color') {
            return (
              <div key={field.key} className="flex items-center gap-2">
                <Label className="text-[10px] font-semibold w-28 shrink-0">{field.label}</Label>
                <input
                  type="color"
                  value={value || '#cb530a'}
                  onChange={(e) => setProp(selectedSectionIndex, field.key, e.target.value)}
                  className="h-8 w-10 rounded border cursor-pointer shrink-0"
                />
                <Input
                  value={value}
                  onChange={(e) => setProp(selectedSectionIndex, field.key, e.target.value)}
                  className="flex-1 h-8 text-xs font-mono"
                  placeholder="#cb530a"
                />
              </div>
            );
          }
          if (field.type === 'image' || field.type === 'url') {
            return (
              <div key={field.key}>
                <Label className="text-[10px] font-semibold">{field.label}</Label>
                <Input
                  value={value}
                  onChange={(e) => setProp(selectedSectionIndex, field.key, e.target.value)}
                  className="mt-0.5 h-8 text-xs"
                  placeholder={field.type === 'url' ? 'https://…' : 'URL oder leer'}
                />
              </div>
            );
          }
          return (
            <div key={field.key}>
              <Label className="text-[10px] font-semibold">{field.label}</Label>
              <Input
                value={value}
                onChange={(e) => setProp(selectedSectionIndex, field.key, e.target.value)}
                className="mt-0.5 h-8 text-xs"
              />
            </div>
          );
        })}
      </div>
    </aside>
  );
}
