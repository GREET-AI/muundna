'use client';

import { motion } from 'framer-motion';
import { ImagesSlider } from './ui/ImagesSlider';
import { InfiniteMovingCards } from './ui/InfiniteMovingCards';

/** Slider-Hintergrund: 3 Trust-Bilder aus public/images/trust/ */
const TRUST_SLIDER_IMAGES = [
  '/images/trust/13.png',
  '/images/trust/14.png',
  '/images/trust/15.png',
];

const testimonials = [
  {
    quote:
      'Seit 2 Jahren betreuen uns Muckenfuss & Nagel. Die Kundenkommunikation hat sich deutlich verbessert und wir können uns voll auf unser Handwerk konzentrieren.',
    name: 'Michael K.',
    title: 'Handwerksbetrieb, Bretten · Telefonservice & Terminorganisation',
  },
  {
    quote:
      'Die komplette Übernahme der Büroarbeit ermöglicht es uns, uns auf große Projekte zu konzentrieren. Professionell, zuverlässig und immer erreichbar.',
    name: 'Sarah M.',
    title: 'Bauunternehmen, Karlsruhe · Vollständige Bürodienstleistungen',
  },
  {
    quote:
      'Durch die professionelle Online-Präsenz konnten wir viele neue Kunden gewinnen. Die Google Bewertungen haben sich deutlich verbessert.',
    name: 'Thomas R.',
    title: 'Dachdeckerei, Bruchsal · Social Media & Google Bewertungen',
  },
  {
    quote:
      'Effiziente Terminorganisation und vollständige Dokumentation. Wir sind sehr zufrieden mit der Zusammenarbeit.',
    name: 'Stefan B.',
    title: 'Sanierungsbetrieb, Oberderdingen · Telefonservice & Dokumentation',
  },
];

/**
 * Kundenbewertungen mit Image-Slider im Hintergrund (wie immosparplan-experts).
 * Slider = Hintergrund (z-0), Headline + Karten darüber (z-10).
 */
export default function TestimonialsSection() {
  return (
    <section className="relative w-full overflow-hidden min-h-[48rem] md:min-h-[54rem]">
      {/* Ebene 1 (z-0): Slider nur als Hintergrund – 3 Trust-Bilder */}
      <div className="absolute inset-0 z-0">
        <ImagesSlider
          className="h-full w-full"
          images={TRUST_SLIDER_IMAGES}
          overlay
          overlayClassName="bg-black/70"
          autoplay
          direction="up"
        />
      </div>

      {/* Ebene 2 (z-10): Headline + Karten darüber */}
      <div className="relative z-10 flex min-h-[48rem] md:min-h-[54rem] flex-col pt-24 md:pt-32 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-50 flex flex-col justify-center items-center px-4 pb-8 md:pb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            Das sagen unsere Kunden
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto text-center">
            Echte Erfahrungen von Handwerksbetrieben und Bauunternehmen
          </p>
        </motion.div>
        <div className="flex-1 py-6 md:py-8 container mx-auto px-4 w-full">
          <InfiniteMovingCards
            items={testimonials}
            direction="left"
            speed="slower"
            pauseOnHover
          />
        </div>
      </div>
    </section>
  );
}
