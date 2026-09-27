/**
 * Insurance role module. `ModuleSlot` lazy-loads this barrel and looks up
 * `widgets[name]` for every `module:<name>` entry in the preset's section list,
 * which is why nothing outside `src/modules/` ever names this role.
 */
import { HlvCalculator } from './components/HlvCalculator';
import { PremiumEstimator } from './components/PremiumEstimator';
import { registerInsuranceTemplates } from './lib/wa-templates';

export const moduleId = 'insurance' as const;

// Importing the module is what specialises the WhatsApp wording — see
// `src/core/whatsapp/templates/index.ts`.
registerInsuranceTemplates();

/**
 * Keys match `insurance.preset.ts`. `taxSaving`, `claimRatio`, `planCompare`
 * and `renewalReminder` land in PART-06 chunk 2 — until then `ModuleSlot`
 * renders nothing for them.
 */
export const widgets = {
  premiumEstimator: PremiumEstimator,
  humanLifeValue: HlvCalculator,
} as const;

export type WidgetName = keyof typeof widgets;

export { registerInsuranceTemplates as waTemplates };
export * from './types';
