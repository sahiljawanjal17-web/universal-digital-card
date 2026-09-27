/**
 * Universal section keys. A preset's `sections` array is the page order, and
 * PART-04's SectionRenderer maps each key to a component.
 *
 * Role-specific sections are NOT listed here — they are written as
 * `module:<moduleName>` and resolved through the module registry.
 */
export const SECTION_KEYS = [
  'hero',
  'quickActions',
  'trustStrip',
  'stats',
  'about',
  'credentials',
  'services',
  'gallery',
  'beforeAfter',
  'clinicInfo',
  'ctaBanner',
  'socialFeed',
  'testimonials',
  'faq',
  'leadForm',
  'footer',
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];
export type ModuleSectionKey = `module:${string}`;
export type PresetSectionKey = SectionKey | ModuleSectionKey;
