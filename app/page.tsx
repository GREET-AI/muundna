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

/** Startseite Muckenfuss & Nagel – Bürodienstleistungen für Handwerksbetriebe (Original).
 *  Der Builder für Online-Kurse betrifft nur die Produkt-Landingpages unter /p/[slug], nicht diese Homepage. */
export default function Home() {
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
