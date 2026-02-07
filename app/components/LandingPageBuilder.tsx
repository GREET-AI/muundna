'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  LayoutTemplate,
  Eye,
  Save,
  X,
  HelpCircle,
  ThumbsUp,
  Sparkles,
  MessageSquare,
  Layers,
  Target,
  ClipboardList,
  CreditCard,
  ShieldCheck,
  ListOrdered,
  PanelBottom,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/app/components/ui/dialog';
import type { LandingSection, LandingSectionType } from '@/types/landing-section';
import { LANDING_ELEMENT_DEFINITIONS, SECTION_PREVIEW_IMAGES } from '@/types/landing-section';
import Image from 'next/image';

const ELEMENT_ICONS: Record<LandingSectionType, typeof LayoutTemplate> = {
  website_jeton_hero: Sparkles,
  website_marquee: Layers,
  website_target_groups: Target,
  website_testimonials: MessageSquare,
  website_quiz_cta: ClipboardList,
  website_services: LayoutTemplate,
  website_benefits: ThumbsUp,
  website_pricing: CreditCard,
  website_trust: ShieldCheck,
  website_process: ListOrdered,
  website_faq: HelpCircle,
  website_footer: PanelBottom,
};

/** Vorschaubild pro Sektion: Screenshot aus public/landing-previews oder Platzhalter (Footer) */
function ElementPreviewThumb({ type }: { type: LandingSectionType }) {
  const base = 'rounded border border-neutral-200 overflow-hidden bg-white shrink-0';
  const src = SECTION_PREVIEW_IMAGES[type];
  const label = LANDING_ELEMENT_DEFINITIONS[type].label;
  if (src) {
    return (
      <div className={`${base} w-full aspect-[2/1] flex flex-col`}>
        <div className="flex-1 min-h-0 relative">
          <Image src={src} alt="" fill className="object-cover object-top" sizes="140px" />
        </div>
        <div className="px-1.5 py-1 border-t border-neutral-100 bg-white/95">
          <span className="text-[8px] text-[#cb530a] font-medium truncate block">{label}</span>
        </div>
      </div>
    );
  }
  return (
    <div className={`${base} w-full aspect-[2/1] p-1.5 flex items-center justify-center bg-neutral-100`}>
      <span className="text-[8px] text-neutral-500 font-medium">{label}</span>
    </div>
  );
}

/** Mini-Vorschaufenster für eine Sektion in der Reihenfolge-Liste: Screenshot, volle Breite, scrollbar */
function SectionRowPreview({ type }: { type: LandingSectionType }) {
  const src = SECTION_PREVIEW_IMAGES[type];
  if (!src) return null;
  return (
    <div className="w-full max-h-36 overflow-y-auto overflow-x-hidden rounded-lg border border-neutral-200 bg-neutral-50 shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="w-full h-auto block object-top" />
    </div>
  );
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productSlug: string;
  productTitle: string;
  initialSections: LandingSection[] | null;
  onSaved: (sections: LandingSection[]) => void;
};

