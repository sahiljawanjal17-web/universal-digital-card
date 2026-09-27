'use client';

import { Search } from 'lucide-react';
import { COMMAND_PALETTE_EVENT } from '@/lib/constants/ui-events';
import { trackCta } from '@/core/analytics';

/** The navbar's hint that ⌘K exists — pointer users get a button too. */
export function CommandPaletteTrigger() {
  return (
    <button
      type="button"
      onClick={() => {
        trackCta('Command palette', 'navbar');
        window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT));
      }}
      aria-label="Open the command palette"
      className="hidden h-9 items-center gap-2 rounded-lg border border-border px-2.5 text-caption text-fg-subtle transition-colors hover:bg-surface hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:flex"
    >
      <Search className="size-3.5" aria-hidden />
      <kbd className="font-sans">⌘K</kbd>
    </button>
  );
}
