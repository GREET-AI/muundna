'use client';

import { cn } from '../../lib/utils';

interface ShimmerButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export default function ShimmerButton({
  children,
  className,
  onClick,
  type = 'button',
}: ShimmerButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        'relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-[#cb530a] focus:ring-offset-2',
        className
      )}
    >
      <span className="absolute inset-[-1000%] animate-[shimmer_3s_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#cb530a_0%,#182c30_50%,#cb530a_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-[#cb530a] px-8 py-3 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:bg-[#a84308]">
        {children}
      </span>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </button>
  );
}

