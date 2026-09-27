/**
 * themeId -> RoleTheme map. resolveConfig() uses this to turn a preset's
 * `themeId` string into the theme object every consumer reads.
 */
import type { ThemeId } from './ids';
import type { RoleTheme } from './types';
import { estateIndigoTheme } from './estate-indigo.theme';
import { trustBlueTheme } from './trust-blue.theme';
import { clinicalTealTheme } from './clinical-teal.theme';
import { ledgerEmeraldTheme } from './ledger-emerald.theme';
import { noirGoldTheme } from './noir-gold.theme';
import { energyAmberTheme } from './energy-amber.theme';

export const themes: Record<ThemeId, RoleTheme> = {
  'estate-indigo': estateIndigoTheme,
  'trust-blue': trustBlueTheme,
  'clinical-teal': clinicalTealTheme,
  'ledger-emerald': ledgerEmeraldTheme,
  'noir-gold': noirGoldTheme,
  'energy-amber': energyAmberTheme,
};

export function getTheme(id: ThemeId): RoleTheme {
  return themes[id];
}

export { THEME_IDS, FONT_PAIR_IDS, THEME_MODES } from './ids';
export type { ThemeId, FontPairId, ThemeMode } from './ids';
export type { RoleTheme } from './types';
