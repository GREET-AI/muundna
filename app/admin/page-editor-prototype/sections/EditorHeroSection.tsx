'use client';

import React from 'react';
import Image from 'next/image';
import { EditableBlock } from '../EditableBlock';
import type { EditorStyle } from '../PageEditorContext';
import type { LandingTemplate } from '@/types/landing-section';

const HERO_BG = '/images/slider2/1.png';

type EditorHeroSectionProps = {
  sectionIndex: number;
  props: Record<string, unknown>;
  getStyle: (sectionIndex: number, propKey: string) => EditorStyle;
  onSelect: (sectionIndex: number, propKey: string) => void;
  selectedElement: { sectionIndex: number; propKey: string } | null;
  template: LandingTemplate;
  textEditMode?: boolean;
  onPropChange?: (propKey: string, value: string) => void;
};

/** Overlay wie JetonStyleHeroSection: Standard = Gradient mit Overlay-Farbe + Transparenz, Parallax = grüner Gradient. */
function getOverlayStyle(template: LandingTemplate, overlayColor: string) {
  if (template === 'parallax') {
    return { background: 'linear-gradient(to bottom right, #C4D32A, #9BCB6B, #60A917)' };
  }
  const overlay = overlayColor || '#cb530a';
  return { background: `linear-gradient(to bottom right, ${overlay}80, ${overlay}66, rgba(0,0,0,0.6))` };
}

