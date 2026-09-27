'use client';

import { useRole } from './useRole';
import { NAV_SECTION_KEYS, SECTION_LABELS } from '@/lib/constants/section-labels';
import { SECTION_KEYS, type SectionKey } from '@/lib/constants/sections';

export type NavSection = { key: SectionKey; label: string; href: string };

function isSectionKey(value: string): value is SectionKey {
  return (SECTION_KEYS as readonly string[]).includes(value);
}

/**
 * Navbar / menu / palette entries, derived from `preset.sections` so the nav
 * order always matches the page order and never lists a section that the
 * current role does not render.
 */
export function useNavSections(): NavSection[] {
  const { preset } = useRole();

  return preset.sections
    .filter((key): key is SectionKey => isSectionKey(key) && NAV_SECTION_KEYS.includes(key))
    .map((key) => ({ key, label: SECTION_LABELS[key], href: `#${key}` }));
}
