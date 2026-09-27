/**
 * Single source of truth for the set of supported roles.
 * Never hardcode a role-key list anywhere else — import ROLE_KEYS.
 */
export const ROLE_KEYS = [
  'real-estate',
  'insurance',
  'doctor',
  'ca-tax',
  'photographer',
  'fitness-tutor',
] as const;

export type RoleKey = (typeof ROLE_KEYS)[number];

export function isRoleKey(value: unknown): value is RoleKey {
  return typeof value === 'string' && (ROLE_KEYS as readonly string[]).includes(value);
}
