/**
 * Single source of truth for CTA / lead intents.
 *
 * Config schemas validate against this list, and PART-03's `core/whatsapp`
 * re-exports it for message templates — never re-declare these strings.
 */
export const INTENT_KEYS = [
  'general_inquiry',
  'callback_request',
  'vcard_download',
  'appointment_book',
  'teleconsult_book',
  'emergency_call',
  'property_inquiry',
  'site_visit_book',
  'brochure_request',
  'quote_request',
  'policy_review',
  'premium_quote',
  'hlv_gap',
  'checklist_send',
  'package_quote',
  'availability_check',
  'pass_generate',
  'demo_book',
  'directions_open',
] as const;

export type IntentKey = (typeof INTENT_KEYS)[number];
