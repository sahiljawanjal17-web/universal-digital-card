import type { RoleKey } from './role';
import type { SiteConfig } from '@/config/schema/site.schema';
import type { RolePreset } from '@/config/schema/preset.schema';
import type { RoleData } from '@/config/schema';
import type { RoleTheme } from '@/config/theme';

/**
 * What resolveConfig() returns. Every member is inferred from a zod schema —
 * there is no hand-written duplicate of any config shape.
 */
export interface ResolvedConfig<K extends RoleKey = RoleKey> {
  site: SiteConfig;
  role: K;
  preset: RolePreset;
  data: RoleData[K];
  theme: RoleTheme;
}
