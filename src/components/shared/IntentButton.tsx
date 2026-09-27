'use client';

import { Button } from '@/components/ui/button';
import { VCardButton } from '@/core/vcard';
import { openIntent, type IntentKey, type MessageField } from '@/core/whatsapp';
import { trackCta } from '@/core/analytics';
import { useRole } from '@/lib/hooks/useRole';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg';

/**
 * The only way a section turns a `data.*.intent` into a click. Every WhatsApp
 * link in the product therefore comes from `@/core/whatsapp` — sections never
 * assemble a `wa.me` URL, and `vcard_download` is routed to the vCard flow
 * instead of to chat.
 */
export function IntentButton({
  intent,
  label,
  section,
  variant = 'default',
  size = 'lg',
  icon,
  className,
  values,
}: {
  intent: IntentKey;
  label: string;
  /** Section key, so analytics can attribute the click. */
  section: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  className?: string;
  /** Extra `[label, value]` lines for the outgoing message. */
  values?: MessageField[];
}) {
  const { data } = useRole();
  const classes = cn('h-11 px-5 text-body', className);

  if (intent === 'vcard_download') {
    return <VCardButton label={label} variant={variant} size={size} className={classes} />;
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={classes}
      onClick={() => {
        trackCta(label, section, { intent });
        openIntent({
          phone: data.contact.whatsapp,
          intent,
          business: data.profile.name,
          values,
          source: section,
          section,
        });
      }}
    >
      {icon}
      {label}
    </Button>
  );
}
