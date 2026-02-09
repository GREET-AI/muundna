import { getPublishedHomepage } from '@/lib/homepage-public';
import { ProductLandingSections } from '@/app/p/[slug]/page';
import type { LandingSection } from '@/types/landing-section';
import { JetonStyleHeroSection } from './components/JetonStyleHeroSection';
import MarqueeBanner from './components/MarqueeBanner';
import ServicesOverview from './components/ServicesOverview';
import TargetGroupsSection from './components/TargetGroupsSection';
import BenefitsSection from './components/BenefitsSection';
import PricingSection from './components/PricingSection';
import TrustSection from './components/TrustSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import ExpertiseCTABanner from './components/ExpertiseCTABanner';
import ProcessSection from './components/ProcessSection';

type HomeProps = { searchParams?: Promise<{ tenant?: string }> };

/**
 * Startseite: Wenn tenant (Query oder NEXT_PUBLIC_TENANT_SLUG) gesetzt und eine
 * veröffentlichte Homepage existiert → Rendering aus dem Builder (pages.json_data).
 * Sonst → statische Startseite (bestehendes Design).
 * tenant_id wird nur serverseitig aus Tenant-Slug ermittelt – keine Session.
 */
export default async function Home({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const tenantSlug = (sp?.tenant && typeof sp.tenant === 'string' ? sp.tenant : process.env.NEXT_PUBLIC_TENANT_SLUG) ?? '';

  if (tenantSlug) {
    const page = await getPublishedHomepage(tenantSlug);
    const components = (page?.json_data?.components ?? []) as LandingSection[];
    if (page && Array.isArray(components) && components.length > 0) {
      const product = { title: page.title || 'Startseite', description: null as string | null, price_cents: 0, image_url: null as string | null, type: 'course' as const };
      const tenant = { name: page.title || 'Startseite' };
      return (
        <div className="min-h-screen bg-neutral-50">
          <main className="w-full">
            <ProductLandingSections
              product={product}
              tenant={tenant}
              sections={components}
              productSlug=""
              themePrimary={null}
              themeSecondary={null}
              landingTemplate="standard"
            />
          </main>
          <footer className="border-t border-neutral-200 py-6">
            <div className="mx-auto max-w-4xl px-4 text-center text-sm text-neutral-500">
              <a href="/impressum" className="hover:text-[#cb530a]">Impressum</a>
              {' · '}
              <a href="/datenschutz" className="hover:text-[#cb530a]">Datenschutz</a>
            </div>
          </footer>
          <CookieBanner />
        </div>
      );
    }
  }

  /** Statische Startseite (Legacy): kundenspezifisch, kein Builder. */
  return (
    <div className="min-h-screen">
      <main>
        <JetonStyleHeroSection
          headline="Ihr Büro."
          headlineLine2="Ihr Geschäft. Unsere Expertise."
          ctaText="Jetzt Anfragen"
          ctaHref="/kontakt/quiz"
          secondaryCtaText="Mehr erfahren"
          secondaryCtaHref="/dienstleistungen"
          backgroundImageUrl="/images/Handwerker%20(2).png"
        />
        <MarqueeBanner />
        <TargetGroupsSection />
        <TestimonialsSection />
        <ExpertiseCTABanner />
        <ServicesOverview />
        <BenefitsSection />
        <PricingSection />
        <TrustSection />
        <ProcessSection />
        <FAQSection />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
