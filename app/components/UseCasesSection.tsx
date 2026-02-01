'use client';

import { motion } from 'framer-motion';
import AnimatedCard3D from './ui/AnimatedCard3D';

interface UseCase {
  title: string;
  description: string;
  result: string;
  icon: string;
}

interface UseCasesSectionProps {
  useCases: UseCase[];
  title?: string;
}

export default function UseCasesSection({ useCases, title = 'Ihre Vorteile im Detail' }: UseCasesSectionProps) {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-12 text-center">
            {title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AnimatedCard3D>
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 h-full hover:shadow-xl transition-all">
                    <div className="text-5xl mb-4">{useCase.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {useCase.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <p className="text-sm font-semibold text-[#cb530a] dark:text-[#182c30]">
                        Ergebnis:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        {useCase.result}
                      </p>
                    </div>
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

