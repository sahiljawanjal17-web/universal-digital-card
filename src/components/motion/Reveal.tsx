'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

/**
 * The section reveal every block uses — y 16 -> 0, blur 6px -> 0, 0.5s.
 * Sections never write raw `motion.div`; they wrap children in <Reveal>.
 * With reduced motion the content renders immediately, no transform.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  offset = 16,
  once = true,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  offset?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'li' | 'span';
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, margin: '-60px' });
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      ref={ref as React.Ref<never>}
      className={cn(className)}
      initial={{ opacity: 0, y: offset, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
