'use client';

import { motion } from 'framer-motion';
import NumberTicker from './ui/NumberTicker';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
  icon?: string;
}

interface StatsSectionProps {
  stats: Stat[];
  title?: string;
  description?: string;
}

export default function StatsSection({ stats, title, description }: StatsSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-[#fef3ed] to-gray-50 dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {(title || description) && (
            <div className="text-center mb-12">
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 text-center hover:shadow-xl transition-shadow"
              >
                {stat.icon && (
                  <div className="text-4xl mb-3">{stat.icon}</div>
                )}
                <div className="text-4xl md:text-5xl font-bold text-[#cb530a] dark:text-[#182c30] mb-2">
                  <NumberTicker value={stat.value} className="text-[#cb530a] dark:text-[#182c30]" />
                  {stat.suffix}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

