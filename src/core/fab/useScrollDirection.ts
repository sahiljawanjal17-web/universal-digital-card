'use client';

import { useEffect, useState } from 'react';

export type ScrollDirection = 'up' | 'down';

/**
 * rAF-throttled scroll direction. The 12px threshold (docs/04-DESIGN-SYSTEM §7)
 * stops momentum scrolling from flickering the FAB.
 */
export function useScrollDirection(threshold = 12): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>('up');

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      if (Math.abs(y - lastY) >= threshold) {
        setDirection(y > lastY ? 'down' : 'up');
        lastY = y;
      }
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return direction;
}