export function LandingPageBuilder({
  open,
  onOpenChange,
  productId,
  productSlug,
  productTitle,
  initialSections,
  onSaved,
}: Props) {
  const [sections, setSections] = useState<LandingSection[]>(() =>
    Array.isArray(initialSections) && initialSections.length > 0
      ? initialSections
      : []
  );
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const prevOpen = useRef(false);
  // Beim Öffnen des Dialogs (open wird true) aktuelle Sektionen vom Produkt laden
  useEffect(() => {
    if (open && !prevOpen.current) {
      setSections(
        Array.isArray(initialSections) && initialSections.length > 0
          ? initialSections
          : []
      );
    }
    prevOpen.current = open;
  }, [open, initialSections]);

  const addSection = useCallback((type: LandingSectionType) => {
    const def = LANDING_ELEMENT_DEFINITIONS[type];
    setSections((prev) => [
      ...prev,
      {
        id: crypto.randomUUID?.() ?? `s-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type,
        props: { ...def.defaultProps },
      },
    ]);
  }, []);

  const removeSection = useCallback((index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveSection = useCallback((index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= sections.length) return;
    setSections((prev) => {
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  }, [sections.length]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDraggedIndex(null);
    const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (Number.isNaN(from) || from === dropIndex) return;
    setSections((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(dropIndex, 0, item);
      return copy;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/digital-products/${productId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landing_page_sections: sections.length ? sections : null }),
      });
      const j = await res.json().catch(() => ({}));
      if (j.data) {
        onSaved(Array.isArray(j.data.landing_page_sections) ? j.data.landing_page_sections : []);
        onOpenChange(false);
      } else {
        const msg = j.error || res.status === 500 ? 'Serverfehler.' : 'Speichern fehlgeschlagen.';
        if (String(j.error || '').toLowerCase().includes('column') || String(j.error || '').includes('landing_page_sections')) {
          alert(`${msg}\n\nHinweis: Migration 004 (landing_page_sections) im Supabase SQL Editor ausführen: supabase/migrations/004_dp_landing_page_sections.sql`);
        } else {
          alert(msg);
        }
      }
    } catch (err) {
      alert('Netzwerkfehler. Bitte erneut versuchen.');
    } finally {
      setSaving(false);
    }
  };

  /** Vorschau in neuem Tab öffnen – echte Seite, Scroll funktioniert immer (wie bei anderen Buildern). */
  const openPreview = useCallback(() => {
    if (!productSlug?.trim()) return;
    const url = `/admin/preview-landing/${encodeURIComponent(productSlug)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [productSlug]);

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Landingpage gestalten</DialogTitle>
          <DialogDescription>
            Elemente auswählen und per Drag &amp; Drop anordnen. Die Vorschau zeigt die öffentliche Seite für „{productTitle}“.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 min-h-0 gap-4 py-2">
          {/* Linke Spalte: Elemente zum Hinzufügen (mit Vorschaubeschreibung) */}
          <div className="w-52 shrink-0 rounded-xl border border-neutral-200 bg-neutral-50 p-3 overflow-y-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Elemente</p>
            <ul className="space-y-2">
              {(Object.keys(LANDING_ELEMENT_DEFINITIONS) as LandingSectionType[]).map((type) => {
                const def = LANDING_ELEMENT_DEFINITIONS[type];
                const Icon = ELEMENT_ICONS[type];
                return (
                  <li key={type}>
                    <button
                      type="button"
                      onClick={() => addSection(type)}
                      className="w-full text-left rounded-lg border border-neutral-200 bg-white overflow-hidden hover:border-[#cb530a]/50 hover:bg-[#cb530a]/5 transition-colors"
                    >
                      <div className="w-full h-14 bg-neutral-50 flex items-center justify-center border-b border-neutral-100 p-1">
                        <div className="w-full h-full max-w-[120px] mx-auto">
                          <ElementPreviewThumb type={type} />
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="w-6 h-6 rounded-md bg-[#cb530a]/15 flex items-center justify-center shrink-0">
                            <Icon className="w-3 h-3 text-[#cb530a]" />
                          </span>
                          <span className="font-medium text-sm">{def.label}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug">{def.description}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Mitte: Reihenfolge (Funnel) mit Drag & Drop */}
          <div className="flex-1 min-w-0 rounded-xl border border-neutral-200 bg-white flex flex-col">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider p-3 border-b border-neutral-100">
              Reihenfolge (oben = oben auf der Seite)
            </p>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground text-sm">
                  <LayoutTemplate className="w-10 h-10 mb-2 opacity-50" />
                  <p>Noch keine Elemente. Links ein Element wählen, um es hinzuzufügen.</p>
                </div>
              ) : (
                sections.map((sec, index) => {
                  const def = LANDING_ELEMENT_DEFINITIONS[sec.type];
                  const Icon = ELEMENT_ICONS[sec.type];
                  return (
                    <div
                      key={sec.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={() => setDraggedIndex(null)}
                      className={`rounded-lg border bg-white p-2 transition-shadow flex flex-col gap-2 ${draggedIndex === index ? 'opacity-60 shadow-lg' : 'border-neutral-200 hover:border-neutral-300'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="cursor-grab active:cursor-grabbing text-muted-foreground" aria-hidden>
                          <GripVertical className="w-4 h-4" />
                        </span>
                        <span className="w-8 h-8 rounded-lg bg-[#cb530a]/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-[#cb530a]" />
                        </span>
                        <span className="flex-1 min-w-0 font-medium text-sm truncate">{def.label}</span>
                        <div className="flex items-center gap-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => moveSection(index, -1)}
                            disabled={index === 0}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => moveSection(index, 1)}
                            disabled={index === sections.length - 1}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive"
                            onClick={() => removeSection(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <SectionRowPreview type={sec.type} />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={openPreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            Vorschau (Vollbild)
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button className="bg-[#cb530a] hover:bg-[#a84308]" onClick={save} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Speichern…' : 'Speichern'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
