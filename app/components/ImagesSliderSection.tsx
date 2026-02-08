'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ImagesSlider } from '@/app/components/ui/ImagesSlider';

/** Wie immosparplan-experts: Bilder aus images/slider1 */
const SLIDER_IMAGES = [
  '/images/slider1/3.png',
  '/images/slider1/4.png',
  '/images/slider1/5.png',
  '/images/slider1/6.png',
  '/images/slider1/7.png',
];

interface ImagesSliderSectionProps {
  sectionTitle?: string;
  ctaText?: string;
  ctaHref?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function ImagesSliderSection({
  sectionTitle = 'Mit ImmoSparplan in die\nfinanzielle Freiheit.',
  ctaText = 'Jetzt Expert werden →',
  ctaHref = '/experts',
  primaryColor = '#cb530a',
}: ImagesSliderSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-neutral-900">
      <ImagesSlider className="h-[40rem] min-h-[100vh] w-full" images={SLIDER_IMAGES}>
        <motion.div
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-50 flex flex-col justify-center items-center"
        >
          <motion.p
            className="font-bold text-xl md:text-5xl lg:text-6xl text-center py-4 px-4 whitespace-pre-line"
            style={{ color: 'var(--tw-neutral-50, #fafafa)' }}
          >
            {sectionTitle}
          </motion.p>
          <Link
            href={ctaHref}
            className="px-4 py-2 backdrop-blur-sm border text-white mx-auto text-center rounded-full relative mt-4"
            style={{
              backgroundColor: primaryColor + '20',
              borderColor: primaryColor + '40',
            }}
          >
            <span>{ctaText.includes('→') ? ctaText : `${ctaText} →`}</span>
          </Link>
        </motion.div>
      </ImagesSlider>
    </section>
  );
}
