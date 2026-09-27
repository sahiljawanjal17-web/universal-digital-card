/**
 * Lead intents live in `@/lib/constants/intents` (PART-01) because the config
 * schemas validate against them. This file only re-exports, so that core code
 * and role modules can keep importing from `@/core/whatsapp`.
 */
export { INTENT_KEYS, type IntentKey } from '@/lib/constants/intents';
