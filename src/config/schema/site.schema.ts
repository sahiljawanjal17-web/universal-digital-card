/**
 * LEVEL 1 — src/config/site.config.json. THE SWITCH.
 * Shape from docs/03-CONFIG-SCHEMA.md. Everything except `role` has a default,
 * so a trimmed-down config still parses.
 */
import { z } from 'zod';
import { ROLE_KEYS } from '@/types/role';
import { THEME_IDS } from '@/config/theme/ids';

export const SiteSchema = z.object({
  /** Editors get autocomplete from the JSON schema; ignored at runtime. */
  $schema: z.string().optional(),
  role: z.enum(ROLE_KEYS),
  locale: z.string().min(2).default('en-IN'),
  secondaryLocale: z.string().min(2).nullable().default('hi-IN'),
  theme: z
    .object({
      mode: z.enum(['light', 'dark', 'system']).default('system'),
      allowToggle: z.boolean().default(true),
      /** null = use the role preset's themeId. */
      override: z.enum(THEME_IDS).nullable().default(null),
    })
    .default({ mode: 'system', allowToggle: true, override: null }),
  flags: z
    .object({
      pwa: z.boolean().default(true),
      installPrompt: z.boolean().default(true),
      analytics: z.boolean().default(true),
      i18nToggle: z.boolean().default(true),
      exitIntentLead: z.boolean().default(true),
      qrShare: z.boolean().default(true),
      smoothScroll: z.boolean().default(true),
      confettiOnLead: z.boolean().default(true),
      devRoleSwitcher: z.boolean().default(true),
    })
    .prefault({}),
  debug: z.object({ showSectionOutlines: z.boolean().default(false) }).prefault({}),
});

export type SiteConfig = z.infer<typeof SiteSchema>;
