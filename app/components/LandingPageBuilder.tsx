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
  Heading1,
  Heading2,
  Palette,
  PaintBucket,
  ImageIcon,
  Image as ImageLucide,
  AlignLeft,
  MousePointerClick,
  Copyright,
  Highlighter,
  FileEdit,
  Plus,
  LayoutGrid,
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
import type { LandingSection, LandingSectionType, LandingTemplate, TestimonialItem, TargetGroupItem, ServiceItem, BenefitItem, PricingCardItem, ProcessStepItem, FaqItem, BeratungProcessStepItem, StatItem } from '@/types/landing-section';
import { LANDING_ELEMENT_DEFINITIONS, SECTION_PREVIEW_IMAGES, SECTION_PREVIEW_IMAGES_PARALLAX, SECTION_TYPES_BY_TEMPLATE, getSectionLabel, getEditablePropsForSection, getDefaultPropsForSection, getElementKindsForProps, getPropsByKind, ELEMENT_KIND_LABELS, type EditablePropDef, type ElementKindId } from '@/types/landing-section';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { RichTextEditor } from '@/app/components/ui/RichTextEditor';
import { BarChart3 } from 'lucide-react';

/** Icons pro Element-Kategorie (Toolbar beim Bearbeiten einer Sektion). */
const ELEMENT_KIND_ICONS: Record<ElementKindId, typeof LayoutTemplate> = {
  headline: Heading1,
  headline_style: Palette,
  logo: ImageIcon,
  background: ImageLucide,
  section_title: Heading2,
  section_subtitle: AlignLeft,
  marquee: Layers,
  marquee_style: PaintBucket,
  target_groups_cards: LayoutGrid,
  services_cards: LayoutGrid,
  benefits_cards: LayoutGrid,
  pricing_cards: LayoutGrid,
  process_cards: ListOrdered,
  faq_items: HelpCircle,
  cta: MousePointerClick,
  testimonials: MessageSquare,
  testimonials_slider_images: ImageLucide,
  copyright: Copyright,
  highlight: Highlighter,
  beratung_headline: Heading1,
  beratung_process: ListOrdered,
  beratung_stats: BarChart3,
  other: FileEdit,
};

/** Claim Parallax: Nur 2 Headlines + CTA + Sidebar-Text, dann pro Card eigene Felder */
const CLAIM_PARALLAX_HEADLINE_KEYS = ['claimHeadlineLine1', 'claimHeadlineLine2', 'ctaText', 'listPhaseSidebarText'] as const;
const CLAIM_PARALLAX_CARD_KEYS: readonly (readonly string[])[] = [
  ['card1ImageUrl', 'cardLabel1', 'card1TrustText', 'card1ButtonText', 'card1TextColor', 'card1TextSize', 'card1Icon', 'card1IconColor'],
  ['cardLabel2', 'card2Line1', 'card2Line2', 'card2StatusText', 'card2TextColor', 'card2TextSize', 'card2Icon', 'card2IconColor'],
  ['card3ImageUrl', 'card3OverlayText', 'card3TextColor', 'card3TextSize'],
  ['cardLabel4', 'card4NumberText', 'card4ContextText', 'card4ButtonText', 'card4TextColor', 'card4TextSize', 'card4Icon', 'card4IconColor'],
];
const CLAIM_PARALLAX_CARD_LABELS = ['Card 1 (Beratung)', 'Card 2 (Planung)', 'Card 3 (Bau)', 'Card 4 (Wert)'] as const;

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
  website_testimonials_infinite: MessageSquare,
  website_beratung: ListOrdered,
  website_claim_parallax: Layers,
  website_words_parallax: Layers,
  website_stacked_sheets: LayoutTemplate,
  website_images_slider: Eye,
};

/** Bild-Upload: max. Größe und erlaubte Formate (wie API). */
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const IMAGE_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp';
const IMAGE_UPLOAD_HINT = 'JPG, PNG, GIF oder WebP · max. 5 MB';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Nur JPG, PNG, GIF oder WebP erlaubt.';
  if (file.size > MAX_IMAGE_SIZE_BYTES) return `Datei zu groß. Max. ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} MB.`;
  return null;
}

function getSectionPreviewSrc(type: LandingSectionType, template: LandingTemplate): string | undefined {
  return (template === 'parallax' && SECTION_PREVIEW_IMAGES_PARALLAX[type]) ? SECTION_PREVIEW_IMAGES_PARALLAX[type] : SECTION_PREVIEW_IMAGES[type];
}

