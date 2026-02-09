'use client';

import { motion } from 'framer-motion';
import NumberTicker from './ui/NumberTicker';
import { RichTextBlock } from './ui/RichTextBlock';

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
  primaryColor?: string;
}

export default function StatsSection({ stats, title, description, primaryColor = '#cb530a' }: StatsSectionProps) {
  const bgFrom = primaryColor === '#C4D32A' ? '#f5fce8' : '#fef3ed';
  return (
    <section className="py-20 to-gray-50" style={{ background: `linear-gradient(to bottom right, ${bgFrom}, rgb(249 250 251))` }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {(title || description) && (
            <div className="text-center mb-12">
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  <RichTextBlock html={title} tag="span" />
                </h2>
              )}
              {description && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  <RichTextBlock html={description} tag="span" />
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
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow"
              >
                {stat.icon && (
                  <div className="text-4xl mb-3">{stat.icon}</div>
                )}
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: primaryColor }}>
                  <NumberTicker value={stat.value} />
                  {stat.suffix}
                </div>
                <p className="text-gray-600 text-sm font-medium">
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

