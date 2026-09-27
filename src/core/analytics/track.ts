import { track as vercelTrack } from '@vercel/analytics';
import { EVENTS, type EventName, type EventProps } from './events';

/**
 * Provider-agnostic dispatcher. Every provider is optional and failure is
 * always swallowed — analytics must never be able to break a lead.
 */

/** Keys that could carry PII; dropped before anything leaves the browser. */
const BLOCKED_PROP_KEYS = /(phone|whatsapp|email|mobile|name|address|pincode|message)/i;

type PlausibleFn = (event: string, options?: { props?: EventProps }) => void;

interface AnalyticsWindow extends Window {
  plausible?: PlausibleFn;
}

let enabled = false;
let debug = false;
/** Ambient props (role, locale) merged into every event. */
let context: EventProps = {};

/** Called once by <AnalyticsProvider>; `flags.analytics` decides `on`. */
export function configureAnalytics(options: {
  enabled: boolean;
  context?: EventProps;
  debug?: boolean;
}): void {
  enabled = options.enabled;
  context = options.context ?? {};
  debug = options.debug ?? false;
}

export function isAnalyticsEnabled(): boolean {
  return enabled;
}

function sanitize(props: EventProps): EventProps {
  const safe: EventProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (BLOCKED_PROP_KEYS.test(key)) continue;
    safe[key] = value;
  }
  return safe;
}

/** Fire one event at every configured provider. Safe to call anywhere. */
export function track(event: EventName, props: EventProps = {}): void {
  const payload = { ...sanitize(context), ...sanitize(props) };

  if (debug) console.debug('[analytics]', event, payload);
  if (!enabled || typeof window === 'undefined') return;

  try {
    vercelTrack(event, payload);
  } catch {
    // provider missing in this deployment — nothing to do
  }

  try {
    (window as AnalyticsWindow).plausible?.(event, { props: payload });
  } catch {
    // Plausible is opt-in; absence is the normal case
  }
}

/** Convenience wrapper so CTA call sites stay one line. */
export function trackCta(label: string, section: string, props: EventProps = {}): void {
  track(EVENTS.CTA_CLICK, { label, section, ...props });
}
