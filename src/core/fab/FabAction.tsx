'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FabTone = 'brand' | 'accent' | 'danger';

export interface FabActionItem {
  key: string;
  label: string;
  icon: LucideIcon;
  tone: FabTone;
  /** Either an href (tel:/maps) or a click handler (WhatsApp goes through core). */
  href?: string;
  onClick?: () => void;
}

const toneClasses: Record<FabTone, string> = {
  brand: 'bg-brand text-brand-fg hover:bg-brand/90',
  accent: 'bg-accent text-accent-fg hover:bg-accent/90',
  danger: 'bg-danger text-bg hover:bg-danger/90',
};

export interface FabActionProps {
  action: FabActionItem;
  /** Desktop dock shows a hover/focus tooltip; the mobile pill does not. */
  withTooltip?: boolean;
  /** Idle attention ring, used once per session on the primary action. */
  pulsing?: boolean;
  className?: string;
}

export function FabAction({ action, withTooltip, pulsing, className }: FabActionProps) {
  const { label, icon: Icon, tone, href, onClick } = action;

  const content = (
    <>
      <Icon className="size-5" aria-hidden />
      {pulsing ? (
        <span
          aria-hidden
          className="ring-brand/60 pointer-events-none absolute inset-0 animate-ping rounded-full ring-2"
        />
      ) : null}
      {withTooltip ? (
        <span
          role="tooltip"
          className="bg-surface-elevated text-fg border-border pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md border px-2 py-1 text-xs opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
        >
          {label}
        </span>
      ) : null}
    </>
  );

  const classes = cn(
    'group focus-visible:ring-ring relative flex size-12 items-center justify-center rounded-full shadow-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    toneClasses[tone],
    className,
  );

  if (href) {
    return (
      <a href={href} aria-label={label} className={classes} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" aria-label={label} className={classes} onClick={onClick}>
      {content}
    </button>
  );
}
