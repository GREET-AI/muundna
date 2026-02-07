import React from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/admin-auth';
import { JetonStyleHeroSection } from '@/app/components/JetonStyleHeroSection';
import MarqueeBanner from '@/app/components/MarqueeBanner';
import TargetGroupsSection from '@/app/components/TargetGroupsSection';
import TestimonialsSection from '@/app/components/TestimonialsSection';
import ExpertiseCTABanner from '@/app/components/ExpertiseCTABanner';
import ServicesOverview from '@/app/components/ServicesOverview';
import BenefitsSection from '@/app/components/BenefitsSection';
import PricingSection from '@/app/components/PricingSection';
import TrustSection from '@/app/components/TrustSection';
import ProcessSection from '@/app/components/ProcessSection';
import FAQSection from '@/app/components/FAQSection';
import Footer from '@/app/components/Footer';

const DEFAULT_TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || 'muckenfuss-nagel';

type Props = { params: Promise<{ slug: string }>; searchParams?: Promise<{ preview?: string }> };

async function getProduct(slug: string, allowDraft = false) {
  if (!supabaseAdmin) return null;
  const { data: tenant } = await supabaseAdmin.from('tenants').select('id, name').eq('slug', DEFAULT_TENANT_SLUG).single();
  if (!tenant) return null;
  let query = supabaseAdmin
    .from('dp_products')
    .select('id, type, title, slug, description, price_cents, image_url, landing_page_sections, is_published')
    .eq('tenant_id', tenant.id)
    .eq('slug', slug.toLowerCase().trim());
  if (!allowDraft) query = query.eq('is_published', true);
  const { data: product } = await query.single();
  return product ? { product, tenant } : null;
}

type LandingSection = { id: string; type: string; props: Record<string, unknown> };

/** Nur die 12 Website-Sektionen (1:1 wie Startseite) – alle full width */
function ProductLandingSections({
  product,
  tenant,
  sections,
}: {
  product: { title: string; description: string | null; price_cents: number; image_url: string | null; type: string };
  tenant: { name: string };
  sections: LandingSection[];
}) {
  return (
    <>
      {sections.map((sec) => {
        if (sec.type === 'website_jeton_hero') {
          const headline = (sec.props?.headline as string) || product.title;
          const ctaText = (sec.props?.ctaText as string) || 'Jetzt Anfragen';
          const ctaHref = (sec.props?.ctaHref as string) || '/kontakt';
          const secondaryCtaText = (sec.props?.secondaryCtaText as string) || 'Mehr erfahren';
          const secondaryCtaHref = (sec.props?.secondaryCtaHref as string) || '/dienstleistungen';
          return (
            <section key={sec.id}>
              <JetonStyleHeroSection headline={headline} ctaText={ctaText} ctaHref={ctaHref} secondaryCtaText={secondaryCtaText} secondaryCtaHref={secondaryCtaHref} />
            </section>
          );
        }
        if (sec.type === 'website_marquee') return <section key={sec.id}><MarqueeBanner /></section>;
        if (sec.type === 'website_target_groups') return <section key={sec.id}><TargetGroupsSection /></section>;
        if (sec.type === 'website_testimonials') return <section key={sec.id}><TestimonialsSection /></section>;
        if (sec.type === 'website_quiz_cta') return <section key={sec.id}><ExpertiseCTABanner /></section>;
        if (sec.type === 'website_services') return <section key={sec.id}><ServicesOverview /></section>;
        if (sec.type === 'website_benefits') return <section key={sec.id}><BenefitsSection /></section>;
        if (sec.type === 'website_pricing') return <section key={sec.id}><PricingSection /></section>;
        if (sec.type === 'website_trust') return <section key={sec.id}><TrustSection /></section>;
        if (sec.type === 'website_process') return <section key={sec.id}><ProcessSection /></section>;
        if (sec.type === 'website_faq') return <section key={sec.id}><FAQSection /></section>;
        if (sec.type === 'website_footer') return <section key={sec.id}><Footer /></section>;
        return null;
      })}
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);
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
  const isPreview = sp?.preview === '1';
  const cookieStore = await cookies();
  const adminSession = getAdminSession({ cookies: cookieStore });
  const allowDraft = isPreview && !!adminSession;

  const data = await getProduct(slug, allowDraft);
  if (!data) notFound();

  const { product, tenant } = data;
  const sections = Array.isArray((product as { landing_page_sections?: unknown }).landing_page_sections)
    ? (product as { landing_page_sections: LandingSection[] }).landing_page_sections
    : [];
  const useBuilderLayout = sections.length > 0;
  const showDraftBanner = allowDraft && !(product as { is_published?: boolean }).is_published;
  const firstIsJetonHero = useBuilderLayout && sections[0]?.type === 'website_jeton_hero';
  const hasFooterSection = sections.some((s) => s.type === 'website_footer');

  return (
    <div className="min-h-screen bg-neutral-50">
      {showDraftBanner && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-sm text-amber-900">
          Vorschau – dieses Produkt ist noch ein Entwurf und für Besucher nicht sichtbar.
        </div>
      )}
      {!firstIsJetonHero && (
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold text-[#182c30] hover:text-[#cb530a] transition-colors">
              {tenant.name}
            </Link>
            <Link
              href="/kontakt"
              className="rounded-lg bg-[#cb530a] px-4 py-2 text-sm font-medium text-white hover:bg-[#a84308] transition-colors"
            >
              Kontakt
            </Link>
          </div>
        </header>
      )}

      <main className={useBuilderLayout ? 'w-full' : 'mx-auto max-w-4xl px-4 py-10 sm:py-16'}>
        {useBuilderLayout ? (
          <ProductLandingSections
            product={product}
            tenant={tenant}
            sections={sections}
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
