/**
 * Role-agnostic templates. Anything that needs role vocabulary is registered
 * by the role module itself (see `registerTemplate`) — core stays role-free.
 */
import { buildMessage, INTENT_TITLES, type TemplateBuilder, type TemplateInput } from './base';

/** The fallback every intent falls back to: title + whatever fields exist. */
export const genericTemplate: TemplateBuilder = (input: TemplateInput) =>
  buildMessage({
    title: INTENT_TITLES[input.intent],
    fields: input.values,
    note: input.note,
    business: input.business,
  });

export const generalEnquiryTemplate: TemplateBuilder = (input) =>
  buildMessage({
    title: INTENT_TITLES.general_inquiry,
    fields: input.values,
    note: input.note ?? 'I found your digital card and would like to know more.',
    business: input.business,
    emoji: '👋',
  });

export const callbackRequestTemplate: TemplateBuilder = (input) =>
  buildMessage({
    title: INTENT_TITLES.callback_request,
    fields: input.values,
    note: input.note ?? 'Please call me back when convenient.',
    business: input.business,
  });

export const brochureRequestTemplate: TemplateBuilder = (input) =>
  buildMessage({
    title: INTENT_TITLES.brochure_request,
    fields: input.values,
    note: input.note ?? 'Please share the brochure / details PDF here on WhatsApp.',
    business: input.business,
  });

export const directionsTemplate: TemplateBuilder = (input) =>
  buildMessage({
    title: INTENT_TITLES.directions_open,
    fields: input.values,
    note: input.note ?? 'I am planning to visit — could you share the exact landmark?',
    business: input.business,
  });

export const vcardTemplate: TemplateBuilder = (input) =>
  buildMessage({
    title: INTENT_TITLES.vcard_download,
    fields: input.values,
    note: input.note ?? 'I have saved your contact and would like to connect.',
    business: input.business,
  });
