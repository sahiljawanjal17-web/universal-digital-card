'use client';

import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { formatINRShort } from '@/lib/utils';

/**
 * Dual-range budget control. Dragging is local state so the URL is only
 * rewritten when the thumb is released — otherwise every pixel would push a
 * history entry and re-filter the list.
 */
export function BudgetSlider({
  range,
  step,
  value,
  onCommit,
}: {
  range: [number, number];
  step: number;
  value: [number, number] | null;
  onCommit: (next: [number, number] | null) => void;
}) {
  const [lo, hi] = range;
  const [draft, setDraft] = useState<[number, number]>(value ?? range);

  useEffect(() => {
    setDraft(value ?? range);
  }, [value, range]);

  const commit = (next: [number, number]) => {
    const isFullRange = next[0] <= lo && next[1] >= hi;
    onCommit(isFullRange ? null : next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-caption font-medium uppercase tracking-wide text-fg-subtle">
          Budget
        </span>
        <span className="text-small font-medium text-fg">
          {formatINRShort(draft[0])} – {formatINRShort(draft[1])}
        </span>
      </div>
      <Slider
        min={lo}
        max={hi}
        step={step}
        value={draft}
        aria-label="Budget range"
        // The base slider's 4px hairline track all but disappears against a
        // muted section, and a budget range has to be readable at a glance.
        className="[&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-brand [&_[data-slot=slider-track]]:h-1.5 [&_[data-slot=slider-track]]:bg-surface-2"
        onValueChange={(next) => {
          if (Array.isArray(next)) setDraft([next[0], next[1]]);
        }}
        onValueCommitted={(next) => {
          if (Array.isArray(next)) commit([next[0], next[1]]);
        }}
      />
    </div>
  );
}
