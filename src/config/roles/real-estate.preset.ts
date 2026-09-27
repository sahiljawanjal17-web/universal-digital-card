/** LEVEL 2 - real-estate. Sections derived from docs/09-FEATURE-MATRIX.md section B. */
import type { RolePreset } from '../schema/preset.schema';

export const realEstatePreset: RolePreset = {
  key: 'real-estate',
  label: 'Real Estate Agent',
  themeId: 'estate-indigo',
  fontPair: 'sora+inter',
  iconSet: 'property',
  sections: [
    'hero',
    'quickActions',
    'trustStrip',
    'about',
    'module:propertyFilter',
    'module:emiCalculator',
    'module:stampDuty',
    'module:rentVsBuy',
    'module:loanEligibility',
    'services',
    'testimonials',
    'faq',
    'leadForm',
    'footer',
  ],
  modules: [
    'propertyFilter',
    'propertyGrid',
    'emiCalculator',
    'stampDuty',
    'rentVsBuy',
    'loanEligibility',
    'compare',
    'shortlist',
  ],
  fab: { whatsapp: true, call: true, directions: true, emergency: false },
  vcard: { includePhoto: true, includeLogo: true, titleField: 'designation' },
  seo: { schemaType: 'RealEstateAgent' },
};
