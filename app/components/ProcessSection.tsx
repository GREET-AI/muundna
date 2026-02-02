'use client';

import { motion } from 'framer-motion';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

interface ProcessSectionProps {
  steps: ProcessStep[];
  title?: string;
}

export default function ProcessSection({ steps, title = 'So funktioniert es' }: ProcessSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            {title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center h-full">
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#cb530a] text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#cb530a] transform -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

