'use client';

import { motion } from 'motion/react';
import { Download, MessageCircle, Phone } from 'lucide-react';
import { useFabVisibility } from '@/core/fab';
import { openIntent } from '@/core/whatsapp';
import { useVCard } from '@/core/vcard';
import { trackCta } from '@/core/analytics';
import { useRole } from '@/lib/hooks/useRole';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { toTelHref } from '@/lib/utils';
import { cn } from '@/lib/utils';

const SECTION = 'stickyBar';

/**
 * The phone-sized contact bar. It shares `useFabVisibility()` with the
 * floating dock, so both step aside for the same `data-fab-hide` sections —
 * and the dock itself is desktop-only, so the two never stack.
 */
export function StickyBottomBar() {
  const { data } = useRole();
  const visible = useFabVisibility();
  const reducedMotion = useReducedMotion();
  const { download, isDownloading } = useVCard();

  const { contact, profile } = data;

  return (
    <motion.div
      aria-label="Contact actions"
      className="fixed inset-x-0 bottom-0 z-(--z-fab) border-t border-border bg-bg/95 supports-backdrop-filter:bg-bg/80 supports-backdrop-filter:backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      initial={false}
      animate={{ y: visible ? 0 : '110%' }}
      transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 32 }}
    >
      <div className="grid grid-cols-3 gap-1 px-2 py-2">
        <a
          href={toTelHref(contact.phone)}
          onClick={() => trackCta('Call', SECTION, { action: 'call' })}
          className={cn(itemClass, 'text-fg-muted hover:bg-surface hover:text-fg')}
        >
          <Phone className="size-5" aria-hidden />
          Call
        </a>

        <button
          type="button"
          onClick={() => {
            trackCta('WhatsApp', SECTION, { action: 'whatsapp' });
            openIntent({
              phone: contact.whatsapp,
              intent: data.leadForm.intent,
              business: profile.name,
              source: SECTION,
              section: SECTION,
            });
          }}
          className={cn(itemClass, 'bg-brand text-brand-fg hover:opacity-90')}
        >
          <MessageCircle className="size-5" aria-hidden />
          WhatsApp
        </button>

        <button
          type="button"
          onClick={() => {
            trackCta('Save contact', SECTION, { action: 'vcard' });
            download();
          }}
          disabled={isDownloading}
          className={cn(itemClass, 'text-fg-muted hover:bg-surface hover:text-fg')}
        >
          <Download className="size-5" aria-hidden />
          Save
        </button>
      </div>
    </motion.div>
  );
}

const itemClass =
  'flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 text-caption font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';
