'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';
import {cn} from '@/lib/cn';

/**
 * Fades content up once it scrolls into view. Only use below the fold.
 * Content is hidden only when JavaScript runs (the `js` class set in the layout),
 * so it stays visible without JS; reduced motion skips the movement.
 */
export function Reveal({children, delay = 0, className}: {children: ReactNode; delay?: number; className?: string}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      {rootMargin: '0px 0px -12% 0px'}
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal={shown ? 'in' : 'out'} style={{transitionDelay: `${delay}s`}} className={cn('reveal', className)}>
      {children}
    </div>
  );
}
