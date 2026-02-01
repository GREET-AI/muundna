'use client';

import Link from 'next/link';
import { getRoute } from '../utils/routes';
import { Sparkles } from 'lucide-react';

export default function ExpertiseCTABanner() {
  return (
    <section className="py-12 bg-gradient-to-r from-[#cb530a] to-[#a84308]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-white/20 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    Expertise erhalten
                  </h3>
                  <p className="text-white/90 text-sm md:text-base">
                    Beantworten Sie 4 kurze Fragen und erhalten Sie ein maßgeschneidertes Angebot
                  </p>
                </div>
              </div>
              <Link
                href={getRoute('Quiz')}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#cb530a] font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Jetzt starten →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

