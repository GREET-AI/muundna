import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase-admin';
import QuizFunnelClient from './QuizFunnelClient';
import LandingPixelsInjector from '@/app/components/LandingPixelsInjector';

const DEFAULT_TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG ?? '';

type Props = { params: Promise<{ slug: string }>; searchParams?: Promise<{ tenant?: string }> };

async function getProduct(tenantSlug: string, productSlug: string) {
  if (!supabaseAdmin || !tenantSlug) return null;
  const { data: tenant } = await supabaseAdmin.from('tenants').select('id, name').eq('slug', tenantSlug).single();
  if (!tenant) return null;
  const { data: product } = await supabaseAdmin
    .from('dp_products')
    .select('id, title, slug, is_published')
    .eq('tenant_id', tenant.id)
    .eq('slug', productSlug.toLowerCase().trim())
    .single();
  return product ? { product, tenant } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tenantSlug = DEFAULT_TENANT_SLUG;
  if (!tenantSlug) return { title: 'Quiz' };
  const data = await getProduct(tenantSlug, slug);
  if (!data) return { title: 'Quiz' };
  return {
    title: `Anfrage – ${data.product.title} | ${data.tenant.name}`,
  };
}

export default async function ProductQuizPage({ params, searchParams }: Props) {
  const { slug } = await params;
  if (!slug) notFound();
  const sp = await searchParams;
  const tenantSlug = (sp?.tenant && typeof sp.tenant === 'string' ? sp.tenant : DEFAULT_TENANT_SLUG) || '';
  if (!tenantSlug) notFound();
  const data = await getProduct(tenantSlug, slug);
  if (!data) notFound();
  const { product, tenant } = data;
  const isPublished = (product as { is_published?: boolean }).is_published;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3e7] via-white to-[#ffe1c7]">
      <header className="fixed top-0 left-0 right-0 z-20 border-b border-[#cb530a]/20 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/p/${slug}`} className="text-[#182c30] hover:text-[#cb530a] font-medium text-sm">
            ← Zurück zu {product.title}
          </Link>
          <span className="text-sm text-neutral-500">{tenant.name}</span>
        </div>
      </header>
      {!isPublished && (
        <div className="fixed top-12 left-0 right-0 z-10 bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-sm text-amber-900">
          Vorschau – dieses Produkt ist noch ein Entwurf.
        </div>
      )}
      {isPublished && <LandingPixelsInjector productSlug={slug} />}
      <div className={!isPublished ? 'pt-24' : 'pt-14'}>
        <QuizFunnelClient productSlug={slug} productTitle={product.title} />
      </div>
    </div>
  );
}
