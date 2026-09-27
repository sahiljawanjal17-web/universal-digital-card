/**
 * The ONE place a `wa.me` URL is allowed to be constructed
 * (docs/07-CONVENTIONS.md hard rule #5).
 */
import { toWaNumber } from '@/lib/utils/phone';
import { truncate, tidy } from './format';

export interface BuildWhatsAppLinkOptions {
  /** E.164, e.g. `+919876543210`. */
  phone: string;
  message: string;
  /** UTM-ish tag appended to the message body, not the URL. */
  source?: string;
}

const WA_BASE = 'https://wa.me';

/**
 * `encodeURIComponent` happens here and nowhere else, so a template author can
 * never double-encode a message.
 */
export function buildWhatsAppLink({ phone, message, source }: BuildWhatsAppLinkOptions): string {
  const number = toWaNumber(phone);
  if (!number) throw new Error(`buildWhatsAppLink: cannot derive a wa.me number from "${phone}"`);

  const tagged = source ? `${tidy(message)}\n(ref: ${source})` : tidy(message);
  const text = encodeURIComponent(truncate(tagged));
  return `${WA_BASE}/${number}?text=${text}`;
}

/** Same link without a message — used by "just chat" affordances. */
export function buildWhatsAppChatLink(phone: string): string {
  return `${WA_BASE}/${toWaNumber(phone)}`;
}
