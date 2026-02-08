/**
 * Komponenten AUSSCHLIESSLICH für Builder / Produkt-Landingpages (/p/[slug], Admin-Vorschau).
 * Alle Sektionen kommen aus landing-builder. Die Hauptseite (Handwerker) nutzt
 * app/components/ direkt und darf davon nicht betroffen werden.
 */
export {
  BuilderJetonStyleHeroSection as ProductLandingHero,
  BuilderMarqueeBanner as ProductLandingMarquee,
  MARQUEE_QUOTES_PARALLAX,
  BuilderTargetGroupsSection as ProductLandingTargetGroups,
  BuilderTestimonialsSection as ProductLandingTestimonials,
  BuilderExpertiseCTABanner as ProductLandingQuizCta,
  BuilderServicesOverview as ProductLandingServices,
  BuilderBenefitsSection as ProductLandingBenefits,
  BuilderPricingSection as ProductLandingPricing,
  BuilderTrustSection as ProductLandingTrust,
  BuilderProcessSection as ProductLandingProcess,
  BuilderFAQSection as ProductLandingFaq,
  BuilderFooter as ProductLandingFooter,
  BuilderTestimonialsInfiniteSection as ProductLandingTestimonialsInfinite,
  BuilderBeratungSectionComposite as ProductLandingBeratung,
  BuilderClaimParallaxSection as ProductLandingClaimParallax,
  BuilderWordsParallaxSection as ProductLandingWordsParallax,
  BuilderStackedSheetsSection as ProductLandingStackedSheets,
  BuilderImagesSliderSection as ProductLandingImagesSlider,
} from '@/app/components/landing-builder';
