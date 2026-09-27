/**
 * Intent → builder registry. Role modules call `registerTemplate` at import
 * time, which is why no role name ever appears in `core/`.
 */
import type { IntentKey } from '@/lib/constants/intents';
import {
  brochureRequestTemplate,
  callbackRequestTemplate,
  directionsTemplate,
  generalEnquiryTemplate,
  genericTemplate,
  vcardTemplate,
} from './general';
import type { TemplateBuilder, TemplateInput } from './base';

const registry = new Map<IntentKey, TemplateBuilder>([
  ['general_inquiry', generalEnquiryTemplate],
  ['callback_request', callbackRequestTemplate],
  ['brochure_request', brochureRequestTemplate],
  ['directions_open', directionsTemplate],
  ['vcard_download', vcardTemplate],
]);

/**
 * Last registration wins, so a role module may specialise a shared intent
 * (e.g. real-estate's own `brochure_request` wording).
 */
export function registerTemplate(intent: IntentKey, builder: TemplateBuilder): void {
  registry.set(intent, builder);
}

export function getTemplate(intent: IntentKey): TemplateBuilder {
  return registry.get(intent) ?? genericTemplate;
}

export function hasTemplate(intent: IntentKey): boolean {
  return registry.has(intent);
}

/** Resolve the intent's builder and produce the final message text. */
export function buildIntentMessage(input: TemplateInput): string {
  return getTemplate(input.intent)(input);
}

export {
  buildMessage,
  INTENT_TITLES,
  type MessageField,
  type TemplateBuilder,
  type TemplateInput,
} from './base';
export { genericTemplate } from './general';
