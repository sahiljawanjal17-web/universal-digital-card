/** LEVEL 2 - insurance. Sections derived from docs/09-FEATURE-MATRIX.md section C. */
import type { RolePreset } from '../schema/preset.schema';

export const insurancePreset: RolePreset = {
  key: 'insurance',
  label: 'Insurance Advisor',
  themeId: 'trust-blue',
  fontPair: 'inter+inter',
  iconSet: 'shield',
  sections: [
    'hero',
    'quickActions',
    'trustStrip',
    'about',
    'services',
    'module:premiumEstimator',
    'module:humanLifeValue',
    'module:taxSaving',
    'module:claimRatio',
    'module:planCompare',
    'testimonials',
    'faq',
    'leadForm',
    'footer',
  ],
  modules: [
    'premiumEstimator',
    'humanLifeValue',
    'taxSaving',
    'claimRatio',
    'planCompare',
    'renewalReminder',
  ],
  fab: { whatsapp: true, call: true, directions: true, emergency: false },
  vcard: { includePhoto: true, includeLogo: true, titleField: 'designation' },
  seo: { schemaType: 'InsuranceAgency' },
};
