'use client';

import { useEffect, useState } from 'react';
import { getHoursStatus, cn, type BusinessHour, type HoursStatus } from '@/lib/utils';

const DOT_TONE = {
  open: 'bg-success',
  'closing-soon': 'bg-warning',
  break: 'bg-warning',
  closed: 'bg-danger',
} as const;

const TEXT_TONE = {
  open: 'text-success',
  'closing-soon': 'text-warning',
  break: 'text-warning',
  closed: 'text-danger',
} as const;

/**
 * D2 — the live "are they open right now" dot. The status is resolved after
 * mount and re-resolved every minute: rendering it on the server would bake a
 * build-time clock into a static page and hydrate wrong an hour later.
 */
export function ClinicStatusBadge({
  hours,
  className,
}: {
  hours: BusinessHour[];
  className?: string;
}) {
  const [status, setStatus] = useState<HoursStatus | null>(null);

  useEffect(() => {
    const read = () => setStatus(getHoursStatus(hours, new Date()));
    read();
    const timer = setInterval(read, 60_000);

    return () => clearInterval(timer);
  }, [hours]);

  if (!status) {
    return (
      <span
        aria-hidden
        className={cn('inline-flex h-7 w-40 rounded-full bg-surface-2 opacity-60', className)}
      />
    );
  }

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1',
        className,
      )}
    >
      <span className="relative flex size-2.5 shrink-0" aria-hidden>
        {status.state === 'open' ? (
          <span
            className={cn(
              'absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:hidden',
              DOT_TONE[status.state],
            )}
          />
        ) : null}
        <span className={cn('relative inline-flex size-2.5 rounded-full', DOT_TONE[status.state])} />
      </span>

      <span className={cn('text-small font-semibold', TEXT_TONE[status.state])}>
        {status.label}
      </span>
      <span aria-hidden className="text-small text-fg-subtle">
        ·
      </span>
      <span className="text-small text-fg-muted">{status.detail}</span>
    </span>
  );
}
