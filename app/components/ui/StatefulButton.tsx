'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface StatefulButtonProps {
  children: React.ReactNode;
  onClick?: () => Promise<void> | void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function StatefulButton({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false
}: StatefulButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleClick = async () => {
    if (state !== 'idle' || disabled) return;
    
    setState('loading');
    try {
      if (onClick) {
        await onClick();
      }
      setState('success');
      setTimeout(() => setState('idle'), 2000);
    } catch (error) {
      setState('idle');
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || state !== 'idle'}
      className={`relative inline-flex items-center justify-center px-8 py-4 font-semibold rounded-lg shadow-lg transition-all duration-300 overflow-hidden transform ${
        disabled || state !== 'idle'
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:scale-105 active:scale-95'
      } ${
        state === 'idle'
          ? 'bg-[#cb530a] text-white hover:bg-[#a84308] hover:shadow-xl'
          : state === 'loading'
          ? 'bg-[#cb530a] text-white cursor-wait'
          : 'bg-green-600 text-white'
      } ${className}`}
    >
      {state === 'idle' && <span>{children}</span>}
      {state === 'loading' && (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          <span>Wird gesendet...</span>
        </>
      )}
      {state === 'success' && (
        <>
          <Check className="w-5 h-5 mr-2" />
          <span>Gesendet!</span>
        </>
      )}
    </button>
  );
}
