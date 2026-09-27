/**
 * Theme + font-pair identifiers. Kept dependency-free so both the zod preset
 * schema and the theme map can import them without a cycle.
 */
export const THEME_IDS = [
  'estate-indigo',
  'trust-blue',
  'clinical-teal',
  'ledger-emerald',
  'noir-gold',
  'energy-amber',
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export const FONT_PAIR_IDS = [
  'sora+inter',
  'inter+inter',
  'plus-jakarta+inter',
  'source-serif+inter',
  'playfair+inter',
  'outfit+inter',
] as const;

export type FontPairId = (typeof FONT_PAIR_IDS)[number];

export const THEME_MODES = ['light', 'dark'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];
