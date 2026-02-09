import React from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/admin-auth';
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
import ProductLandingTracker from '@/app/components/ProductLandingTracker';
import LandingPixelsInjector from '@/app/components/LandingPixelsInjector';
import { FloatingDockParallax } from '@/app/components/FloatingDock';
import { getProductForPublic } from '@/lib/dp-product-public';

// Legacy: ein Tenant über Env; für Multi-Tenant URL /p/[tenant]/[slug] nutzen.
const DEFAULT_TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG ?? '';

type Props = { params: Promise<{ slug: string }>; searchParams?: Promise<{ preview?: string; tenant?: string }> };

type LandingSection = { id: string; type: string; props: Record<string, unknown> };

const DEFAULT_PRIMARY = '#cb530a';
const DEFAULT_SECONDARY = '#f0e6e0';
/** ImmoSparplan-Parallax-Vorlage: Farben wie Original */
const PARALLAX_PRIMARY = '#C4D32A';
const PARALLAX_SECONDARY = '#60A917';

/** Nur die 12 Website-Sektionen (1:1 wie Startseite) – alle full width. Theme-Farben aus Produkt. Für Homepage und Produkt-Landing nutzbar. */
export function ProductLandingSections({
  product,
  tenant,
  sections,
  productSlug,
  themePrimary,
  themeSecondary,
  landingTemplate,
}: {
  product: { title: string; description: string | null; price_cents: number; image_url: string | null; type: string };
  tenant: { name: string };
  sections: LandingSection[];
  productSlug: string;
  themePrimary?: string | null;
  themeSecondary?: string | null;
  landingTemplate?: string | null;
}) {
  const isParallax = landingTemplate === 'parallax';
  const primary = isParallax ? PARALLAX_PRIMARY : (themePrimary || DEFAULT_PRIMARY);
  const secondary = isParallax ? PARALLAX_SECONDARY : (themeSecondary || DEFAULT_SECONDARY);
  const elements = sections.map((sec, index) => {
        if (sec.type === 'website_jeton_hero') {
          const p = sec.props || {};
          const headline = (p.headline as string) || (isParallax ? 'Mit vermieteten' : product.title);
          const headlineLine2 = (p.headlineLine2 as string) || (isParallax ? 'Immobilien in die' : undefined);
          const headlineLine3 = (p.headlineLine3 as string) || (isParallax ? 'finanzielle Freiheit.' : undefined);
          const heroBg = (p.backgroundImageUrl as string) || (isParallax ? '/images/slider2/1.png' : undefined);
          return (
            <section key={sec.id} id={`section-${sec.id}`}>
              <ProductLandingHero
                variant={isParallax ? 'parallax' : 'default'}
                scrollDrivenHorizontalPan={false}
                headline={headline}
                headlineLine2={headlineLine2}
                headlineLine3={headlineLine3}
                ctaText={isParallax ? 'Go Expert' : undefined}
                ctaHref={isParallax ? '/experts' : '/login'}
                secondaryCtaText={isParallax ? 'Log in' : 'Mehr erfahren'}
                secondaryCtaHref={typeof p.secondaryCtaHref === 'string' ? p.secondaryCtaHref : (isParallax ? '/checkout/basic' : '')}
                backgroundImageUrl={heroBg}
                overlayColor={(p.overlayColor as string) || primary}
                buttonPrimaryColor={primary}
                buttonSecondaryColor={secondary}
                logoUrl={p.logoUrl as string | undefined}
              />
            </section>
          );
        }
        if (sec.type === 'website_marquee') {
          const text = sec.props?.text as string | undefined;
          const customQuotes = sec.props?.customQuotes as string[] | undefined;
          const backgroundColor = (sec.props?.backgroundColor as string) || undefined;
          const textColor = (sec.props?.textColor as string) || undefined;
          const bg = backgroundColor || (isParallax ? '#000000' : primary);
          const color = textColor || '#ffffff';
          if (isParallax && (!Array.isArray(customQuotes) || customQuotes.length === 0)) {
            return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingMarquee customQuotes={MARQUEE_QUOTES_PARALLAX} backgroundColor={bg} textColor={color} /></section>;
          }
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingMarquee customText={text} customQuotes={customQuotes} backgroundColor={bg} textColor={color} /></section>;
        }
        if (sec.type === 'website_target_groups') {
          const p = sec.props || {};
          const targetGroups = Array.isArray(p.targetGroups) ? p.targetGroups as import('@/types/landing-section').TargetGroupItem[] : undefined;
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingTargetGroups variant="coaching" primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} targetGroups={targetGroups} /></section>;
        }
        if (sec.type === 'website_testimonials') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingTestimonials primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} testimonials={p.testimonials as import('@/types/landing-section').TestimonialItem[] | undefined} backgroundSliderImages={Array.isArray(p.backgroundSliderImages) ? p.backgroundSliderImages as string[] : undefined} /></section>;
        }
        if (sec.type === 'website_quiz_cta') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingQuizCta productSlug={productSlug} primaryColor={primary} secondaryColor={secondary} title={p.title as string | undefined} subtitle={p.subtitle as string | undefined} buttonText={p.buttonText as string | undefined} /></section>;
        }
        if (sec.type === 'website_services') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingServices variant="coaching" primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} services={p.services as import('@/types/landing-section').ServiceItem[] | undefined} /></section>;
        }
        if (sec.type === 'website_benefits') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingBenefits variant="coaching" primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} benefits={p.benefits as import('@/types/landing-section').BenefitItem[] | undefined} /></section>;
        }
        if (sec.type === 'website_pricing') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingPricing primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} pricingCards={p.pricingCards as import('@/types/landing-section').PricingCardItem[] | undefined} /></section>;
        }
        if (sec.type === 'website_trust') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingTrust primaryColor={primary} secondaryColor={secondary} sealText={p.sealText as string | undefined} sectionTitle={p.sectionTitle as string | undefined} bodyHtml={p.bodyHtml as string | undefined} buttonText={p.buttonText as string | undefined} /></section>;
        }
        if (sec.type === 'website_process') {
          const p = sec.props || {};
          const processSteps = (Array.isArray(p.processSteps) ? p.processSteps : []) as import('@/types/landing-section').ProcessStepItem[];
          const steps = processSteps.length >= 4
            ? processSteps.slice(0, 4).map((s, i) => ({ ...s, icon: ['💬', '📋', '✅', '🚀'][i] ?? '🚀' }))
            : undefined;
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingProcess variant="coaching" primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} steps={steps} /></section>;
        }
        if (sec.type === 'website_faq') {
          const p = sec.props || {};
          const faqs = (Array.isArray(p.faqs) ? p.faqs : []) as import('@/types/landing-section').FaqItem[];
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingFaq primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} faqs={faqs.length > 0 ? faqs : undefined} /></section>;
        }
        if (sec.type === 'website_footer') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingFooter variant="coaching" primaryColor={primary} secondaryColor={secondary} copyrightText={p.copyrightText as string | undefined} sublineText={p.sublineText as string | undefined} logoUrl={p.logoUrl as string | undefined} /></section>;
        }
        if (sec.type === 'website_testimonials_infinite') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingTestimonialsInfinite primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} testimonials={p.testimonials as import('@/types/landing-section').TestimonialItem[] | undefined} backgroundSliderImages={Array.isArray(p.backgroundSliderImages) ? p.backgroundSliderImages as string[] : undefined} /></section>;
        }
        if (sec.type === 'website_beratung') {
          const p = sec.props || {};
          return (
            <section key={sec.id} id={`section-${sec.id}`}>
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
            </section>
          );
        }
        if (sec.type === 'website_claim_parallax') {
          const p = sec.props || {};
          return (
            <section key={sec.id} id={`section-${sec.id}`} className="relative" style={{ zIndex: index }}>
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
            </section>
          );
        }
        if (sec.type === 'website_words_parallax') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`} className="relative" style={{ zIndex: index }}><ProductLandingWordsParallax primaryColor={primary} secondaryColor={secondary} word1={p.word1 as string | undefined} word2={p.word2 as string | undefined} word3={p.word3 as string | undefined} /></section>;
        }
        if (sec.type === 'website_stacked_sheets') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingStackedSheets primaryColor={primary} secondaryColor={secondary} sheet1Title={p.sheet1Title as string | undefined} sheet1Body={p.sheet1Body as string | undefined} sheet2Title={p.sheet2Title as string | undefined} sheet2Body={p.sheet2Body as string | undefined} sheet3Title={p.sheet3Title as string | undefined} sheet3Body={p.sheet3Body as string | undefined} /></section>;
        }
        if (sec.type === 'website_images_slider') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingImagesSlider primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} ctaText={p.ctaText as string | undefined} ctaHref={(p.ctaHref as string) || '/experts'} /></section>;
        }
        return null;
  });
  return <>{elements}</>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!DEFAULT_TENANT_SLUG) return { title: 'Produkt' };
  const data = await getProductForPublic(DEFAULT_TENANT_SLUG, slug);
  if (!data) return { title: 'Produkt' };
  return {
    title: `${data.product.title} | ${data.tenant.name}`,
    description: data.product.description?.slice(0, 160) || undefined,
  };
}

export default async function ProductLandingPage({ params, searchParams }: Props) {
  const { slug } = await params;
  if (!slug) notFound();

  const sp = await searchParams;
  // Tenant: aus Query (?tenant=) von /p/[tenant]/[slug] oder aus Env (Legacy).
  const tenantSlug = (sp?.tenant && typeof sp.tenant === 'string' ? sp.tenant : DEFAULT_TENANT_SLUG) || '';
  const productSlug = slug;
  if (!tenantSlug) notFound();

  const isPreview = sp?.preview === '1';
  const cookieStore = await cookies();
  const adminSession = getAdminSession({ cookies: cookieStore });
  const allowDraft = isPreview && !!adminSession;

  const data = await getProductForPublic(tenantSlug, productSlug, allowDraft);
  if (!data) notFound();

  const { product, tenant } = data;
  const sections = Array.isArray((product as { landing_page_sections?: unknown }).landing_page_sections)
    ? (product as { landing_page_sections: LandingSection[] }).landing_page_sections
    : [];
  const useBuilderLayout = sections.length > 0;
  const showDraftBanner = allowDraft && !(product as { is_published?: boolean }).is_published;
  const hasFooterSection = sections.some((s) => s.type === 'website_footer');
  const isParallax = (product as { landing_template?: string | null }).landing_template === 'parallax';

  return (
    <div className="min-h-screen bg-neutral-50">
      {useBuilderLayout && (product as { is_published?: boolean }).is_published && (
        <>
          <ProductLandingTracker productSlug={slug} enabled />
          <LandingPixelsInjector productSlug={slug} />
        </>
      )}
      {showDraftBanner && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-sm text-amber-900">
          Vorschau – dieses Produkt ist noch ein Entwurf und für Besucher nicht sichtbar.
        </div>
      )}
      <main className={useBuilderLayout ? 'w-full' : 'mx-auto max-w-4xl px-4 py-10 sm:py-16'}>
        {useBuilderLayout ? (
          <ProductLandingSections
            product={product}
            tenant={tenant}
            sections={sections}
            productSlug={slug}
            themePrimary={(product as { theme_primary_color?: string | null }).theme_primary_color}
            themeSecondary={(product as { theme_secondary_color?: string | null }).theme_secondary_color}
            landingTemplate={(product as { landing_template?: string | null }).landing_template}
          />
        ) : (
          <>
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              {product.image_url && (
                <div className="relative aspect-video w-full bg-neutral-100">
                  <Image
                    src={product.image_url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 896px"
                  />
                </div>
              )}
              <div className="p-6 sm:p-10">
                <span className="inline-block rounded-full bg-[#cb530a]/10 px-3 py-1 text-xs font-medium text-[#cb530a] mb-4">
                  {product.type === 'course' ? 'Kurs' : product.type === 'download' ? 'Download' : 'Mitgliederbereich'}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#182c30] mb-4">{product.title}</h1>
                {product.description && (
                  <p className="text-lg text-neutral-600 leading-relaxed mb-8 whitespace-pre-line">{product.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  {Number(product.price_cents) > 0 ? (
                    <p className="text-2xl font-bold text-[#182c30]">
                      {(product.price_cents / 100).toFixed(2)} € <span className="text-base font-normal text-neutral-500">(brutto)</span>
                    </p>
                  ) : (
                    <p className="text-lg font-medium text-neutral-600">Kostenlos</p>
                  )}
                  <Link
                    href={`/kontakt?produkt=${encodeURIComponent(product.title)}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[#cb530a] px-6 py-3 text-base font-semibold text-white hover:bg-[#a84308] transition-colors"
                  >
                    Jetzt anfragen
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {isParallax && useBuilderLayout && <FloatingDockParallax />}
      {!hasFooterSection && (
        <footer className="border-t border-neutral-200 py-6 mt-12">
          <div className="mx-auto max-w-4xl px-4 text-center text-sm text-neutral-500">
            <Link href="/impressum" className="hover:text-[#cb530a]">Impressum</Link>
            {' · '}
            <Link href="/datenschutz" className="hover:text-[#cb530a]">Datenschutz</Link>
          </div>
        </footer>
      )}
    </div>
  );
}
