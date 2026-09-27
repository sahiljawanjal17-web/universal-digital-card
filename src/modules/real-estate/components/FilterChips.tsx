'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * One toggleable facet value. Chips beat a multi-select on a phone, and
 * `aria-pressed` keeps the state audible to a screen reader.
 */
export function FilterChip({
  label,
  active,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-lg border px-3 py-1.5 text-small transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        active
          ? 'border-brand bg-brand text-brand-fg'
          : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg',
        className,
      )}
    >
      {label}
    </button>
  );
}

export function ChipGroup({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-caption font-medium uppercase tracking-wide text-fg-subtle">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export interface ActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

/** Removable summary of what is currently narrowing the list. */
export function ActiveFilterChips({
  filters,
  onReset,
}: {
  filters: ActiveFilter[];
  onReset: () => void;
}) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={filter.onRemove}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface-2 px-2.5 py-1 text-caption text-fg transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {filter.label}
          <X className="size-3.5 text-fg-subtle" aria-hidden />
          <span className="sr-only">Remove filter</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="text-caption font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Clear all
      </button>
    </div>
  );
}
