/**
 * Advisory wording for the insurance intents (PART-06 §6). Registered at
 * module import time so `core/whatsapp` keeps no role vocabulary of its own.
 */
import {
  buildMessage,
  registerTemplate,
  INTENT_TITLES,
  type MessageField,
  type TemplateBuilder,
} from '@/core/whatsapp';
import { formatINR } from '@/lib/utils';
import type { HlvInput, HlvResult } from './hlv';
import type { PremiumEstimate, PremiumInput } from './premium';

const PRODUCT_LABELS: Record<PremiumInput['product'], string> = {
  term: 'Term Life',
  health: 'Health',
  motor: 'Motor',
  child: 'Child Plan',
  retirement: 'Retirement Plan',
};

export function productLabel(product: PremiumInput['product']): string {
  return PRODUCT_LABELS[product];
}

const premiumQuote: TemplateBuilder = (input) =>
  buildMessage({
    title: INTENT_TITLES.premium_quote,
    fields: input.values,
    note: input.note ?? 'Please share exact quotes from top insurers.',
    business: input.business,
    emoji: '🛡️',
  });

const hlvGap: TemplateBuilder = (input) =>
  buildMessage({
    title: INTENT_TITLES.hlv_gap,
    fields: input.values,
    note: input.note ?? 'Please suggest a plan to close this gap.',
    business: input.business,
    emoji: '📊',
  });

/** Called once from the module barrel — registration is idempotent. */
export function registerInsuranceTemplates(): void {
  registerTemplate('premium_quote', premiumQuote);
  registerTemplate('hlv_gap', hlvGap);
}

/** The `[label, value]` lines of PART-06 §6 `premium_quote`. */
export function premiumFields(input: PremiumInput, estimate: PremiumEstimate): MessageField[] {
  return [
    ['Product', productLabel(input.product)],
    ['Age', `${input.age} years`],
    ['Cover', formatINR(input.cover)],
    ['Tenure', `${input.tenure} years`],
    ['Smoker', input.smoker ? 'Yes' : 'No'],
    ['Gender', input.gender === 'female' ? 'Female' : 'Male'],
    [
      'Estimated Premium',
      `${formatINR(estimate.monthly)}/month (${formatINR(estimate.annual)}/year incl. GST)`,
    ],
  ];
}

/** The `[label, value]` lines of PART-06 §6 `hlv_gap`. */
export function hlvFields(input: HlvInput, result: HlvResult): MessageField[] {
  return [
    ['Annual Income', formatINR(input.annualIncome)],
    ['Age', `${input.age} · Retirement: ${input.retirementAge}`],
    ['Liabilities', formatINR(input.liabilities)],
    ['Existing Cover', formatINR(result.existing)],
    ['Recommended Cover', formatINR(result.recommended)],
    ['Cover Gap', `*${formatINR(result.gap)}*`],
  ];
}
