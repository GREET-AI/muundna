'use client';

import Link from 'next/link';
import { getRoute } from '../utils/routes';

interface CTASectionProps {
  title: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  variant?: 'default' | 'gradient' | 'dark';
}

export default function CTASection({
  title,
  description,
  primaryButtonText = 'Jetzt unverbindlich anfragen',
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  variant = 'default'
}: CTASectionProps) {
  const variants = {
    default: 'bg-[#fef3ed] dark:bg-gray-900',
    gradient: 'bg-gradient-to-br from-[#cb530a] to-[#a84308] dark:from-gray-900 dark:to-black',
    dark: 'bg-gray-900 dark:bg-black'
  };

  const textColor = variant === 'gradient' || variant === 'dark' 
    ? 'text-white' 
    : 'text-gray-800 dark:text-white';

  const descColor = variant === 'gradient' || variant === 'dark'
    ? 'text-gray-200'
    : 'text-gray-700 dark:text-gray-300';

  return (
    <section className={`py-20 ${variants[variant]}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${textColor}`}>
            {title}
          </h2>
          <p className={`text-xl mb-8 leading-relaxed ${descColor}`}>
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={primaryButtonLink || getRoute('Kontakt')}
              className={`inline-flex items-center justify-center px-8 py-4 font-semibold rounded-lg shadow-lg transition-colors text-lg ${
                variant === 'gradient' || variant === 'dark'
                  ? 'bg-white text-[#cb530a] hover:bg-gray-100'
                  : 'bg-[#cb530a] text-white hover:bg-[#a84308]'
              }`}
            >
              {primaryButtonText}
            </Link>
            {secondaryButtonText && secondaryButtonLink && (
              <Link
                href={secondaryButtonLink}
                className={`inline-flex items-center justify-center px-8 py-4 font-semibold rounded-lg shadow-lg transition-colors text-lg ${
                  variant === 'gradient' || variant === 'dark'
                    ? 'bg-transparent border-2 border-white text-white hover:bg-white/10'
                    : 'bg-white border-2 border-[#cb530a] text-[#cb530a] hover:bg-[#fef3ed] dark:hover:bg-gray-800'
                }`}
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

