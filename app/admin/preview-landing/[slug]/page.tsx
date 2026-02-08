import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Image from 'next/image';
import PreviewViewportWrapper from '../PreviewViewportWrapper';
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
import { FloatingDockParallax } from '@/app/components/FloatingDock';

type Props = { params: Promise<{ slug: string }>; searchParams?: Promise<{ embed?: string }> };

type LandingSection = { id: string; type: string; props: Record<string, unknown> };

async function getProductForPreview(slug: string, tenantId: string) {
  if (!supabaseAdmin) return null;
  const { data: tenant } = await supabaseAdmin.from('tenants').select('id, name').eq('id', tenantId).single();
  if (!tenant) return null;
  const { data: product } = await supabaseAdmin
    .from('dp_products')
    .select('id, type, title, slug, description, price_cents, image_url, landing_page_sections, is_published, theme_primary_color, theme_secondary_color, landing_template')
    .eq('tenant_id', tenantId)
    .eq('slug', slug.toLowerCase().trim())
    .single();
  return product ? { product, tenant } : null;
}

const DEFAULT_PRIMARY = '#cb530a';
const DEFAULT_SECONDARY = '#f0e6e0';
/** ImmoSparplan-Parallax-Vorlage: Farben wie Original */
const PARALLAX_PRIMARY = '#C4D32A';
const PARALLAX_SECONDARY = '#60A917';

/** Nur die 12 Website-Sektionen (1:1 wie Startseite) – alle full width. Theme-Farben aus Produkt. */
function ProductLandingSections({
  product,
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
  return (
    <>
      {sections.map((sec, index) => {
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
                headlineColor={p.headlineColor as string | undefined}
                logoUrl={p.logoUrl as string | undefined}
                headlineFontSize={p.headlineFontSize as string | undefined}
                headlineFontFamily={p.headlineFontFamily as string | undefined}
              />
            </section>
          );
        }
        if (sec.type === 'website_marquee') {
          const text = sec.props?.text as string | undefined;
          const customQuotes = sec.props?.customQuotes as string[] | undefined;
          const backgroundColor = (sec.props?.backgroundColor as string) || undefined;
          if (isParallax && (!Array.isArray(customQuotes) || customQuotes.length === 0)) {
            return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingMarquee customQuotes={MARQUEE_QUOTES_PARALLAX} backgroundColor={backgroundColor || '#000000'} /></section>;
          }
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingMarquee customText={text} customQuotes={customQuotes} backgroundColor={backgroundColor || (isParallax ? '#000000' : primary)} /></section>;
        }
        if (sec.type === 'website_target_groups') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingTargetGroups variant="coaching" primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} /></section>;
        }
        if (sec.type === 'website_testimonials') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingTestimonials primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} testimonials={p.testimonials as import('@/types/landing-section').TestimonialItem[] | undefined} /></section>;
        }
        if (sec.type === 'website_quiz_cta') return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingQuizCta productSlug={productSlug} primaryColor={primary} secondaryColor={secondary} /></section>;
        if (sec.type === 'website_services') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingServices variant="coaching" primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} /></section>;
        }
        if (sec.type === 'website_benefits') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingBenefits variant="coaching" primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} /></section>;
        }
        if (sec.type === 'website_pricing') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingPricing primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} /></section>;
        }
        if (sec.type === 'website_trust') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingTrust primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} /></section>;
        }
        if (sec.type === 'website_process') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingProcess variant="coaching" primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} /></section>;
        }
        if (sec.type === 'website_faq') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingFaq primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} sectionSubtitle={p.sectionSubtitle as string | undefined} /></section>;
        }
        if (sec.type === 'website_footer') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingFooter primaryColor={primary} secondaryColor={secondary} copyrightText={p.copyrightText as string | undefined} /></section>;
        }
        if (sec.type === 'website_testimonials_infinite') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingTestimonialsInfinite primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} testimonials={p.testimonials as import('@/types/landing-section').TestimonialItem[] | undefined} /></section>;
        }
        if (sec.type === 'website_beratung') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingBeratung primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} /></section>;
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
        if (sec.type === 'website_words_parallax') return <section key={sec.id} id={`section-${sec.id}`} className="relative" style={{ zIndex: index }}><ProductLandingWordsParallax primaryColor={primary} secondaryColor={secondary} /></section>;
        if (sec.type === 'website_stacked_sheets') return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingStackedSheets primaryColor={primary} secondaryColor={secondary} /></section>;
        if (sec.type === 'website_images_slider') {
          const p = sec.props || {};
          return <section key={sec.id} id={`section-${sec.id}`}><ProductLandingImagesSlider primaryColor={primary} secondaryColor={secondary} sectionTitle={p.sectionTitle as string | undefined} ctaText={p.ctaText as string | undefined} ctaHref={(p.ctaHref as string) || '/experts'} /></section>;
        }
        return null;
      })}
    </>
  );
}

export default async function AdminPreviewLandingPage({ params, searchParams }: Props) {
  const { slug } = await params;
  if (!slug) notFound();
  const sp = await searchParams;
  const isEmbed = sp?.embed === '1';

  const cookieStore = await cookies();
  const session = getAdminSession({ cookies: cookieStore });
  if (!session?.tid) redirect('/admin');

  const data = await getProductForPreview(slug, session.tid);
  if (!data) notFound();

  const { product, tenant } = data;
  const sections = Array.isArray((product as { landing_page_sections?: unknown }).landing_page_sections)
    ? (product as { landing_page_sections: LandingSection[] }).landing_page_sections
    : [];
  const useBuilderLayout = sections.length > 0;
  const isDraft = !(product as { is_published?: boolean }).is_published;
  const firstIsJetonHero = useBuilderLayout && sections[0]?.type === 'website_jeton_hero';
  const hasFooterSection = sections.some((s) => s.type === 'website_footer');
  const isParallax = (product as { landing_template?: string | null }).landing_template === 'parallax';

  const content = (
    <div className={`min-h-screen bg-neutral-50 ${isEmbed ? '' : ''}`}>
      {!isEmbed && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-sm text-amber-900">
          Vorschau (Admin) {isDraft && '– Entwurf, für Besucher nicht sichtbar'}
        </div>
      )}
      {!firstIsJetonHero && (
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
            <span className="text-lg font-semibold text-[#182c30]">{tenant.name}</span>
            <span className="rounded-lg bg-neutral-200 px-4 py-2 text-sm text-neutral-600">Kontakt</span>
          </div>
        </header>
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
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            {product.image_url && (
              <div className="relative aspect-video w-full bg-neutral-100">
                <Image src={product.image_url} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 896px" />
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
                <span className="inline-flex items-center justify-center rounded-xl bg-[#cb530a] px-6 py-3 text-base font-semibold text-white">
                  Jetzt anfragen
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {isParallax && useBuilderLayout && <FloatingDockParallax />}
      {!hasFooterSection && (
        <footer className="border-t border-neutral-200 py-6 mt-12 w-full">
          <div className="mx-auto max-w-4xl px-4 text-center text-sm text-neutral-500">
            Impressum · Datenschutz
          </div>
        </footer>
      )}
    </div>
  );

  if (isEmbed) return content;
  return <PreviewViewportWrapper slug={slug}>{content}</PreviewViewportWrapper>;
}
