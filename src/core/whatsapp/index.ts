/**
 * WhatsApp lead router. Every `wa.me` link in this product originates here —
 * components must never build one themselves (docs/07-CONVENTIONS.md rule #5).
 */
export { INTENT_KEYS, type IntentKey } from './intents';
export { buildWhatsAppLink, buildWhatsAppChatLink, type BuildWhatsAppLinkOptions } from './build-link';
export {
  bold,
  italic,
  bullet,
  field,
  section,
  tidy,
  truncate,
  MAX_MESSAGE_LENGTH,
} from './format';
export {
  buildMessage,
  buildIntentMessage,
  registerTemplate,
  getTemplate,
  hasTemplate,
  INTENT_TITLES,
  type MessageField,
  type TemplateBuilder,
  type TemplateInput,
} from './templates';
export { openWhatsApp, openIntent, type OpenIntentOptions, type OpenWhatsAppMeta } from './open';