/** Vorschaubild pro Sektion: natives <img> damit jede URL 1:1 geladen wird (kein Next/Image-Cache). */
function ElementPreviewThumb({ type, template }: { type: LandingSectionType; template: LandingTemplate }) {
  const base = 'rounded border border-neutral-200 overflow-hidden bg-white shrink-0';
  const src = getSectionPreviewSrc(type, template);
  const label = getSectionLabel(type, template);
  if (src) {
    return (
      <div className={`${base} w-full aspect-[2/1] flex flex-col`}>
        <div className="flex-1 min-h-0 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={src} src={src} alt="" className="w-full h-full object-cover object-top block" />
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

/** Vorschau einer Sektion: volle Breite, Bild komplett sichtbar (object-contain), kein Zoom/Crop */
function SectionRowPreview({ type, template, fullHeight = false }: { type: LandingSectionType; template: LandingTemplate; fullHeight?: boolean }) {
  const src = getSectionPreviewSrc(type, template);
  const isMarquee = type === 'website_marquee';
  if (!src) {
    const label = getSectionLabel(type, template);
    return (
      <div className={`w-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-sm ${fullHeight && !isMarquee ? 'min-h-[240px]' : fullHeight && isMarquee ? 'h-8 min-h-[32px]' : 'max-h-36'}`}>
        {label}
      </div>
    );
  }
  if (fullHeight && isMarquee) {
    return (
      <div className="w-full h-8 min-h-[32px] overflow-hidden bg-neutral-50 shrink-0 flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="w-full h-full object-cover object-center block" />
      </div>
    );
  }
  return (
    <div className={`w-full overflow-hidden bg-neutral-50 shrink-0 flex items-center justify-center ${fullHeight ? 'min-h-[240px]' : 'max-h-36'}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="w-full h-auto max-h-[360px] object-contain object-top block" />
    </div>
  );
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string | null;
  productSlug?: string | null;
  productTitle?: string | null;
  initialSections: LandingSection[] | null;
  initialThemePrimary?: string | null;
  initialThemeSecondary?: string | null;
  initialLandingTemplate?: LandingTemplate | null;
  onSaved: (sections: LandingSection[], theme?: { theme_primary_color: string | null; theme_secondary_color: string | null }, template?: LandingTemplate) => void;
  /** Homepage-Modus: Laden/Speichern über /api/admin/homepage, Vorschau = /. Kein Pixel-Tab. */
  homepageMode?: boolean;
};

const DEFAULT_PRIMARY = '#cb530a';
const DEFAULT_SECONDARY = '#f0e6e0';
/** ImmoSparplan-Parallax-Vorlage: Standard-Farben wie Original */
const PARALLAX_PRIMARY = '#C4D32A';
const PARALLAX_SECONDARY = '#60A917';

const PARALLAX_TYPES = new Set(SECTION_TYPES_BY_TEMPLATE.parallax);
function inferTemplate(sections: LandingSection[]): LandingTemplate {
  if (sections.length === 0) return 'standard';
  const first = sections[0];
  return first && PARALLAX_TYPES.has(first.type as LandingSectionType) ? 'parallax' : 'standard';
}

export function LandingPageBuilder({
  open,
  onOpenChange,
  productId: productIdProp,
  productSlug,
  productTitle,
  initialSections,
  initialThemePrimary,
  initialThemeSecondary,
  initialLandingTemplate,
  onSaved,
  homepageMode = false,
}: Props) {
  const productId = homepageMode ? null : (productIdProp ?? null);
  const [sections, setSections] = useState<LandingSection[]>(() =>
    Array.isArray(initialSections) && initialSections.length > 0
      ? initialSections
      : []
  );
  const [template, setTemplate] = useState<LandingTemplate>(() =>
    initialLandingTemplate ?? (Array.isArray(initialSections) && initialSections.length > 0 ? inferTemplate(initialSections) : 'standard')
  );
  const [themePrimary, setThemePrimary] = useState<string>(() => initialThemePrimary ?? DEFAULT_PRIMARY);
  const [themeSecondary, setThemeSecondary] = useState<string>(() => initialThemeSecondary ?? DEFAULT_SECONDARY);
  const [hasSavedOnce, setHasSavedOnce] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
  const [selectedElementKind, setSelectedElementKind] = useState<ElementKindId | null>(null);
  const [selectedClaimParallaxCard, setSelectedClaimParallaxCard] = useState<number | null>(null);
  const [selectedTestimonialIndex, setSelectedTestimonialIndex] = useState<number | null>(null);
  const [selectedTargetGroupIndex, setSelectedTargetGroupIndex] = useState<number | null>(null);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null);
  const [selectedBenefitIndex, setSelectedBenefitIndex] = useState<number | null>(null);
  const [selectedPricingIndex, setSelectedPricingIndex] = useState<number | null>(null);
  const [selectedProcessStepIndex, setSelectedProcessStepIndex] = useState<number | null>(null);
  const [selectedFaqIndex, setSelectedFaqIndex] = useState<number | null>(null);
  const [selectedBeratungProcessStepIndex, setSelectedBeratungProcessStepIndex] = useState<number | null>(null);
  const [selectedBeratungStatIndex, setSelectedBeratungStatIndex] = useState<number | null>(null);
  const optionsPanelRef = useRef<HTMLDivElement>(null);
  const pipelineListRef = useRef<HTMLDivElement>(null);

  /** Schließen des Options-Panels bei Klick außerhalb (nicht auf Sektion, nicht im Panel) */
  useEffect(() => {
    if (selectedSectionIndex === null) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (optionsPanelRef.current?.contains(target)) return;
      if ((e.target as HTMLElement).closest?.('[data-section-block]')) return;
      setSelectedSectionIndex(null);
      setSelectedElementKind(null);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [selectedSectionIndex]);

  /** Beim Wechsel der Sektion: Element-Kategorie, Claim-Card, Testimonial und Zielgruppen-Card zurücksetzen */
  useEffect(() => {
    setSelectedElementKind(null);
    setSelectedClaimParallaxCard(null);
    setSelectedTestimonialIndex(null);
    setSelectedTargetGroupIndex(null);
    setSelectedServiceIndex(null);
    setSelectedBenefitIndex(null);
    setSelectedPricingIndex(null);
    setSelectedProcessStepIndex(null);
    setSelectedFaqIndex(null);
  }, [selectedSectionIndex]);
  type PixelRow = { id: string; provider: string; pixel_id: string | null; name: string | null };
  const [pixels, setPixels] = useState<PixelRow[]>([]);
  const [pixelForm, setPixelForm] = useState({ provider: 'facebook', pixel_id: '', name: '', script_content: '' });
  const [trackingOpen, setTrackingOpen] = useState(false);

  const prevOpen = useRef(false);
  // Beim Öffnen des Dialogs (open wird true) aktuelle Sektionen, Vorlage und Theme vom Produkt laden
  useEffect(() => {
    if (open && !prevOpen.current) {
      const rawSections = Array.isArray(initialSections) && initialSections.length > 0 ? initialSections : [];
      const chosenTemplate: LandingTemplate = initialLandingTemplate ?? (rawSections.length > 0 ? inferTemplate(rawSections) : 'standard');
      const allowedTypes = new Set(SECTION_TYPES_BY_TEMPLATE[chosenTemplate]);
      const sectionsList = rawSections.filter((s) => allowedTypes.has(s.type as LandingSectionType));
      const theme = chosenTemplate === 'parallax' ? { primary: PARALLAX_PRIMARY, secondary: PARALLAX_SECONDARY } : { primary: DEFAULT_PRIMARY, secondary: DEFAULT_SECONDARY };
      setTemplate(chosenTemplate);
      setSections(sectionsList);
      setThemePrimary(initialThemePrimary ?? theme.primary);
      setThemeSecondary(initialThemeSecondary ?? theme.secondary);
      setHasSavedOnce(sectionsList.length > 0);
    }
    prevOpen.current = open;
    if (open && productId) {
      fetch(`/api/admin/digital-products/${productId}/pixels`, { credentials: 'include' })
        .then((r) => r.json())
        .then((j) => setPixels(j.data ?? []))
        .catch(() => setPixels([]));
    }
    if (!open) setSelectedSectionIndex(null);
  }, [open, initialSections, initialLandingTemplate, productId]);

  const addSection = useCallback((type: LandingSectionType) => {
    const def = LANDING_ELEMENT_DEFINITIONS[type];
    const props = template === 'parallax' && def.parallaxDefaultProps
      ? { ...def.parallaxDefaultProps }
      : { ...def.defaultProps };
    setSections((prev) => [
      ...prev,
      {
        id: crypto.randomUUID?.() ?? `s-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type,
        props,
      },
    ]);
  }, [template]);

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
    setSelectedSectionIndex((i) => (i === from ? dropIndex : i === dropIndex ? from : i));
  };

  const updateSectionProp = useCallback((index: number, key: string, value: unknown) => {
    setSections((prev) =>
      prev.map((sec, i) => (i === index ? { ...sec, props: { ...sec.props, [key]: value } } : sec))
    );
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      if (homepageMode) {
        const res = await fetch('/api/admin/homepage', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Startseite',
            json_data: { title: 'Startseite', components: sections },
          }),
        });
        const j = await res.json().catch(() => ({}));
        if (j.data) {
          const comp = (j.data.json_data && (j.data.json_data as { components?: LandingSection[] }).components) ?? sections;
          onSaved(Array.isArray(comp) ? comp : sections);
          setHasSavedOnce(true);
        } else {
          alert(j.error || 'Speichern fehlgeschlagen.');
        }
        setSaving(false);
        return;
      }
      const res = await fetch(`/api/admin/digital-products/${productId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        landing_page_sections: sections.length ? sections : null,
        theme_primary_color: themePrimary || null,
        theme_secondary_color: themeSecondary || null,
        landing_template: template,
      }),
      });
      const j = await res.json().catch(() => ({}));
      if (j.data) {
        onSaved(
          Array.isArray(j.data.landing_page_sections) ? j.data.landing_page_sections : [],
          {
            theme_primary_color: j.data.theme_primary_color ?? null,
            theme_secondary_color: j.data.theme_secondary_color ?? null,
          },
          (j.data.landing_template === 'parallax' ? 'parallax' : 'standard') as LandingTemplate
        );
        setHasSavedOnce(true);
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

  /** Vorschau in neuem Tab öffnen – echte Seite. Homepage: /, sonst Landing-Vorschau. */
  const openPreview = useCallback(() => {
    if (homepageMode) {
      window.open('/', '_blank', 'noopener,noreferrer');
      return;
    }
    if (!productSlug?.trim()) return;
    const url = `/admin/preview-landing/${encodeURIComponent(productSlug)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [productSlug, homepageMode]);

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{homepageMode ? 'Homepage gestalten' : 'Landingpage gestalten'}</DialogTitle>
          <DialogDescription>
            {homepageMode
              ? 'Elemente auswählen und per Drag & Drop anordnen. Die Vorschau zeigt Ihre Startseite (/).'
              : `Elemente auswählen und per Drag &amp; Drop anordnen. Die Vorschau zeigt die öffentliche Seite für „${productTitle ?? ''}“.`}
          </DialogDescription>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-medium text-muted-foreground">Vorlage:</span>
            <div className="flex rounded-lg border border-neutral-200 p-0.5 bg-neutral-100">
              <button
                type="button"
                onClick={() => {
                  if (template === 'standard') return;
                  if (sections.length > 0 && !window.confirm('Vorlage wechseln? Die aktuelle Anordnung wird gelöscht und Sie können nur die Elemente der neuen Vorlage hinzufügen.')) return;
                  setTemplate('standard');
                  setThemePrimary(DEFAULT_PRIMARY);
                  setThemeSecondary(DEFAULT_SECONDARY);
                  if (sections.length > 0) setSections([]);
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${template === 'standard' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => {
                  if (template === 'parallax') return;
                  if (sections.length > 0 && !window.confirm('Vorlage wechseln? Die aktuelle Anordnung wird gelöscht und Sie können nur die Elemente der Parallax-Vorlage hinzufügen.')) return;
                  setTemplate('parallax');
                  setThemePrimary(PARALLAX_PRIMARY);
                  setThemeSecondary(PARALLAX_SECONDARY);
                  if (sections.length > 0) setSections([]);
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${template === 'parallax' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                Parallax Vorlage
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 min-h-0 gap-4 py-2">
          {/* Linke Spalte: Elemente zum Hinzufügen (nur für gewählte Vorlage) */}
          <div className="w-52 shrink-0 rounded-xl border border-neutral-200 bg-neutral-50 p-3 overflow-y-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Elemente ({template === 'parallax' ? 'Parallax' : 'Standard'})</p>
            <ul className="space-y-0">
              {SECTION_TYPES_BY_TEMPLATE[template].map((type) => {
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
                          <ElementPreviewThumb type={type} template={template} />
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="w-6 h-6 rounded-md bg-[#cb530a]/15 flex items-center justify-center shrink-0">
                            <Icon className="w-3 h-3 text-[#cb530a]" />
                          </span>
                          <span className="font-medium text-sm">{getSectionLabel(type, template)}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug">{def.description}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Mitte: Seiten-Farben + Reihenfolge (Funnel) mit Drag & Drop */}
          <div className="flex-1 min-w-0 rounded-xl border border-neutral-200 bg-white flex flex-col">
            <div className="p-3 border-b border-neutral-100 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seiten-Farben</p>
              <p className="text-[11px] text-muted-foreground">Eine Änderung gilt für die gesamte Landingpage (Buttons, Akzente).</p>
                <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] font-semibold shrink-0">{template === 'parallax' ? 'Primary' : 'Primär'}</Label>
                  <input type="color" value={themePrimary} onChange={(e) => setThemePrimary(e.target.value)} className="h-8 w-10 rounded border cursor-pointer shrink-0" />
                  <Input value={themePrimary} onChange={(e) => setThemePrimary(e.target.value)} className="w-24 h-8 text-xs font-mono" placeholder={template === 'parallax' ? '#C4D32A' : '#cb530a'} />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] font-semibold shrink-0">{template === 'parallax' ? 'Primary Dark' : 'Sekundär'}</Label>
                  <input type="color" value={themeSecondary} onChange={(e) => setThemeSecondary(e.target.value)} className="h-8 w-10 rounded border cursor-pointer shrink-0" />
                  <Input value={themeSecondary} onChange={(e) => setThemeSecondary(e.target.value)} className="w-24 h-8 text-xs font-mono" placeholder={template === 'parallax' ? '#60A917' : '#f0e6e0'} />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs shrink-0"
                  onClick={() => { setThemePrimary(template === 'parallax' ? PARALLAX_PRIMARY : DEFAULT_PRIMARY); setThemeSecondary(template === 'parallax' ? PARALLAX_SECONDARY : DEFAULT_SECONDARY); }}
                >
                  Zurücksetzen
                </Button>
              </div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider p-3 border-b border-neutral-100">
              Reihenfolge (oben = oben auf der Seite)
            </p>
            <div ref={pipelineListRef} className="flex-1 overflow-y-auto p-0">
              {sections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground text-sm p-4">
                  <LayoutTemplate className="w-10 h-10 mb-2 opacity-50" />
                  <p>Noch keine Elemente. Links ein Element wählen, um es hinzuzufügen.</p>
                </div>
              ) : (
                sections.map((sec, index) => {
                  const editableProps = getEditablePropsForSection(sec.type as LandingSectionType, template);
                  const isSelected = selectedSectionIndex === index;
                  return (
                    <div
                      key={sec.id}
                      data-section-block
                      draggable={!isSelected}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={() => setDraggedIndex(null)}
                      className={`relative group cursor-grab active:cursor-grabbing transition-opacity ${draggedIndex === index ? 'opacity-60' : ''} ${isSelected ? 'ring-2 ring-[#cb530a] ring-inset' : ''}`}
                    >
                      {/* Hover-Toolbar: nur bei Hover oben rechts */}
                      <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-white hover:bg-white/20"
                          onClick={(e) => { e.stopPropagation(); moveSection(index, -1); }}
                          disabled={index === 0}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-white hover:bg-white/20"
                          onClick={(e) => { e.stopPropagation(); moveSection(index, 1); }}
                          disabled={index === sections.length - 1}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-white hover:bg-red-600/80"
                          onClick={(e) => { e.stopPropagation(); removeSection(index); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setSelectedSectionIndex(isSelected ? null : index); }}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedSectionIndex(isSelected ? null : index)}
                        className="cursor-pointer block w-full"
                      >
                        <SectionRowPreview type={sec.type} template={template} fullHeight />
                      </div>
                      {isSelected && editableProps && editableProps.length > 0 && (
                        <div
                          ref={optionsPanelRef}
                          className="border-t border-neutral-200 bg-white p-3 space-y-3"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-[#cb530a]">Inhalt bearbeiten</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => setSelectedSectionIndex(null)}
                              aria-label="Schließen"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          {/* Claim Parallax: Headline (2 Zeilen) + 4 Card-Buttons, dann Card-Felder */}
                          {sec.type === 'website_claim_parallax' ? (
                            <>
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Headline (2 Zeilen) &amp; CTA</p>
                              <div className="space-y-2">
                                {editableProps.filter((f) => (CLAIM_PARALLAX_HEADLINE_KEYS as readonly string[]).includes(f.key)).map((field: EditablePropDef) => {
                                  const rawValue = sec.props[field.key];
                                  const value = (rawValue as string) ?? '';
                                  return (
                                    <div key={field.key}>
                                      <Label className="text-[10px] font-semibold">{field.label}</Label>
                                      {field.type === 'textarea' ? (
                                        <Textarea value={value} onChange={(e) => updateSectionProp(index, field.key, e.target.value)} rows={2} className="mt-0.5 text-xs h-16" />
                                      ) : (
                                        <Input value={value} onChange={(e) => updateSectionProp(index, field.key, e.target.value)} className="mt-0.5 h-8 text-xs" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pt-2 border-t border-neutral-100">Card wählen</p>
                              <div className="flex flex-wrap gap-1.5">
                                {[0, 1, 2, 3].map((cardIdx) => (
                                  <button
                                    key={cardIdx}
                                    type="button"
                                    onClick={() => setSelectedClaimParallaxCard(selectedClaimParallaxCard === cardIdx ? null : cardIdx)}
                                    className={`shrink-0 px-2.5 py-1.5 rounded-md border text-[10px] font-medium transition-colors ${selectedClaimParallaxCard === cardIdx ? 'bg-[#cb530a] text-white border-[#cb530a]' : 'bg-white border-neutral-200 hover:border-[#cb530a]/50'}`}
                                  >
                                    {CLAIM_PARALLAX_CARD_LABELS[cardIdx]}
                                  </button>
                                ))}
                              </div>
                              {selectedClaimParallaxCard !== null && (() => {
                                const cardKeys = CLAIM_PARALLAX_CARD_KEYS[selectedClaimParallaxCard] as readonly string[];
                                const cardFields = editableProps.filter((f) => cardKeys.includes(f.key));
                                return (
                                  <div className="space-y-2 pt-2 border-t border-neutral-100">
                                    {cardFields.map((field: EditablePropDef) => {
                                      const rawValue = sec.props[field.key];
                                      const value = (rawValue as string) ?? '';
                                      if (field.type === 'textarea') {
                                        return (
                                          <div key={field.key}>
                                            <Label className="text-[10px] font-semibold">{field.label}</Label>
                                            <Textarea value={value} onChange={(e) => updateSectionProp(index, field.key, e.target.value)} rows={2} className="mt-0.5 text-xs h-16" />
                                          </div>
                                        );
                                      }
                                      if (field.type === 'color') {
                                        return (
                                          <div key={field.key} className="flex items-center gap-2">
                                            <Label className="text-[10px] font-semibold w-28 shrink-0">{field.label}</Label>
                                            <input type="color" value={value || '#000000'} onChange={(e) => updateSectionProp(index, field.key, e.target.value)} className="h-8 w-10 rounded border cursor-pointer shrink-0" />
                                            <Input value={value} onChange={(e) => updateSectionProp(index, field.key, e.target.value)} className="flex-1 h-8 text-xs font-mono" placeholder="#000000" />
                                          </div>
                                        );
                                      }
                                      if (field.type === 'image') {
                                        return (
                                          <div key={field.key}>
                                            <Label className="text-[10px] font-semibold">{field.label}</Label>
                                            <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                              {value ? (
                                                <div className="flex items-center gap-2">
                                                  <img src={value} alt="" className="h-14 w-20 rounded border object-cover" />
                                                  <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => updateSectionProp(index, field.key, '')}>Entfernen</Button>
                                                </div>
                                              ) : null}
                                              <label className="cursor-pointer">
                                                <input
                                                  type="file"
                                                  accept={IMAGE_ACCEPT}
                                                  className="sr-only"
                                                  onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const err = validateImageFile(file);
                                                    if (err) { alert(err); e.target.value = ''; return; }
                                                    const fd = new FormData();
                                                    fd.append('file', file);
                                                    try {
                                                      const res = await fetch('/api/admin/digital-products/upload-image', { method: 'POST', credentials: 'include', body: fd });
                                                      const j = await res.json();
                                                      if (j.url) updateSectionProp(index, field.key, j.url);
                                                      else if (j.error) alert(j.error);
                                                    } catch { alert('Upload fehlgeschlagen.'); }
                                                    e.target.value = '';
                                                  }}
                                                />
                                                <span className="inline-flex items-center justify-center rounded-md border border-input bg-background px-2 py-1.5 h-8 text-[10px] font-medium hover:bg-muted/50">
                                                  {value ? 'Anderes Bild' : 'Bild hochladen'}
                                                </span>
                                              </label>
                                            </div>
                                            <p className="mt-1 text-[9px] text-muted-foreground">{IMAGE_UPLOAD_HINT}</p>
                                          </div>
                                        );
                                      }
                                      return (
                                        <div key={field.key}>
                                          <Label className="text-[10px] font-semibold">{field.label}</Label>
                                          <Input value={value} onChange={(e) => updateSectionProp(index, field.key, e.target.value)} className="mt-0.5 h-8 text-xs" />
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </>
                          ) : (
                            <>
                          {/* Icon-Toolbar: nur Kategorien, die in dieser Sektion vorkommen. Zielgruppen: 4 Card-Buttons direkt. */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {getElementKindsForProps(editableProps, sec.type as LandingSectionType).map((kind) => {
                              if (sec.type === 'website_target_groups' && kind === 'target_groups_cards') {
                                return [0, 1, 2, 3].map((cardIdx) => {
                                  const isActive = selectedElementKind === 'target_groups_cards' && selectedTargetGroupIndex === cardIdx;
                                  return (
                                    <button
                                      key={`card-${cardIdx}`}
                                      type="button"
                                      onClick={() => { setSelectedElementKind('target_groups_cards'); setSelectedTargetGroupIndex(isActive ? null : cardIdx); setSelectedTestimonialIndex(null); setSelectedServiceIndex(null); setSelectedBenefitIndex(null); setSelectedPricingIndex(null); setSelectedProcessStepIndex(null); setSelectedFaqIndex(null); }}
                                      title={`Card ${cardIdx + 1}`}
                                      className={`shrink-0 px-2 py-1.5 rounded-md border text-[10px] font-medium transition-colors ${isActive ? 'bg-[#cb530a] text-white border-[#cb530a]' : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#cb530a]/50'}`}
                                    >
                                      Card {cardIdx + 1}
                                    </button>
                                  );
                                });
                              }
                              if (sec.type === 'website_services' && kind === 'services_cards') {
                                return [0, 1, 2, 3, 4, 5].map((cardIdx) => {
                                  const isActive = selectedElementKind === 'services_cards' && selectedServiceIndex === cardIdx;
                                  return (
                                    <button
                                      key={`service-card-${cardIdx}`}
                                      type="button"
                                      onClick={() => { setSelectedElementKind('services_cards'); setSelectedServiceIndex(isActive ? null : cardIdx); setSelectedTestimonialIndex(null); setSelectedTargetGroupIndex(null); setSelectedBenefitIndex(null); setSelectedPricingIndex(null); setSelectedProcessStepIndex(null); setSelectedFaqIndex(null); }}
                                      title={`Card ${cardIdx + 1}`}
                                      className={`shrink-0 px-2 py-1.5 rounded-md border text-[10px] font-medium transition-colors ${isActive ? 'bg-[#cb530a] text-white border-[#cb530a]' : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#cb530a]/50'}`}
                                    >
                                      Card {cardIdx + 1}
                                    </button>
                                  );
                                });
                              }
                              if (sec.type === 'website_benefits' && kind === 'benefits_cards') {
                                return [0, 1, 2, 3, 4, 5].map((cardIdx) => {
                                  const isActive = selectedElementKind === 'benefits_cards' && selectedBenefitIndex === cardIdx;
                                  return (
                                    <button
                                      key={`benefit-card-${cardIdx}`}
                                      type="button"
                                      onClick={() => { setSelectedElementKind('benefits_cards'); setSelectedBenefitIndex(isActive ? null : cardIdx); setSelectedTestimonialIndex(null); setSelectedTargetGroupIndex(null); setSelectedServiceIndex(null); setSelectedPricingIndex(null); setSelectedProcessStepIndex(null); setSelectedFaqIndex(null); }}
                                      title={`Card ${cardIdx + 1}`}
                                      className={`shrink-0 px-2 py-1.5 rounded-md border text-[10px] font-medium transition-colors ${isActive ? 'bg-[#cb530a] text-white border-[#cb530a]' : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#cb530a]/50'}`}
                                    >
                                      Card {cardIdx + 1}
                                    </button>
                                  );
                                });
                              }
                              if (sec.type === 'website_pricing' && kind === 'pricing_cards') {
                                return [0, 1, 2].map((cardIdx) => {
                                  const isActive = selectedElementKind === 'pricing_cards' && selectedPricingIndex === cardIdx;
                                  return (
                                    <button
                                      key={`pricing-card-${cardIdx}`}
                                      type="button"
                                      onClick={() => { setSelectedElementKind('pricing_cards'); setSelectedPricingIndex(isActive ? null : cardIdx); setSelectedTestimonialIndex(null); setSelectedTargetGroupIndex(null); setSelectedServiceIndex(null); setSelectedBenefitIndex(null); setSelectedProcessStepIndex(null); setSelectedFaqIndex(null); }}
                                      title={`Card ${cardIdx + 1}`}
                                      className={`shrink-0 px-2 py-1.5 rounded-md border text-[10px] font-medium transition-colors ${isActive ? 'bg-[#cb530a] text-white border-[#cb530a]' : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#cb530a]/50'}`}
                                    >
                                      Card {cardIdx + 1}
                                    </button>
                                  );
                                });
                              }
                              if (sec.type === 'website_process' && kind === 'process_cards') {
                                return [0, 1, 2, 3].map((cardIdx) => {
                                  const isActive = selectedElementKind === 'process_cards' && selectedProcessStepIndex === cardIdx;
                                  return (
                                    <button
                                      key={`process-card-${cardIdx}`}
                                      type="button"
                                      onClick={() => { setSelectedElementKind('process_cards'); setSelectedProcessStepIndex(isActive ? null : cardIdx); setSelectedTestimonialIndex(null); setSelectedTargetGroupIndex(null); setSelectedServiceIndex(null); setSelectedBenefitIndex(null); setSelectedPricingIndex(null); setSelectedFaqIndex(null); }}
                                      title={`Card ${cardIdx + 1}`}
                                      className={`shrink-0 px-2 py-1.5 rounded-md border text-[10px] font-medium transition-colors ${isActive ? 'bg-[#cb530a] text-white border-[#cb530a]' : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#cb530a]/50'}`}
                                    >
                                      Card {cardIdx + 1}
                                    </button>
                                  );
                                });
                              }
                              if (sec.type === 'website_faq' && kind === 'faq_items') {
                                const rawFaqs = (Array.isArray(sec.props.faqs) ? sec.props.faqs : []) as FaqItem[];
                                return (
                                  <div key="faq-tabs" className="flex flex-wrap items-center gap-1">
                                    {rawFaqs.map((faq, faqIdx) => {
                                      const isActive = selectedElementKind === 'faq_items' && selectedFaqIndex === faqIdx;
                                      return (
                                        <div key={`faq-${faqIdx}`} className="flex items-center gap-0.5 shrink-0">
                                          <button
                                            type="button"
                                            onClick={() => { setSelectedElementKind('faq_items'); setSelectedFaqIndex(isActive ? null : faqIdx); setSelectedProcessStepIndex(null); setSelectedPricingIndex(null); setSelectedTestimonialIndex(null); setSelectedTargetGroupIndex(null); setSelectedServiceIndex(null); setSelectedBenefitIndex(null); }}
                                            title={faq.question?.slice(0, 40) || `Frage ${faqIdx + 1}`}
                                            className={`max-w-[100px] truncate px-2 py-1.5 rounded-md border text-[10px] font-medium transition-colors ${isActive ? 'bg-[#cb530a] text-white border-[#cb530a]' : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#cb530a]/50'}`}
                                          >
                                            {faq.question?.trim() ? faq.question.slice(0, 12) + '…' : `Frage ${faqIdx + 1}`}
                                          </button>
                                          <button
                                            type="button"
                                            title="Frage löschen"
                                            className="p-1 rounded border border-neutral-200 text-neutral-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                            onClick={() => {
                                              const next = rawFaqs.filter((_, j) => j !== faqIdx);
                                              updateSectionProp(index, 'faqs', next);
                                              setSelectedFaqIndex(selectedFaqIndex === faqIdx ? (next.length > 0 ? Math.min(faqIdx, next.length - 1) : null) : selectedFaqIndex !== null && selectedFaqIndex > faqIdx ? selectedFaqIndex - 1 : selectedFaqIndex);
                                            }}
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      );
                                    })}
                                    <button
                                      type="button"
                                      title="Neue Frage hinzufügen"
                                      className="shrink-0 p-1.5 rounded-md border border-dashed border-neutral-300 bg-white text-neutral-500 hover:bg-[#cb530a]/10 hover:border-[#cb530a]/50 hover:text-[#cb530a]"
                                      onClick={() => {
                                        const next = [...rawFaqs, { question: 'Neue Frage', answer: '' }];
                                        updateSectionProp(index, 'faqs', next);
                                        setSelectedElementKind('faq_items');
                                        setSelectedFaqIndex(next.length - 1);
                                        setSelectedProcessStepIndex(null); setSelectedPricingIndex(null); setSelectedTestimonialIndex(null); setSelectedTargetGroupIndex(null); setSelectedServiceIndex(null); setSelectedBenefitIndex(null);
                                      }}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                );
                              }
                              const Icon = ELEMENT_KIND_ICONS[kind];
                              const isActive = selectedElementKind === kind;
                              return (
                                <button
                                  key={kind}
                                  type="button"
                                  onClick={() => { setSelectedElementKind(isActive ? null : kind); if (kind !== 'testimonials') setSelectedTestimonialIndex(null); if (kind !== 'target_groups_cards') setSelectedTargetGroupIndex(null); if (kind !== 'services_cards') setSelectedServiceIndex(null); if (kind !== 'benefits_cards') setSelectedBenefitIndex(null); if (kind !== 'pricing_cards') setSelectedPricingIndex(null); if (kind !== 'process_cards') setSelectedProcessStepIndex(null); if (kind !== 'faq_items') setSelectedFaqIndex(null); if (kind !== 'beratung_process') setSelectedBeratungProcessStepIndex(null); if (kind !== 'beratung_stats') setSelectedBeratungStatIndex(null); }}
                                  title={ELEMENT_KIND_LABELS[kind]}
                                  className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-colors ${isActive ? 'bg-[#cb530a] text-white border-[#cb530a]' : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:border-[#cb530a]/40'}`}
                                >
                                  <Icon className="w-4 h-4" />
                                </button>
                              );
                            })}
                          </div>
                          {/* Sub-Panel: Felder nur für die gewählte Kategorie */}
                          {selectedElementKind ? (
                            <div className="space-y-2 pt-1 border-t border-neutral-100">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{ELEMENT_KIND_LABELS[selectedElementKind]}</p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-[10px]"
                                  onClick={() => {
                                    const def = getDefaultPropsForSection(sec.type as LandingSectionType, template);
                                    setSections((prev) => {
                                      const next = [...prev];
                                      next[index] = { ...next[index], props: { ...def } };
                                      return next;
                                    });
                                  }}
                                >
                                  Auf Standard zurücksetzen
                                </Button>
                              </div>
                              {(() => {
                            const sectionDefaults = getDefaultPropsForSection(sec.type as LandingSectionType, template);
                            return getPropsByKind(editableProps, selectedElementKind, sec.type as LandingSectionType).map((field: EditablePropDef) => {
                            const rawValue = sec.props[field.key];
                            const fallback = (sectionDefaults[field.key] as string) ?? '';
                            const value = (field.key === 'customQuotes' && Array.isArray(rawValue))
                              ? (rawValue as string[]).join('\n')
                              : (field.key === 'highlightWords' && Array.isArray(rawValue))
                              ? (rawValue as string[]).join(', ')
                              : (rawValue !== undefined && rawValue !== null ? (rawValue as string) : fallback) ?? '';
                            if (field.key === 'highlightWords' && sec.type === 'website_beratung') {
                              return (
                                <div key={field.key}>
                                  <Label className="text-[10px] font-semibold">{field.label}</Label>
                                  <Input value={value} onChange={(e) => updateSectionProp(index, field.key, e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} className="mt-0.5 h-8 text-xs" placeholder="finanzielle Freiheit, 8 Wochen, ersten, Immobilie" />
                                </div>
                              );
                            }
                            if (field.key === 'customQuotes') {
                              return (
                                <div key={field.key}>
                                  <Label className="text-[10px] font-semibold">{field.label}</Label>
                                  <Textarea
                                    value={value}
                                    onChange={(e) => updateSectionProp(index, field.key, e.target.value.split('\n').filter(Boolean))}
                                    rows={8}
                                    className="mt-0.5 text-xs font-mono"
                                    placeholder="Ein Text pro Zeile"
                                  />
                                </div>
                              );
                            }
                            if (field.type === 'textarea') {
                              return (
                                <div key={field.key}>
                                  <Label className="text-[10px] font-semibold">{field.label}</Label>
                                  <Textarea value={value} onChange={(e) => updateSectionProp(index, field.key, e.target.value)} rows={2} className="mt-0.5 text-xs h-16" />
                                </div>
                              );
                            }
                            if (field.type === 'richtext') {
                              return (
                                <div key={field.key}>
                                  <RichTextEditor
                                    value={value}
                                    onChange={(html) => updateSectionProp(index, field.key, html)}
                                    label={field.label}
                                    placeholder="Text eingeben – Wörter markieren und oben Fett, Kursiv, Farbe oder Größe anwenden."
                                    minHeight="140px"
                                  />
                                </div>
                              );
                            }
                            if (field.type === 'color') {
                              return (
                                <div key={field.key} className="flex items-center gap-2">
                                  <Label className="text-[10px] font-semibold w-28 shrink-0">{field.label}</Label>
                                  <input type="color" value={value || '#cb530a'} onChange={(e) => updateSectionProp(index, field.key, e.target.value)} className="h-8 w-10 rounded border cursor-pointer shrink-0" />
                                  <Input value={value} onChange={(e) => updateSectionProp(index, field.key, e.target.value)} className="flex-1 h-8 text-xs font-mono" placeholder="#cb530a" />
                                </div>
                              );
                            }
                            if (field.type === 'image_array') {
                              const urls = (Array.isArray(sec.props[field.key]) ? sec.props[field.key] : []) as string[];
                              const setUrls = (next: string[]) => updateSectionProp(index, field.key, next);
                              return (
                                <div key={field.key}>
                                  <Label className="text-[10px] font-semibold">{field.label}</Label>
                                  <div className="mt-0.5 flex flex-wrap gap-2">
                                    {urls.map((url, i) => (
                                      <div key={i} className="flex flex-col items-center gap-1">
                                        <img src={url} alt="" className="h-14 w-20 rounded border object-cover" />
                                        <div className="flex gap-1">
                                          <Button type="button" variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => setUrls(urls.filter((_, j) => j !== i))}>Entfernen</Button>
                                        </div>
                                      </div>
                                    ))}
                                    <label className="cursor-pointer flex flex-col items-center justify-center h-14 w-20 rounded border border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100">
                                      <input type="file" accept={IMAGE_ACCEPT} className="sr-only" onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const err = validateImageFile(file);
                                        if (err) { alert(err); e.target.value = ''; return; }
                                        const fd = new FormData();
                                        fd.append('file', file);
                                        try {
                                          const res = await fetch('/api/admin/digital-products/upload-image', { method: 'POST', credentials: 'include', body: fd });
                                          const j = await res.json();
                                          if (j.url) setUrls([...urls, j.url]);
                                          else if (j.error) alert(j.error);
                                        } catch { alert('Upload fehlgeschlagen.'); }
                                        e.target.value = '';
                                      }} />
                                      <Plus className="w-5 h-5 text-neutral-400" />
                                      <span className="text-[10px] text-neutral-500">Bild</span>
                                    </label>
                                  </div>
                                  <p className="mt-1 text-[9px] text-muted-foreground">{IMAGE_UPLOAD_HINT}</p>
                                </div>
                              );
                            }
                            if (field.type === 'image') {
                              return (
                                <div key={field.key}>
                                  <Label className="text-[10px] font-semibold">{field.label}</Label>
                                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                    {value ? (
                                      <div className="flex items-center gap-2">
                                        <img src={value} alt="" className="h-14 w-20 rounded border object-cover" />
                                        <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => updateSectionProp(index, field.key, '')}>Entfernen</Button>
                                      </div>
                                    ) : null}
                                    <label className="cursor-pointer">
                                      <input
                                        type="file"
                                        accept={IMAGE_ACCEPT}
                                        className="sr-only"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;
                                          const err = validateImageFile(file);
                                          if (err) { alert(err); e.target.value = ''; return; }
                                          const fd = new FormData();
                                          fd.append('file', file);
                                          try {
                                            const res = await fetch('/api/admin/digital-products/upload-image', { method: 'POST', credentials: 'include', body: fd });
                                            const j = await res.json();
                                            if (j.url) updateSectionProp(index, field.key, j.url);
                                            else if (j.error) alert(j.error);
                                          } catch { alert('Upload fehlgeschlagen.'); }
                                          e.target.value = '';
                                        }}
                                      />
                                      <span className="inline-flex items-center justify-center rounded-md border border-input bg-background px-2 py-1.5 h-8 text-[10px] font-medium hover:bg-muted/50">
                                        {value ? 'Anderes Bild' : 'Bild hochladen'}
                                      </span>
                                    </label>
                                  </div>
                                  <p className="mt-1 text-[9px] text-muted-foreground">{IMAGE_UPLOAD_HINT}</p>
                                </div>
                              );
                            }
                            if (field.type === 'fontsize_responsive') {
                              const num = typeof rawValue === 'number' || (typeof rawValue === 'string' && /^\d+$/.test(rawValue as string)) ? Number(rawValue) : (field.key === 'headlineFontSizeDesktop' ? 48 : field.key === 'headlineFontSizeTablet' ? 32 : 20);
                              return (
                                <div key={field.key}>
                                  <Label className="text-[10px] font-semibold">{field.label}</Label>
                                  <Input type="number" min={8} max={120} value={num} onChange={(e) => updateSectionProp(index, field.key, e.target.value === '' ? undefined : Number(e.target.value))} className="mt-0.5 h-8 text-xs" placeholder="px" />
                                </div>
                              );
                            }
                            if (field.type === 'fontsize') {
                              return (
                                <div key={field.key}>
                                  <Label className="text-[10px] font-semibold">{field.label}</Label>
                                  <select value={value || 'medium'} onChange={(e) => updateSectionProp(index, field.key, e.target.value)} className="mt-0.5 h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                                    <option value="small">Klein</option>
                                    <option value="medium">Mittel</option>
                                    <option value="large">Groß</option>
                                  </select>
                                </div>
                              );
                            }
                            if (field.type === 'fontfamily') {
                              return (
                                <div key={field.key}>
                                  <Label className="text-[10px] font-semibold">{field.label}</Label>
                                  <select value={value || 'default'} onChange={(e) => updateSectionProp(index, field.key, e.target.value)} className="mt-0.5 h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                                    <option value="default">Standard</option>
                                    <option value="serif">Serif</option>
                                    <option value="sans">Sans</option>
                                  </select>
                                </div>
                              );
                            }
                            if (field.type === 'testimonials') {
                              const items = (Array.isArray(sec.props[field.key]) ? sec.props[field.key] : []) as TestimonialItem[];
                              const setItems = (next: TestimonialItem[]) => updateSectionProp(index, field.key, next);
                              const sel = selectedTestimonialIndex;
                              const editingIndex = sel !== null && sel >= 0 && sel < items.length ? sel : null;
                              return (
                                <div key={field.key} className="space-y-2">
                                  <Label className="text-[10px] font-semibold">{field.label}</Label>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {items.map((item, i) => (
                                      <button
                                        key={i}
                                        type="button"
                                        onClick={() => setSelectedTestimonialIndex(editingIndex === i ? null : i)}
                                        className={`shrink-0 px-2.5 py-1.5 rounded-md border text-[10px] font-medium transition-colors ${editingIndex === i ? 'bg-[#cb530a] text-white border-[#cb530a]' : 'bg-white border-neutral-200 hover:border-[#cb530a]/50'}`}
                                      >
                                        Stimme {i + 1}
                                      </button>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => { setItems([...items, { quote: '', name: '', title: '' }]); setSelectedTestimonialIndex(items.length); }}
                                      className="shrink-0 w-8 h-8 rounded-md border border-dashed border-neutral-300 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:border-[#cb530a]/40"
                                      title="Neue Stimme"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                  {editingIndex !== null && (
                                    <div className="p-2 rounded border border-neutral-200 bg-neutral-50 space-y-1.5">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-semibold">Stimme {editingIndex + 1} bearbeiten</span>
                                        <Button type="button" variant="ghost" size="sm" className="h-5 w-5 p-0 text-red-600" onClick={() => { setItems(items.filter((_, j) => j !== editingIndex)); setSelectedTestimonialIndex(null); }}>× Löschen</Button>
                                      </div>
                                      <Textarea value={items[editingIndex]?.quote || ''} onChange={(e) => { const n = [...items]; n[editingIndex] = { ...n[editingIndex] || {}, quote: e.target.value }; setItems(n); }} placeholder="Testimonial-Text" rows={2} className="text-xs h-12" />
                                      <div className="flex gap-1">
                                        <Input value={items[editingIndex]?.name || ''} onChange={(e) => { const n = [...items]; n[editingIndex] = { ...n[editingIndex] || {}, name: e.target.value }; setItems(n); }} placeholder="Name" className="h-7 text-xs flex-1" />
                                        <Input value={items[editingIndex]?.title || ''} onChange={(e) => { const n = [...items]; n[editingIndex] = { ...n[editingIndex] || {}, title: e.target.value }; setItems(n); }} placeholder="Branche" className="h-7 text-xs flex-1" />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {items[editingIndex]?.imageUrl ? (
                                          <div className="flex items-center gap-1">
                                            <img src={items[editingIndex].imageUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                                            <Button type="button" variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => { const n = [...items]; n[editingIndex] = { ...n[editingIndex] || {}, imageUrl: '' }; setItems(n); }}>Entfernen</Button>
                                          </div>
                                        ) : (
                                          <label className="cursor-pointer">
                                            <input type="file" accept={IMAGE_ACCEPT} className="sr-only" onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (!file) return;
                                              const err = validateImageFile(file);
                                              if (err) { alert(err); e.target.value = ''; return; }
                                              const fd = new FormData();
                                              fd.append('file', file);
                                              try {
                                                const res = await fetch('/api/admin/digital-products/upload-image', { method: 'POST', credentials: 'include', body: fd });
                                                const j = await res.json();
                                                if (j.url) { const n = [...items]; n[editingIndex] = { ...n[editingIndex] || {}, imageUrl: j.url }; setItems(n); }
                                              } catch { alert('Upload fehlgeschlagen.'); }
                                              e.target.value = '';
                                            }} />
                                            <span className="inline-flex h-7 items-center rounded border px-2 text-[10px]">Bild wählen</span>
                                          </label>
                                        )}
                                      </div>
                                      <p className="text-[9px] text-muted-foreground">{IMAGE_UPLOAD_HINT}</p>
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            if (field.type === 'target_groups') {
                              const items = (Array.isArray(sec.props[field.key]) ? sec.props[field.key] : []) as TargetGroupItem[];
                              const setItems = (next: TargetGroupItem[]) => updateSectionProp(index, field.key, next);
                              const sel = selectedTargetGroupIndex;
                              const editingIndex = sel !== null && sel >= 0 && sel < items.length ? sel : null;
                              return (
                                <div key={field.key} className="space-y-2">
                                  <Label className="text-[10px] font-semibold">{field.label}</Label>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {items.map((_, i) => (
                                      <button
                                        key={i}
                                        type="button"
                                        onClick={() => setSelectedTargetGroupIndex(editingIndex === i ? null : i)}
                                        className={`shrink-0 px-2.5 py-1.5 rounded-md border text-[10px] font-medium transition-colors ${editingIndex === i ? 'bg-[#cb530a] text-white border-[#cb530a]' : 'bg-white border-neutral-200 hover:border-[#cb530a]/50'}`}
                                      >
                                        Card {i + 1}
                                      </button>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => { setItems([...items, { title: '', description: '', image: '', imageSlogan: '' }]); setSelectedTargetGroupIndex(items.length); }}
                                      className="shrink-0 w-8 h-8 rounded-md border border-dashed border-neutral-300 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:border-[#cb530a]/40"
                                      title="Neue Card"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                  {editingIndex !== null && items[editingIndex] && (
                                    <div className="p-2 rounded border border-neutral-200 bg-neutral-50 space-y-1.5">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-semibold">Card {editingIndex + 1} bearbeiten</span>
                                        <Button type="button" variant="ghost" size="sm" className="h-5 w-5 p-0 text-red-600" onClick={() => { setItems(items.filter((_, j) => j !== editingIndex)); setSelectedTargetGroupIndex(null); }}>× Löschen</Button>
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Bild</Label>
                                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                          {items[editingIndex].image ? (
                                            <div className="flex items-center gap-2">
                                              <img src={items[editingIndex].image} alt="" className="h-14 w-20 rounded border object-cover" />
                                              <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => { const n = [...items]; n[editingIndex] = { ...n[editingIndex], image: '' }; setItems(n); }}>Entfernen</Button>
                                            </div>
                                          ) : null}
                                          <label className="cursor-pointer">
                                            <input type="file" accept={IMAGE_ACCEPT} className="sr-only" onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (!file) return;
                                              const err = validateImageFile(file);
                                              if (err) { alert(err); e.target.value = ''; return; }
                                              const fd = new FormData();
                                              fd.append('file', file);
                                              try {
                                                const res = await fetch('/api/admin/digital-products/upload-image', { method: 'POST', credentials: 'include', body: fd });
                                                const j = await res.json();
                                                if (j.url) { const n = [...items]; n[editingIndex] = { ...n[editingIndex], image: j.url }; setItems(n); }
                                              } catch { alert('Upload fehlgeschlagen.'); }
                                              e.target.value = '';
                                            }} />
                                            <span className="inline-flex items-center justify-center rounded-md border border-input bg-background px-2 py-1.5 h-8 text-[10px] font-medium hover:bg-muted/50">Bild hochladen</span>
                                          </label>
                                        </div>
                                        <p className="mt-1 text-[9px] text-muted-foreground">{IMAGE_UPLOAD_HINT}</p>
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Slogan auf dem Bild (oben)</Label>
                                        <Input value={items[editingIndex].imageSlogan ?? ''} onChange={(e) => { const n = [...items]; n[editingIndex] = { ...n[editingIndex], imageSlogan: e.target.value }; setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="z. B. Quereinsteiger" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Überschrift (unter dem Bild)</Label>
                                        <Input value={items[editingIndex].title ?? ''} onChange={(e) => { const n = [...items]; n[editingIndex] = { ...n[editingIndex], title: e.target.value }; setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="Titel der Card" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Text</Label>
                                        <Textarea value={items[editingIndex].description ?? ''} onChange={(e) => { const n = [...items]; n[editingIndex] = { ...n[editingIndex], description: e.target.value }; setItems(n); }} rows={3} className="mt-0.5 text-xs" placeholder="Beschreibung" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            if (field.type === 'services') {
                              const sectionDefaults = getDefaultPropsForSection(sec.type as LandingSectionType, template);
                              const defaultServices = (Array.isArray(sectionDefaults.services) ? sectionDefaults.services : []) as ServiceItem[];
                              const rawItems = (Array.isArray(sec.props[field.key]) ? sec.props[field.key] : []) as ServiceItem[];
                              const setItems = (next: ServiceItem[]) => updateSectionProp(index, field.key, next);
                              const sel = selectedServiceIndex;
                              const emptyService = (): ServiceItem => ({ title: '', description: '', image: '', imageSlogan: '', buttonText: 'Mehr erfahren', href: '#' });
                              const padded: ServiceItem[] = rawItems.length >= 6
                                ? rawItems
                                : rawItems.length > 0
                                  ? [...rawItems, ...Array.from({ length: 6 - rawItems.length }, emptyService)]
                                  : (defaultServices.length >= 6 ? defaultServices : [...defaultServices, ...Array.from({ length: Math.max(0, 6 - defaultServices.length) }, emptyService)]);
                              const editingIndex = sel !== null && sel >= 0 && sel < padded.length ? sel : null;
                              return (
                                <div key={field.key} className="space-y-2">
                                  {editingIndex !== null && padded[editingIndex] ? (
                                    <div className="p-2 rounded border border-neutral-200 bg-neutral-50 space-y-1.5">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-semibold">Card {editingIndex + 1} bearbeiten</span>
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Bild</Label>
                                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                          {padded[editingIndex].image ? (
                                            <div className="flex items-center gap-2">
                                              <img src={padded[editingIndex].image} alt="" className="h-14 w-20 rounded border object-cover" />
                                              <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, image: '' } : item)); setItems(n); }}>Entfernen</Button>
                                            </div>
                                          ) : null}
                                          <label className="cursor-pointer">
                                            <input type="file" accept={IMAGE_ACCEPT} className="sr-only" onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (!file) return;
                                              const err = validateImageFile(file);
                                              if (err) { alert(err); e.target.value = ''; return; }
                                              const fd = new FormData();
                                              fd.append('file', file);
                                              try {
                                                const res = await fetch('/api/admin/digital-products/upload-image', { method: 'POST', credentials: 'include', body: fd });
                                                const j = await res.json();
                                                if (j.url) { const n = padded.map((item, idx) => (idx === editingIndex ? { ...item, image: j.url } : item)); setItems(n); }
                                              } catch { alert('Upload fehlgeschlagen.'); }
                                              e.target.value = '';
                                            }} />
                                            <span className="inline-flex items-center justify-center rounded-md border border-input bg-background px-2 py-1.5 h-8 text-[10px] font-medium hover:bg-muted/50">Bild hochladen</span>
                                          </label>
                                        </div>
                                        <p className="mt-1 text-[9px] text-muted-foreground">{IMAGE_UPLOAD_HINT}</p>
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Slogan auf dem Bild</Label>
                                        <Input value={padded[editingIndex].imageSlogan ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, imageSlogan: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="z. B. Deal-Flow" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Überschrift (Headline)</Label>
                                        <Input value={padded[editingIndex].title ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, title: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="Titel der Card" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Icon (Emoji)</Label>
                                        <Input value={padded[editingIndex].icon ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, icon: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="🔑" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Text (Beschreibung)</Label>
                                        <Textarea value={padded[editingIndex].description ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, description: e.target.value } : item)); setItems(n); }} rows={3} className="mt-0.5 text-xs" placeholder="Beschreibung" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Button-Text</Label>
                                        <Input value={padded[editingIndex].buttonText ?? 'Mehr erfahren'} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, buttonText: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="Mehr erfahren" />
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-[10px] text-muted-foreground">Card in der Toolbar (Card 1–6) auswählen.</p>
                                  )}
                                </div>
                              );
                            }
                            if (field.type === 'benefits') {
                              const sectionDefaults = getDefaultPropsForSection(sec.type as LandingSectionType, template);
                              const defaultBenefits = (Array.isArray(sectionDefaults.benefits) ? sectionDefaults.benefits : []) as BenefitItem[];
                              const rawItems = (Array.isArray(sec.props[field.key]) ? sec.props[field.key] : []) as BenefitItem[];
                              const setItems = (next: BenefitItem[]) => updateSectionProp(index, field.key, next);
                              const sel = selectedBenefitIndex;
                              const emptyBenefit = (): BenefitItem => ({ icon: 'MapPin', iconColor: '#cb530a', title: '', description: '' });
                              const padded: BenefitItem[] = rawItems.length >= 6
                                ? rawItems
                                : rawItems.length > 0
                                  ? [...rawItems, ...Array.from({ length: 6 - rawItems.length }, emptyBenefit)]
                                  : (defaultBenefits.length >= 6 ? defaultBenefits : [...defaultBenefits, ...Array.from({ length: Math.max(0, 6 - defaultBenefits.length) }, emptyBenefit)]);
                              const editingIndex = sel !== null && sel >= 0 && sel < padded.length ? sel : null;
                              return (
                                <div key={field.key} className="space-y-2">
                                  {editingIndex !== null && padded[editingIndex] ? (
                                    <div className="p-2 rounded border border-neutral-200 bg-neutral-50 space-y-1.5">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-semibold">Card {editingIndex + 1} bearbeiten</span>
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Icon (Lucide-Name)</Label>
                                        <Input value={padded[editingIndex].icon ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, icon: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="z.B. MapPin, CheckCircle2, Zap" />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Label className="text-[10px] font-semibold w-28 shrink-0">Icon-Farbe</Label>
                                        <input type="color" value={padded[editingIndex].iconColor || '#cb530a'} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, iconColor: e.target.value } : item)); setItems(n); }} className="h-8 w-10 rounded border cursor-pointer shrink-0" />
                                        <Input value={padded[editingIndex].iconColor ?? '#cb530a'} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, iconColor: e.target.value } : item)); setItems(n); }} className="flex-1 h-8 text-xs font-mono" placeholder="#cb530a" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Headline</Label>
                                        <Input value={padded[editingIndex].title ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, title: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="Überschrift" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Text</Label>
                                        <Textarea value={padded[editingIndex].description ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, description: e.target.value } : item)); setItems(n); }} rows={3} className="mt-0.5 text-xs" placeholder="Beschreibung" />
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-[10px] text-muted-foreground">Card in der Toolbar (Card 1–6) auswählen.</p>
                                  )}
                                </div>
                              );
                            }
                            if (field.type === 'pricing_cards') {
                              const sectionDefaults = getDefaultPropsForSection(sec.type as LandingSectionType, template);
                              const defaultCards = (Array.isArray(sectionDefaults.pricingCards) ? sectionDefaults.pricingCards : []) as PricingCardItem[];
                              const rawItems = (Array.isArray(sec.props[field.key]) ? sec.props[field.key] : []) as PricingCardItem[];
                              const setItems = (next: PricingCardItem[]) => updateSectionProp(index, field.key, next);
                              const sel = selectedPricingIndex;
                              const emptyPricing = (): PricingCardItem => ({ title: '', description: '', price: '', recommendation: '', bulletPoints: [], buttonText: 'Jetzt Platz sichern', popular: false });
                              const padded: PricingCardItem[] = rawItems.length >= 3 ? rawItems : rawItems.length > 0 ? [...rawItems, ...Array.from({ length: 3 - rawItems.length }, emptyPricing)] : (defaultCards.length >= 3 ? defaultCards : [...defaultCards, ...Array.from({ length: Math.max(0, 3 - defaultCards.length) }, emptyPricing)]);
                              const editingIndex = sel !== null && sel >= 0 && sel < padded.length ? sel : null;
                              return (
                                <div key={field.key} className="space-y-2">
                                  {editingIndex !== null && padded[editingIndex] ? (
                                    <div className="p-2 rounded border border-neutral-200 bg-neutral-50 space-y-1.5">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-semibold">Card {editingIndex + 1} bearbeiten</span>
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Beschreibung (z. B. Einstieg)</Label>
                                        <Input value={padded[editingIndex].title ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, title: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="Einstieg" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Unterbeschreibung</Label>
                                        <Textarea value={padded[editingIndex].description ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, description: e.target.value } : item)); setItems(n); }} rows={2} className="mt-0.5 text-xs" placeholder="Systematischer Start in Immobilien als Kapitalanlage" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Preis</Label>
                                        <Input value={padded[editingIndex].price ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, price: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="auf Anfrage" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Empfehlung (unter dem Preis)</Label>
                                        <Input value={padded[editingIndex].recommendation ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, recommendation: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="z. B. Ideal für Quereinsteiger" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Bullet Points (ein Punkt pro Zeile)</Label>
                                        <Textarea value={(padded[editingIndex].bulletPoints ?? []).join('\n')} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, bulletPoints: e.target.value.split('\n').filter(Boolean) } : item)); setItems(n); }} rows={5} className="mt-0.5 text-xs font-mono" placeholder="Ein Punkt pro Zeile" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Button-Text (Verlinkung intern)</Label>
                                        <Input value={padded[editingIndex].buttonText ?? 'Jetzt Platz sichern'} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, buttonText: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="Jetzt Platz sichern" />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <input type="checkbox" id={`pricing-popular-${editingIndex}`} checked={!!padded[editingIndex].popular} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, popular: e.target.checked } : item)); setItems(n); }} className="rounded border-input" />
                                        <Label htmlFor={`pricing-popular-${editingIndex}`} className="text-[10px] font-semibold">„Stolz empfohlen“-Badge anzeigen</Label>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-[10px] text-muted-foreground">Card in der Toolbar (Card 1–3) auswählen.</p>
                                  )}
                                </div>
                              );
                            }
                            if (field.type === 'process_steps') {
                              const sectionDefaults = getDefaultPropsForSection(sec.type as LandingSectionType, template);
                              const defaultSteps = (Array.isArray(sectionDefaults.processSteps) ? sectionDefaults.processSteps : []) as ProcessStepItem[];
                              const rawItems = (Array.isArray(sec.props[field.key]) ? sec.props[field.key] : []) as ProcessStepItem[];
                              const setItems = (next: ProcessStepItem[]) => updateSectionProp(index, field.key, next);
                              const emptyStep = (): ProcessStepItem => ({ number: '1', title: '', description: '', ctaText: '', href: '' });
                              const padded: ProcessStepItem[] = rawItems.length >= 4 ? rawItems.slice(0, 4) : rawItems.length > 0 ? [...rawItems, ...Array.from({ length: 4 - rawItems.length }, (_, i) => ({ ...emptyStep(), number: String(rawItems.length + i + 1) }))] : (defaultSteps.length >= 4 ? defaultSteps : [...defaultSteps, ...Array.from({ length: Math.max(0, 4 - defaultSteps.length) }, (_, i) => ({ ...emptyStep(), number: String(defaultSteps.length + i + 1) }))]);
                              const editingIndex = selectedProcessStepIndex !== null && selectedProcessStepIndex >= 0 && selectedProcessStepIndex < padded.length ? selectedProcessStepIndex : null;
                              return (
                                <div key={field.key} className="space-y-2">
                                  {editingIndex !== null && padded[editingIndex] ? (
                                    <div className="p-2 rounded border border-neutral-200 bg-neutral-50 space-y-1.5">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-semibold">Card {editingIndex + 1} (Nummer-Badge, Headline, Text{editingIndex === 3 ? ', Button' : ''})</span>
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Nummer (Badge)</Label>
                                        <Input value={padded[editingIndex].number ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, number: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="1" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Headline</Label>
                                        <Input value={padded[editingIndex].title ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, title: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="z. B. Kennenlernen" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Text</Label>
                                        <Textarea value={padded[editingIndex].description ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, description: e.target.value } : item)); setItems(n); }} rows={3} className="mt-0.5 text-xs" placeholder="Beschreibung des Schritts" />
                                      </div>
                                      {editingIndex === 3 && (
                                        <>
                                          <div>
                                            <Label className="text-[10px] font-semibold">Button-Text (nur Card 4)</Label>
                                            <Input value={padded[editingIndex].ctaText ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, ctaText: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="Jetzt Platz sichern" />
                                          </div>
                                          <div>
                                            <Label className="text-[10px] font-semibold">Button-Link (z. B. /quiz oder #section-xy)</Label>
                                            <Input value={padded[editingIndex].href ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, href: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="/quiz" />
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-[10px] text-muted-foreground">Card unten auswählen (Schritt 1–4).</p>
                                  )}
                                </div>
                              );
                            }
                            if (field.type === 'beratung_process_steps') {
                              const sectionDefaults = getDefaultPropsForSection(sec.type as LandingSectionType, template);
                              const defaultSteps = (Array.isArray(sectionDefaults.processSteps) ? sectionDefaults.processSteps : []) as BeratungProcessStepItem[];
                              const rawItems = (Array.isArray(sec.props[field.key]) ? sec.props[field.key] : []) as BeratungProcessStepItem[];
                              const setItems = (next: BeratungProcessStepItem[]) => updateSectionProp(index, field.key, next);
                              const emptyStep = (): BeratungProcessStepItem => ({ number: '1', title: '', description: '', icon: '', ctaText: '', href: '' });
                              const padded: BeratungProcessStepItem[] = rawItems.length >= 4 ? rawItems.slice(0, 4) : rawItems.length > 0 ? [...rawItems, ...Array.from({ length: 4 - rawItems.length }, (_, i) => ({ ...emptyStep(), number: String(rawItems.length + i + 1) }))] : (defaultSteps.length >= 4 ? defaultSteps : [...defaultSteps, ...Array.from({ length: Math.max(0, 4 - defaultSteps.length) }, (_, i) => ({ ...emptyStep(), number: String(defaultSteps.length + i + 1) }))]);
                              const editingIndex = selectedBeratungProcessStepIndex !== null && selectedBeratungProcessStepIndex >= 0 && selectedBeratungProcessStepIndex < padded.length ? selectedBeratungProcessStepIndex : null;
                              return (
                                <div key={field.key} className="space-y-2">
                                  <div className="flex flex-wrap gap-1">
                                    {[0, 1, 2, 3].map((cardIdx) => {
                                      const isActive = editingIndex === cardIdx;
                                      return (
                                        <button key={cardIdx} type="button" onClick={() => { setSelectedBeratungProcessStepIndex(isActive ? null : cardIdx); }} title={`Schritt ${cardIdx + 1}`} className={`shrink-0 px-2 py-1.5 rounded-md border text-[10px] font-medium transition-colors ${isActive ? 'bg-[#cb530a] text-white border-[#cb530a]' : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#cb530a]/50'}`}>
                                          Schritt {cardIdx + 1}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {editingIndex !== null && padded[editingIndex] ? (
                                    <div className="p-2 rounded border border-neutral-200 bg-neutral-50 space-y-1.5">
                                      <div>
                                        <Label className="text-[10px] font-semibold">Nummer (Badge)</Label>
                                        <Input value={padded[editingIndex].number ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, number: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="1" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Icon (Emoji)</Label>
                                        <Input value={padded[editingIndex].icon ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, icon: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="💬" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Headline</Label>
                                        <Input value={padded[editingIndex].title ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, title: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="z. B. Individuelle Beratung" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Text</Label>
                                        <Textarea value={padded[editingIndex].description ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, description: e.target.value } : item)); setItems(n); }} rows={3} className="mt-0.5 text-xs" placeholder="Beschreibung" />
                                      </div>
                                      {editingIndex === 3 && (
                                        <>
                                          <div>
                                            <Label className="text-[10px] font-semibold">Button-Text (nur Schritt 4)</Label>
                                            <Input value={padded[editingIndex].ctaText ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, ctaText: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="Zum Experten-Bereich" />
                                          </div>
                                          <div>
                                            <Label className="text-[10px] font-semibold">Button-Link</Label>
                                            <Input value={padded[editingIndex].href ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, href: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="/experts" />
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-[10px] text-muted-foreground">Schritt 1–4 oben auswählen.</p>
                                  )}
                                </div>
                              );
                            }
                            if (field.type === 'beratung_stats') {
                              const sectionDefaults = getDefaultPropsForSection(sec.type as LandingSectionType, template);
                              const defaultStats = (Array.isArray(sectionDefaults.stats) ? sectionDefaults.stats : []) as StatItem[];
                              const rawItems = (Array.isArray(sec.props[field.key]) ? sec.props[field.key] : []) as StatItem[];
                              const setItems = (next: StatItem[]) => updateSectionProp(index, field.key, next);
                              const emptyStat = (): StatItem => ({ value: 0, label: '', suffix: '', icon: '' });
                              const padded: StatItem[] = rawItems.length >= 4 ? rawItems.slice(0, 4) : rawItems.length > 0 ? [...rawItems, ...Array.from({ length: 4 - rawItems.length }, () => emptyStat())] : (defaultStats.length >= 4 ? defaultStats : [...defaultStats, ...Array.from({ length: Math.max(0, 4 - defaultStats.length) }, () => emptyStat())]);
                              const editingIndex = selectedBeratungStatIndex !== null && selectedBeratungStatIndex >= 0 && selectedBeratungStatIndex < padded.length ? selectedBeratungStatIndex : null;
                              return (
                                <div key={field.key} className="space-y-2">
                                  <div className="flex flex-wrap gap-1">
                                    {[0, 1, 2, 3].map((cardIdx) => {
                                      const isActive = editingIndex === cardIdx;
                                      return (
                                        <button key={cardIdx} type="button" onClick={() => { setSelectedBeratungStatIndex(isActive ? null : cardIdx); }} title={`Card ${cardIdx + 1}`} className={`shrink-0 px-2 py-1.5 rounded-md border text-[10px] font-medium transition-colors ${isActive ? 'bg-[#cb530a] text-white border-[#cb530a]' : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#cb530a]/50'}`}>
                                          Card {cardIdx + 1}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {editingIndex !== null && padded[editingIndex] ? (
                                    <div className="p-2 rounded border border-neutral-200 bg-neutral-50 space-y-1.5">
                                      <div>
                                        <Label className="text-[10px] font-semibold">Icon (Emoji)</Label>
                                        <Input value={padded[editingIndex].icon ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, icon: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="🏠" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Zahl (Wert)</Label>
                                        <Input type="number" value={padded[editingIndex].value ?? 0} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, value: parseInt(e.target.value, 10) || 0 } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="230" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Suffix (z. B. +)</Label>
                                        <Input value={padded[editingIndex].suffix ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, suffix: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="+" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Label (Beschreibung)</Label>
                                        <Input value={padded[editingIndex].label ?? ''} onChange={(e) => { const n = padded.map((item, j) => (j === editingIndex ? { ...item, label: e.target.value } : item)); setItems(n); }} className="mt-0.5 h-8 text-xs" placeholder="Zufriedene Kunden" />
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-[10px] text-muted-foreground">Card 1–4 oben auswählen.</p>
                                  )}
                                </div>
                              );
                            }
                            if (field.type === 'faq_items') {
                              const rawFaqs = (Array.isArray(sec.props[field.key]) ? sec.props[field.key] : []) as FaqItem[];
                              const setFaqs = (next: FaqItem[]) => updateSectionProp(index, field.key, next);
                              const editingIndex = selectedFaqIndex !== null && selectedFaqIndex >= 0 && selectedFaqIndex < rawFaqs.length ? selectedFaqIndex : null;
                              return (
                                <div key={field.key} className="space-y-2">
                                  {editingIndex !== null && rawFaqs[editingIndex] ? (
                                    <div className="p-2 rounded border border-neutral-200 bg-neutral-50 space-y-1.5">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-semibold">Frage {editingIndex + 1} bearbeiten</span>
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Frage</Label>
                                        <Input value={rawFaqs[editingIndex].question ?? ''} onChange={(e) => { const n = rawFaqs.map((item, j) => (j === editingIndex ? { ...item, question: e.target.value } : item)); setFaqs(n); }} className="mt-0.5 h-8 text-xs" placeholder="Frage eingeben" />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold">Antwort</Label>
                                        <Textarea value={rawFaqs[editingIndex].answer ?? ''} onChange={(e) => { const n = rawFaqs.map((item, j) => (j === editingIndex ? { ...item, answer: e.target.value } : item)); setFaqs(n); }} rows={4} className="mt-0.5 text-xs" placeholder="Antwort eingeben" />
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-[10px] text-muted-foreground">Tab (+) für neue Frage, bestehende Tabs anklicken zum Bearbeiten, Papierkorb zum Löschen.</p>
                                  )}
                                </div>
                              );
                            }
                            if (field.key === 'secondaryCtaHref' && sec.type === 'website_jeton_hero') {
                              return (
                                <div key={field.key}>
                                  <Label className="text-[10px] font-semibold">Mehr erfahren führt zu (Sektion)</Label>
                                  <select value={value || ''} onChange={(e) => updateSectionProp(index, field.key, e.target.value)} className="mt-0.5 h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                                    <option value="">— Keine (externer Link) —</option>
                                    {sections.map((s) => {
                                      if (s.id === sec.id) return null;
                                      return (
                                        <option key={s.id} value={`#section-${s.id}`}>
                                          {getSectionLabel(s.type as LandingSectionType, template)}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              );
                            }
                            return (
                              <div key={field.key}>
                                <Label className="text-[10px] font-semibold">{field.label}</Label>
                                <Input value={value} onChange={(e) => updateSectionProp(index, field.key, e.target.value)} className="mt-0.5 h-8 text-xs" placeholder={field.type === 'url' ? 'https://…' : ''} />
                              </div>
                            );
                          });
                            })()}
                            </div>
                          ) : (
                            <p className="text-[11px] text-muted-foreground">Element oben anklicken (z. B. Überschrift, Logo) zum Bearbeiten.</p>
                          )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Tracking & Pixel – nur bei Produkt-Landing, nicht bei Homepage */}
        {!homepageMode && (
        <div className="flex-shrink-0 border-t border-neutral-200 px-1 py-3">
          <button type="button" onClick={() => setTrackingOpen((o) => !o)} className="flex items-center gap-2 w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground">
            {trackingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <BarChart3 className="w-4 h-4" />
            Tracking &amp; Pixel
          </button>
          {trackingOpen && (
            <div className="mt-3 space-y-3 pl-6">
              <div className="space-y-2 max-h-28 overflow-y-auto">
                {pixels.map((px) => (
                  <div key={px.id} className="flex items-center justify-between gap-2 text-sm py-1.5 px-2 rounded border border-neutral-200 bg-neutral-50">
                    <span className="font-medium">{px.provider === 'facebook' ? 'Facebook Pixel' : px.provider === 'google_analytics' ? 'Google Analytics 4' : px.provider === 'google_ads' ? 'Google Ads' : px.provider === 'tiktok' ? 'TikTok Pixel' : 'Benutzerdefiniert'}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[100px]">{px.pixel_id || px.name || '–'}</span>
                    <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive shrink-0" onClick={async () => {
                      if (!confirm('Pixel entfernen?')) return;
                      await fetch(`/api/admin/digital-products/${productId}/pixels/${px.id}`, { method: 'DELETE', credentials: 'include' });
                      setPixels((prev) => prev.filter((x) => x.id !== px.id));
                    }}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-2">
                <select value={pixelForm.provider} onChange={(e) => setPixelForm((f) => ({ ...f, provider: e.target.value }))} className="h-8 rounded-md border border-input bg-background px-2 text-xs">
                  <option value="facebook">Facebook Pixel</option>
                  <option value="google_analytics">Google Analytics 4 (G-…)</option>
                  <option value="google_ads">Google Ads (AW-…)</option>
                  <option value="tiktok">TikTok Pixel</option>
                  <option value="custom">Benutzerdefiniert</option>
                </select>
                {pixelForm.provider !== 'custom' ? (
                  <Input value={pixelForm.pixel_id} onChange={(e) => setPixelForm((f) => ({ ...f, pixel_id: e.target.value }))} placeholder="Pixel- / Measurement-ID" className="h-8 text-xs" />
                ) : (
                  <Textarea value={pixelForm.script_content} onChange={(e) => setPixelForm((f) => ({ ...f, script_content: e.target.value }))} rows={2} className="text-xs font-mono" placeholder="<script>…</script>" />
                )}
                <Input value={pixelForm.name} onChange={(e) => setPixelForm((f) => ({ ...f, name: e.target.value }))} placeholder="Optional: Bezeichnung" className="h-8 text-xs" />
                <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={async () => {
                  if (pixelForm.provider !== 'custom' && !pixelForm.pixel_id.trim()) { alert('Bitte Pixel- bzw. Measurement-ID eintragen.'); return; }
                  if (pixelForm.provider === 'custom' && !pixelForm.script_content.trim()) { alert('Bitte Skript eintragen.'); return; }
                  const res = await fetch(`/api/admin/digital-products/${productId}/pixels`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: pixelForm.provider, pixel_id: pixelForm.pixel_id.trim() || null, name: pixelForm.name.trim() || null, script_content: pixelForm.provider === 'custom' ? pixelForm.script_content.trim() : null }) });
                  const j = await res.json();
                  if (j.data) { setPixels((prev) => [...prev, j.data]); setPixelForm({ provider: 'facebook', pixel_id: '', name: '', script_content: '' }); } else { alert(j.error || 'Fehler'); }
                }}>Pixel hinzufügen</Button>
              </div>
            </div>
          )}
        </div>
        )}

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={openPreview}
            disabled={!hasSavedOnce}
            title={hasSavedOnce ? 'Vorschau in neuem Tab' : 'Speichern um Vorschau zu sehen.'}
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
