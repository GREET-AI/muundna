'use client';

/**
 * NUR FÜR DIE HAUPTSEITE (Handwerker / Bürodienstleistungen).
 * Feste Inhalte – keine Builder-Props. Builder/Produkt-Landingpages nutzen
 * app/components/product-landing/ProductLandingTestimonials.tsx
 */
import { motion } from 'framer-motion';
import { ImagesSlider } from './ui/ImagesSlider';
import { InfiniteMovingCards } from './ui/InfiniteMovingCards';

const TRUST_SLIDER_IMAGES = ['/images/trust/13.png', '/images/trust/14.png', '/images/trust/15.png'];

const TITLE = 'Das sagen unsere Kunden';
const SUBTITLE = 'Echte Erfahrungen von Handwerksbetrieben und Bauunternehmen';

const TESTIMONIALS = [
  { quote: 'Seit 2 Jahren betreuen uns Muckenfuss & Nagel. Die Kundenkommunikation hat sich deutlich verbessert und wir können uns voll auf unser Handwerk konzentrieren.', name: 'Ugnius Reich', title: 'Ofenbau Reich, Menzingen' },
  { quote: 'Die komplette Übernahme der Büroarbeit ermöglicht es uns, uns auf große Projekte zu konzentrieren. Professionell, zuverlässig und immer erreichbar.', name: 'Jürgen Brand', title: 'Bauunternehmung Brand, Bretten' },
  { quote: 'Effiziente Terminorganisation und Dokumentation. Wir sind sehr zufrieden mit der Zusammenarbeit.', name: 'Christoph Boxtaler', title: 'Schweißerfachbetrieb' },
  { quote: 'Zuverlässiger Telefonservice und Büroarbeit im Hintergrund – so können wir uns aufs Zimmern konzentrieren.', name: 'Falk Welker', title: 'Zimmermann, Kürnbach' },
];

export default function TestimonialsSection() {
  return (
    <section className="relative w-full overflow-hidden min-h-[48rem] md:min-h-[54rem]">
      <div className="absolute inset-0 z-0">
        <ImagesSlider className="h-full w-full" images={TRUST_SLIDER_IMAGES} overlay overlayClassName="bg-black/70" autoplay direction="up" />
      </div>
      <div className="relative z-10 flex min-h-[48rem] md:min-h-[54rem] flex-col pt-24 md:pt-32 pb-12 md:pb-16">
        <motion.div initial={{ opacity: 0, y: -80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="z-50 flex flex-col justify-center items-center px-4 pb-8 md:pb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">{TITLE}</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto text-center">{SUBTITLE}</p>
        </motion.div>
        <div className="flex-1 py-6 md:py-8 container mx-auto px-4 w-full">
          <InfiniteMovingCards items={TESTIMONIALS} direction="left" speed="slower" pauseOnHover />
        </div>
      </div>
    </section>
  );
}
