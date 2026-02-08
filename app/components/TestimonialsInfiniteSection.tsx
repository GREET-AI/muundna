'use client';

import { motion } from 'framer-motion';
import { ImagesSlider } from '@/app/components/ui/ImagesSlider';
import { InfiniteMovingCards, type InfiniteMovingCardsItem } from '@/app/components/ui/InfiniteMovingCards';

/** Wie immosparplan-experts: Bilder aus images/slider1 als Hintergrund */
const SLIDER_IMAGES = [
  '/images/slider1/3.png',
  '/images/slider1/4.png',
  '/images/slider1/5.png',
  '/images/slider1/6.png',
  '/images/slider1/7.png',
];

/** 6 fiktive Kundenstimmen für Parallax-Vorlage */
const DEFAULT_TESTIMONIALS: InfiniteMovingCardsItem[] = [
  { quote: 'Es war großartig, den gesamten Prozess – von der Objektauswahl bis zur finanziellen Absicherung – strukturiert zu erleben.', name: 'Hanna M', title: 'Architektin' },
  { quote: 'Die Beratung hat mir geholfen, Immobilieninvestments zu verstehen und ein passives Einkommen für die Zukunft aufzubauen.', name: 'Stefan S', title: 'IT-Berater' },
  { quote: 'Wir haben die perfekte Immobilie gefunden und eine klare Strategie für den Vermögensaufbau entwickelt.', name: 'Sophie & Nedim', title: 'Ärztin & Lehrer' },
  { quote: 'Die strukturierte Vorgehensweise und das Fachwissen – jeder Schritt war unkompliziert und stressfrei.', name: 'Alex E', title: 'Unternehmensberater' },
  { quote: 'Innerhalb von acht Wochen von Null auf die erste Immobilie – das hätte ich mir vorher nicht vorstellen können.', name: 'Laura K', title: 'Marketing Managerin' },
  { quote: 'Das Netzwerk und die Deals haben mir den Einstieg enorm erleichtert. Absolute Empfehlung.', name: 'Marcus T', title: 'Ingenieur' },
];

import type { TestimonialItem } from '@/types/landing-section';

interface TestimonialsInfiniteSectionProps {
  sectionTitle?: string;
  primaryColor?: string;
  secondaryColor?: string;
  testimonials?: TestimonialItem[];
  /** Hintergrund-Slider (Parallax: 5 Bilder). */
  backgroundSliderImages?: string[];
}

export default function TestimonialsInfiniteSection({
  sectionTitle = 'Bereits mehr als 230 Kunden freuen sich über den Kauf ihrer Immobilie',
  primaryColor = '#cb530a',
  testimonials: customTestimonials,
  backgroundSliderImages,
}: TestimonialsInfiniteSectionProps) {
  const testimonials = (Array.isArray(customTestimonials) && customTestimonials.length > 0) ? customTestimonials : DEFAULT_TESTIMONIALS;
  const sliderImages = (Array.isArray(backgroundSliderImages) && backgroundSliderImages.length > 0) ? backgroundSliderImages : SLIDER_IMAGES;
  return (
    <section className="relative w-full overflow-hidden min-h-[48rem] md:min-h-[54rem]">
      <div className="absolute inset-0 z-0">
        <ImagesSlider
          className="h-full w-full"
          images={sliderImages}
          overlay
          overlayClassName="bg-black/75"
          autoplay
        />
      </div>
      <div className="relative z-10 flex min-h-[48rem] md:min-h-[54rem] flex-col pt-24 md:pt-32 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-50 flex flex-col justify-center items-center px-4 pb-8 md:pb-12"
        >
          <motion.p className="font-bold text-xl md:text-5xl lg:text-6xl text-center py-4 max-w-4xl mx-auto leading-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            {sectionTitle}
          </motion.p>
        </motion.div>
        <div className="flex-1 py-6 md:py-8">
          <InfiniteMovingCards
            items={testimonials}
            direction="left"
            speed="slower"
            pauseOnHover
            primaryColor={primaryColor}
          />
        </div>
      </div>
    </section>
  );
}
