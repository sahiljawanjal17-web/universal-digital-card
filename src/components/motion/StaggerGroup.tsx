'use client';

import { Children } from 'react';
import { Reveal } from './Reveal';
import { cn } from '@/lib/utils';

/**
 * Staggers its direct children with the 0.08s rhythm from the motion spec.
 * Usage: <StaggerGroup className="grid gap-4">{cards}</StaggerGroup>
 */
export function StaggerGroup({
  children,
  className,
  step = 0.08,
  startDelay = 0,
  itemClassName,
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
  startDelay?: number;
  itemClassName?: string;
}) {
  return (
    <div className={cn(className)}>
      {Children.map(children, (child, i) => (
        <Reveal className={itemClassName} delay={startDelay + i * step}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
