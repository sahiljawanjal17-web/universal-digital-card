'use client';

import type { IntentKey } from '@/lib/constants/intents';
import { EVENTS, track } from '@/core/analytics';
import { buildWhatsAppLink } from './build-link';
import { buildIntentMessage } from './templates';
import type { MessageField } from './templates/base';

/**
 * On a phone the wa.me link must replace the current page — `window.open`
 * leaves an orphan tab behind after the app handover. Desktop gets a new tab.
 */
function isHandheld(): boolean {
  if (typeof navigator === 'undefined') return false;
  const coarse = navigator.maxTouchPoints > 1;
  const ua = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
  return coarse && ua;
}

export interface OpenWhatsAppMeta {
  intent?: IntentKey;
  section?: string;
  label?: string;
}

/** Tracks first, then hands over — a navigation can cancel a pending beacon. */
export function openWhatsApp(link: string, meta: OpenWhatsAppMeta = {}): void {
  track(EVENTS.LEAD_WHATSAPP_OPEN, {
    intent: meta.intent ?? null,
    section: meta.section ?? null,
    label: meta.label ?? null,
  });

  if (typeof window === 'undefined') return;

  if (isHandheld()) {
    window.location.href = link;
    return;
  }
  window.open(link, '_blank', 'noopener,noreferrer');
}

export interface OpenIntentOptions {
  phone: string;
  intent: IntentKey;
  business: string;
  values?: MessageField[];
  note?: string;
  /** UTM-ish tag, e.g. `fab` or `hero-cta`. */
  source?: string;
  section?: string;
}

/**
 * The one-call path a section should use: intent in, WhatsApp open out.
 * Returns the link so callers can also render it as an `href`.
 */
export function openIntent(options: OpenIntentOptions): string {
  const { phone, intent, business, values, note, source, section } = options;
  const message = buildIntentMessage({ intent, business, values, note });
  const link = buildWhatsAppLink({ phone, message, source });
  openWhatsApp(link, { intent, section, label: source });
  return link;
}
