'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

/**
 * Pointer-magnet wrapper for primary CTAs: the element leans toward the cursor
 * and springs back. Press feedback is the spec's { stiffness: 400, damping: 25 }.
 * Touch devices and reduced-motion users get a plain element.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.25,
  ...rest
}: Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'style'
> & { strength?: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  function handleMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setOffset({
      x: (e.clientX - (rect.left + rect.width / 2)) * strength,
      y: (e.clientY - (rect.top + rect.height / 2)) * strength,
    });
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      className={cn('inline-flex items-center justify-center', className)}
      onPointerMove={handleMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      animate={reduced ? { x: 0, y: 0 } : offset}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
