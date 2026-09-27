'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IntentButton } from './IntentButton';
import { useExitIntent } from '@/lib/hooks/useExitIntent';
import { EVENTS, track } from '@/core/analytics';
import { useRole } from '@/lib/hooks/useRole';

const SECTION = 'exitIntent';
const SEEN_KEY = 'exit-intent-shown';

/**
 * One last offer on the way out, gated by `flags.exitIntentLead` and shown at
 * most once per session. The offer itself is `data.leadForm`, so no copy in
 * this file belongs to a role.
 */
export function ExitIntentDialog() {
  const { site, data } = useRole();
  const enabled = site.flags.exitIntentLead;
  const [open, setOpen] = useState(false);

  const triggered = useExitIntent(enabled);

  useEffect(() => {
    if (!triggered) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // Private mode: showing it once per page load is close enough.
    }
    setOpen(true);
    track(EVENTS.LEAD_START, { section: SECTION });
  }, [triggered]);

  if (!enabled) return null;

  const { leadForm, profile } = data;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-h3 font-display">{leadForm.title}</DialogTitle>
          <DialogDescription className="text-body text-fg-muted">
            {leadForm.subtitle || `Send ${profile.name} a message before you go.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 sm:flex-row">
          <IntentButton
            intent={leadForm.intent}
            label={data.cta.primary.label}
            section={SECTION}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-11 rounded-lg px-5 text-body text-fg-muted transition-colors hover:bg-surface hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Not now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
