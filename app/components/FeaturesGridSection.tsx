'use client';

import { motion } from 'framer-motion';
import AnimatedCard3D from './ui/AnimatedCard3D';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesGridSectionProps {
  features: Feature[];
  title?: string;
  description?: string;
  columns?: 2 | 3 | 4;
}

export default function FeaturesGridSection({ 
  features, 
  title, 
  description,
  columns = 3 
}: FeaturesGridSectionProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  };

  return (
    <section className="py-20 bg-white dark:bg-black">
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
          <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AnimatedCard3D>
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 h-full hover:shadow-xl transition-all group">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-[#cb530a] dark:group-hover:text-[#182c30] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </AnimatedCard3D>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

