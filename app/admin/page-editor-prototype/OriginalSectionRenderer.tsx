'use client';

import React from 'react';
import {
  ProductLandingHero,
  ProductLandingMarquee,
  MARQUEE_QUOTES_PARALLAX,
  ProductLandingTargetGroups,
  ProductLandingTestimonials,
  ProductLandingQuizCta,
  ProductLandingServices,
  ProductLandingBenefits,
  ProductLandingPricing,
  ProductLandingTrust,
  ProductLandingProcess,
  ProductLandingFaq,
  ProductLandingFooter,
  ProductLandingTestimonialsInfinite,
  ProductLandingBeratung,
  ProductLandingClaimParallax,
  ProductLandingWordsParallax,
  ProductLandingStackedSheets,
  ProductLandingImagesSlider,
} from '@/app/components/product-landing';
import type { LandingSection, LandingSectionType } from '@/types/landing-section';

const DEFAULT_PRIMARY = '#cb530a';
const PARALLAX_PRIMARY = '#C4D32A';
const PARALLAX_SECONDARY = '#60A917';

type Props = {
  section: LandingSection;
  index: number;
  isParallax: boolean;
  primary: string;
  secondary: string;
  productSlug: string;
  productTitle: string;
};

/** Rendert eine echte ProductLanding-Sektion (wie in der Vorschau/Live-Seite). */
export function OriginalSectionRenderer({
  section,
  index,
  isParallax,
  primary,
  secondary,
  productSlug,
  productTitle,
}: Props) {
  const sec = section;
  const p = sec.props || {};

  if (sec.type === 'website_jeton_hero') {
    const headline = (p.headline as string) || (isParallax ? 'Mit vermieteten' : productTitle);
    const headlineLine2 = (p.headlineLine2 as string) || (isParallax ? 'Immobilien in die' : undefined);
    const headlineLine3 = (p.headlineLine3 as string) || (isParallax ? 'finanzielle Freiheit.' : undefined);
    const heroBg = (p.backgroundImageUrl as string) || (isParallax ? '/images/slider2/1.png' : undefined);
    return (
      <ProductLandingHero
        variant={isParallax ? 'parallax' : 'default'}
        scrollDrivenHorizontalPan={false}
        headline={headline}
        headlineLine2={headlineLine2}
        headlineLine3={headlineLine3}
        ctaText={isParallax ? 'Go Expert' : undefined}
        ctaHref={isParallax ? '/experts' : '/login'}
        secondaryCtaText={isParallax ? 'Log in' : 'Mehr erfahren'}
        secondaryCtaHref={(p.secondaryCtaHref as string) || (isParallax ? '/checkout/basic' : '')}
        backgroundImageUrl={heroBg || undefined}
        overlayColor={(p.overlayColor as string) || primary}
        buttonPrimaryColor={primary}
        buttonSecondaryColor={secondary}
        logoUrl={p.logoUrl as string | undefined}
      />
    );
  }
  if (sec.type === 'website_marquee') {
    const text = p.text as string | undefined;
    const customQuotes = p.customQuotes as string[] | undefined;
    const bg = (p.backgroundColor as string) || (isParallax ? '#000000' : primary);
    const color = (p.textColor as string) || '#ffffff';
    if (isParallax && (!Array.isArray(customQuotes) || customQuotes.length === 0)) {
      return <ProductLandingMarquee customQuotes={MARQUEE_QUOTES_PARALLAX} backgroundColor={bg} textColor={color} />;
    }
    return <ProductLandingMarquee customText={text} customQuotes={customQuotes} backgroundColor={bg} textColor={color} />;
  }
  if (sec.type === 'website_target_groups') {
    const targetGroups = Array.isArray(p.targetGroups) ? p.targetGroups as import('@/types/landing-section').TargetGroupItem[] : undefined;
    return <ProductLandingTargetGroups variant="coaching" primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} targetGroups={targetGroups} />;
  }
  if (sec.type === 'website_testimonials') {
    return <ProductLandingTestimonials primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} testimonials={p.testimonials as import('@/types/landing-section').TestimonialItem[] | undefined} />;
  }
  if (sec.type === 'website_quiz_cta') {
    return <ProductLandingQuizCta productSlug={productSlug} primaryColor={primary} secondaryColor={secondary} title={p.title as string | undefined} subtitle={p.subtitle as string | undefined} buttonText={p.buttonText as string | undefined} />;
  }
  if (sec.type === 'website_services') {
    return <ProductLandingServices variant="coaching" primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} services={p.services as import('@/types/landing-section').ServiceItem[] | undefined} />;
  }
  if (sec.type === 'website_benefits') {
    return <ProductLandingBenefits variant="coaching" primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} benefits={p.benefits as import('@/types/landing-section').BenefitItem[] | undefined} />;
  }
  if (sec.type === 'website_pricing') {
    return <ProductLandingPricing primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} pricingCards={p.pricingCards as import('@/types/landing-section').PricingCardItem[] | undefined} />;
  }
  if (sec.type === 'website_trust') {
    return <ProductLandingTrust primaryColor={primary} secondaryColor={secondary} sealText={p.sealText as string | undefined} sectionTitle={p.sectionTitle as string | undefined} bodyHtml={p.bodyHtml as string | undefined} buttonText={p.buttonText as string | undefined} />;
  }
  if (sec.type === 'website_process') {
    const processSteps = (Array.isArray(p.processSteps) ? p.processSteps : []) as import('@/types/landing-section').ProcessStepItem[];
    const steps = processSteps.length >= 4 ? processSteps.slice(0, 4).map((s, i) => ({ ...s, icon: ['💬', '📋', '✅', '🚀'][i] ?? '🚀' })) : undefined;
    return <ProductLandingProcess variant="coaching" primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} steps={steps} />;
  }
  if (sec.type === 'website_faq') {
    const faqs = (Array.isArray(p.faqs) ? p.faqs : []) as import('@/types/landing-section').FaqItem[];
    return <ProductLandingFaq primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} faqs={faqs.length > 0 ? faqs : undefined} />;
  }
  if (sec.type === 'website_footer') {
    return <ProductLandingFooter variant="coaching" primaryColor={primary} secondaryColor={secondary} copyrightText={p.copyrightText as string | undefined} sublineText={p.sublineText as string | undefined} logoUrl={p.logoUrl as string | undefined} />;
  }
  if (sec.type === 'website_testimonials_infinite') {
    return <ProductLandingTestimonialsInfinite primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} testimonials={p.testimonials as import('@/types/landing-section').TestimonialItem[] | undefined} backgroundSliderImages={Array.isArray(p.backgroundSliderImages) ? p.backgroundSliderImages as string[] : undefined} />;
  }
  if (sec.type === 'website_beratung') {
    return (
      <ProductLandingBeratung
        primaryColor={primary}
        secondaryColor={secondary}
        sectionTitle={p.sectionTitle as string | undefined}
        highlightWords={p.highlightWords as string[] | string | undefined}
        processHeadline={p.processHeadline as string | undefined}
        processBadgeColor={p.processBadgeColor as string | undefined}
        processSteps={p.processSteps as import('@/types/landing-section').BeratungProcessStepItem[] | undefined}
        statsHeadline={p.statsHeadline as string | undefined}
        statsSubheadline={p.statsSubheadline as string | undefined}
        stats={p.stats as import('@/types/landing-section').StatItem[] | undefined}
      />
    );
  }
  if (sec.type === 'website_claim_parallax') {
    return (
      <ProductLandingClaimParallax
        primaryColor={primary}
        secondaryColor={secondary}
        claimHeadlineLine1={p.claimHeadlineLine1 as string | undefined}
        claimHeadlineLine2={p.claimHeadlineLine2 as string | undefined}
        ctaText={p.ctaText as string | undefined}
        listPhaseSidebarText={p.listPhaseSidebarText as string | undefined}
        cardLabel1={p.cardLabel1 as string | undefined}
        cardLabel2={p.cardLabel2 as string | undefined}
        cardLabel3={p.cardLabel3 as string | undefined}
        cardLabel4={p.cardLabel4 as string | undefined}
        card1ImageUrl={p.card1ImageUrl as string | undefined}
        card1TrustText={p.card1TrustText as string | undefined}
        card1ButtonText={p.card1ButtonText as string | undefined}
        card2Line1={p.card2Line1 as string | undefined}
        card2Line2={p.card2Line2 as string | undefined}
        card2StatusText={p.card2StatusText as string | undefined}
        card3ImageUrl={p.card3ImageUrl as string | undefined}
        card3OverlayText={p.card3OverlayText as string | undefined}
        card4NumberText={p.card4NumberText as string | undefined}
        card4ContextText={p.card4ContextText as string | undefined}
        card4ButtonText={p.card4ButtonText as string | undefined}
        card1TextColor={p.card1TextColor as string | undefined}
        card2TextColor={p.card2TextColor as string | undefined}
        card3TextColor={p.card3TextColor as string | undefined}
        card4TextColor={p.card4TextColor as string | undefined}
        card1TextSize={p.card1TextSize as number | string | undefined}
        card2TextSize={p.card2TextSize as number | string | undefined}
        card3TextSize={p.card3TextSize as number | string | undefined}
        card4TextSize={p.card4TextSize as number | string | undefined}
        card1Icon={p.card1Icon as string | undefined}
        card2Icon={p.card2Icon as string | undefined}
        card3Icon={p.card3Icon as string | undefined}
        card4Icon={p.card4Icon as string | undefined}
        card1IconColor={p.card1IconColor as string | undefined}
        card2IconColor={p.card2IconColor as string | undefined}
        card3IconColor={p.card3IconColor as string | undefined}
        card4IconColor={p.card4IconColor as string | undefined}
      />
    );
  }
  if (sec.type === 'website_words_parallax') {
    return <ProductLandingWordsParallax primaryColor={primary} secondaryColor={secondary} word1={p.word1 as string | undefined} word2={p.word2 as string | undefined} word3={p.word3 as string | undefined} />;
  }
  if (sec.type === 'website_stacked_sheets') {
    return <ProductLandingStackedSheets primaryColor={primary} secondaryColor={secondary} sheet1Title={p.sheet1Title as string | undefined} sheet1Body={p.sheet1Body as string | undefined} sheet2Title={p.sheet2Title as string | undefined} sheet2Body={p.sheet2Body as string | undefined} sheet3Title={p.sheet3Title as string | undefined} sheet3Body={p.sheet3Body as string | undefined} />;
  }
  if (sec.type === 'website_images_slider') {
    return <ProductLandingImagesSlider primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} ctaText={p.ctaText as string | undefined} ctaHref={(p.ctaHref as string) || '/experts'} />;
  }
  return (
    <section className="py-8 px-4 bg-neutral-100 text-neutral-500 text-sm">
      Unbekannte Sektion: {(sec as LandingSection).type}
    </section>
  );
}
