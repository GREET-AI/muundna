'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import type { LandingSection, LandingSectionType, LandingTemplate } from '@/types/landing-section';
import { getDefaultPropsForSection, SECTION_TYPES_BY_TEMPLATE } from '@/types/landing-section';

export type EditorStyle = { fontSize?: number; color?: string; backgroundColor?: string };

export type SelectedElement = { sectionIndex: number; propKey: string } | null;

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

function generateSectionId(): string {
  return `sec-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type PageEditorContextValue = {
  template: LandingTemplate;
  setTemplate: (t: LandingTemplate) => void;
  /** Template wechseln und Sektionen auf volles Template setzen (Basic/Parallax). */
  setTemplateWithFullSections: (t: LandingTemplate) => void;
  viewportMode: ViewportMode;
  setViewportMode: (m: ViewportMode) => void;
  /** Vollbild-Preview (Toolbar oben rechts: Desktop/Tablet/Mobile + Schließen). */
  previewOpen: boolean;
  setPreviewOpen: (v: boolean) => void;
  sections: LandingSection[];
  setSections: React.Dispatch<React.SetStateAction<LandingSection[]>>;
  /** Template-Switcher: Sektionen durch neues Set ersetzen (IDs neu generieren). */
  applySections: (next: LandingSection[]) => void;
  addSection: (type: LandingSectionType) => void;
  fillWithCompleteTemplate: () => void;
  removeSection: (index: number) => void;
  moveSectionUp: (index: number) => void;
  moveSectionDown: (index: number) => void;
  /** Welche Sektion im Canvas ausgewählt ist (Linksklick). */
  selectedSectionIndex: number | null;
  setSelectedSectionIndex: (index: number | null) => void;
  /** Sektions-Toolbar (Bearbeiten, Hoch, Runter, Löschen) nur bei Rechtsklick auf Sektion. */
  sectionToolbarIndex: number | null;
  setSectionToolbarIndex: (index: number | null) => void;
  selectedElement: SelectedElement;
  setSelectedElement: (el: SelectedElement) => void;
  /** true = Formatierungs-Toolbar + Inline-Edit (nach „Text bearbeiten“). */
  textEditMode: boolean;
  setTextEditMode: (v: boolean) => void;
  /** Rechtes Panel nur bei „Sektion bearbeiten“ öffnen. */
  showSectionPropsPanel: boolean;
  setShowSectionPropsPanel: (v: boolean) => void;
  editorStyles: Record<string, Record<string, EditorStyle>>;
  setProp: (sectionIndex: number, propKey: string, value: unknown) => void;
  setStyle: (sectionIndex: number, propKey: string, style: Partial<EditorStyle>) => void;
  getStyle: (sectionIndex: number, propKey: string) => EditorStyle;
};

const PageEditorContext = createContext<PageEditorContextValue | null>(null);

export function PageEditorProvider({
  children,
  initialSections,
  initialTemplate = 'standard',
}: {
  children: React.ReactNode;
  initialSections: LandingSection[];
  initialTemplate?: LandingTemplate;
}) {
  const [template, setTemplate] = useState<LandingTemplate>(initialTemplate);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sections, setSections] = useState<LandingSection[]>(initialSections);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
  const [sectionToolbarIndex, setSectionToolbarIndex] = useState<number | null>(null);
  const [selectedElement, setSelectedElement] = useState<SelectedElement>(null);
  const [textEditMode, setTextEditMode] = useState(false);
  const [showSectionPropsPanel, setShowSectionPropsPanel] = useState(false);
  const [editorStyles, setEditorStyles] = useState<Record<string, Record<string, EditorStyle>>>({});

  const applySections = useCallback((next: LandingSection[]) => {
    setSections(
      next.map((sec) => ({
        ...sec,
        id: generateSectionId(),
      }))
    );
    setSelectedSectionIndex(null);
    setSelectedElement(null);
    setSectionToolbarIndex(null);
  }, []);

  const fillWithCompleteTemplate = useCallback(() => {
    const types = SECTION_TYPES_BY_TEMPLATE[template];
    setSections(
      types.map((type) => ({
        id: generateSectionId(),
        type,
        props: getDefaultPropsForSection(type, template),
      }))
    );
    setSelectedSectionIndex(null);
    setSelectedElement(null);
  }, [template]);

  const setTemplateWithFullSections = useCallback((t: LandingTemplate) => {
    setTemplate(t);
    const types = SECTION_TYPES_BY_TEMPLATE[t];
    setSections(
      types.map((type) => ({
        id: generateSectionId(),
        type,
        props: getDefaultPropsForSection(type, t),
      }))
    );
    setSelectedSectionIndex(null);
    setSelectedElement(null);
    setSectionToolbarIndex(null);
  }, []);

  const addSection = useCallback(
    (type: LandingSectionType) => {
      const props = getDefaultPropsForSection(type, template);
      setSections((prev) => [...prev, { id: generateSectionId(), type, props }]);
      setSelectedElement(null);
    },
    [template]
  );

  const removeSection = useCallback((index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
    setSelectedSectionIndex((i) => (i === index ? null : i != null && i > index ? i - 1 : i));
    setSelectedElement((el) => (el?.sectionIndex === index ? null : el?.sectionIndex != null && el.sectionIndex > index ? { ...el, sectionIndex: el.sectionIndex - 1 } : el));
  }, []);

  const moveSectionUp = useCallback((index: number) => {
    if (index <= 0) return;
    setSections((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setSelectedSectionIndex(index - 1);
  }, []);

  const moveSectionDown = useCallback((index: number) => {
    setSections((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
    setSelectedSectionIndex((i) => (i === index ? index + 1 : i));
  }, []);

  const setProp = useCallback((sectionIndex: number, propKey: string, value: unknown) => {
    setSections((prev) => {
      const next = [...prev];
      if (!next[sectionIndex]) return next;
      next[sectionIndex] = {
        ...next[sectionIndex],
        props: { ...next[sectionIndex].props, [propKey]: value },
      };
      return next;
    });
  }, []);

  const setStyle = useCallback((sectionIndex: number, propKey: string, style: Partial<EditorStyle>) => {
    setEditorStyles((prev) => {
      const key = String(sectionIndex);
      const sectionStyles = prev[key] ?? {};
      const current = sectionStyles[propKey] ?? {};
      const nextStyle = { ...current, ...style };
      return { ...prev, [key]: { ...sectionStyles, [propKey]: nextStyle } };
    });
  }, []);

  const getStyle = useCallback(
    (sectionIndex: number, propKey: string): EditorStyle => {
      const key = String(sectionIndex);
      return editorStyles[key]?.[propKey] ?? {};
    },
    [editorStyles]
  );

  const value: PageEditorContextValue = {
    template,
    setTemplate,
    setTemplateWithFullSections,
    viewportMode,
    setViewportMode,
    previewOpen,
    setPreviewOpen,
    sections,
    setSections,
    applySections,
    addSection,
    fillWithCompleteTemplate,
    removeSection,
    moveSectionUp,
    moveSectionDown,
    selectedSectionIndex,
    setSelectedSectionIndex,
    sectionToolbarIndex,
    setSectionToolbarIndex,
    selectedElement,
    setSelectedElement,
    textEditMode,
    setTextEditMode,
    showSectionPropsPanel,
    setShowSectionPropsPanel,
    editorStyles,
    setProp,
    setStyle,
    getStyle,
  };

  return <PageEditorContext.Provider value={value}>{children}</PageEditorContext.Provider>;
}

export function usePageEditor() {
  const ctx = useContext(PageEditorContext);
  if (!ctx) throw new Error('usePageEditor must be used within PageEditorProvider');
  return ctx;
}
