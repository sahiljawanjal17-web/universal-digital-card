/**
 * The fixed event vocabulary from docs/07-CONVENTIONS.md §8.
 * Never write an event name as a bare string anywhere else.
 */
export const EVENTS = {
  PAGE_VIEW: 'page_view',
  SECTION_VIEW: 'section_view',
  CTA_CLICK: 'cta_click',
  FAB_OPEN: 'fab_open',
  FAB_ACTION: 'fab_action',
  VCARD_DOWNLOAD: 'vcard_download',
  QR_OPEN: 'qr_open',
  SHARE_CLICK: 'share_click',
  LEAD_START: 'lead_start',
  LEAD_SUBMIT: 'lead_submit',
  LEAD_WHATSAPP_OPEN: 'lead_whatsapp_open',
  TOOL_USE: 'tool_use',
  FILTER_APPLY: 'filter_apply',
  GALLERY_OPEN: 'gallery_open',
  PASS_GENERATE: 'pass_generate',
  INSTALL_PROMPT: 'install_prompt',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

/**
 * Analytics props are deliberately primitive-only: no nested objects, and
 * — per the part brief — never a phone number, email or any other PII.
 */
export type EventProps = Record<string, string | number | boolean | null>;
