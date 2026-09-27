/** LEVEL 2 - ca-tax. Sections derived from docs/09-FEATURE-MATRIX.md section E. */
import type { RolePreset } from '../schema/preset.schema';

export const caTaxPreset: RolePreset = {
  key: 'ca-tax',
  label: 'CA / Tax Consultant',
  themeId: 'ledger-emerald',
  fontPair: 'source-serif+inter',
  iconSet: 'ledger',
  sections: [
    'hero',
    'quickActions',
    'trustStrip',
    'about',
    'services',
    'module:docChecklist',
    'module:regimeCalculator',
    'module:gstCalculator',
    'module:dueDates',
    'module:packages',
    'credentials',
    'testimonials',
    'faq',
    'leadForm',
    'footer',
  ],
  modules: [
    'docChecklist',
    'regimeCalculator',
    'gstCalculator',
    'hraCalculator',
    'dueDates',
    'packages',
  ],
  fab: { whatsapp: true, call: true, directions: true, emergency: false },
  vcard: { includePhoto: true, includeLogo: true, titleField: 'designation' },
  seo: { schemaType: 'AccountingService' },
};
