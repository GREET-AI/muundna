'use client';

import { motion } from 'framer-motion';

interface ComparisonItem {
  feature: string;
  ohne: string | boolean;
  mit: string | boolean;
}

interface ComparisonSectionProps {
  items: ComparisonItem[];
  title?: string;
}

export default function ComparisonSection({ items, title = 'Mit vs. Ohne Muckenfuss & Nagel' }: ComparisonSectionProps) {
  return (
    <section className="py-20 bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-12 text-center">
            {title}
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-6 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="font-bold text-gray-800 dark:text-white">Feature</div>
              <div className="font-bold text-gray-800 dark:text-white text-center">Ohne</div>
              <div className="font-bold text-[#cb530a] dark:text-[#182c30] text-center">Mit uns</div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="font-medium text-gray-800 dark:text-white">
                    {item.feature}
                  </div>
                  <div className="text-center">
                    {typeof item.ohne === 'boolean' ? (
                      item.ohne ? (
                        <span className="text-red-500 text-xl">✗</span>
                      ) : (
                        <span className="text-gray-400 text-xl">—</span>
                      )
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">{item.ohne}</span>
                    )}
                  </div>
                  <div className="text-center">
                    {typeof item.mit === 'boolean' ? (
                      item.mit ? (
                        <span className="text-green-500 text-xl">✓</span>
                      ) : (
                        <span className="text-gray-400 text-xl">—</span>
                      )
                    ) : (
                      <span className="text-[#cb530a] dark:text-[#182c30] font-semibold">{item.mit}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

