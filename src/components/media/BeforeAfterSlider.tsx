// Source: Aceternity UI "Compare" — https://ui.aceternity.com/components/compare
// License: MIT (https://github.com/aceternity-ui) — free to use, no attribution required.
// Adapted for this project: SparklesCore + hardcoded indigo/cyan/white removed in favour of
// semantic tokens, next/image via <SmartImage>, keyboard support, reduced-motion guard.
'use client';

import { useCallback, useRef, useState } from 'react';
import { GripVertical } from 'lucide-react';
import { AspectBox } from './AspectBox';
import { SmartImage } from './SmartImage';
import { cn } from '@/lib/utils';

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Before',
  afterLabel = 'After',
  ratio = '4/3',
  initial = 50,
  slideMode = 'drag',
  sizes = '(min-width: 768px) 50vw, 100vw',
  className,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  ratio?: string;
  initial?: number;
  slideMode?: 'hover' | 'drag';
  sizes?: string;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(initial);
  const [dragging, setDragging] = useState(false);

  const moveTo = useCallback(
    (clientX: number) => {
      const rect = boxRef.current?.getBoundingClientRect();
      if (!rect) return;
      const next = ((clientX - rect.left) / rect.width) * 100;
      setPercent(Math.max(0, Math.min(100, next)));
    },
    [],
  );

  const onPointerMove = (e: React.PointerEvent) => {
    if (slideMode === 'hover' || dragging) moveTo(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPercent((p) => Math.max(0, p - 4));
    if (e.key === 'ArrowRight') setPercent((p) => Math.min(100, p + 4));
    if (e.key === 'Home') setPercent(0);
    if (e.key === 'End') setPercent(100);
  };

  return (
    <div ref={boxRef} className={cn('relative select-none', className)}>
      <AspectBox ratio={ratio} className="border border-border">
        {/* after = base layer */}
        <SmartImage src={afterSrc} alt={afterLabel} sizes={sizes} priority={false} />

        {/* before = clipped overlay */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        >
          <SmartImage src={beforeSrc} alt={beforeLabel} sizes={sizes} />
        </div>

        <span className="text-caption absolute top-3 left-3 rounded-full bg-surface/85 px-2.5 py-1 text-fg-muted backdrop-blur">
          {beforeLabel}
        </span>
        <span className="text-caption absolute top-3 right-3 rounded-full bg-surface/85 px-2.5 py-1 text-fg-muted backdrop-blur">
          {afterLabel}
        </span>

        {/* divider + handle */}
        <div
          className="absolute inset-y-0 z-20 w-px bg-accent"
          style={{ left: `${percent}%` }}
          aria-hidden
        />
        <button
          type="button"
          role="slider"
          aria-label={`${beforeLabel} / ${afterLabel} comparison`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percent)}
          onKeyDown={onKeyDown}
          onPointerDown={(e) => {
            if (slideMode === 'drag') {
              setDragging(true);
              e.currentTarget.setPointerCapture(e.pointerId);
            }
          }}
          onPointerUp={() => setDragging(false)}
          onPointerMove={onPointerMove}
          className={cn(
            'absolute top-1/2 z-30 flex size-9 -translate-x-1/2 -translate-y-1/2',
            'cursor-ew-resize items-center justify-center rounded-full',
            'bg-accent text-accent-fg shadow-md transition-transform duration-150',
            dragging && 'scale-110',
          )}
          style={{ left: `${percent}%` }}
        >
          <GripVertical className="size-5" aria-hidden />
        </button>

        {/* hover/drag surface */}
        <div
          className="absolute inset-0 z-10"
          onPointerMove={onPointerMove}
          onPointerUp={() => setDragging(false)}
          onPointerLeave={() => {
            setDragging(false);
            if (slideMode === 'hover') setPercent(initial);
          }}
        />
      </AspectBox>
    </div>
  );
}
