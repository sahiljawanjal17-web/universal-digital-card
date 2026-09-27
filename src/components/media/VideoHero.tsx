'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { AspectBox } from './AspectBox';
import { cn } from '@/lib/utils';

/**
 * Poster-first hero video. The <source> is only attached once the box is near
 * the viewport, so nothing downloads above the fold cost. Muted + playsInline
 * are what make autoplay legal on mobile Safari; with reduced motion we never
 * attach the source at all and the poster stays.
 */
export function VideoHero({
  src,
  poster,
  ratio = '16/9',
  className,
  loop = true,
  ariaLabel,
}: {
  src: string;
  poster: string;
  ratio?: string;
  className?: string;
  loop?: boolean;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (active) ref.current?.load();
  }, [active]);

  return (
    <AspectBox ratio={ratio} className={className}>
      <video
        ref={ref}
        poster={poster}
        aria-label={ariaLabel}
        muted
        playsInline
        autoPlay={!reduced}
        loop={loop}
        preload="metadata"
        controls={false}
        disablePictureInPicture
        className={cn('absolute inset-0 size-full object-cover')}
      >
        {active && !reduced ? <source src={src} type="video/mp4" /> : null}
      </video>
    </AspectBox>
  );
}
