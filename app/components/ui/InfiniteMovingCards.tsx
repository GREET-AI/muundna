'use client';

import { cn } from '../../lib/utils';

export interface InfiniteMovingCardsItem {
  quote: string;
  name: string;
  title: string;
  imageUrl?: string;
}

interface InfiniteMovingCardsProps {
  items: InfiniteMovingCardsItem[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow' | 'slower';
  pauseOnHover?: boolean;
  className?: string;
  /** Theme-Akzentfarbe für Avatar-Ring und Hover (z. B. #cb530a oder Primärfarbe der Seite) */
  primaryColor?: string;
}

const speedMap = {
  fast: '25s',
  normal: '40s',
  slow: '60s',
  slower: '85s',
};

const DEFAULT_PRIMARY = '#cb530a';

export function InfiniteMovingCards({
  items,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className,
  primaryColor = DEFAULT_PRIMARY,
}: InfiniteMovingCardsProps) {
  const duration = speedMap[speed];
  const duplicated = [...items, ...items];
  const avatarBg = primaryColor.replace(/^#/, '');

  return (
    <div
      className={cn(
        'relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]',
        pauseOnHover && 'group',
        className
      )}
    >
      <div
        className={cn(
          'flex shrink-0 gap-6 md:gap-10 py-8 md:py-10 animate-infinite-scroll',
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
        style={
          {
            '--infinite-scroll-duration': duration,
            animationDirection: direction === 'right' ? 'reverse' : 'normal',
          } as React.CSSProperties
        }
      >
        {duplicated.map((item, i) => (
          <Card key={`${i}-${item.name}`} item={item} primaryColor={primaryColor} avatarBg={avatarBg} />
        ))}
      </div>
    </div>
  );
}

function Card({ item, primaryColor, avatarBg }: { item: InfiniteMovingCardsItem; primaryColor: string; avatarBg: string }) {
  const avatarSrc =
    item.imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=${avatarBg}&color=fff&size=96`;

  return (
    <figure
      className="group/card relative flex w-[320px] md:w-[380px] shrink-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-lg origin-center transition-transform duration-300 ease-out hover:scale-[1.05] hover:shadow-xl hover:border-[var(--card-accent-30)]"
      style={{ ['--card-accent']: primaryColor, ['--card-accent-30']: `${primaryColor}4d` } as React.CSSProperties}
    >
      <blockquote className="text-gray-700 text-sm md:text-base leading-relaxed">
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <div className="overflow-hidden rounded-full h-12 w-12 shrink-0 ring-2 bg-gray-100" style={{ borderColor: `${primaryColor}4d`, boxShadow: `0 0 0 2px ${primaryColor}4d` }}>
          <img src={avatarSrc} alt={item.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
          <div className="text-xs text-gray-500">{item.title}</div>
        </div>
      </figcaption>
    </figure>
  );
}
