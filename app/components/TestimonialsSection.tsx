'use client';

import { motion } from 'framer-motion';
import AnimatedCard3D from './ui/AnimatedCard3D';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Michael K.',
      company: 'Handwerksbetrieb, Bretten',
      service: 'Telefonservice & Terminorganisation',
      text: 'Seit 2 Jahren betreuen uns Muckenfuss & Nagel. Die Kundenkommunikation hat sich deutlich verbessert und wir können uns voll auf unser Handwerk konzentrieren.',
      rating: 5
    },
    {
      name: 'Sarah M.',
      company: 'Bauunternehmen, Karlsruhe',
      service: 'Vollständige Bürodienstleistungen',
      text: 'Die komplette Übernahme der Büroarbeit ermöglicht es uns, uns auf große Projekte zu konzentrieren. Professionell, zuverlässig und immer erreichbar.',
      rating: 5
    },
    {
      name: 'Thomas R.',
      company: 'Dachdeckerei, Bruchsal',
      service: 'Social Media & Google Bewertungen',
      text: 'Durch die professionelle Online-Präsenz konnten wir viele neue Kunden gewinnen. Die Google Bewertungen haben sich deutlich verbessert.',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Das sagen unsere Kunden
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Echte Erfahrungen von Handwerksbetrieben und Bauunternehmen, die mit uns zusammenarbeiten
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AnimatedCard3D>
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 h-full">
                  <div className="mb-4">
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-700 italic leading-relaxed mb-4">
                      "{testimonial.text}"
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-bold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.company}
                    </p>
                    <p className="text-xs text-[#cb530a] mt-2">
                      {testimonial.service}
                    </p>
                  </div>
                </div>
              </AnimatedCard3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

