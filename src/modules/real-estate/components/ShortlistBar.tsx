'use client';

import { Heart, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ShortlistState } from '../hooks/useShortlist';

/**
 * R9 — floating shortlist bar. Appears at the top of the property browser
 * section whenever the visitor has ♡-ed at least one listing. The count,
 * WhatsApp send and clear actions are all driven by `useShortlist`.
 */
export function ShortlistBar({
  state,
  className,
}: {
  state: ShortlistState;
  className?: string;
}) {
  const { count, sendOnWhatsApp, clear } = state;

  if (count === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center justify-between gap-3 rounded-xl border border-brand/30 bg-brand-muted px-4 py-3',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Heart className="size-4 fill-brand text-brand" aria-hidden />
        <span className="text-small font-semibold text-fg">
          {count} {count === 1 ? 'property' : 'properties'} shortlisted
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={sendOnWhatsApp}
          className="h-9 gap-1.5"
          aria-label="Send shortlist on WhatsApp"
        >
          <Send className="size-4" aria-hidden />
          <span className="hidden sm:inline">Send on WhatsApp</span>
          <span className="sm:hidden">Send</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clear}
          className="size-9 text-fg-muted hover:text-danger"
          aria-label="Clear shortlist"
        >
          <Trash2 className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