export function EditorHeroSection({
  sectionIndex,
  props: p,
  getStyle,
  onSelect,
  selectedElement,
  template,
  textEditMode,
  onPropChange,
}: EditorHeroSectionProps) {
  const headline = (p.headline as string) ?? 'Mit vermieteten';
  const headlineLine2 = (p.headlineLine2 as string) ?? 'Immobilien in die';
  const headlineLine3 = (p.headlineLine3 as string) ?? 'finanzielle Freiheit.';

  const isSelected = (key: string) =>
    selectedElement?.sectionIndex === sectionIndex && selectedElement?.propKey === key;
  const isEditing = (key: string) => !!textEditMode && isSelected(key);

  const bgSrc = (p.backgroundImageUrl as string)?.trim() || HERO_BG;
  const overlayColor = (p.overlayColor as string)?.trim() || '#cb530a';
  const overlayStyle = getOverlayStyle(template, overlayColor);

  const ctaText = (p.ctaText as string) ?? (template === 'parallax' ? 'Go Expert' : 'Jetzt Anfragen');
  const secondaryCtaText = (p.secondaryCtaText as string) ?? (template === 'parallax' ? 'Log in' : 'Mehr erfahren');
  const logoUrl = (p.logoUrl as string)?.trim() || '';
  const isParallax = template === 'parallax';
  const btnPrimary = isParallax ? '#C4D32A' : '#cb530a';
  const btnSecondary = isParallax ? 'rgba(255,255,255,0.9)' : '#f0e6e0';

  return (
    <section className="relative flex w-full flex-col overflow-hidden md:min-h-screen" style={{ minHeight: '100dvh' }}>
      <div className="absolute inset-0 z-0">
        {template === 'parallax' ? (
          <>
            <div className="absolute inset-0" style={overlayStyle} aria-hidden />
            <div className="absolute inset-0 opacity-10" aria-hidden>
              <Image src={bgSrc} alt="" fill className="object-cover object-center" />
            </div>
          </>
        ) : (
          <>
            <Image src={bgSrc} alt="" fill className="object-cover object-center" />
            <div className="absolute inset-0" style={overlayStyle} />
          </>
        )}
      </div>

      {/* Top-Bar: Logo links, Buttons rechts (wie JetonStyleHeroSection) */}
      <header className="relative z-20 flex w-full items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-4 md:px-8 md:py-4 md:gap-4 lg:px-12 lg:py-5 xl:px-16">
        <div className="flex shrink-0 items-center min-w-0">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" width={200} height={64} className="h-10 w-auto max-w-[120px] object-contain sm:h-12 md:h-14 lg:h-16 xl:h-20" unoptimized />
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <EditableBlock
            sectionIndex={sectionIndex}
            propKey="secondaryCtaText"
            value={secondaryCtaText}
            style={{
              ...getStyle(sectionIndex, 'secondaryCtaText'),
              color: getStyle(sectionIndex, 'secondaryCtaText').color ?? (isParallax ? 'inherit' : btnSecondary),
              backgroundColor: getStyle(sectionIndex, 'secondaryCtaText').backgroundColor ?? (isParallax ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)'),
            }}
            tag="span"
            className={`rounded-lg border-2 px-2.5 py-2 text-[11px] font-medium sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs md:px-4 md:py-2.5 md:text-sm lg:px-5 lg:py-3 lg:text-base cursor-pointer ${isParallax ? 'border-black/50' : 'border-white/90'}`}
            isSelected={isSelected('secondaryCtaText')}
            onClick={() => onSelect(sectionIndex, 'secondaryCtaText')}
            label="Log in / Sekundär-CTA"
          />
          <EditableBlock
            sectionIndex={sectionIndex}
            propKey="ctaText"
            value={ctaText}
            style={{
              ...getStyle(sectionIndex, 'ctaText'),
              color: getStyle(sectionIndex, 'ctaText').color ?? (isParallax ? btnPrimary : '#ffffff'),
              backgroundColor: getStyle(sectionIndex, 'ctaText').backgroundColor ?? (isParallax ? '#000000' : btnPrimary),
            }}
            tag="span"
            className={`rounded-lg border-2 px-2.5 py-2 text-[11px] font-semibold shadow-lg sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs md:px-4 md:py-2.5 md:text-sm lg:px-5 lg:py-3 lg:text-base cursor-pointer ${isParallax ? 'border-black/50' : 'border-[#cb530a]'}`}
            isSelected={isSelected('ctaText')}
            onClick={() => onSelect(sectionIndex, 'ctaText')}
            label="Go Expert / Haupt-CTA"
          />
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-start justify-end px-4 pb-12 pt-2 sm:px-5 sm:pb-16 sm:pt-4 md:px-8 md:pb-20 md:-translate-y-8 lg:px-12 lg:pb-28 lg:-translate-y-12 xl:px-16 xl:pb-32 xl:-translate-y-[75px]">
        <div className="w-full max-w-full min-w-0">
          <h1
            className={`text-left drop-shadow-lg leading-[1.15] sm:leading-[1.2] md:leading-tight ${template === 'parallax' ? 'font-medium' : 'font-bold'} text-[2.5rem] md:text-[3rem] lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5.5rem]`}
            style={{ color: template === 'parallax' ? '#000000' : '#ffffff' }}
          >
          <EditableBlock
            sectionIndex={sectionIndex}
            propKey="headline"
            value={headline}
            style={getStyle(sectionIndex, 'headline')}
            isSelected={isSelected('headline')}
            isEditing={isEditing('headline')}
            onBlur={onPropChange ? (v) => onPropChange('headline', v) : undefined}
            onClick={() => onSelect(sectionIndex, 'headline')}
            label="Headline Zeile 1"
          />
          <br />
          <EditableBlock
            sectionIndex={sectionIndex}
            propKey="headlineLine2"
            value={headlineLine2}
            style={getStyle(sectionIndex, 'headlineLine2')}
            isSelected={isSelected('headlineLine2')}
            isEditing={isEditing('headlineLine2')}
            onBlur={onPropChange ? (v) => onPropChange('headlineLine2', v) : undefined}
            onClick={() => onSelect(sectionIndex, 'headlineLine2')}
            label="Headline Zeile 2"
          />
          <br />
          <span className="font-bold">
            <EditableBlock
              sectionIndex={sectionIndex}
              propKey="headlineLine3"
              value={headlineLine3}
              style={getStyle(sectionIndex, 'headlineLine3')}
              isSelected={isSelected('headlineLine3')}
              isEditing={isEditing('headlineLine3')}
              onBlur={onPropChange ? (v) => onPropChange('headlineLine3', v) : undefined}
              onClick={() => onSelect(sectionIndex, 'headlineLine3')}
              label="Headline Zeile 3"
            />
          </span>
          </h1>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:gap-3 sm:mt-6 md:mt-6 md:gap-4">
            <EditableBlock
              sectionIndex={sectionIndex}
              propKey="secondaryCtaText"
              value={secondaryCtaText}
              style={{
                ...getStyle(sectionIndex, 'secondaryCtaText'),
                color: getStyle(sectionIndex, 'secondaryCtaText').color ?? (isParallax ? 'inherit' : btnSecondary),
                backgroundColor: getStyle(sectionIndex, 'secondaryCtaText').backgroundColor ?? (isParallax ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.1)'),
              }}
              tag="span"
              className={`inline-flex items-center justify-center rounded-lg border-2 py-2.5 px-3.5 text-xs font-medium sm:rounded-xl sm:py-3 sm:px-4 sm:text-sm md:py-3 md:px-5 lg:px-6 lg:py-3.5 lg:text-base cursor-pointer ${isParallax ? 'border-black/50' : 'border-white/90'}`}
              isSelected={isSelected('secondaryCtaText')}
              onClick={() => onSelect(sectionIndex, 'secondaryCtaText')}
              label="Sekundär-CTA"
            />
            <EditableBlock
              sectionIndex={sectionIndex}
              propKey="ctaText"
              value={ctaText}
              style={{
                ...getStyle(sectionIndex, 'ctaText'),
                color: getStyle(sectionIndex, 'ctaText').color ?? (isParallax ? btnPrimary : '#ffffff'),
                backgroundColor: getStyle(sectionIndex, 'ctaText').backgroundColor ?? (isParallax ? '#000000' : btnPrimary),
              }}
              tag="span"
              className={`inline-flex items-center justify-center rounded-lg border-2 py-2.5 px-3.5 text-xs font-semibold shadow-lg sm:rounded-xl sm:py-3 sm:px-4 sm:text-sm md:py-3 md:px-5 lg:px-6 lg:py-3.5 lg:text-base cursor-pointer ${isParallax ? 'border-black/50' : 'border-[#cb530a]'}`}
              isSelected={isSelected('ctaText')}
              onClick={() => onSelect(sectionIndex, 'ctaText')}
              label="Haupt-CTA"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
