'use client';

import React from 'react';
import { PageEditorProvider } from './PageEditorContext';
import { EditorLayout } from './EditorLayout';
import type { LandingSection, LandingTemplate } from '@/types/landing-section';
import { getDefaultPropsForSection, SECTION_TYPES_BY_TEMPLATE } from '@/types/landing-section';

function buildFullTemplateSections(template: LandingTemplate): LandingSection[] {
  const types = SECTION_TYPES_BY_TEMPLATE[template];
  return types.map((type, i) => ({
    id: `sec-${template}-${type}-${i}-${Date.now()}`,
    type,
    props: getDefaultPropsForSection(type, template),
  }));
}

/** Start: immer volles Template (Standard). */
const INITIAL_SECTIONS = buildFullTemplateSections('standard');

export default function PageEditorPrototypePage() {
  return (
    <div className="min-h-screen bg-white">
      <PageEditorProvider initialSections={INITIAL_SECTIONS} initialTemplate="standard">
        <EditorLayout
          backHref="/admin"
          backLabel="Admin"
          showTemplateSwitch
        />
      </PageEditorProvider>
    </div>
  );
}
