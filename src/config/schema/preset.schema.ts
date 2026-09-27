/**
 * LEVEL 2 — src/config/roles/<role>.preset.ts. Structure, not content.
 * Shape from docs/03-CONFIG-SCHEMA.md.
 */
import { z } from 'zod';
import { ROLE_KEYS } from '@/types/role';
import { SECTION_KEYS, type ModuleSectionKey } from '@/lib/constants/sections';
import { THEME_IDS, FONT_PAIR_IDS } from '@/config/theme/ids';

/** A universal section key, or `module:<name>` handled by the module registry. */
export const SectionKeySchema = z.union([
  z.enum(SECTION_KEYS),
  z.custom<ModuleSectionKey>(
    (v) => typeof v === 'string' && /^module:[a-z][a-zA-Z0-9]*$/.test(v),
    { message: 'Module sections must look like "module:slotBooking"' },
  ),
]);

export const PresetSchema = z.object({
  key: z.enum(ROLE_KEYS),
  label: z.string().min(1),
  /** Resolved to a RoleTheme object by src/config/theme. */
  themeId: z.enum(THEME_IDS),
  fontPair: z.enum(FONT_PAIR_IDS),
  iconSet: z.string().min(1),
  /** Array order IS the page order. */
  sections: z.array(SectionKeySchema).min(1),
  modules: z.array(z.string().min(1)).default([]),
  fab: z.object({
    whatsapp: z.boolean(),
    call: z.boolean(),
    directions: z.boolean(),
    emergency: z.boolean().default(false),
  }),
  vcard: z.object({
    includePhoto: z.boolean(),
    includeLogo: z.boolean(),
    titleField: z.enum(['designation', 'tagline']),
  }),
  seo: z.object({ schemaType: z.string().min(1) }),
});

export type RolePreset = z.infer<typeof PresetSchema>;
