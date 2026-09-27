'use client';

import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Indian mobile input. The `+91` is furniture rather than a value, so what the
 * visitor types is always the bare 10 digits the lead schema validates —
 * pasted numbers with spaces, dashes or a country prefix are cleaned on entry.
 */
export const PhoneField = forwardRef<
  HTMLInputElement,
  {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    error?: string;
    required?: boolean;
    className?: string;
  }
>(function PhoneField({ id, label, value, onChange, onBlur, error, required, className }, ref) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </Label>

      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border border-border bg-surface pl-3 focus-within:border-brand',
          error && 'border-danger',
        )}
      >
        <span aria-hidden className="text-body text-fg-subtle">
          +91
        </span>
        <Input
          ref={ref}
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          placeholder="98765 43210"
          value={value}
          onBlur={onBlur}
          onChange={(event) => onChange(normalise(event.target.value))}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className="border-0 bg-transparent pl-0 shadow-none focus-visible:ring-0"
        />
      </div>

      {error ? (
        <p id={errorId} className="text-small text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
});

/** Strips everything but digits and drops a pasted 91 / 0 prefix. */
function normalise(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const trimmed = digits.startsWith('91') && digits.length > 10 ? digits.slice(2) : digits;
  return (trimmed.startsWith('0') ? trimmed.slice(1) : trimmed).slice(0, 10);
}
