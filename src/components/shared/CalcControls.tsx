'use client';

import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

/**
 * Calculators across role modules share one control vocabulary — a labelled slider, a
 * labelled number box and a result tile — so they read as one tool set instead
 * of four separately-styled forms.
 */

// The base slider's 4px hairline track disappears on a muted section; every
// slider built on this control thickens it the same way (PART-05 §9 gotchas).
const SLIDER_CLASS =
  '[&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-brand [&_[data-slot=slider-track]]:h-1.5 [&_[data-slot=slider-track]]:bg-surface-2';

export function CalcSlider({
  label,
  display,
  value,
  min,
  max,
  step,
  onChange,
  onCommit,
  hint,
}: {
  label: string;
  /** Formatted value shown beside the label. */
  display: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
  onCommit?: () => void;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-caption font-medium uppercase tracking-wide text-fg-subtle">
          {label}
        </span>
        <span className="text-small font-semibold text-fg">{display}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        className={SLIDER_CLASS}
        onValueChange={(next) => {
          const picked = Array.isArray(next) ? next[0] : next;
          if (typeof picked === 'number') onChange(picked);
        }}
        onValueCommitted={onCommit}
      />
      {hint ? <p className="text-caption text-fg-subtle">{hint}</p> : null}
    </div>
  );
}

export function CalcNumber({
  label,
  value,
  onChange,
  min = 0,
  step = 1,
  prefix,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-caption font-medium uppercase tracking-wide text-fg-subtle">
        {label}
      </Label>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-small text-fg-muted">
            {prefix}
          </span>
        ) : null}
        <Input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : ''}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(Number.isFinite(next) ? Math.max(min, next) : min);
          }}
          className={cn('h-11', prefix && 'pl-7', suffix && 'pr-10')}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-small text-fg-muted">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? <p className="text-caption text-fg-subtle">{hint}</p> : null}
    </div>
  );
}

export function ResultStat({
  label,
  value,
  tone = 'default',
  className,
}: {
  label: string;
  value: React.ReactNode;
  tone?: 'default' | 'brand' | 'muted';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-xl border border-border px-4 py-3',
        tone === 'brand' ? 'bg-brand-muted' : 'bg-surface',
        className,
      )}
    >
      <span className="text-caption uppercase tracking-wide text-fg-subtle">{label}</span>
      <span
        className={cn(
          'text-body-lg font-semibold tabular-nums',
          tone === 'muted' ? 'text-fg-muted' : 'text-fg',
        )}
      >
        {value}
      </span>
    </div>
  );
}

/** Label / amount line used by the stamp-duty and rent-vs-buy breakdowns. */
export function ResultRow({
  label,
  value,
  hint,
  strong = false,
}: {
  label: string;
  value: string;
  hint?: string;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-4 py-2',
        strong ? 'border-t border-border-strong pt-3 text-body font-semibold text-fg' : 'text-body text-fg-muted',
      )}
    >
      <span className="flex flex-col">
        {label}
        {hint ? <span className="text-caption text-fg-subtle">{hint}</span> : null}
      </span>
      <span className={cn('shrink-0 tabular-nums', strong ? 'text-fg' : 'font-medium text-fg')}>
        {value}
      </span>
    </div>
  );
}
