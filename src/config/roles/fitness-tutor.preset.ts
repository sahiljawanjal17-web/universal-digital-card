/** LEVEL 2 - fitness-tutor. Sections derived from docs/09-FEATURE-MATRIX.md section G. */
import type { RolePreset } from '../schema/preset.schema';

export const fitnessTutorPreset: RolePreset = {
  key: 'fitness-tutor',
  label: 'Gym Trainer / Tutor',
  themeId: 'energy-amber',
  fontPair: 'outfit+inter',
  iconSet: 'dumbbell',
  sections: [
    'hero',
    'quickActions',
    'trustStrip',
    'module:vipPass',
    'about',
    'services',
    'module:programs',
    'module:timetable',
    'module:transformations',
    'module:calculators',
    'testimonials',
    'faq',
    'leadForm',
    'footer',
  ],
  modules: ['vipPass', 'programs', 'timetable', 'transformations', 'calculators', 'results'],
  fab: { whatsapp: true, call: true, directions: true, emergency: false },
  vcard: { includePhoto: true, includeLogo: true, titleField: 'designation' },
  seo: { schemaType: 'ExerciseGym' },
};
