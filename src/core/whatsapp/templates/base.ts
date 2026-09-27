/**
 * The message envelope every intent shares — docs/07-CONVENTIONS.md §7:
 *
 *   *<Intent Title>*
 *
 *   <label>: <value>
 *
 *   <optional note>
 *
 *   — via <business name> website
 */
import type { IntentKey } from '@/lib/constants/intents';
import { bold, field, section, tidy } from '../format';

/** `[label, value]`. A pair with an empty value is dropped, not printed blank. */
export type MessageField = [label: string, value: string | number | null | undefined];

export interface BuildMessageOptions {
  title: string;
  fields?: MessageField[];
  note?: string;
  business: string;
  /** Conventions §7 allows at most 2 emoji; this is the header one. */
  emoji?: string;
}

export function buildMessage({
  title,
  fields = [],
  note,
  business,
  emoji,
}: BuildMessageOptions): string {
  const header = bold(emoji ? `${emoji} ${title}` : title);
  const body = fields
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
    .map(([label, value]) => field(label, String(value).trim()))
    .join('\n');

  return tidy(section(header, body, note, `— via ${business} website`));
}

/**
 * Human titles for the shared intent vocabulary. Keyed by intent, so adding a
 * role never means touching a conditional.
 */
export const INTENT_TITLES: Record<IntentKey, string> = {
  general_inquiry: 'General Enquiry',
  callback_request: 'Callback Request',
  vcard_download: 'Contact Saved',
  appointment_book: 'Appointment Request',
  teleconsult_book: 'Teleconsult Request',
  emergency_call: 'Urgent Assistance',
  property_inquiry: 'Property Enquiry',
  site_visit_book: 'Site Visit Request',
  brochure_request: 'Brochure Request',
  quote_request: 'Quote Request',
  policy_review: 'Policy Review Request',
  premium_quote: 'Insurance Quote Request',
  hlv_gap: 'Cover Gap Analysis',
  checklist_send: 'Document Checklist Request',
  package_quote: 'Package Quote Request',
  availability_check: 'Availability Check',
  pass_generate: 'Pass Request',
  demo_book: 'Trial / Demo Booking',
  directions_open: 'Visit Enquiry',
};

/** Structured input a template turns into a message. Values stay primitive. */
export interface TemplateInput {
  intent: IntentKey;
  /** Business / professional name used in the attribution line. */
  business: string;
  /** Ordered label → value pairs collected at the call site. */
  values?: MessageField[];
  note?: string;
}

export type TemplateBuilder = (input: TemplateInput) => string;
