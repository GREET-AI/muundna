'use client';

import { Suspense } from 'react';
import QuizFunnel from '../../components/QuizFunnel';

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Laden…</p>
        </div>
      }
    >
      <QuizFunnel />
    </Suspense>
  );
}
