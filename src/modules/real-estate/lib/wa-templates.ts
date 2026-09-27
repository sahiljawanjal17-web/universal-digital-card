/**
 * Real-estate wording for the shared intents. Registered at module import time
 * so `core/whatsapp` keeps no role vocabulary of its own — importing this file
 * is the only thing needed to specialise the messages (PART-05 §6).
 */
import {
  buildMessage,
  registerTemplate,
  INTENT_TITLES,
  type MessageField,
  type TemplateBuilder,
} from '@/core/whatsapp';
import { formatINR, formatINRShort } from '@/lib/utils';
import type { Property } from '../types';

const propertyEnquiry: TemplateBuilder = (input) =>
  buildMessage({
    title: INTENT_TITLES.property_inquiry,
    fields: input.values,
    note: input.note ?? "I'd like to know more about this property.",
    business: input.business,
    emoji: '🏠',
  });

const siteVisit: TemplateBuilder = (input) =>
  buildMessage({
    title: INTENT_TITLES.site_visit_book,
    fields: input.values,
    note: input.note ?? 'Please confirm a slot for a site visit.',
    business: input.business,
    emoji: '📍',
  });

const brochureRequest: TemplateBuilder = (input) =>
  buildMessage({
    title: INTENT_TITLES.brochure_request,
    fields: input.values,
    note: input.note ?? 'Please share the brochure and the floor plan PDF here.',
    business: input.business,
  });

/**
 * The calculators' hand-off (PART-05 §6 `emi_help`). It carries whatever the
 * visitor had on screen — EMI figures, a duty breakdown or an eligibility
 * band — so the agent replies to a real number, not to "hi".
 */
const loanAssistance: TemplateBuilder = (input) =>
  buildMessage({
    title: 'Home Loan Assistance',
    fields: input.values,
    note: input.note ?? 'Need help with loan pre-approval.',
    business: input.business,
    emoji: '🏦',
  });

/** Called once from the module barrel — registration is idempotent. */
export function registerRealEstateTemplates(): void {
  registerTemplate('property_inquiry', propertyEnquiry);
  registerTemplate('site_visit_book', siteVisit);
  registerTemplate('brochure_request', brochureRequest);
  registerTemplate('quote_request', loanAssistance);
}

/** The `[label, value]` lines that identify one listing in any message. */
export function propertyFields(property: Property): MessageField[] {
  const isRent = property.listingFor === 'rent';

  return [
    ['Property', `${property.title} (ID: ${property.id})`],
    [isRent ? 'Rent' : 'Price', isRent ? `${formatINR(property.price)} / month` : formatINR(property.price)],
    ['Carpet Area', `${property.carpetArea} sq.ft.`],
    ['Locality', `${property.locality}, ${property.city}`],
    ['RERA', property.reraId],
  ];
}

/** `3BHK Baner High-Rise — ₹1.25 Cr — 1275 sq.ft.` — one shortlist line. */
export function propertySummaryLine(property: Property): string {
  return `${property.title} — ${formatINRShort(property.price)} — ${property.carpetArea} sq.ft.`;
}
