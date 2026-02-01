import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
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

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSlider />
        <ExpertiseCTABanner />
        <ServicesOverview />
        <TargetGroupsSection />
        <BenefitsSection />
        <PricingSection />
        <CompanyInfoSection />
        <TrustSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
