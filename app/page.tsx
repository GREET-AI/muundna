import { JetonStyleHeroSection } from './components/JetonStyleHeroSection';
import MarqueeBanner from './components/MarqueeBanner';
import ServicesOverview from './components/ServicesOverview';
import TargetGroupsSection from './components/TargetGroupsSection';
import BenefitsSection from './components/BenefitsSection';
import PricingSection from './components/PricingSection';
import CompanyInfoSection from './components/CompanyInfoSection';
import TrustSection from './components/TrustSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import ExpertiseCTABanner from './components/ExpertiseCTABanner';
import ProcessSection from './components/ProcessSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <JetonStyleHeroSection />
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
    </div>
  );
}
