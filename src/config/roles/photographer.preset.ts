/** LEVEL 2 - photographer. Sections derived from docs/09-FEATURE-MATRIX.md section F. */
import type { RolePreset } from '../schema/preset.schema';

export const photographerPreset: RolePreset = {
  key: 'photographer',
  label: 'Event / Wedding Photographer',
  themeId: 'noir-gold',
  fontPair: 'playfair+inter',
  iconSet: 'camera',
  sections: [
    'hero',
    'module:showreel',
    'quickActions',
    'trustStrip',
    'about',
    'gallery',
    'module:availability',
    'module:packageBuilder',
    'module:albums',
    'socialFeed',
    'testimonials',
    'faq',
    'leadForm',
    'footer',
  ],
  modules: ['showreel', 'availability', 'packageBuilder', 'albums', 'stylePicker', 'travelMap'],
  fab: { whatsapp: true, call: true, directions: true, emergency: false },
  vcard: { includePhoto: true, includeLogo: true, titleField: 'tagline' },
  seo: { schemaType: 'ProfessionalService' },
};
