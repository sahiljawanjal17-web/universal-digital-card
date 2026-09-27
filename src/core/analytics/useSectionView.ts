'use client';

import { useEffect, useRef } from 'react';
import { EVENTS } from './events';
import { track } from './track';

/**
 * Fires `section_view` the first time a section is meaningfully on screen.
 * PART-04's SectionRenderer attaches the returned ref to every section wrapper.
 */
export function useSectionView<T extends HTMLElement = HTMLElement>(
  section: string,
  { threshold = 0.4 }: { threshold?: number } = {},
) {
  const ref = useRef<T>(null);
  const fired = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || fired.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || fired.current) return;
        fired.current = true;
        track(EVENTS.SECTION_VIEW, { section });
        observer.disconnect();
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [section, threshold]);

  return ref;
}
