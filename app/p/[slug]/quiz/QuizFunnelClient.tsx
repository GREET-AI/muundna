'use client';

import { Suspense } from 'react';
import QuizFunnel from '@/app/components/QuizFunnel';

export default function QuizFunnelClient({ productSlug, productTitle }: { productSlug: string; productTitle: string }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Laden…</p>
        </div>
      }
    >
      <QuizFunnel
        productSlug={productSlug}
        successBackHref={`/p/${productSlug}`}
        successBackLabel={`Zurück zu ${productTitle}`}
      />
    </Suspense>
  );
}
