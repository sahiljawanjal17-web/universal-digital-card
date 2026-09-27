'use client';

import { useEffect, useState } from 'react';
import { useScrollDirection } from './useScrollDirection';

/** Sections that must not be covered by the FAB opt in with this attribute. */
export const FAB_HIDE_ATTR = 'data-fab-hide';

/** Below this we never hide — a FAB that vanishes on the hero looks broken. */
const REVEAL_OFFSET = 160;

/**
 * The FAB hides while scrolling down, and also whenever a footer CTA (any
 * element carrying `data-fab-hide`) is on screen — two CTAs stacked on top of
 * each other read as a bug.
 */
export function useFabVisibility(): boolean {
  const direction = useScrollDirection();
  const [pastFold, setPastFold] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    function onScroll() {
      setPastFold(window.scrollY > REVEAL_OFFSET);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll(`[${FAB_HIDE_ATTR}]`);
    if (targets.length === 0) return;

    const overlapping = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) overlapping.add(entry.target);
          else overlapping.delete(entry.target);
        }
        setBlocked(overlapping.size > 0);
      },
      // Only the lower slice of the viewport can actually collide with the FAB.
      { rootMargin: '0px 0px -40% 0px', threshold: 0.1 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return !blocked && (!pastFold || direction === 'up');
}
