'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

/**
 * The consent gate every lead form must pass before a message can be sent.
 * The wording is never written here — it comes from `data.leadForm.consentText`.
 */
export function ConsentCheckbox({
  id,
  text,
  checked,
  onChange,
  error,
  className,
}: {
  id: string;
  text: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  className?: string;
}) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(value) => onChange(value === true)}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className="mt-0.5"
        />
        <label htmlFor={id} className="text-small text-fg-muted">
          {text}
        </label>
      </div>

      {error ? (
        <p id={errorId} className="text-small text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
