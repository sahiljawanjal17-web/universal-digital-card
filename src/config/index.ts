/**
 * The config engine. Reads LEVEL 1 (site.config.json), picks the LEVEL 2 preset
 * and parses the LEVEL 3 data for that role into one type-safe object.
 *
 * This is the ONLY place allowed to touch raw config/data JSON.
 */
import { cache } from 'react';
import type { RoleKey } from '@/types/role';
import type { ResolvedConfig } from '@/types/config';
import { rawRoleData } from '@/data/roles';
import { presets } from './roles';
import { themes } from './theme';
import { dataSchemas, type RoleData } from './schema';
import { SiteSchema } from './schema/site.schema';
import siteConfigJson from './site.config.json';
import { ConfigError } from './errors';

function parseSite() {
  const result = SiteSchema.safeParse(siteConfigJson);
  if (!result.success) throw new ConfigError('src/config/site.config.json', result.error);
  return result.data;
}

function parseRoleData<K extends RoleKey>(role: K): RoleData[K] {
  const result = dataSchemas[role].safeParse(rawRoleData[role]);
  if (!result.success) throw new ConfigError(`src/data/roles/${role}.json`, result.error);
  return result.data as RoleData[K];
}

function buildConfig(overrideRole?: RoleKey): ResolvedConfig {
  const site = parseSite();
  const role = overrideRole ?? site.role;
  const preset = presets[role];
  const themeId = site.theme.override ?? preset.themeId;
  return { site, role, preset, data: parseRoleData(role), theme: themes[themeId] };
}

/** Cached per server request. `overrideRole` is for the dev role switcher. */
export const resolveConfig: (overrideRole?: RoleKey) => ResolvedConfig = cache(buildConfig);

export function getRole(): RoleKey {
  return resolveConfig().role;
}

export function getRoleData(overrideRole?: RoleKey): ResolvedConfig['data'] {
  return resolveConfig(overrideRole).data;
}

export { presets, getPreset } from './roles';
export { ConfigError, formatConfigError } from './errors';
export { themes, getTheme } from './theme';
