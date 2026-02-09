'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PageEditorProvider } from '@/app/admin/page-editor-prototype/PageEditorContext';
import { EditorLayout } from '@/app/admin/page-editor-prototype/EditorLayout';
import { getStandardHomepageJson } from '@/lib/homepage-template';
import { getMainpageTemplateJson } from '@/lib/mainpage-template';
import type { LandingSection } from '@/types/landing-section';
import { Button } from '@/app/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';

const TITLE = 'Startseite';

function useHomepageData() {
  const [initialSections, setInitialSections] = useState<LandingSection[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/homepage', { credentials: 'include' });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.error || 'Laden fehlgeschlagen');
        setInitialSections(null);
        return;
      }
      const data = j.data;
      const fromTemplate = j.fromTemplate === true;
      const comp = (data?.json_data && (data.json_data as { components?: LandingSection[] }).components) ?? null;
      // Beim ersten Öffnen (keine gespeicherte Seite): Main-Page-Template laden
      const fallback = fromTemplate ? getMainpageTemplateJson().components : getStandardHomepageJson().components;
      setInitialSections(Array.isArray(comp) && comp.length > 0 ? comp : fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { initialSections, loading, error };
}

export default function HomepageEditPage() {
  const { initialSections, loading, error } = useHomepageData();
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async (sections: LandingSection[]) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: TITLE,
          json_data: { title: TITLE, components: sections },
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || 'Speichern fehlgeschlagen');
    } finally {
      setSaving(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#cb530a]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-neutral-50 p-4">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/admin">
          <Button variant="outline" size="sm" className="border-[#cb530a]/50 text-[#cb530a]">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Zurück zum Admin
          </Button>
        </Link>
      </div>
    );
  }

  const sections = initialSections ?? getMainpageTemplateJson().components;

  return (
    <div className="min-h-screen bg-white">
      <PageEditorProvider initialSections={sections} initialTemplate="standard">
        <EditorLayout
          backHref="/admin"
          backLabel="Zurück"
          onSave={handleSave}
          saving={saving}
          showTemplateSwitch
        />
      </PageEditorProvider>
    </div>
  );
}
