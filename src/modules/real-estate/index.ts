/**
 * Real-estate role module. `ModuleSlot` lazy-loads this barrel and looks up
 * `widgets[name]` for every `module:<name>` entry in the preset's section list,
 * which is why nothing outside `src/modules/` ever names this role.
 */
import { EmiCalculator } from './components/EmiCalculator';
import { LoanEligibility } from './components/LoanEligibility';
import { PropertyBrowser } from './components/PropertyBrowser';
import { RentVsBuy } from './components/RentVsBuy';
import { StampDutyEstimator } from './components/StampDutyEstimator';
import { registerRealEstateTemplates } from './lib/wa-templates';

export const moduleId = 'real-estate' as const;

// Importing the module is what specialises the WhatsApp wording — see
// `src/core/whatsapp/templates/index.ts`.
registerRealEstateTemplates();

export const widgets = {
  propertyFilter: PropertyBrowser,
  emiCalculator: EmiCalculator,
  stampDuty: StampDutyEstimator,
  rentVsBuy: RentVsBuy,
  loanEligibility: LoanEligibility,
} as const;

export type WidgetName = keyof typeof widgets;

export { registerRealEstateTemplates as waTemplates };
export * from './types';
