'use client';

/**
 * NUR FÜR BUILDER / PRODUKT-LANDINGPAGES (/p/[slug], Admin-Vorschau).
 * Kundenstimmen mit optionalen Überschriften und bearbeitbaren Testimonials aus dem Builder.
 * Die Hauptseite nutzt app/components/TestimonialsSection.tsx (feste Handwerker-Inhalte).
 */
import { motion } from 'framer-motion';
import { ImagesSlider } from '../ui/ImagesSlider';
import { InfiniteMovingCards } from '../ui/InfiniteMovingCards';
import type { TestimonialItem } from '@/types/landing-section';

const TRUST_SLIDER_IMAGES = ['/images/trust/13.png', '/images/trust/14.png', '/images/trust/15.png'];

const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  { quote: 'Endlich ein System, das funktioniert.', name: 'Markus S.', title: 'Teilnehmer Immobiliencoaching' },
  { quote: 'Von der Due Diligence bis zur Vermietung – alles klar strukturiert.', name: 'Sarah K.', title: 'Quereinsteigerin Immobilien' },
  { quote: 'Die exklusiven Strategien und der Zugang zu Off-Market-Deals.', name: 'Thomas R.', title: 'Investor' },
  { quote: '1:1-Betreuung und ein klares System.', name: 'Julia M.', title: 'Coaching-Teilnehmerin' },
  { quote: 'Hochpreisig, aber jeder Euro wert.', name: 'Daniel W.', title: 'Teilnehmer' },
];

const FALLBACK_TITLE = 'Das sagen unsere Teilnehmer';
const FALLBACK_SUBTITLE = 'Echte Erfahrungen aus dem Immobiliencoaching';

export type ProductLandingTestimonialsProps = {
  primaryColor?: string;
  secondaryColor?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  testimonials?: TestimonialItem[];
  /** Hintergrund-Slider (Basic: 3 Bilder). */
  backgroundSliderImages?: string[];
};

export default function ProductLandingTestimonials(props: ProductLandingTestimonialsProps = {}) {
  const { primaryColor, sectionTitle, sectionSubtitle, testimonials: customTestimonials, backgroundSliderImages } = props;
  const testimonials = (Array.isArray(customTestimonials) && customTestimonials.length > 0) ? customTestimonials : FALLBACK_TESTIMONIALS;
  const title = sectionTitle?.trim() || FALLBACK_TITLE;
  const subtitle = sectionSubtitle?.trim() || FALLBACK_SUBTITLE;
  const sliderImages = (Array.isArray(backgroundSliderImages) && backgroundSliderImages.length > 0) ? backgroundSliderImages : TRUST_SLIDER_IMAGES;

  return (
    <section className="relative w-full overflow-hidden min-h-[48rem] md:min-h-[54rem]">
      <div className="absolute inset-0 z-0">
        <ImagesSlider className="h-full w-full" images={sliderImages} overlay overlayClassName="bg-black/70" autoplay direction="up" />
      </div>
      <div className="relative z-10 flex min-h-[48rem] md:min-h-[54rem] flex-col pt-24 md:pt-32 pb-12 md:pb-16">
        <motion.div initial={{ opacity: 0, y: -80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="z-50 flex flex-col justify-center items-center px-4 pb-8 md:pb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">{title}</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto text-center">{subtitle}</p>
        </motion.div>
        <div className="flex-1 py-6 md:py-8 container mx-auto px-4 w-full">
          <InfiniteMovingCards items={testimonials} direction="left" speed="slower" pauseOnHover primaryColor={primaryColor} />
        </div>
      </div>
    </section>
  );
}
